import datetime
from enum import Enum
from typing import Any, Optional, Union

import semver
from pydantic import BaseModel, Field, TypeAdapter, field_validator

from invokeai.app.util.misc import uuid_string

__workflow_meta_version__ = semver.Version.parse("1.0.0")


class WorkflowCategory(str, Enum):
    Image = "image"
    User = "user"
    System = "system"


class ExposedField(BaseModel):
    nodeId: str
    fieldName: str


class WorkflowMeta(BaseModel):
    version: str = Field(description="The version of the workflow schema.")

    @field_validator("version")
    def validate_version(cls, version: str):
        try:
            semver.Version.parse(version)
            return version
        except Exception:
            raise ValueError(f"Invalid workflow meta version: {version}")

    def to_semver(self) -> semver.Version:
        return semver.Version.parse(self.version)


class Workflow(BaseModel):
    id: str = Field(default_factory=uuid_string, description="The id of the workflow.")
    name: Optional[str] = Field(default="", description="The name of the workflow.")
    author: Optional[str] = Field(default="", description="The author of the workflow.")
    description: Optional[str] = Field(default="", description="The description of the workflow.")
    version: Optional[str] = Field(default="", description="The version of the workflow.")
    contact: Optional[str] = Field(default="", description="The contact of the workflow.")
    tags: Optional[str] = Field(default="", description="The tags of the workflow.")
    notes: Optional[str] = Field(default="", description="The notes of the workflow.")
    exposedFields: list[ExposedField] = Field(default=[], description="The exposed fields of the workflow.")
    meta: WorkflowMeta = Field(description="The meta of the workflow.")
    # TODO: nodes and edges are very loosely typed
    # Can be improved somewhat by using pydantic.JsonValue, but it has a bug: https://github.com/pydantic/pydantic/issues/8175
    nodes: list[dict[str, Any]] = Field(default=[], description="The nodes of the workflow.")
    edges: list[dict[str, Any]] = Field(default=[], description="The edges of the workflow.")


WorkflowValidator = TypeAdapter(Workflow)


class WorkflowRecordDTO(BaseModel):
    workflow_id: str = Field(description="The id of the workflow.")
    workflow: Workflow = Field(description="The workflow.")
    created_at: Union[datetime.datetime, str] = Field(description="The created timestamp of the workflow.")
    updated_at: Union[datetime.datetime, str] = Field(description="The updated timestamp of the workflow.")
    category: WorkflowCategory = Field(description="The category of the workflow.")

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "WorkflowRecordDTO":
        data["workflow"] = WorkflowValidator.validate_json(data.get("workflow", ""))
        return WorkflowRecordDTOValidator.validate_python(data)


WorkflowRecordDTOValidator = TypeAdapter(WorkflowRecordDTO)


class WorkflowNotFoundError(Exception):
    """Raised when a workflow is not found"""
