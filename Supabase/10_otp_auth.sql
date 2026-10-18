-- Run after 01_accounts.sql and 05_access_policies.sql
-- Adds OTP authentication support via Brevo email delivery
begin;

-- OTP storage table for email-based authentication
create table public.auth_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp_hash text not null,          -- SHA-256 digest of the 6-digit OTP
  purpose text not null check (purpose in ('login','signup')),
  role text not null check (role in ('buyer','vendor')),
  name text,                       -- only for signup purpose
  expires_at timestamptz not null, -- 10 minutes from creation
  attempts integer not null default 0,       -- verification attempts (max 5)
  resend_count integer not null default 0,   -- resend attempts (max 3 per window)
  last_resent_at timestamptz,      -- for resend rate limiting (15 min window)
  consumed_at timestamptz,         -- set when OTP is successfully used
  created_at timestamptz not null default now()
);

create index auth_otps_email_idx on public.auth_otps(email);
create index auth_otps_expires_idx on public.auth_otps(expires_at) where consumed_at is null;

-- Enable RLS - OTPs are managed only by service_role via server endpoints
alter table public.auth_otps enable row level security;
revoke all on public.auth_otps from anon, authenticated;
grant all on public.auth_otps to service_role;

-- Function to clean expired OTPs (can be called via pg_cron or manually)
create function private.cleanup_expired_otps() returns integer
language plpgsql security definer set search_path = ''
as $$
declare deleted_count integer;
begin
  delete from public.auth_otps
  where expires_at < now() or consumed_at is not null;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end $$;

revoke all on function private.cleanup_expired_otps() from public;
grant execute on function private.cleanup_expired_otps() to service_role;

-- Optional direct-SQL helper. The application enforces the same limits through
-- service-role table access because private-schema functions are not exposed by
-- the default Supabase Data API.
-- Function to check rate limits for OTP requests
create function private.check_otp_rate_limit(p_email text, p_purpose text, p_role text)
returns table (allowed boolean, error text, retry_after interval)
language plpgsql security definer set search_path = ''
as $$
declare
  recent_otp record;
  resend_window interval := '15 minutes';
  max_resends integer := 3;
begin
  -- Check for active unconsumed OTP for same email/purpose/role
  select * into recent_otp
  from public.auth_otps
  where email = lower(p_email)
    and purpose = p_purpose
    and role = p_role
    and consumed_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if recent_otp is not null then
    -- Check resend limit within window
    if recent_otp.resend_count >= max_resends
       and recent_otp.last_resent_at > now() - resend_window then
      return query select false, 'Too many OTP requests. Please wait before requesting another.', 
        (recent_otp.last_resent_at + resend_window) - now();
    end if;
  end if;

  return query select true, null, null;
end $$;

revoke all on function private.check_otp_rate_limit(text,text,text) from public;
grant execute on function private.check_otp_rate_limit(text,text,text) to service_role;

commit;
