-- Add sale-related fields to electronic_broker_transactions table
ALTER TABLE electronic_broker_transactions
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
