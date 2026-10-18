-- Files must be uploaded through Supabase Storage API, never INSERT into storage.objects.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('avatars','avatars',false,2097152,array['image/jpeg','image/png','image/webp']),
 ('product-media','product-media',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('vendor-documents','vendor-documents',false,26214400,array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
 ('product-downloads','product-downloads',false,104857600,null),
 ('dossiers','dossiers',false,26214400,array['application/pdf']);
-- Paths for avatars and vendor documents: <auth-user-uuid>/<unique-file-name>.
create policy marketplace_avatar_read on storage.objects for select to authenticated
using(bucket_id = 'avatars' and
 ((storage.foldername(name))[1] = auth.uid()::text and private.current_role() is not null
 or private.current_role() = 'admin'));
create policy marketplace_avatar_insert on storage.objects for insert to authenticated
with check(bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
 and private.current_role() is not null);
create policy marketplace_avatar_delete on storage.objects for delete to authenticated
using(bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
 and private.current_role() is not null);
-- Upload immutable objects under unique paths. Replacing files requires server authorization.
create policy marketplace_document_insert on storage.objects for insert to authenticated
with check(bucket_id = 'vendor-documents'
 and (storage.foldername(name))[1] = auth.uid()::text
 and private.current_role() = 'vendor');
create policy marketplace_document_read on storage.objects for select to authenticated
using(bucket_id = 'vendor-documents' and
 (private.current_role() = 'admin' or
 ((storage.foldername(name))[1] = auth.uid()::text and private.current_role() = 'vendor')));
create policy marketplace_download_read on storage.objects for select to authenticated
using(bucket_id = 'product-downloads' and
 (private.current_role() = 'admin' or exists(
 select 1 from public.licenses l join public.orders o on o.id = l.order_id
 where l.download_path = name and o.buyer_id = auth.uid() and o.status = 'paid'
 and l.status = 'active' and (l.expires_at is null or l.expires_at > now())
 and private.current_role() = 'buyer')));
create policy marketplace_dossier_read on storage.objects for select to authenticated
using(bucket_id = 'dossiers' and
 (private.current_role() = 'admin' or exists(
 select 1 from public.product_dossiers d where d.storage_path = name
 and d.published and private.current_role() = 'buyer')));
-- Product media is publicly served; only trusted server endpoints publish/upload it.
-- Draft screenshots must not be stored here until approved for public exposure.
commit;
