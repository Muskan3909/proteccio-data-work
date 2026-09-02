'use strict';

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
exports.shorthands = undefined;

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = async (pgm) => {
  pgm.sql(`
    ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2) NOT NULL DEFAULT 0;

    ALTER TABLE organizations
      ADD COLUMN IF NOT EXISTS calculation_method VARCHAR(20) NOT NULL DEFAULT 'hourly',
      ADD COLUMN IF NOT EXISTS hours_per_day DOUBLE PRECISION NOT NULL DEFAULT 8;

    ALTER TABLE task_comments
      ADD COLUMN IF NOT EXISTS is_edited BOOLEAN NOT NULL DEFAULT FALSE;
  `);
};

/** @param {import('node-pg-migrate').MigrationBuilder} _pgm */
exports.down = async (_pgm) => {
  // Keep these compatibility columns in place during rollback.
};
