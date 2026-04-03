-- After creating `public.orders` (or any new API table), PostgREST may still report
-- "Could not find the table ... in the schema cache" until its cache reloads.
-- Run this once in the SQL Editor (or include after migrations) to refresh immediately:

NOTIFY pgrst, 'reload schema';
