-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Creates profiles, forum threads/posts, friendships and reports, with row-level security.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  level int check (level between 0 and 1400),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index profiles_username_lower on public.profiles (lower(username));

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username) values (new.id, new.raw_user_meta_data->>'username');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('general','amc8','amc1012','aime','olympiad','help','site')),
  title text not null check (char_length(title) between 3 and 120),
  author_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_post_at timestamptz not null default now(),
  reply_count int not null default 0
);
create index threads_cat_last on public.threads (category, last_post_at desc);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index posts_thread on public.posts (thread_id, created_at);

-- Limit how fast one person can post (5 per minute). Counters are updated after the row exists.
create function public.posts_rate_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.posts where author_id = new.author_id and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Too many posts, slow down';
  end if;
  return new;
end $$;
create trigger posts_before_insert before insert on public.posts for each row execute function public.posts_rate_limit();

create function public.posts_update_thread() returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.threads
     set last_post_at = now(),
         reply_count = greatest((select count(*) from public.posts where thread_id = new.thread_id) - 1, 0)
   where id = new.thread_id;
  return new;
end $$;
create trigger posts_after_insert after insert on public.posts for each row execute function public.posts_update_thread();

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  check (requester_id <> addressee_id)
);
create unique index friendships_pair on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 300),
  created_at timestamptz not null default now()
);

-- Synced practice progress: one private row per person.
create table public.user_data (
  user_id uuid primary key default auth.uid() references public.profiles(id) on delete cascade,
  data jsonb not null check (pg_column_size(data) < 2000000),
  updated_at timestamptz not null default now()
);

-- ---------- row-level security ----------
alter table public.user_data enable row level security;
create policy "own progress read"   on public.user_data for select using (auth.uid() = user_id);
create policy "own progress insert" on public.user_data for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.user_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own progress delete" on public.user_data for delete using (auth.uid() = user_id);

alter table public.profiles enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.friendships enable row level security;
alter table public.reports enable row level security;

create function public.is_admin() returns boolean language sql stable security definer set search_path = public as
$$ select coalesce((select is_admin from public.profiles where id = auth.uid()), false) $$;

create policy "profiles are public"   on public.profiles for select using (true);
create policy "edit own profile"      on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from anon, authenticated;
grant update (level) on public.profiles to authenticated; -- people can change only their shown level

create policy "read threads"          on public.threads for select using (true);
create policy "create thread"         on public.threads for insert with check (auth.uid() = author_id);
create policy "delete thread"         on public.threads for delete using (auth.uid() = author_id or public.is_admin());

create policy "read posts"            on public.posts for select using (true);
create policy "create post"           on public.posts for insert with check (auth.uid() = author_id);
create policy "delete post"           on public.posts for delete using (auth.uid() = author_id or public.is_admin());

create policy "see my friendships"    on public.friendships for select using (auth.uid() in (requester_id, addressee_id));
create policy "send request"          on public.friendships for insert with check (auth.uid() = requester_id and status = 'pending');
create policy "accept request"        on public.friendships for update using (auth.uid() = addressee_id) with check (auth.uid() = addressee_id);
create policy "remove friendship"     on public.friendships for delete using (auth.uid() in (requester_id, addressee_id));

create policy "file a report"         on public.reports for insert with check (auth.uid() = reporter_id);
create policy "admins read reports"   on public.reports for select using (public.is_admin());

-- To make yourself a moderator, after you sign up on the site, run:
--   update public.profiles set is_admin = true where lower(username) = lower('YOUR_USERNAME');
