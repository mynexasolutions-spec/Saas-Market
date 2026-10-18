# SaaS Market database setup

These are **proposed first-install scripts for an empty Supabase project**, based on the
current repository. They have not been applied to your hosted database.
Run each file in the Supabase SQL Editor as the project database owner, in order.
Files 01–07 are one-time migrations, not scripts to rerun against an existing schema.
Each file is transactional; if one fails, stop and resolve the error before proceeding.
File 08 is a manual account-promotion step; file 09 is read-only.

| File | Purpose |
| --- | --- |
| 01_accounts.sql | Auth-linked profiles, database roles, suspension, safe signup trigger |
| 02_catalog.sql | Categories, products, moderation fields, featured products, reviews, deals |
| 03_orders_and_inquiries.sql | Orders, licenses, shared buyer/vendor inquiries, contact approvals |
| 04_dashboards_and_content.sql | Wishlists, stacks, documents, dossiers, contact forms, subscriptions, editorial content, audit records |
| 05_access_policies.sql | Public visibility, owner access, admin reads, write restrictions |
| 06_storage.sql | Public product imagery and private avatars, documents, dossiers, downloads |
| 07_reference_categories.sql | Initial category labels only |
| setup_three_profiles.sql | Resolve the three designated confirmed emails and assign buyer/vendor/admin roles |
| 08_promote_admin.sql | Optional, repeatable promotion of the confirmed designated admin email |
| 09_verify_setup.sql | Inspect RLS, grants, buckets, and role counts without exposing credentials |
| tests/access_contract.sql | Rollback-only assertions for grants, RLS, and forged metadata |

## Authentication and admin setup

Supabase Auth owns passwords, email verification, refresh tokens, and sessions.
Do not create password or session tables or insert directly into auth.users.
Configure email confirmation, permitted redirect URLs, and email delivery in Supabase.
Signup metadata may contain name and role; role must be buyer or vendor.
The trigger rejects admin and other roles. Later metadata changes cannot alter
account_roles. Existing Auth accounts are backfilled as buyer/vendor only.

Create the three designated accounts through Supabase Authentication and confirm
their emails, then run setup_three_profiles.sql. It assigns all three roles.
File 08 optionally reaffirms the designated admin's role; no UUID editing is needed.
Neither script changes passwords. The repository's preset admin identity is a demo, not an
existing authenticated account or a stored password.

The application must verify the supplied password through Supabase Auth and read
account_roles for the verified user ID. A login-tab selection must never determine
permissions. This lets an admin sign in through either buyer or vendor selection.
Use server-verified sessions and check the current database role/status on every
privileged request, including after refresh. Suspended accounts have no private
data access through the policies, even if their token has not expired.

## Mapping the existing application

| Existing source / workflow | Database destination |
| --- | --- |
| AuthContext and profile page | auth.users, profiles, account_roles |
| adminStore platform users | profiles and account_roles; email comes from server-side Auth admin API |
| products.ts, categoriesData.ts | products, categories; rich category content lives in categories.content |
| vendorProducts, submit-product | products; vendor_id is an Auth UUID, never a vendor name |
| Admin project review/security scan | products.status, security_scan, approved_by, approved_at |
| FeaturedProducts and admin home tab | featured_products ordered by position |
| buyerOrders and checkout | orders plus licenses |
| vendorInquiries and buyer dashboard inquiries | purchase_inquiries shared by buyer_id/vendor_id |
| Profile applied products/contact approval | contact_applications plus private vendor_contacts |
| wishlist.ts | wishlist_items |
| Buyer stack and spend calculator inputs | buyer_stack; one-off calculator inputs can remain local |
| Vendor/admin document tables | vendor_documents and vendor-documents bucket |
| Buyer due-diligence dossiers | product_dossiers and dossiers bucket |
| Product rating/review display | reviews and derived product_ratings |
| Deals and deal email signup | deals and subscriptions(topic = deals) |
| Contact form | contact_messages |
| Newsletter | subscriptions(topic = newsletter) |
| Blog pages | blog_posts |
| alternativesData.ts | alternatives.content with associated product IDs |
| Static trust/about/legal/FAQ/badge content | site_content if database editing is desired |
| Administrative actions | admin_audit_log written by trusted endpoints |

Compare selections, search/filter state, open modals, and splash-screen session state
do not need database tables. Existing public images can remain in public/.
The catalog uses text product IDs to preserve current prod-* URLs. Account IDs must
be actual Auth UUIDs; do not seed fictional users or assign catalog records by name.
No hard-coded demo buyers, orders, license keys, or compliance claims are seeded.
Static catalog/blog imports need explicit mapping and review before publishing.
Product review totals will reflect real published reviews rather than demo counts.

## Write paths and permissions

Public visitors can read published catalog/editorial data only.
Buyers can read their own orders, licenses, inquiries, applications, wishlist, and
stack. Vendors can read their own listings, orders, inquiries, and documents.
Approved contact applications unlock the relevant private vendor contact.
Active admins can read all application tables. Role management and privileged
writes are reserved for trusted server endpoints; RLS does not make a service-role
key safe to expose in a browser.

Direct authenticated writes are limited to editable profile fields, owned wishlist
and stack rows, and immutable avatar/document uploads. Other writes intentionally
require backend endpoints. Those endpoints must verify the session, current role,
ownership, and allowed state transitions before using service_role:

- Product submission: derive vendor_id from the session and start Under Review.
  Vendors may edit their own listing and pause/re-enable only approved products.
  Only an admin may approve/reject, set security-scan results, or feature a product.
- Orders: derive prices and seller IDs from the database. Only a verified payment
  result may mark an order paid and issue a license. Use provider payment IDs for
  idempotency and a transaction for order/license/inquiry updates.
- Inquiries: derive buyer/vendor/product relationships server-side. Validate
  vendor ownership before changing status, quotes, or contact approval.
- Documents: verify uploaded object ownership, MIME type and size before inserting
  metadata. Only admins may verify/reject. Vendor edits must not replace a verified
  document in place.
- Users: check admin authorization before suspending/removing accounts. Preserve
  historical orders; use suspension instead of deleting referenced profiles.
- Public contact/subscription endpoints: validate inputs and apply rate limits.
  Confirm subscriptions before sending mail and support unsubscribe.
- Audit changes in the same transaction as the corresponding privileged write.

Use private Storage paths rather than base64 document contents. Generate short-lived
signed URLs only after checking access. The public product-media bucket must contain
only approved public assets. Draft documents, packages, and avatars remain private.
Vendor document SQL status pending/verified/rejected maps respectively to the
dashboard's In Review/Verified/Action Required and admin moderation labels.
Order paid plus active license maps to the current UI's Active purchase status.
Timestamps and numeric money values must be formatted by the UI, not stored as
display strings.

## Validation and remaining integration

The scripts were reviewed against the code's types, storage keys, forms, and dashboard
actions. Hosted execution is unverified: the configured Supabase hostname did not
resolve. A local PostgreSQL server exists, but no usable database login was available.
Run 09 and tests/access_contract.sql after installation and three-profile setup.
The access contract temporarily suspends the designated admin within a transaction
and rolls back all changes. If a test fails, issue ROLLBACK on the same connection.

SQL alone does not connect this Next.js app to Supabase. AuthContext and browser
storage utilities still need replacement with Supabase-backed services. The existing
password-ignoring demo login and localStorage role checks are not secured by merely
installing this schema. No frontend or backend authentication changes are included
in this SQL-only delivery.

After wiring the application, test buyer/vendor signup, forbidden admin signup,
wrong passwords, admin login through both tabs, session refresh/logout, suspension,
cross-account reads/writes, direct admin URLs/API calls, listing moderation, actual
file upload/download, and payment idempotency using isolated test accounts.

Reference: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[Auth profiles](https://supabase.com/docs/guides/auth/managing-user-data),
[Storage access](https://supabase.com/docs/guides/storage/security/access-control).
