-- Run once on a fresh Supabase project, as postgres, in numeric order.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  title text, company text, bio text, location text, website text, phone text,
  avatar_path text,
  created_at timestamptz not null default now()
);
-- Never derive authorization from editable user_metadata or the selected login tab.
create table public.account_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('buyer','vendor','admin')),
  status text not null default 'active' check (status in ('active','verified','suspended'))
);
alter table public.profiles enable row level security;
alter table public.account_roles enable row level security;

create function private.current_role() returns text
language sql stable security definer set search_path = ''
as $$ select role from public.account_roles
      where user_id = auth.uid() and status <> 'suspended' $$;
revoke all on function private.current_role() from public;
grant execute on function private.current_role() to anon, authenticated, service_role;

create function private.handle_signup() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare requested_role text := coalesce(new.raw_user_meta_data->>'role', 'buyer');
begin
  if requested_role not in ('buyer','vendor') then
    raise exception 'Public registration supports buyer and vendor accounts only';
  end if;
  insert into public.profiles(id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  insert into public.account_roles(user_id, role) values (new.id, requested_role);
  return new;
end $$;
revoke all on function private.handle_signup() from public;
create trigger marketplace_signup after insert on auth.users
for each row execute function private.handle_signup();

-- Existing Auth users get no privilege from client-editable metadata.
insert into public.profiles(id, name)
select id, coalesce(raw_user_meta_data->>'name','') from auth.users
on conflict (id) do nothing;
insert into public.account_roles(user_id,role)
select id, case when raw_user_meta_data->>'role' = 'vendor' then 'vendor' else 'buyer' end
from auth.users on conflict (user_id) do nothing;

revoke all on public.profiles, public.account_roles from anon, authenticated;
grant select on public.profiles, public.account_roles to authenticated;
grant update(name,title,company,bio,location,website,phone,avatar_path) on public.profiles to authenticated;
grant all on public.profiles, public.account_roles to service_role;
create policy profile_read on public.profiles for select to authenticated
using ((id = auth.uid() and private.current_role() is not null) or private.current_role() = 'admin');
create policy profile_edit on public.profiles for update to authenticated
using ((id = auth.uid() and private.current_role() is not null) or private.current_role() = 'admin')
with check ((id = auth.uid() and private.current_role() is not null) or private.current_role() = 'admin');
create policy role_read on public.account_roles for select to authenticated
using (user_id = auth.uid() or private.current_role() = 'admin');
-- Account suspension/deletion and role changes require an authorized server endpoint.
commit;
