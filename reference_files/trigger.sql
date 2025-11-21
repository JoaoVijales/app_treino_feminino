create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, name)
  values (new.id, '');
  return new;
end;
$$ language plpgsql security definer;


create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();
