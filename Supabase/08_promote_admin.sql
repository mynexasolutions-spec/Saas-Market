-- MANUAL OPERATOR STEP, not an automatic migration.
-- First create the real account through Supabase Auth (Dashboard > Authentication > Users).
-- Set its password there; never put passwords in SQL or source control.
-- Resolves the explicitly designated admin email; leave its signup role buyer/vendor.
-- Optional after setup_three_profiles.sql, which already promotes this account.
-- Safe to repeat: no password changes and no duplicate promotion audit entries.
begin;
do $$
declare target_user uuid;
begin
 select id into strict target_user from auth.users
 where lower(email) = 'admin@saasmrkt.com' and email_confirmed_at is not null;
 if not exists(select 1 from public.account_roles where user_id = target_user) then
   raise exception 'Profile/role record missing; verify the 01_accounts.sql signup trigger';
 end if;
 update public.account_roles set role = 'admin', status = 'active'
 where user_id = target_user and (role <> 'admin' or status <> 'active');
 if found then
   insert into public.admin_audit_log(actor_id,action,entity_type,entity_id,details)
   values(null,'operator_promoted_admin','account_roles',target_user::text,
     jsonb_build_object('source','08_promote_admin.sql'));
 end if;
exception
 when no_data_found then
   raise exception 'Create and confirm admin@saasmrkt.com in Supabase Auth first';
 when too_many_rows then
   raise exception 'Multiple Auth accounts match the designated admin email; resolve duplicates first';
end $$;
commit;
