-- Reference labels only. No fake users, purchases, compliance certificates, or credentials.
begin;
insert into public.categories(slug,name) values
 ('hr-payroll','HR & Payroll'),
 ('project-management','Project Management'),
 ('accounting-finance','Accounting & Finance'),
 ('marketing','Marketing'),
 ('customer-support','Customer Support'),
 ('developer-tools','Developer Tools'),
 ('crm-sales','CRM & Sales'),
 ('analytics-bi','Analytics & BI'),
 ('security-compliance','Security & Compliance'),
 ('productivity','Productivity'),
 ('design-creative','Design & Creative'),
 ('collaboration','Collaboration')
on conflict (slug) do nothing;
commit;
