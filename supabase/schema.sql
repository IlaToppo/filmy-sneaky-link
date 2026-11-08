-- Filmy Sneaky Link: room storage + realtime
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- It is safe to run more than once.

-- One row per record: the room itself ("room:K3G1"), each player ("rp:K3G1:abc123")
-- and the shared co-op board ("rc:K3G1"). "room" holds the 4-character code so a phone
-- can subscribe to just its own room.
create table if not exists public.room_state (
  key        text primary key,
  room       text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  constraint room_state_key_format check (key ~ '^(room|rc|rp):[A-Z0-9]{4}'),
  constraint room_state_size check (octet_length(value::text) < 20000)
);

create index if not exists room_state_room_idx on public.room_state (room);

-- Row level security: the app uses the public "anon" key, so these policies are what
-- allow it to read and write. Room codes are not secret, which is fine for a party game.
alter table public.room_state enable row level security;

drop policy if exists "anyone can read rooms"        on public.room_state;
drop policy if exists "anyone can add room data"     on public.room_state;
drop policy if exists "anyone can update room data"  on public.room_state;
drop policy if exists "anyone can remove room data"  on public.room_state;

create policy "anyone can read rooms"        on public.room_state for select to anon using (true);
create policy "anyone can add room data"     on public.room_state for insert to anon with check (true);
create policy "anyone can update room data"  on public.room_state for update to anon using (true) with check (true);
create policy "anyone can remove room data"  on public.room_state for delete to anon using (true);

-- Realtime: broadcast changes to this table to every subscribed phone.
do $$
begin
  alter publication supabase_realtime add table public.room_state;
exception when duplicate_object then null;
end $$;

-- Lets delete events (a player leaving) carry the room code too.
alter table public.room_state replica identity full;

-- OPTIONAL housekeeping: delete rooms untouched for a day.
-- Turn on Database > Extensions > pg_cron first, then uncomment:
-- select cron.schedule(
--   'clean-room-state', '0 * * * *',
--   $$ delete from public.room_state where updated_at < now() - interval '1 day' $$
-- );
