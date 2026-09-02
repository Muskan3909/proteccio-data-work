-- Fix project priority trigger to use the table referenced by projects.priority_id
CREATE OR REPLACE FUNCTION set_project_default_priority_trigger_fn() RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.priority_id IS NULL
    THEN
        SELECT id
        FROM sys_project_priorities
        WHERE name = 'Medium'
        LIMIT 1
        INTO NEW.priority_id;
    END IF;

    RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_default_priority_trigger ON projects;
CREATE TRIGGER projects_default_priority_trigger
    BEFORE INSERT OR UPDATE OF priority_id
    ON projects
    FOR EACH ROW
EXECUTE FUNCTION set_project_default_priority_trigger_fn();
