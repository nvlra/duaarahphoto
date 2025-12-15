-- Helper function to add enum value safely
create or replace function add_enum_value_if_not_exists(
  enum_name text,
  new_value text
) returns void as $$
declare
  exists_ boolean;
begin
  execute format('select exists (select 1 from pg_enum where enumtypid = %L::regtype and enumlabel = %L)', enum_name, new_value)
  into exists_;

  if not exists_ then
    execute format('alter type %I add value %L', enum_name, new_value);
  end if;
end;
$$ language plpgsql;

-- Execute the helper to add 'on_process'
select add_enum_value_if_not_exists('order_status', 'on_process');

-- Optional: Clean fill description for new status if needed
comment on type order_status is 'Status workflow: pending -> confirmed -> on_process -> completed (or cancelled)';
