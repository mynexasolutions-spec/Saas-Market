begin;
create table public.categories (
  slug text primary key, name text not null unique,
  description text, icon text, content jsonb not null default '{}'::jsonb
);
create table public.products (
  id text primary key,
  vendor_id uuid references public.profiles(id),
  slug text unique, name text not null,
  category_slug text references public.categories(slug),
  tagline text not null default '', description text not null default '',
  website text, price numeric(12,2) not null default 0 check(price >= 0),
  currency text not null default 'USD', period text not null default 'mo',
  pricing_model text not null default 'Subscription',
  brand_color text, brand_letter text, logo_path text, image_path text,
  gallery text[] not null default '{}', features text[] not null default '{}',
  tags text[] not null default '{}', target_audience text, hq_location text,
  about_text text, key_features jsonb not null default '[]'::jsonb,
  launch_date text, team_size text, tech_stack text[] not null default '{}',
  status text not null default 'Under Review'
    check(status in ('Under Review','Live & Active','Paused','Rejected')),
  security_scan text not null default 'Pending' check(security_scan in ('Pending','Passed','Flagged')),
  founder_name text, founder_email text, escrow_accepted_at timestamptz,
  approved_by uuid references public.profiles(id), approved_at timestamptz,
  deleted_at timestamptz, created_at timestamptz not null default now()
);
create index products_vendor_idx on public.products(vendor_id);
create index products_category_idx on public.products(category_slug);
create index products_live_idx on public.products(status) where deleted_at is null;
create table public.featured_products (
  product_id text primary key references public.products(id) on delete cascade,
  position integer not null default 0
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  buyer_id uuid not null references public.profiles(id),
  rating integer not null check(rating between 1 and 5),
  title text, body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  unique(product_id,buyer_id)
);
-- Ratings/counts are derived from published reviews, never client-supplied totals.
create view public.product_ratings with (security_invoker = true) as
select product_id, avg(rating)::numeric(3,2) as rating, count(*) as review_count
from public.reviews where published group by product_id;
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  title text not null, description text, coupon_code text,
  original_price numeric(12,2) check(original_price >= 0),
  deal_price numeric(12,2) check(deal_price >= 0),
  starts_at timestamptz, expires_at timestamptz,
  published boolean not null default false,
  check(expires_at is null or starts_at is null or expires_at > starts_at)
);
-- Remain inaccessible until the access-policy file is installed.
alter table public.categories enable row level security;
revoke all on public.categories from anon, authenticated;
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
alter table public.featured_products enable row level security;
revoke all on public.featured_products from anon, authenticated;
alter table public.reviews enable row level security;
revoke all on public.reviews from anon, authenticated;
alter table public.deals enable row level security;
revoke all on public.deals from anon, authenticated;
revoke all on public.product_ratings from anon, authenticated;
commit;
