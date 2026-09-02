REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE ROLE Proteccio_client;

GRANT CONNECT ON DATABASE Proteccio_db TO Proteccio_client;
GRANT INSERT, SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO Proteccio_client;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO Proteccio_client;

REVOKE ALL PRIVILEGES ON task_priorities FROM Proteccio_client;
GRANT SELECT ON task_priorities TO Proteccio_client;

REVOKE ALL PRIVILEGES ON project_access_levels FROM Proteccio_client;
GRANT SELECT ON project_access_levels TO Proteccio_client;

REVOKE ALL PRIVILEGES ON timezones FROM Proteccio_client;
GRANT SELECT ON timezones TO Proteccio_client;

REVOKE ALL PRIVILEGES ON Proteccio_alerts FROM Proteccio_client;
GRANT SELECT ON Proteccio_alerts TO Proteccio_client;

REVOKE ALL PRIVILEGES ON sys_task_status_categories FROM Proteccio_client;
GRANT SELECT ON sys_task_status_categories TO Proteccio_client;

REVOKE ALL PRIVILEGES ON sys_project_statuses FROM Proteccio_client;
GRANT SELECT ON sys_project_statuses TO Proteccio_client;

REVOKE ALL PRIVILEGES ON sys_project_healths FROM Proteccio_client;
GRANT SELECT ON sys_project_healths TO Proteccio_client;

CREATE USER Proteccio_backend WITH PASSWORD 'n?&bb24=aWmnw+G@';
GRANT Proteccio_client TO Proteccio_backend;
