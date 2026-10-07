-- =========================================================
-- MESS MATE: SUPABASE DATABASE SCHEMA
-- Pilot Schema for College Hostel Mess Nutrition App
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. IFCT 2017 INGREDIENTS TABLE
create table if not exists public.ingredients (
  id text primary key,
  code text not null,
  name text not null,
  category text not null,
  calories numeric not null, -- per 100g
  protein numeric not null,  -- g per 100g
  carbs numeric not null,    -- g per 100g
  fat numeric not null,      -- g per 100g
  fiber numeric not null,    -- g per 100g
  allergens text[] default '{}',
  common_measure_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MESS DISHES TABLE
create table if not exists public.dishes (
  id text primary key,
  name text not null,
  category text check (category in ('veg', 'non-veg', 'egg')) not null,
  meal_slots text[] not null, -- array of 'breakfast', 'lunch', 'snacks', 'dinner'
  portion_description text not null,
  portion_size_grams numeric not null,
  portion_status text check (portion_status in ('measured', 'estimated')) default 'estimated',
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  fiber numeric not null,
  allergens text[] default '{}',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DISH INGREDIENTS COMPOSITION TABLE
create table if not exists public.dish_ingredients (
  id uuid primary key default uuid_generate_v4(),
  dish_id text references public.dishes(id) on delete cascade not null,
  ingredient_id text references public.ingredients(id) on delete cascade not null,
  raw_grams numeric not null
);

-- 4. MONTHLY FIXED MESS MENU (Fixed 30-Day Rotation)
create table if not exists public.monthly_menu (
  id uuid primary key default uuid_generate_v4(),
  day_number integer check (day_number between 1 and 30) not null,
  day_of_week text not null,
  meal_slot text check (meal_slot in ('breakfast', 'lunch', 'snacks', 'dinner')) not null,
  dish_ids text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (day_number, meal_slot)
);

-- 5. FOOD COURT SHOPS & ITEMS TABLES (Campus Vendors with Pricing)
create table if not exists public.food_court_shops (
  id text primary key,
  name text not null,
  tagline text not null,
  icon text not null,
  price_range text not null,
  popular_item_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.food_court_items (
  id text primary key,
  shop_id text not null,
  shop_name text not null,
  name text not null,
  price numeric not null,
  category text check (category in ('veg', 'non-veg', 'egg')) not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  fiber numeric not null,
  allergens text[] default '{}',
  portion_description text not null,
  is_popular boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ALLOWED COLLEGE DOMAINS TABLE (Configurable multi-campus support)
create table if not exists public.allowed_college_domains (
  id text primary key,
  college_name text not null,
  domain text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed default college domains
insert into public.allowed_college_domains (id, college_name, domain, is_active)
values 
  ('vitap_student', 'VIT-AP Student Portal', 'vitapstudent.ac.in', true),
  ('vitap', 'VIT-AP University', 'vitap.ac.in', true)
on conflict (domain) do update set is_active = true;

-- 7. STUDENTS TABLE (Linked to auth.users.id UUID)
create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  college_domain text not null,
  name text,
  hostel_block text,
  age integer,
  gender text check (gender in ('male', 'female')),
  height_cm numeric,
  weight_kg numeric,
  activity_level text,
  goal text check (goal in ('lose', 'maintain', 'gain', 'fitness')),
  diet_preference text check (diet_preference in ('veg', 'non-veg', 'egg')),
  allergies text[] default '{}',
  has_medical_condition boolean default false,
  medical_notes text,
  
  -- Calculated clinical targets (Mifflin-St Jeor)
  bmr numeric,
  tdee numeric,
  target_calories numeric,
  target_protein_g numeric,
  target_carbs_g numeric,
  target_fat_g numeric,
  bmi numeric,
  is_extreme_bmi boolean default false,
  calorie_floor_triggered boolean default false,
  is_liability_guardrail_active boolean default false,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Backward-compatibility user_profiles table (optional alias)
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  hostel_block text not null,
  age integer not null,
  gender text check (gender in ('male', 'female')) not null,
  height_cm numeric not null,
  weight_kg numeric not null,
  activity_level text not null,
  goal text check (goal in ('lose', 'maintain', 'gain', 'fitness')) not null,
  diet_preference text check (diet_preference in ('veg', 'non-veg', 'egg')) not null,
  allergies text[] default '{}',
  has_medical_condition boolean default false,
  medical_notes text,
  bmr numeric not null,
  tdee numeric not null,
  target_calories numeric not null,
  target_protein_g numeric not null,
  target_carbs_g numeric not null,
  target_fat_g numeric not null,
  bmi numeric not null,
  is_extreme_bmi boolean default false,
  calorie_floor_triggered boolean default false,
  is_liability_guardrail_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. MEAL CONSUMPTION LOGS (To measure behavioral shift in mess line)
create table if not exists public.meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  date_str text not null, -- YYYY-MM-DD
  source text check (source in ('mess', 'food_court')) not null,
  meal_slot text check (meal_slot in ('breakfast', 'lunch', 'snacks', 'dinner')) not null,
  dish_id text not null,
  dish_name text not null,
  portion_count numeric default 1.0 not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================
-- SERVER-SIDE TRIGGERS (DEFENSE-IN-DEPTH)
-- =========================================================

-- Trigger 1: Validate email domain strictly against allowed_college_domains table before auth user is created
create or replace function public.validate_college_email_domain()
returns trigger
language plpgsql
security definer
as $$
declare
  user_domain text;
  domain_allowed boolean;
begin
  user_domain := lower(split_part(new.email, '@', 2));
  
  select exists(
    select 1 from public.allowed_college_domains
    where domain = user_domain and is_active = true
  ) into domain_allowed;
  
  if not domain_allowed then
    raise exception 'Access Denied: Email domain % is not authorized. Registration is restricted to verified college domains (@vitapstudent.ac.in).', user_domain;
  end if;
  
  return new;
end;
$$;

drop trigger if exists check_college_email_domain on auth.users;
create trigger check_college_email_domain
  before insert on auth.users
  for each row
  execute function public.validate_college_email_domain();

-- Trigger 2: Auto-create student profile linkage row in public.students on auth user insert
create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
as $$
declare
  user_domain text;
begin
  user_domain := lower(split_part(new.email, '@', 2));
  
  insert into public.students (id, email, college_domain, onboarding_completed)
  values (new.id, new.email, user_domain, false)
  on conflict (id) do nothing;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student on auth.users;
create trigger on_auth_user_created_student
  after insert on auth.users
  for each row
  execute function public.handle_new_student();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
alter table public.ingredients enable row level security;
alter table public.dishes enable row level security;
alter table public.dish_ingredients enable row level security;
alter table public.monthly_menu enable row level security;
alter table public.food_court_shops enable row level security;
alter table public.food_court_items enable row level security;
alter table public.allowed_college_domains enable row level security;
alter table public.students enable row level security;
alter table public.user_profiles enable row level security;
alter table public.meal_logs enable row level security;

-- Public read policies for static campus menus, ingredients & allowed domains
create policy "Public ingredients read" on public.ingredients for select using (true);
create policy "Public dishes read" on public.dishes for select using (true);
create policy "Public monthly_menu read" on public.monthly_menu for select using (true);
create policy "Public food_court_shops read" on public.food_court_shops for select using (true);
create policy "Public food_court read" on public.food_court_items for select using (true);
create policy "Public allowed_domains read" on public.allowed_college_domains for select using (true);

-- Student RLS: Only the authenticated student can access their own profile
create policy "Students can view own student record" on public.students for select using (auth.uid() = id);
create policy "Students can insert own student record" on public.students for insert with check (auth.uid() = id);
create policy "Students can update own student record" on public.students for update using (auth.uid() = id);

-- Meal Logs RLS: Only the authenticated student can access their own logs
create policy "Students can view own logs" on public.meal_logs for select using (auth.uid() = user_id);
create policy "Students can insert own logs" on public.meal_logs for insert with check (auth.uid() = user_id);
create policy "Students can update own logs" on public.meal_logs for update using (auth.uid() = user_id);
create policy "Students can delete own logs" on public.meal_logs for delete using (auth.uid() = user_id);

-- Legacy user_profiles fallback policy
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = user_id or user_id is null);
create policy "Users can update own profile" on public.user_profiles for all using (auth.uid() = user_id or user_id is null);

-- =========================================================
-- 9. ADMIN USERS TABLE & STRICT ADMIN ACCESS CONTROL
-- =========================================================
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique,
  email text not null unique,
  role text default 'admin' check (role in ('admin', 'mess_committee', 'superadmin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_users enable row level security;

-- Admin can view their own admin user row
create policy "Admins can view admin_users" on public.admin_users
  for select using (auth.uid() = user_id);

-- Security definer helper to check admin role without exposing admin list
create or replace function public.is_admin(p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists(
    select 1 from public.admin_users
    where user_id = p_user_id
  );
end;
$$;

-- Admin write policies on dishes, monthly menu, and food court
create policy "Admins can insert dishes" on public.dishes for insert with check (public.is_admin(auth.uid()));
create policy "Admins can update dishes" on public.dishes for update using (public.is_admin(auth.uid()));
create policy "Admins can delete dishes" on public.dishes for delete using (public.is_admin(auth.uid()));

create policy "Admins can insert monthly_menu" on public.monthly_menu for insert with check (public.is_admin(auth.uid()));
create policy "Admins can update monthly_menu" on public.monthly_menu for update using (public.is_admin(auth.uid()));
create policy "Admins can delete monthly_menu" on public.monthly_menu for delete using (public.is_admin(auth.uid()));

create policy "Admins can insert food_court_items" on public.food_court_items for insert with check (public.is_admin(auth.uid()));
create policy "Admins can update food_court_items" on public.food_court_items for update using (public.is_admin(auth.uid()));
create policy "Admins can delete food_court_items" on public.food_court_items for delete using (public.is_admin(auth.uid()));

-- =========================================================
-- 10. PRIVACY-GUARDED AGGREGATE ANALYTICS FUNCTION
-- Critical constraint: Zero individual student diaries or PII exposed
-- =========================================================
create or replace function public.get_admin_aggregate_analytics()
returns json
language plpgsql
security definer
as $$
declare
  total_students integer;
  dau_count integer;
  wau_count integer;
  today_date text;
  result json;
begin
  -- Restrict execution to authorized admins
  if not public.is_admin(auth.uid()) then
    raise exception 'Access Denied: Only authorized administrators may view aggregate campus analytics.';
  end if;

  today_date := to_char(now(), 'YYYY-MM-DD');

  select count(*) into total_students from public.students;

  -- Daily Active Users (logged meals today)
  select count(distinct user_id) into dau_count 
  from public.meal_logs 
  where date_str = today_date;

  -- Weekly Active Users (logged meals in past 7 days)
  select count(distinct user_id) into wau_count 
  from public.meal_logs 
  where created_at >= (now() - interval '7 days');

  -- Build purely aggregated payload with ZERO student names, emails, or weights
  select json_build_object(
    'total_registered_students', total_students,
    'dau', dau_count,
    'wau', wau_count,
    'today_date', today_date,
    'privacy_guardrail_status', 'Enforced: Zero PII or individual student diary records returned'
  ) into result;

  return result;
end;
$$;
