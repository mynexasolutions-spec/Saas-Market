-- Run after setup_three_profiles.sql (08 is optional afterward).
-- Read-only: reports only the three explicitly designated account emails.
-- No passwords, hashes, tokens, or file contents are returned.
with expected(email, expected_role, dashboard_path) as (
 values ('alex@company.com','buyer','/dashboard'),
        ('vendor@saasmrkt.com','vendor','/vendor'),
        ('admin@saasmrkt.com','admin','/admin')
)
select e.email, e.expected_role, r.role as actual_role, r.status,
       e.dashboard_path as intended_dashboard,
       case when u.id is null then 'MISSING AUTH USER'
            when u.email_confirmed_at is null then 'EMAIL NOT CONFIRMED'
            when r.user_id is null then 'MISSING ROLE'
            when r.role <> e.expected_role then 'WRONG ROLE'
            when r.status not in ('active','verified') then 'ACCOUNT SUSPENDED'
            else 'PASS' end as result
from expected e left join auth.users u on lower(u.email) = e.email
left join public.account_roles r on r.user_id = u.id
order by e.expected_role;
-- Intended dashboard paths are informational; routing requires backend integration.
select tablename, rowsecurity from pg_tables
where schemaname = 'public' order by tablename;
select schemaname, tablename, policyname, roles, cmd from pg_policies
where schemaname in ('public','storage') order by schemaname,tablename,policyname;
select role,status,count(*) from public.account_roles group by role,status;
select id,public,file_size_limit from storage.buckets
where id in ('avatars','product-media','vendor-documents','product-downloads','dossiers');
select grantee,table_name,privilege_type from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon','authenticated')
order by table_name,grantee,privilege_type;
-- Both must be false: public clients must never assign roles or forge paid orders.
select has_table_privilege('authenticated','public.account_roles','UPDATE') as client_can_change_roles,
       has_table_privilege('authenticated','public.orders','INSERT') as client_can_forge_orders;
