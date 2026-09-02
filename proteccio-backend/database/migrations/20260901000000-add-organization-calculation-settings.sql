-- Migration: Add organization calculation settings
-- Purpose: Add missing columns to organizations table for calculation method settings

BEGIN;

-- Add calculation_method column (supports "hourly" or "man_days" calculation)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS calculation_method TEXT DEFAULT 'hourly' NOT NULL;

-- Add hours_per_day column for calculation settings
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS hours_per_day NUMERIC(5,2) DEFAULT 8.0 NOT NULL;

-- Add logo_url column for organization branding
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add constraint to validate calculation_method values
ALTER TABLE organizations
ADD CONSTRAINT IF NOT EXISTS calculation_method_check
CHECK (calculation_method IN ('hourly', 'man_days'));

-- Record migration
INSERT INTO schema_migrations (version) VALUES ('20260901000000-add-organization-calculation-settings');

COMMIT;
