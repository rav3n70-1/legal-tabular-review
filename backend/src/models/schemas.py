from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime
import uuid

class ProcessStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    content: Optional[str] = None
    status: str = "pending"  # Changed from Enum to string matching DB

    model_config = {"from_attributes": True}

class Citation(BaseModel):
    source_document_id: str
    text_snippet: str
    page_number: Optional[int] = None
    model_config = {"from_attributes": True}

class Answer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_id: str
    question_text: str
    value: Optional[str] = None
    confidence: float = 0.0
    citations: List[Dict] = [] # Changed to Dict to match JSON column flex
    normalization_output: Optional[Dict[str, Any]] = None
    status: str = "pending"

    model_config = {"from_attributes": True}

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    documents: List[Document] = []
    answers: List[Answer] = []
    status: str = "pending"

    model_config = {"from_attributes": True}

class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    filenames: List[str] # Simulating file upload by just passing names for now

class Answerrequest(BaseModel):
    question_text: str

class RequestStatus(BaseModel):
    request_id: str
    status: ProcessStatus
    result: Optional[Any] = None
    error: Optional[str] = None
