-- Make address column nullable in tenants table
ALTER TABLE tenants MODIFY COLUMN address VARCHAR(255) NULL;
