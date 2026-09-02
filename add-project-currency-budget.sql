-- Migration: Add currency and budget columns to projects table
-- Purpose: Add missing columns for project finance tracking

BEGIN;

-- Add currency column (ISO 4217 currency code, e.g., 'USD', 'LKR')
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add budget column for project budget tracking
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS budget NUMERIC(15,2);

COMMIT;
