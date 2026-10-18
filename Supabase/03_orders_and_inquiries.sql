begin;
-- Only a verified server payment workflow may issue paid orders/licenses.
-- Never store card numbers, CVV, payment passwords, or browser-generated license keys.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  vendor_id uuid not null references public.profiles(id),
  product_id text not null references public.products(id),
  product_name text not null, category text, seller_name text,
  amount numeric(12,2) not null check(amount >= 0),
  currency text not null default 'USD', period text not null,
  payment_method text not null check(payment_method in ('card','paypal','applepay')),
  status text not null default 'pending' check(status in ('pending','paid','failed','refunded','cancelled')),
  payment_provider text, provider_payment_id text,
  purchased_at timestamptz, created_at timestamptz not null default now(),
  unique(payment_provider,provider_payment_id)
);
create index orders_buyer_idx on public.orders(buyer_id);
create index orders_vendor_idx on public.orders(vendor_id);
create index orders_product_idx on public.orders(product_id);
create table public.licenses (
  order_id uuid primary key references public.orders(id),
  license_key text not null unique, download_path text,
  status text not null default 'active' check(status in ('active','revoked','expired')),
  issued_at timestamptz not null default now(), expires_at timestamptz
);
create table public.purchase_inquiries (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  vendor_id uuid not null references public.profiles(id),
  product_id text not null references public.products(id),
  order_id uuid unique references public.orders(id),
  buyer_name text, buyer_email text, buyer_phone text, buyer_whatsapp text,
  company_name text, purchase_type text not null
    check(purchase_type in ('Direct Purchase','Enterprise License','Custom Quote','Volume Discount')),
  team_size text, budget_offer text, message text not null,
  quoted_price text, vendor_note text,
  status text not null default 'New Request'
    check(status in ('New Request','Contacted','Quote Sent','Purchased')),
  buyer_status text not null default 'Pending Vendor'
    check(buyer_status in ('Quote Received','Pending Vendor','Negotiation','Purchased')),
  created_at timestamptz not null default now()
);
create index inquiries_buyer_idx on public.purchase_inquiries(buyer_id);
create index inquiries_vendor_idx on public.purchase_inquiries(vendor_id);
create table public.contact_applications (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  product_id text not null references public.products(id),
  inquiry_note text, status text not null default 'pending' check(status in ('pending','approved','rejected')),
  status_note text, created_at timestamptz not null default now(),
  unique(buyer_id,product_id)
);
-- Private vendor contacts are separate from the public product catalog.
create table public.vendor_contacts (
  vendor_id uuid primary key references public.profiles(id),
  contact_person text, email text, phone text, whatsapp_number text
);
-- Remain inaccessible until the access-policy file is installed.
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
alter table public.licenses enable row level security;
revoke all on public.licenses from anon, authenticated;
alter table public.purchase_inquiries enable row level security;
revoke all on public.purchase_inquiries from anon, authenticated;
alter table public.contact_applications enable row level security;
revoke all on public.contact_applications from anon, authenticated;
alter table public.vendor_contacts enable row level security;
revoke all on public.vendor_contacts from anon, authenticated;
commit;
