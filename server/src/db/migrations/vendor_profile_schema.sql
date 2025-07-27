-- This schema update adds vendor-specific profile fields to the suppliers table

-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_description TEXT,
  business_category VARCHAR(100) NOT NULL,
  business_phone VARCHAR(50) NOT NULL,
  business_address TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_id_unique UNIQUE (user_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_supplier_user_id ON suppliers(user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_supplier_timestamp ON suppliers;
CREATE TRIGGER update_supplier_timestamp
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
