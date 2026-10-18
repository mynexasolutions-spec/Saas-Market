-- Deny by default. Sensitive writes use authenticated, authorized server endpoints.
-- service_role bypasses RLS: every such endpoint MUST independently verify the caller.
begin;
alter table public.categories enable row level security;
revoke all on public.categories from anon, authenticated;
grant all on public.categories to service_role;
grant select on public.categories to authenticated;
create policy admin_read on public.categories for select to authenticated using (private.current_role() = 'admin');

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant all on public.products to service_role;
grant select on public.products to authenticated;
create policy admin_read on public.products for select to authenticated using (private.current_role() = 'admin');

alter table public.featured_products enable row level security;
revoke all on public.featured_products from anon, authenticated;
grant all on public.featured_products to service_role;
grant select on public.featured_products to authenticated;
create policy admin_read on public.featured_products for select to authenticated using (private.current_role() = 'admin');

alter table public.reviews enable row level security;
revoke all on public.reviews from anon, authenticated;
grant all on public.reviews to service_role;
grant select on public.reviews to authenticated;
create policy admin_read on public.reviews for select to authenticated using (private.current_role() = 'admin');

alter table public.deals enable row level security;
revoke all on public.deals from anon, authenticated;
grant all on public.deals to service_role;
grant select on public.deals to authenticated;
create policy admin_read on public.deals for select to authenticated using (private.current_role() = 'admin');

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant all on public.orders to service_role;
grant select on public.orders to authenticated;
create policy admin_read on public.orders for select to authenticated using (private.current_role() = 'admin');

alter table public.licenses enable row level security;
revoke all on public.licenses from anon, authenticated;
grant all on public.licenses to service_role;
grant select on public.licenses to authenticated;
create policy admin_read on public.licenses for select to authenticated using (private.current_role() = 'admin');

alter table public.purchase_inquiries enable row level security;
revoke all on public.purchase_inquiries from anon, authenticated;
grant all on public.purchase_inquiries to service_role;
grant select on public.purchase_inquiries to authenticated;
create policy admin_read on public.purchase_inquiries for select to authenticated using (private.current_role() = 'admin');

alter table public.contact_applications enable row level security;
revoke all on public.contact_applications from anon, authenticated;
grant all on public.contact_applications to service_role;
grant select on public.contact_applications to authenticated;
create policy admin_read on public.contact_applications for select to authenticated using (private.current_role() = 'admin');

alter table public.vendor_contacts enable row level security;
revoke all on public.vendor_contacts from anon, authenticated;
grant all on public.vendor_contacts to service_role;
grant select on public.vendor_contacts to authenticated;
create policy admin_read on public.vendor_contacts for select to authenticated using (private.current_role() = 'admin');

alter table public.wishlist_items enable row level security;
revoke all on public.wishlist_items from anon, authenticated;
grant all on public.wishlist_items to service_role;
grant select on public.wishlist_items to authenticated;
create policy admin_read on public.wishlist_items for select to authenticated using (private.current_role() = 'admin');

alter table public.buyer_stack enable row level security;
revoke all on public.buyer_stack from anon, authenticated;
grant all on public.buyer_stack to service_role;
grant select on public.buyer_stack to authenticated;
create policy admin_read on public.buyer_stack for select to authenticated using (private.current_role() = 'admin');

alter table public.vendor_documents enable row level security;
revoke all on public.vendor_documents from anon, authenticated;
grant all on public.vendor_documents to service_role;
grant select on public.vendor_documents to authenticated;
create policy admin_read on public.vendor_documents for select to authenticated using (private.current_role() = 'admin');

alter table public.product_dossiers enable row level security;
revoke all on public.product_dossiers from anon, authenticated;
grant all on public.product_dossiers to service_role;
grant select on public.product_dossiers to authenticated;
create policy admin_read on public.product_dossiers for select to authenticated using (private.current_role() = 'admin');

alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
grant all on public.contact_messages to service_role;
grant select on public.contact_messages to authenticated;
create policy admin_read on public.contact_messages for select to authenticated using (private.current_role() = 'admin');

alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from anon, authenticated;
grant all on public.subscriptions to service_role;
grant select on public.subscriptions to authenticated;
create policy admin_read on public.subscriptions for select to authenticated using (private.current_role() = 'admin');

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from anon, authenticated;
grant all on public.blog_posts to service_role;
grant select on public.blog_posts to authenticated;
create policy admin_read on public.blog_posts for select to authenticated using (private.current_role() = 'admin');

alter table public.alternatives enable row level security;
revoke all on public.alternatives from anon, authenticated;
grant all on public.alternatives to service_role;
grant select on public.alternatives to authenticated;
create policy admin_read on public.alternatives for select to authenticated using (private.current_role() = 'admin');

alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant all on public.site_content to service_role;
grant select on public.site_content to authenticated;
create policy admin_read on public.site_content for select to authenticated using (private.current_role() = 'admin');

alter table public.admin_audit_log enable row level security;
revoke all on public.admin_audit_log from anon, authenticated;
grant all on public.admin_audit_log to service_role;
grant select on public.admin_audit_log to authenticated;
create policy admin_read on public.admin_audit_log for select to authenticated using (private.current_role() = 'admin');


grant select on public.categories, public.products, public.featured_products,
 public.reviews, public.product_ratings, public.deals, public.blog_posts,
 public.alternatives, public.site_content to anon, authenticated;
create policy categories_read on public.categories for select using (true);
create policy products_read on public.products for select using (
 (status = 'Live & Active' and deleted_at is null)
 or (vendor_id = auth.uid() and private.current_role() = 'vendor')
);
create policy featured_read on public.featured_products for select using (
 exists(select 1 from public.products p where p.id = product_id and p.status = 'Live & Active' and p.deleted_at is null)
);
create policy reviews_read on public.reviews for select using (
 (published and exists(select 1 from public.products p where p.id = product_id and p.status = 'Live & Active' and p.deleted_at is null))
 or (buyer_id = auth.uid() and private.current_role() = 'buyer')
);
create policy deals_read on public.deals for select using (
 published and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at > now())
 and exists(select 1 from public.products p where p.id = product_id and p.status = 'Live & Active' and p.deleted_at is null)
);
create policy blog_read on public.blog_posts for select using (published and published_at <= now());
create policy alternatives_read on public.alternatives for select using(published);
create policy content_read on public.site_content for select using(published);
create policy orders_read on public.orders for select to authenticated using (
 (buyer_id = auth.uid() and private.current_role() = 'buyer')
 or (vendor_id = auth.uid() and private.current_role() = 'vendor')
);
create policy licenses_read on public.licenses for select to authenticated using (
 private.current_role() = 'buyer' and exists(
 select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
);
create policy inquiries_read on public.purchase_inquiries for select to authenticated using (
 (buyer_id = auth.uid() and private.current_role() = 'buyer')
 or (vendor_id = auth.uid() and private.current_role() = 'vendor')
);
create policy applications_read on public.contact_applications for select to authenticated using (
 (buyer_id = auth.uid() and private.current_role() = 'buyer')
 or (private.current_role() = 'vendor' and exists(
 select 1 from public.products p where p.id = product_id and p.vendor_id = auth.uid()))
);
create policy contacts_read on public.vendor_contacts for select to authenticated using (
 (vendor_id = auth.uid() and private.current_role() = 'vendor')
 or (private.current_role() = 'buyer' and exists(
 select 1 from public.contact_applications a join public.products p on p.id = a.product_id
 where a.buyer_id = auth.uid() and a.status = 'approved' and p.vendor_id = vendor_contacts.vendor_id))
);
create policy documents_read on public.vendor_documents for select to authenticated using (
 vendor_id = auth.uid() and private.current_role() = 'vendor'
);
create policy dossiers_read on public.product_dossiers for select to authenticated using (
 published and private.current_role() = 'buyer'
);
create policy messages_read on public.contact_messages for select to authenticated using (
 user_id = auth.uid() and private.current_role() is not null
);
grant select, insert, update, delete on public.wishlist_items, public.buyer_stack to authenticated;
create policy wishlist_owner on public.wishlist_items for all to authenticated
using (buyer_id = auth.uid() and private.current_role() = 'buyer')
with check (buyer_id = auth.uid() and private.current_role() = 'buyer');
create policy stack_owner on public.buyer_stack for all to authenticated
using (buyer_id = auth.uid() and private.current_role() = 'buyer')
with check (buyer_id = auth.uid() and private.current_role() = 'buyer');
-- No client writes for payments, licensing, approval, role management, or audit events.
-- Public contact/newsletter submissions go through a rate-limited server endpoint.
commit;
