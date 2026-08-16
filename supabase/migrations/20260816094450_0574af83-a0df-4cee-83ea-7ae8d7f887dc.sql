
drop policy "public services read" on public.services;
drop policy "public team read" on public.team_members;
drop policy "public posts read" on public.posts;

create policy "anon services read" on public.services for select to anon using (published);
create policy "auth services read" on public.services for select to authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "anon team read" on public.team_members for select to anon using (published);
create policy "auth team read" on public.team_members for select to authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "anon posts read" on public.posts for select to anon using (published);
create policy "auth posts read" on public.posts for select to authenticated using (published or public.has_role(auth.uid(),'admin'));

revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
