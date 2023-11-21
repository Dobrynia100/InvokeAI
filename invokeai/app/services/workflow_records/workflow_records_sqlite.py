import sqlite3
import threading
from typing import Optional

from invokeai.app.services.invoker import Invoker
from invokeai.app.services.shared.pagination import PaginatedResults
from invokeai.app.services.shared.sqlite import SqliteDatabase
from invokeai.app.services.workflow_records.workflow_records_base import WorkflowRecordsStorageBase
from invokeai.app.services.workflow_records.workflow_records_common import (
    Workflow,
    WorkflowCategory,
    WorkflowNotFoundError,
    WorkflowRecordDTO,
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

    def get(self, workflow_id: str) -> WorkflowRecordDTO:
        try:
            self._lock.acquire()
            self._cursor.execute(
                """--sql
                SELECT workflow_id, workflow, created_at, updated_at, category
                FROM workflows
                WHERE workflow_id = ?;
                """,
                (workflow_id,),
            )
            row = self._cursor.fetchone()
            if row is None:
                raise WorkflowNotFoundError(f"Workflow with id {workflow_id} not found")
            return WorkflowRecordDTO.from_dict(dict(row))
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()

    def create(self, workflow: Workflow) -> WorkflowRecordDTO:
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

    def update(self, workflow: Workflow) -> WorkflowRecordDTO:
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

    def get_many(
        self, page: int, per_page: int, category: Optional[WorkflowCategory] = None
    ) -> PaginatedResults[WorkflowRecordDTO]:
        try:
            self._lock.acquire()

            main_query = """--sql
                SELECT workflow_id, workflow, category, created_at, updated_at
                FROM workflows
            """
            count_query = """--sql
                SELECT COUNT(*)
                FROM workflows
            """

            main_query_params: tuple[int | str, ...] = (per_page, per_page * page)
            count_query_params: tuple[str, ...] = ()

            if category is not None:
                main_query += " WHERE category = ?"
                count_query += " WHERE category = ?"
                main_query_params = (category.value, *main_query_params)
                count_query_params = (category.value,)

            main_query += """--sql
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?;
            """
            count_query += ";"

            self._cursor.execute(main_query, main_query_params)
            rows = self._cursor.fetchall()
            workflows = [WorkflowRecordDTO.from_dict(dict(row)) for row in rows]
            self._cursor.execute(count_query, count_query_params)
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

            # add workflows category column, if it doesn't already exist
            self._cursor.execute("PRAGMA table_info(workflows);")
            columns = [column[1] for column in self._cursor.fetchall()]
            if "category" not in columns:
                self._cursor.execute(
                    """
                    ALTER TABLE workflows
                    ADD COLUMN category TEXT NOT NULL DEFAULT('image');
                    """
                )

            self._conn.commit()
        except Exception:
            self._conn.rollback()
            raise
        finally:
            self._lock.release()
