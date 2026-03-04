-- Remove landlord_id from rental tables
-- Ownership is determined through store_access relationship

-- Drop landlord_id from hostels table
ALTER TABLE hostels DROP COLUMN IF EXISTS landlord_id;

-- Drop landlord_id from appartments table
ALTER TABLE appartments DROP COLUMN IF EXISTS landlord_id;

-- Drop landlord_id from rental_houses table (if exists)
ALTER TABLE rental_houses DROP COLUMN IF EXISTS landlord_id;
