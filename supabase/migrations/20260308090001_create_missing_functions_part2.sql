-- ============================================================================
-- Part 2: Event validation function
-- One function per file to avoid pgx prepared statement parsing issues
-- ============================================================================

-- validate_event_scope() - trigger to validate hosted events
CREATE OR REPLACE FUNCTION public.validate_event_scope()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $validate_event_scope$
begin
    if new.event_scope = 'hosted' then
        if new.name is null then
            raise exception 'Hosted events must have a name';
        end if;
        if new.slug is null then
            raise exception 'Hosted events must have a slug';
        end if;
        if new.location_type in ('in_person', 'hybrid') and (new.capacity is null or new.capacity <= 0) then
            raise exception 'Hosted events with in_person or hybrid location must have capacity > 0';
        end if;
    end if;

    return new;
end;
$validate_event_scope$;
