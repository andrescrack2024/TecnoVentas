from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import uuid

from config import db
from routes.auth import verify_token, verify_admin

router = APIRouter(prefix="/projects", tags=["projects"])

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    clientEmail: str
    clientName: str
    description: str
    requirements: Optional[str] = ""
    progress: int = 0
    status: str = "En Progreso"  # En Progreso, Completado, Pausado
    startDate: Optional[str] = None
    duration: Optional[str] = None

@router.get("/", response_model=List[Project])
def get_client_projects(user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        email = user_info.get("email")
        docs = db.collection("projects").where("clientEmail", "==", email).stream()
        
        projects = []
        for doc in docs:
            data = doc.to_dict()
            projects.append(data)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all", response_model=List[Project])
def get_all_projects(user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        docs = db.collection("projects").stream()
        projects = []
        for doc in docs:
            data = doc.to_dict()
            projects.append(data)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Project)
def create_project(project: Project, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        proj_id = project.id or f"PRJ-{uuid.uuid4().hex[:4].upper()}"
        project_dict = project.dict()
        project_dict["id"] = proj_id
        db.collection("projects").document(proj_id).set(project_dict)
        return project_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, project: Project, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        project_dict = project.dict()
        project_dict["id"] = project_id
        doc_ref.set(project_dict, merge=True)
        return project_dict
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}")
def delete_project(project_id: str, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        doc_ref.delete()
        return {"status": "success", "message": f"Proyecto {project_id} eliminado."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
