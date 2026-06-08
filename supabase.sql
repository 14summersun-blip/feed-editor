-- UMKM Circle Album
create table albums (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text,
  cover_image text,
  created_at timestamp with time zone default now()
);

create table cards (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references albums(id) on delete cascade,
  slug text unique not null,
  title text,
  description text,
  images jsonb default '[]',
  video_url text,
  card_color text default '#ffffff',
  border_radius int default 24,
  title_font text default 'Poppins',
  title_size int default 28,
  title_color text default '#111111',
  desc_font text default 'Inter',
  desc_size int default 14,
  desc_color text default '#444444',
  cta_text text,
  cta_url text,
  cta_bg text default '#ff6b35',
  cta_color text default '#ffffff',
  cta_radius int default 12,
  likes int default 0,
  created_at timestamp with time zone default now()
);

create table comments (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references cards(id) on delete cascade,
  parent_id uuid references comments(id),
  name text,
  content text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table albums enable row level security;
alter table cards enable row level security;
alter table comments enable row level security;

create policy "public read albums" on albums for select using (true);
create policy "public read cards" on cards for select using (true);
create policy "public read comments" on comments for select using (true);
create policy "public insert comments" on comments for insert with check (true);
create policy "public update likes" on cards for update using (true);
