-- Run after 01-07 and setup_three_profiles.sql in SQL Editor as postgres.
-- Session changes and temporary suspension are rolled back. If execution fails,
-- issue ROLLBACK before another command on the same connection.
-- This checks the database contract; it does not replace HTTP/session workflow tests.
begin;
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','account_roles','categories','products','featured_products','reviews',
    'deals','orders','licenses','purchase_inquiries','contact_applications',
    'vendor_contacts','wishlist_items','buyer_stack','vendor_documents',
    'product_dossiers','contact_messages','subscriptions','blog_posts',
    'alternatives','site_content','admin_audit_log'
  ] loop
    if not exists (
      select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = table_name and c.relrowsecurity
    ) then raise exception 'Missing RLS on %', table_name; end if;
  end loop;
  if has_table_privilege('authenticated','public.account_roles','UPDATE')
    or has_table_privilege('authenticated','public.account_roles','INSERT')
    or has_table_privilege('authenticated','public.orders','INSERT')
    or has_table_privilege('authenticated','public.licenses','INSERT')
    or has_table_privilege('anon','public.profiles','SELECT')
    or has_function_privilege('authenticated','private.handle_signup()','EXECUTE')
  then raise exception 'Unexpected privileged client grant'; end if;
  if not has_column_privilege('authenticated','public.profiles','name','UPDATE')
    or has_column_privilege('authenticated','public.profiles','id','UPDATE')
  then raise exception 'Incorrect profile column grants'; end if;
  if exists(select 1 from storage.buckets where id in
    ('avatars','vendor-documents','product-downloads','dossiers') and public)
  then raise exception 'Private bucket is public'; end if;
end $$;

-- Client-editable claims must never promote an unknown account.
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000000',true);
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated","user_metadata":{"role":"admin"},"app_metadata":{"role":"admin"}}',
  true);
set local role authenticated;
do $$
begin
  if private.current_role() is not null then
    raise exception 'Database authorization trusted forged metadata';
  end if;
  if exists(select 1 from public.account_roles)
    or exists(select 1 from public.orders)
    or exists(select 1 from public.vendor_documents)
    or exists(select 1 from public.admin_audit_log)
  then raise exception 'Unknown account can read private records'; end if;
end $$;
reset role;

-- Resolve expected identities as the SQL Editor operator before simulating clients.
do $$
declare expected record; account_id uuid; actual_role text; account_status text;
begin
  for expected in select * from (values
    ('alex@company.com','buyer'), ('vendor@saasmrkt.com','vendor'),
    ('admin@saasmrkt.com','admin')) as accounts(email,role)
  loop
    select u.id, r.role, r.status into strict account_id, actual_role, account_status
    from auth.users u join public.account_roles r on r.user_id = u.id
    where lower(u.email) = expected.email and u.email_confirmed_at is not null;
    if actual_role <> expected.role or account_status not in ('active','verified') then
      raise exception 'Incorrect role/status for %; run setup_three_profiles.sql', expected.email;
    end if;
    perform set_config('test.' || expected.role || '_id', account_id::text, true);
  end loop;
  perform set_config('test.profile_count',(select count(*)::text from public.profiles),true);
exception
  when no_data_found then raise exception 'A designated confirmed account/role is missing';
  when too_many_rows then raise exception 'Duplicate designated account email';
end $$;

-- buyer: editable JWT metadata must not override the role stored in the database.
select set_config('request.jwt.claim.sub', current_setting('test.buyer_id'), true);
select set_config('request.jwt.claims', jsonb_build_object(
 'sub',current_setting('test.buyer_id'),'role','authenticated',
 'user_metadata',jsonb_build_object('role','admin'))::text,true);
set local role authenticated;
do $$
begin
  if private.current_role() is distinct from 'buyer' then
    raise exception 'buyer role did not resolve from the database';
  end if;
  if (select count(*) from public.profiles) <> 1
    or exists(select 1 from public.profiles where id <> auth.uid())
    or exists(select 1 from public.account_roles where user_id <> auth.uid())
    or exists(select 1 from public.admin_audit_log)
    or exists(select 1 from public.orders where buyer_id <> auth.uid())
  then raise exception 'buyer can read another account or privileged data'; end if;
  begin
    update public.account_roles set role = 'admin' where user_id = auth.uid();
    raise exception 'buyer unexpectedly changed its own role';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- vendor: editable JWT metadata must not override the role stored in the database.
select set_config('request.jwt.claim.sub', current_setting('test.vendor_id'), true);
select set_config('request.jwt.claims', jsonb_build_object(
 'sub',current_setting('test.vendor_id'),'role','authenticated',
 'user_metadata',jsonb_build_object('role','admin'))::text,true);
set local role authenticated;
do $$
begin
  if private.current_role() is distinct from 'vendor' then
    raise exception 'vendor role did not resolve from the database';
  end if;
  if (select count(*) from public.profiles) <> 1
    or exists(select 1 from public.profiles where id <> auth.uid())
    or exists(select 1 from public.account_roles where user_id <> auth.uid())
    or exists(select 1 from public.admin_audit_log)
    or exists(select 1 from public.orders where vendor_id <> auth.uid())
  then raise exception 'vendor can read another account or privileged data'; end if;
  begin
    update public.account_roles set role = 'admin' where user_id = auth.uid();
    raise exception 'vendor unexpectedly changed its own role';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- Admin may read all profiles; client-selected buyer metadata does not downgrade it.
select set_config('request.jwt.claim.sub',current_setting('test.admin_id'),true);
select set_config('request.jwt.claims',jsonb_build_object(
 'sub',current_setting('test.admin_id'),'role','authenticated',
 'user_metadata',jsonb_build_object('role','buyer'))::text,true);
set local role authenticated;
do $$
begin
 if private.current_role() is distinct from 'admin'
   or (select count(*) from public.profiles) <> current_setting('test.profile_count')::bigint
 then raise exception 'Admin database access failed'; end if;
end $$;
reset role;

-- Suspending an admin must revoke private access even with the same session claims.
-- The entire script rolls back, restoring the original status.
update public.account_roles set status = 'suspended'
where user_id = current_setting('test.admin_id')::uuid;
set local role authenticated;
do $$
begin
 if private.current_role() is not null
   or exists(select 1 from public.profiles)
   or exists(select 1 from public.orders)
   or exists(select 1 from public.admin_audit_log)
 then raise exception 'Suspended account retained privileged access'; end if;
end $$;
reset role;
rollback;
