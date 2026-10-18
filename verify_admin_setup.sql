-- Verify admin account exists and has correct role
SELECT 
  u.email,
  u.email_confirmed_at,
  p.name,
  p.title,
  p.company,
  r.role,
  r.status,
  CASE r.role 
    WHEN 'buyer' THEN '/dashboard'
    WHEN 'vendor' THEN '/vendor' 
    WHEN 'admin' THEN '/admin'
  END as dashboard_path
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
JOIN public.account_roles r ON r.user_id = u.id
WHERE lower(u.email) = 'admin@saasmrkt.com';

-- Verify no public signup can create admin (should return constraint)
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.account_roles'::regclass 
AND contype = 'c';

-- Verify RLS policies use current_role()
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'account_roles';