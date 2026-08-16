
-- roles
create type public.app_role as enum ('admin','editor','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "admin profile read" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admin profile update" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());

create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admin roles read" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
grant insert, update, delete on public.user_roles to authenticated;
create policy "admin roles write" on public.user_roles for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin roles delete" on public.user_roles for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  details text not null default '',
  icon text not null default 'Sparkles',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public services read" on public.services for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin services write" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();

-- team
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null default '',
  photo_url text not null default '',
  bio text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "public team read" on public.team_members for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin team write" on public.team_members for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger team_touch before update on public.team_members for each row execute function public.touch_updated_at();

-- posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Insights',
  excerpt text not null default '',
  content text not null default '',
  cover_url text not null default '',
  author text not null default 'Fourtitude Team',
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "public posts read" on public.posts for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin posts write" on public.posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

-- settings
create table public.site_settings (
  id int primary key default 1,
  company_name text not null default 'Fourtitude Technology Consultants LTD',
  tagline text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  about text not null default '',
  mission text not null default '',
  vision text not null default '',
  email text not null default '',
  phone text not null default '',
  phone_alt text not null default '',
  address text not null default '',
  facebook text not null default '',
  twitter text not null default '',
  linkedin text not null default '',
  stat_clients int not null default 0,
  stat_projects int not null default 0,
  stat_partners int not null default 0,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public settings read" on public.site_settings for select to anon, authenticated using (true);
create policy "admin settings write" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default '',
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send message" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admin messages read" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin messages update" on public.contact_messages for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin messages delete" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- seed
insert into public.site_settings (id, tagline, hero_title, hero_subtitle, about, mission, vision, email, phone, phone_alt, address, stat_clients, stat_projects, stat_partners)
values (1,
 'Empowering innovation through cutting-edge technology solutions.',
 'Technology that moves your business forward',
 'We are an innovative technology consulting firm revolutionizing industries and driving digital transformation across Kenya and beyond.',
 'Founded in 2023, Fourtitude Technology Consultants LTD specializes in cutting-edge technology services. Our team has developed expertise in website design, domain hosting, cybersecurity and software solutions, all of which can be customized to meet your unique requirements. We take pride in our work and look forward to helping you achieve your goals.',
 'To deliver top-tier information technology services to government and industry clients, empowering our customers to succeed in managing their daily business workflows, big data and advanced analytics. We leverage the latest technology to deliver exceptional, user-friendly business applications and innovative problem-solving strategies.',
 'To be a top software company through outstanding solutions, an inclusive environment, continuous investment in technology, and lasting client partnerships.',
 'info@fourtitude.co.ke', '+254726900262', '+254712490863', 'Nairobi, Kenya', 40, 65, 12);

insert into public.services (slug, title, summary, details, icon, sort_order) values
('website-design-hosting','Website Design & Hosting','Professional website design for small businesses and entrepreneurs, built modern, fast and mobile-friendly.','Our designers are knowledgeable in the latest industry trends and technology, ensuring your website is modern and user-friendly. We handle design, development, domain registration, hosting and ongoing maintenance so your online presence always works.','Globe',1),
('it-consultation','IT Consultation','Expert guidance on cloud computing, software development, data analytics, cybersecurity and project management.','We offer professional IT consultation services to help your organization with its technology needs. We can make your tech better and save you time and money, helping you use the latest technology to meet your business goals with great ongoing support.','Lightbulb',2),
('system-development','System Development','Custom-built systems and support for existing ones, delivered on time and on budget.','Our expert developers create bespoke software tailored to your needs, from mobile apps and desktop software to cloud-based applications. We also modernise and support existing systems, always ensuring customer satisfaction.','Code2',3),
('cyber-security','Cyber Security','Assessments, penetration testing and incident response planning to protect your business.','We help protect your business with a wide range of cybersecurity services. Our experts use the latest technologies and techniques, including security assessments, vulnerability and penetration testing, awareness training and incident response planning.','ShieldCheck',4),
('data-analytics','Data Analytics','Precise insights that drive growth, from data modeling to optimization.','We offer tailored analytics solutions from data modeling and warehousing to dashboards and optimization. Unlock your data potential, measure what matters and elevate your decision making.','BarChart3',5),
('it-infrastructure','IT Infrastructure','Reliable, secure and scalable infrastructure, including networks, cloud and virtualization.','We design and deploy custom IT infrastructure that is reliable, secure and scalable. Services include network setup, network security, cloud solutions, server virtualization and structured support.','Server',6),
('systems-integration','Systems Integration','Seamlessly connect and optimize your existing systems.','We help you streamline processes, enhance data flow between platforms and improve overall system efficiency through well-planned integrations and APIs.','Workflow',7),
('computer-hardware','Computer Hardware','Quality hardware supply, custom PC builds, upgrades and troubleshooting.','We offer a comprehensive range of top quality computer hardware products and services. From building custom PCs to hardware upgrades and troubleshooting, we have your hardware needs covered.','Cpu',8);

insert into public.team_members (name, title, photo_url, bio, sort_order) values
('Evans K. Rop','Computer Engineer','/__l5e/assets-v1/6a036fad-138d-403c-b004-93312fe83571/EVANS_passport.png','Evans leads our hardware and infrastructure practice, designing reliable systems and networks for clients of every size.',1),
('Alfred Kosgey','Software Engineer','/__l5e/assets-v1/9800ce56-da22-457f-ba1b-68d9b69bf9f8/Alfred_passport.jpg','Alfred builds robust web and mobile applications, turning complex business processes into clean, usable software.',2),
('Enock Sang','Software Engineer','/__l5e/assets-v1/32d9af38-ab3d-4781-b4dc-2fd45e084726/Enock_Passport.png','Enock specialises in systems development and integration, connecting platforms so data flows where it is needed.',3),
('Caldas Cheruyot','Cybersecurity Analyst','/__l5e/assets-v1/694a6b99-b96b-46b5-a021-97aba8d82c3b/Caldas_Passport.png','Caldas keeps our clients secure through assessments, penetration testing and incident response planning.',4);

insert into public.posts (slug, title, category, excerpt, content) values
('why-every-kenyan-sme-needs-a-modern-website','Why every Kenyan SME needs a modern website','Web','Your website is often the first conversation a customer has with your business. Here is how to make it count.','A modern website is no longer a brochure, it is your most reliable salesperson. It works at 2am, it answers common questions, and it collects leads while your team sleeps.

Speed, mobile-first layouts and clear calls to action consistently outperform heavy, cluttered designs. Start with the three questions every visitor asks: what do you do, can I trust you, and how do I get started.'),
('five-cybersecurity-habits-for-small-teams','Five cybersecurity habits for small teams','Security','You do not need an enterprise budget to dramatically reduce your risk. Start with these five habits.','1. Turn on multi-factor authentication everywhere. 2. Patch systems weekly. 3. Back up to a location attackers cannot reach. 4. Train your team to recognise phishing. 5. Write down what you will do in the first hour of an incident.

Most breaches we investigate would have been prevented or contained by these basics.'),
('turning-your-data-into-decisions','Turning your data into decisions','Data','Dashboards are easy. Decisions are hard. Here is how we bridge the gap for our clients.','Good analytics starts with a question, not a chart. We work backwards from the decision you need to make, identify the smallest reliable dataset that answers it, then automate the reporting so the answer arrives before the decision does.');
