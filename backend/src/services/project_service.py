from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from ..models.schemas import ProjectCreateRequest, ProcessStatus
from ..models.db_models import ProjectModel, DocumentModel, AnswerModel
from ..storage.db import SessionLocal
from ..indexing.parser import DocumentParser
from ..services.llm_service import LLMService
import uuid
import os
import logging

logger = logging.getLogger(__name__)

# Base path for data - normally would be configured
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))

class ProjectService:
    @staticmethod
    def get_db():
        return SessionLocal()

    @staticmethod
    async def create_project(data: ProjectCreateRequest) -> ProjectModel:
        db = ProjectService.get_db()
        try:
            project = ProjectModel(
                name=data.name,
                description=data.description,
                status=ProcessStatus.PENDING
            )
            db.add(project)
            db.commit()
            db.refresh(project)

            # Add documents
            for f in data.filenames:
                doc = DocumentModel(project_id=project.id, filename=f, status=ProcessStatus.PENDING)
                db.add(doc)
            
            db.commit()
            db.refresh(project) # Load relationships
            return project
        finally:
            db.close()



    @staticmethod
    async def get_project(project_id: str) -> Optional[ProjectModel]:
        db = ProjectService.get_db()
        try:
            return db.query(ProjectModel).options(
                joinedload(ProjectModel.documents),
                joinedload(ProjectModel.answers)
            ).filter(ProjectModel.id == project_id).first()
        finally:
            db.close()

    @staticmethod
    async def list_available_files() -> List[str]:
        logger.info(f"Checking for files in: {DATA_DIR}")
        if not os.path.exists(DATA_DIR):
            logger.error(f"DATA_DIR does not exist: {DATA_DIR}")
            return []
        files = [f for f in os.listdir(DATA_DIR) if os.path.isfile(os.path.join(DATA_DIR, f)) and not f.startswith('.')]
        logger.info(f"Found files: {files}")
        return files

    @staticmethod
    async def list_projects() -> List[ProjectModel]:
        db = ProjectService.get_db()
        try:
            return db.query(ProjectModel).options(
                joinedload(ProjectModel.documents),
                joinedload(ProjectModel.answers)
            ).all()
        finally:
            db.close()

    @staticmethod
    async def delete_project(project_id: str) -> bool:
        db = ProjectService.get_db()
        try:
            project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
            if not project:
                return False
            
            # SQLAlchemy will cascade delete documents and answers due to relationship configuration
            db.delete(project)
            db.commit()
            return True
        finally:
            db.close()

    @staticmethod
    async def generate_answers(project_id: str, questions: List[str]) -> ProjectModel:
        db = ProjectService.get_db()
        llm = LLMService()
        try:
            project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
            if not project:
                return None
            
            # Clear old answers just in case? Or append? Appending for now but might duplicate if re-run.
            # Ideally we should check if question already exists.
            
            for doc in project.documents:
                # 1. Parse Document
                file_path = os.path.join(DATA_DIR, doc.filename)
                try:
                    text = DocumentParser.extract_text(file_path)
                    doc.status = "parsed"
                    db.commit()
                except Exception as e:
                    logger.error(f"Failed to parse {doc.filename}: {e}")
                    doc.status = "failed"
                    db.commit()
                    continue

                # 2. Extract with LLM
                results = llm.extract_answers(text, questions)

                # 3. Save Answers
                for res in results:
                    q_text = res.get("question")
                    val = res.get("value")
                    conf = res.get("confidence", 0.0)
                    cit = res.get("citation", "")

                    if not q_text: continue

                    ans = AnswerModel(
                        project_id=project.id,
                        question_id=str(uuid.uuid4()),
                        question_text=q_text,
                        value=str(val),
                        confidence=float(conf),
                        citations=[{"text": cit, "source": doc.filename}], # Store basic citation
                        status=ProcessStatus.COMPLETED
                    )
                    db.add(ans)
            
            project.status = ProcessStatus.COMPLETED
            db.commit()
            db.refresh(project)
            return project
        except Exception as e:
            logger.error(f"Generate answers failed: {e}")
            raise e
        finally:
            db.close()
