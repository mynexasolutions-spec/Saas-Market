begin;
create table public.wishlist_items (
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(buyer_id,product_id)
);
create table public.buyer_stack (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_id text references public.products(id),
  name text not null, category text not null,
  seats integer not null check(seats > 0),
  monthly_cost_per_seat numeric(12,2) not null check(monthly_cost_per_seat >= 0),
  billing text not null check(billing in ('Monthly','Annual'))
);
create index buyer_stack_owner_idx on public.buyer_stack(buyer_id);
create table public.vendor_documents (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.profiles(id),
  title text not null,
  category text not null check(category in
    ('Legal & Incorporation','Tax & Financial','Security & Compliance','Service Level Agreement')),
  storage_path text not null unique, file_name text not null,
  byte_size bigint not null check(byte_size > 0 and byte_size <= 26214400),
  mime_type text not null,
  status text not null default 'pending' check(status in ('pending','verified','rejected')),
  reviewed_by uuid references public.profiles(id), reviewed_at timestamptz, review_note text,
  created_at timestamptz not null default now()
);
create index documents_vendor_idx on public.vendor_documents(vendor_id);
create table public.product_dossiers (
  product_id text primary key references public.products(id),
  audited_mrr numeric(14,2) check(audited_mrr >= 0),
  infrastructure_sla text, compliance_audit text, storage_path text,
  published boolean not null default false, audited_at timestamptz
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  name text not null, email text not null, company text, reason text not null,
  message text not null, resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null, topic text not null check(topic in ('newsletter','deals')),
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz, unsubscribed_at timestamptz,
  unique(email,topic), check(email = lower(trim(email)))
);
create table public.blog_posts (
  slug text primary key, title text not null, excerpt text, body text not null,
  category text, author_name text, image_path text, read_time_minutes integer,
  featured boolean not null default false,
  published boolean not null default false, published_at timestamptz
);
create table public.alternatives (
  slug text primary key, title text not null,
  content jsonb not null default '{}'::jsonb,
  product_ids text[] not null default '{}', published boolean not null default false
);
create table public.site_content (
  key text primary key, content jsonb not null,
  published boolean not null default false
);
-- Record admin actions from trusted server endpoints in the same transaction as each change.
create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null, entity_type text not null, entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
-- Remain inaccessible until the access-policy file is installed.
alter table public.wishlist_items enable row level security;
revoke all on public.wishlist_items from anon, authenticated;
alter table public.buyer_stack enable row level security;
revoke all on public.buyer_stack from anon, authenticated;
alter table public.vendor_documents enable row level security;
revoke all on public.vendor_documents from anon, authenticated;
alter table public.product_dossiers enable row level security;
revoke all on public.product_dossiers from anon, authenticated;
alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from anon, authenticated;
alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from anon, authenticated;
alter table public.alternatives enable row level security;
revoke all on public.alternatives from anon, authenticated;
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
alter table public.admin_audit_log enable row level security;
revoke all on public.admin_audit_log from anon, authenticated;
commit;
