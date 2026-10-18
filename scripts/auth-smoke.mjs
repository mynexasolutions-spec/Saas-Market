import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { chromium, request } from "@playwright/test";

const base = process.env.AUTH_TEST_BASE_URL || "http://127.0.0.1:3000";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth:{persistSession:false,autoRefreshToken:false} });
const createdUsers = [], productId = "prod-auth-test-" + randomUUID();
const cases = [], contexts = [];
let browser;
const check = (name) => { cases.push(name); console.log("PASS",name); };
const context = async () => {
 const ctx = await request.newContext({baseURL:base,extraHTTPHeaders:{Origin:base}});
 contexts.push(ctx); return ctx;
};
const post = (ctx,path,data) => ctx.post(path,{data});
async function createTestUser(role) {
 const password = randomUUID()+"aA1!";
 const email = "auth-test-"+randomUUID()+"@example.com";
 const {data,error} = await service.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{role,name:"Auth Smoke "+role}});
 assert.ifError(error);
 createdUsers.push(data.user.id);
 return {id:data.user.id,email,password,role};
}
async function adminSession(ctx) {
 const {data,error} = await service.auth.admin.generateLink({type:"magiclink",email:"admin@saasmrkt.com"});
 assert.ifError(error);
 const jar = new Map();
 const client = createServerClient(url,key,{
  cookieOptions:{httpOnly:true,sameSite:"lax",secure:false,path:"/"},
  cookies:{getAll:()=>[...jar.values()],setAll:values=>values.forEach(v=>jar.set(v.name,v))},
 });
 const {error:verifyError} = await client.auth.verifyOtp({token_hash:data.properties.hashed_token,type:"magiclink"});
 assert.ifError(verifyError);
 await ctx.storageState(); // Session tokens stay in memory; never write them to disk.
 const state = {cookies:[...jar.values()].filter(c=>c.value).map(c=>({
  name:c.name,value:c.value,domain:new URL(base).hostname,path:"/",httpOnly:true,secure:false,sameSite:"Lax",expires:-1,
 })),origins:[]};
 return state;
}
try {
 const guest = await context();
 assert.equal((await guest.get("/api/auth/session")).status(),401);
 assert.equal((await guest.get("/api/admin")).status(),401);
 for(const action of ["approve-document","reject-document","approve-project","remove-project","remove-user","feature-product","unfeature-product"])
  assert.equal((await post(guest,"/api/admin",{action,id:productId})).status(),401);
 check("anonymous sessions and every admin action denied");
 assert.equal((await post(guest,"/api/auth/signup",{email:"nobody@example.com",password:"invalid",name:"Test",role:"admin"})).status(),400);
 assert.equal((await post(guest,"/api/auth/login",{email:"nobody@example.com",password:randomUUID(),role:"buyer"})).status(),401);
 assert.equal((await guest.post("/api/auth/login",{headers:{Origin:"https://attacker.example"},data:{}})).status(),403);
 check("admin registration, invalid credentials, and cross-origin login denied");
 const buyer = await createTestUser("buyer"), vendor = await createTestUser("vendor");
 const buyerCtx = await context(), vendorCtx = await context();
 for(const [account,ctx] of [[buyer,buyerCtx],[vendor,vendorCtx]]) {
  for(const tab of ["buyer","vendor"]) {
   const response = await post(ctx,"/api/auth/login",{email:account.email,password:account.password,role:tab});
   const responseBody = await response.json();
   assert.equal(response.status(),200,JSON.stringify(responseBody));
   assert.equal(responseBody.user.role,account.role);
  }
  assert.equal((await ctx.get("/api/admin")).status(),403);
  for(const action of ["approve-document","reject-document","approve-project","remove-project","remove-user","feature-product","unfeature-product"])
   assert.equal((await post(ctx,"/api/admin",{action,id:productId})).status(),403);
  assert.equal((await post(ctx,"/api/profile",{role:"admin"})).status(),400);
  const state = await ctx.storageState();
  assert(state.cookies.filter(c=>c.name.startsWith("sb-")).every(c=>c.httpOnly));
 }
 check("password login through either tab respects database roles; all privileged writes denied");
 assert.equal((await buyerCtx.get("/vendor",{maxRedirects:0})).status(),307);
 assert.equal((await vendorCtx.get("/dashboard",{maxRedirects:0})).status(),307);
 check("cross-role dashboard routes denied");
 const listing = {id:productId,name:"Auth smoke product",category:"Project Management",
 tagline:"Temporary product for authorization smoke testing",price:10,period:"mo",pricingModel:"Subscription",
 description:"Temporary test record",website:"https://example.com",brandColor:"#6366F1",brandLetter:"AT",
 features:[],status:"Under Review"};
 assert.equal((await post(buyerCtx,"/api/vendor",{action:"listing",listing})).status(),403);
 assert.equal((await post(vendorCtx,"/api/vendor",{action:"listing",listing:{...listing,status:"Live & Active"}})).status(),403);
 assert.equal((await post(vendorCtx,"/api/vendor",{action:"listing",listing})).status(),200);
 check("vendor submission succeeds; buyer writes and vendor self-approval denied");
 const adminState = await adminSession(guest);
 const adminCtx = await request.newContext({baseURL:base,extraHTTPHeaders:{Origin:base},storageState:adminState});
 contexts.push(adminCtx);
 assert.equal((await (await adminCtx.get("/api/auth/session")).json()).user.role,"admin");
 const snapshot = await (await adminCtx.get("/api/admin")).json();
 assert(snapshot.projects.some(p=>p.id===productId));
 assert.equal((await post(adminCtx,"/api/admin",{action:"approve-project",id:productId})).status(),200);
 assert.equal((await post(adminCtx,"/api/admin",{action:"feature-product",id:productId})).status(),200);
 assert((await (await guest.get("/api/catalog")).json()).featuredIds.includes(productId));
 assert.equal((await post(adminCtx,"/api/admin",{action:"unfeature-product",id:productId})).status(),200);
 assert.equal((await post(adminCtx,"/api/admin",{action:"remove-user",id:(await (await adminCtx.get("/api/auth/session")).json()).user.id})).status(),403);
 check("verified admin session, approval, featured placement and self-deletion protection");
 const upload = await post(vendorCtx,"/api/vendor",{action:"document",document:{
  title:"Auth smoke document",category:"Security & Compliance",fileName:"auth-smoke.pdf",
  dataUrl:"data:application/pdf;base64,"+Buffer.from("%PDF-1.4\n%%EOF").toString("base64"),
 }});
 assert.equal(upload.status(),200);
 const vendorData = await (await vendorCtx.get("/api/vendor")).json();
 const doc = vendorData.documents.find(d=>d.title==="Auth smoke document");
 assert(doc);
 assert.equal((await buyerCtx.get(doc.downloadUrl,{maxRedirects:0})).status(),403);
 assert.equal((await post(adminCtx,"/api/admin",{action:"approve-document",id:doc.id})).status(),200);
 assert.equal((await post(adminCtx,"/api/admin",{action:"reject-document",id:doc.id})).status(),200);
 assert.equal((await vendorCtx.get(doc.downloadUrl,{maxRedirects:0})).status(),307);
 check("private document upload/download and admin review");
 browser = await chromium.launch({channel:"chrome",headless:true});
 const browserCtx = await browser.newContext();
 await browserCtx.addInitScript(() => sessionStorage.setItem("hasVisited", "true"));
 const page = await browserCtx.newPage();
 await page.goto(base + "/?signin=1");
 const dialog = page.getByRole("dialog").first();
 await dialog.waitFor();
 assert.equal(await dialog.getByRole("button",{name:/Platform Ops|Admin/}).count(),0);
 await dialog.locator('input[type=email]').fill(buyer.email);
 await dialog.locator('input[type=password]').fill(buyer.password);
 await dialog.getByRole("button",{name:"Sign In as User",exact:true}).click();
 await page.waitForURL("**/dashboard",{timeout:60000});
 await page.reload();
 await page.getByRole("heading",{name:/Buyer|Dashboard|Executive/}).first().waitFor({timeout:60000});
 await page.evaluate(()=>localStorage.setItem("saas_mrkt_user_session",JSON.stringify({role:"admin",email:"admin@saasmrkt.com"})));
 await page.goto(base+"/admin");
 assert(!page.url().endsWith("/admin"));
 check("browser login, reload persistence, two role tabs, and forged localStorage rejection");
 const adminBrowser = await browser.newContext({storageState:adminState});
 const adminPage = await adminBrowser.newPage();
 await adminPage.goto(base+"/admin");
 for(const label of ["Vendor Documents","Vendor Projects","Users","Orders","Home"]) {
  const buttons=adminPage.locator(".admin-tab-btn").filter({hasText:label});
  if(await buttons.count())await buttons.first().click();
 }
 assert.equal((await adminPage.request.get(base+"/api/admin")).status(),200);
 check("admin dashboard renders with verified session");
 assert.equal((await post(buyerCtx,"/api/auth/logout",{})).status(),200);
 assert.equal((await buyerCtx.get("/api/auth/session")).status(),401);
 assert.equal((await buyerCtx.get("/dashboard",{maxRedirects:0})).status(),307);
 check("logout clears session and protected access");
 console.log("Completed",cases.length,"smoke groups. Existing admin password was not reset or inspected.");
} finally {
 if(browser) await browser.close();
 // Delete only test-owned data created in this run, preserving real accounts/data.
 const ids = createdUsers;
 if(ids.length) {
  const {data:docs}=await service.from("vendor_documents").select("storage_path").in("vendor_id",ids);
  if(docs?.length)await service.storage.from("vendor-documents").remove(docs.map(d=>d.storage_path));
  const {data:docIds}=await service.from("vendor_documents").select("id").in("vendor_id",ids);
  const entities=[productId,...(docIds||[]).map(d=>d.id)];
  await service.from("admin_audit_log").delete().in("entity_id",entities);
  await service.from("vendor_documents").delete().in("vendor_id",ids);
  await service.from("featured_products").delete().eq("product_id",productId);
  await service.from("products").delete().eq("id",productId);
  for(const id of ids) {const {error}=await service.auth.admin.deleteUser(id);assert.ifError(error);}
 }
 for(const ctx of contexts)await ctx.dispose();
}
