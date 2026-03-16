-- 프로필 테이블
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  nickname text not null,
  avatar_url text,
  couple_id uuid,
  created_at timestamptz default now()
);

-- 커플 테이블
create table couples (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references profiles(id) not null,
  user2_id uuid references profiles(id),
  started_at date not null,
  invite_code text unique not null,
  created_at timestamptz default now()
);

-- profiles에 couple_id FK 추가
alter table profiles
  add constraint profiles_couple_id_fkey
  foreign key (couple_id) references couples(id);

-- 추억 테이블
create table memories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) not null,
  author_id uuid references profiles(id) not null,
  content text default '',
  image_url text,
  created_at timestamptz default now()
);

-- 메시지 테이블
create table messages (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- RLS 활성화
alter table profiles enable row level security;
alter table couples enable row level security;
alter table memories enable row level security;
alter table messages enable row level security;

-- RLS 정책: 본인 프로필 읽기/수정
create policy "profiles: 본인 접근" on profiles
  for all using (auth.uid() = id);

-- RLS 정책: 커플 멤버만 접근
create policy "couples: 멤버 접근" on couples
  for all using (
    auth.uid() = user1_id or auth.uid() = user2_id
  );

-- 초대 코드로 커플 조회 허용 (연결 전)
create policy "couples: 초대코드 조회" on couples
  for select using (true);

-- RLS 정책: 같은 커플만 추억 접근
create policy "memories: 커플 접근" on memories
  for all using (
    couple_id in (
      select id from couples
      where user1_id = auth.uid() or user2_id = auth.uid()
    )
  );

-- RLS 정책: 같은 커플만 메시지 접근
create policy "messages: 커플 접근" on messages
  for all using (
    couple_id in (
      select id from couples
      where user1_id = auth.uid() or user2_id = auth.uid()
    )
  );

-- Storage 버킷 생성 (Supabase 대시보드에서도 가능)
insert into storage.buckets (id, name, public)
  values ('memories', 'memories', true);

create policy "memories storage: 커플 접근" on storage.objects
  for all using (bucket_id = 'memories' and auth.role() = 'authenticated');
