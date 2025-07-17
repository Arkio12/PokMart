-- Check if tables exist and their structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('pokemon', 'pokemon_types', 'users', 'cart_items')
ORDER BY table_name, ordinal_position;
