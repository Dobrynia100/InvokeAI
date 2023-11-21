import sqlite3
import threading

from invokeai.app.services.invoker import Invoker
from invokeai.app.services.shared.pagination import PaginatedResults
from invokeai.app.services.shared.sqlite import SqliteDatabase
from invokeai.app.services.workflow_records.workflow_records_base import WorkflowRecordsStorageBase
from invokeai.app.services.workflow_records.workflow_records_common import (
    Workflow,
    WorkflowNotFoundError,
    WorkflowValidator,
)


class SqliteWorkflowRecordsStorage(WorkflowRecordsStorageBase):
    _invoker: Invoker
    _conn: sqlite3.Connection
    _cursor: sqlite3.Cursor
    _lock: threading.RLock

    def __init__(self, db: SqliteDatabase) -> None:
        super().__init__()
        self._lock = db.lock
        self._conn = db.conn
        self._cursor = self._conn.cursor()
        self._create_tables()

    def start(self, invoker: Invoker) -> None:
        self._invoker = invoker

    def get(self, workflow_id: str) -> Workflow:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                SELECT workflow
                FROM workflows
                WHERE workflow_id = ?;
                """,
                (workflow_id,),
            )
            row = self._cursor.fetchone()
            if row is None:
                raise WorkflowNotFoundError(f"Workflow with id {workflow_id} not found")
            return WorkflowValidator.validate_json(row[0])
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()

    def create(self, workflow: Workflow) -> Workflow:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                INSERT OR IGNORE INTO workflows(workflow)
                VALUES (?);
                """,
                (workflow.model_dump_json(),),
            )
            self._conn.commit()
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()
        return self.get(workflow.id)

    def update(self, workflow: Workflow) -> Workflow:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                UPDATE workflows
                SET workflow = ?
                WHERE workflow_id = ?;
                """,
                (workflow.model_dump_json(), workflow.id),
            )
            self._conn.commit()
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()
        return self.get(workflow.id)

    def delete(self, workflow_id: str) -> None:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                DELETE from workflows
                WHERE workflow_id = ?;
                """,
                tuple(workflow_id),
            )
            self._conn.commit()
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()
        return None

    def get_many(self, page: int = 0, per_page: int = 10) -> PaginatedResults[Workflow]:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                SELECT workflow
                FROM workflows
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?;
                """,
                (per_page, per_page * page),
            )
            rows = self._cursor.fetchall()
            workflows = [WorkflowValidator.validate_json(row[0]) for row in rows]
            self._cursor.execute(
                """--sql
                SELECT COUNT(*)
                FROM workflows;
                """
            )
            row = self._cursor.fetchone()
            total = row[0]
            pages = int(total / per_page) + 1
            return PaginatedResults(
                items=workflows,
                page=page,
                per_page=per_page,
                pages=pages,
                total=total,
            )
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()

    def _create_tables(self) -> None:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                CREATE TABLE IF NOT EXISTS workflows (
                    workflow TEXT NOT NULL,
                    workflow_id TEXT GENERATED ALWAYS AS (json_extract(workflow, '$.id')) VIRTUAL NOT NULL UNIQUE, -- gets implicit index
                    created_at DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                    updated_at DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')) -- updated via trigger
                );
                """
            )

            self._cursor.execute(
                """--sql
                CREATE TRIGGER IF NOT EXISTS tg_workflows_updated_at
                AFTER UPDATE
                ON workflows FOR EACH ROW
                BEGIN
                    UPDATE workflows
                    SET updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')
                    WHERE workflow_id = old.workflow_id;
                END;
                """
            )

            self._conn.commit()
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()
