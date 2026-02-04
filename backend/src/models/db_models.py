from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from ..storage.db import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")
    
    documents = relationship("DocumentModel", back_populates="project")
    answers = relationship("AnswerModel", back_populates="project")

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"))
    filename = Column(String)
    content = Column(Text, nullable=True)
    status = Column(String, default="pending")

    project = relationship("ProjectModel", back_populates="documents")

class AnswerModel(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"))
    question_id = Column(String)
    question_text = Column(String)
    value = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    citations = Column(JSON, default=list)
    normalization_output = Column(JSON, nullable=True)
    status = Column(String, default="pending")

    project = relationship("ProjectModel", back_populates="answers")
