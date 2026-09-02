BEGIN;

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS calculation_method TEXT DEFAULT 'hourly' NOT NULL;

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS hours_per_day NUMERIC(5,2) DEFAULT 8.0 NOT NULL;

-- Add constraint to validate calculation_method values
DO $$ BEGIN
    ALTER TABLE organizations
    ADD CONSTRAINT calculation_method_check
    CHECK (calculation_method IN ('hourly', 'man_days'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
