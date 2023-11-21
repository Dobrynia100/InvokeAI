from typing import Any, Optional
from pydantic import BaseModel, Field, TypeAdapter, field_serializer
import semver

from invokeai.app.services.shared.semver import SemVer
from invokeai.app.util.misc import uuid_string


__workflow_meta_version__ = semver.Version.parse("1.0.0")


class ExposedField(BaseModel):
    nodeId: str
    fieldName: str


class WorkflowMeta(BaseModel):
    version: SemVer = Field(description="The version of the workflow schema.")

    @field_serializer("version")
    def serialize_version(self, version: SemVer):
        return str(version)


class Workflow(BaseModel):
    id: str = Field(default_factory=uuid_string, description="The id of the workflow.")
    name: Optional[str] = Field(default="", description="The name of the workflow.")
    author: Optional[str] = Field(default="", description="The author of the workflow.")
    description: Optional[str] = Field(default="", description="The description of the workflow.")
    version: Optional[str] = Field(default="", description="The version of the workflow.")
    contact: Optional[str] = Field(default="", description="The contact of the workflow.")
    tags: Optional[str] = Field(default="", description="The tags of the workflow.")
    notes: Optional[str] = Field(default="", description="The notes of the workflow.")
    # TODO: nodes and edges are very loosely typed
    # Can be improved somewhat by using pydantic.JsonValue, but it has a bug: https://github.com/pydantic/pydantic/issues/8175
    nodes: list[dict[str, Any]] = Field(default=[], description="The nodes of the workflow.")
    edges: list[dict[str, Any]] = Field(default=[], description="The edges of the workflow.")
    exposedFields: list[ExposedField] = Field(default=[], description="The exposed fields of the workflow.")
    meta: WorkflowMeta = Field(..., description="The meta of the workflow.")


WorkflowValidator = TypeAdapter(Workflow)


class WorkflowNotFoundError(Exception):
    """Raised when a workflow is not found"""
