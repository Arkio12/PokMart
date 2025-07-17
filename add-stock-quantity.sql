-- Add stock_quantity column to pokemon table
ALTER TABLE pokemon ADD COLUMN stock_quantity INTEGER DEFAULT 0;

-- Update existing records to have some stock quantity
UPDATE pokemon SET stock_quantity = 
  CASE 
    WHEN "inStock" = true THEN 10
    ELSE 0
  END;
