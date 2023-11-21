from abc import ABC, abstractmethod
from invokeai.app.services.shared.pagination import PaginatedResults

from invokeai.app.services.workflow_records.workflow_records_common import Workflow


class WorkflowRecordsStorageBase(ABC):
    """Base class for workflow storage services."""

    @abstractmethod
    def get(self, workflow_id: str) -> Workflow:
        """Get workflow by id."""
        pass

    @abstractmethod
    def create(self, workflow: Workflow) -> Workflow:
        """Creates a workflow."""
        pass

    @abstractmethod
    def update(self, workflow: Workflow) -> Workflow:
        """Updates a workflow."""
        pass

    @abstractmethod
    def delete(self, workflow_id: str) -> None:
        """Deletes a workflow."""
        pass

    @abstractmethod
    def get_many(self, page: int = 0, per_page: int = 10) -> PaginatedResults[Workflow]:
        """Gets many workflows."""
        pass
