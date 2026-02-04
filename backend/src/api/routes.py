from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from typing import List, Dict
from ..models.schemas import Project, ProjectCreateRequest, Answer, Document
from ..services.project_service import ProjectService
from ..models.db_models import ProjectModel

router = APIRouter()

@router.post("/create-project-async")
async def create_project(request: ProjectCreateRequest):
    return await ProjectService.create_project(request)

@router.get("/get-project-info/{project_id}")
async def get_project_info(project_id: str):
    project = await ProjectService.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/list-projects")
async def list_projects():
    return await ProjectService.list_projects()

@router.get("/list-available-files")
async def list_available_files():
    """List files in the data directory available for ingestion."""
    return await ProjectService.list_available_files()

@router.delete("/delete-project/{project_id}")
async def delete_project(project_id: str):
    """Delete a project and all associated data."""
    success = await ProjectService.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted", "project_id": project_id}

@router.post("/generate-all-answers/{project_id}")
async def generate_all_answers(project_id: str, questions: List[str] = Body(...)):
    project = await ProjectService.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await ProjectService.generate_answers(project_id, questions)
    return {"status": "processing_started", "project_id": project_id}

@router.post("/define-fields/{project_id}")
async def define_fields(project_id: str, fields: List[Dict[str, str]] = Body(...)):
    """
    Define fields to extract for a project.
    Expects [{'name': 'Effective Date', 'description': 'The start date...'}]
    For now, this just maps to 'questions' for generating answers later, 
    or could trigger generation immediately if we wanted.
    """
    # This is a placeholder for saving templates. 
    # For MVP, we pass questions directly to generate_answers, 
    # but logically we should save these definitions.
    return {"status": "fields_defined", "count": len(fields)}
