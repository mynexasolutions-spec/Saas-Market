-- Run manually after 01-07 and after creating three users through Supabase Auth.
-- Run as postgres in the SQL Editor, never from a public application endpoint.
-- Resolves only the three explicitly designated, confirmed email accounts below.
-- Passwords must be set in Supabase Auth, never in this file.
-- Assigns all three roles, including admin. No separate 08 promotion is needed.
-- Intended routes: buyer /dashboard, vendor /vendor, admin /admin.
-- SQL does not implement website redirects or replace its demo authentication.
begin;
do $$
declare
  buyer_user uuid;
  vendor_user uuid;
  admin_user uuid;
begin
  -- STRICT rejects missing or ambiguous matches before any data changes.
  select id into strict buyer_user from auth.users
  where lower(email) = 'alex@company.com' and email_confirmed_at is not null;
  select id into strict vendor_user from auth.users
  where lower(email) = 'vendor@saasmrkt.com' and email_confirmed_at is not null;
  select id into strict admin_user from auth.users
  where lower(email) = 'admin@saasmrkt.com' and email_confirmed_at is not null;
  if (select count(*) from public.account_roles
      where user_id = any(array[buyer_user,vendor_user,admin_user])) <> 3
  then
    raise exception 'Missing profile/role records. Verify the 01_accounts.sql signup trigger';
  end if;
  if exists(select 1 from public.account_roles
      where user_id in (buyer_user,vendor_user) and role = 'admin')
  then
    raise exception 'Selected buyer/vendor ID is already an admin. Verify the IDs; no roles changed';
  end if;

  update public.profiles set name = 'Alex Morgan',
    title = 'Head of Product & Growth', company = 'Acme Cloud Ventures'
  where id = buyer_user;
  update public.profiles set name = 'David Miller',
    title = 'Founder & Lead Architect', company = 'SaaS MRKT'
  where id = vendor_user;
  update public.profiles set name = 'Admin',
    title = 'Platform Super Administrator', company = 'SaaS MRKT Operations'
  where id = admin_user;
  update public.account_roles set role = 'buyer', status = 'active' where user_id = buyer_user;
  update public.account_roles set role = 'vendor', status = 'active' where user_id = vendor_user;
  update public.account_roles set role = 'admin', status = 'active'
  where user_id = admin_user and (role <> 'admin' or status <> 'active');
  if found then
    insert into public.admin_audit_log(actor_id,action,entity_type,entity_id,details)
    values(null,'operator_promoted_admin','account_roles',admin_user::text,
      jsonb_build_object('source','setup_three_profiles.sql'));
  end if;
exception
  when no_data_found then
    raise exception 'Create and confirm all three designated accounts in Supabase Auth before running this script';
  when too_many_rows then
    raise exception 'Multiple Auth accounts match a designated email. Resolve duplicates before assigning roles';
end $$;

-- Confirm the resulting database role and intended dashboard for each account.
select u.email, r.role, r.status,
  case r.role when 'buyer' then '/dashboard'
              when 'vendor' then '/vendor'
              when 'admin' then '/admin' end as dashboard_path
from auth.users u join public.account_roles r on r.user_id = u.id
where lower(u.email) in ('alex@company.com','vendor@saasmrkt.com','admin@saasmrkt.com')
order by r.role;
commit;
