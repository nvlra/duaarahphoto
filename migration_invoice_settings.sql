-- Create invoice_settings table if it doesn't exist
create table if not exists invoice_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  brand_name text,
  brand_logo_url text,
  brand_color text default '#1e293b',
  bank_name text,
  bank_number text,
  bank_holder text,
  address text,
  footer_note text,
  created_at timestamptz default now(),
  constraint unique_user_settings unique (user_id)
);

-- Enable RLS
alter table invoice_settings enable row level security;

-- Policies
create policy "Users can view their own invoice settings"
  on invoice_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own invoice settings"
  on invoice_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own invoice settings"
  on invoice_settings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own invoice settings"
  on invoice_settings for delete
  using (auth.uid() = user_id);
