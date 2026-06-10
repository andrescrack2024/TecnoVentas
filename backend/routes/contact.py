from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid

from config import db
from routes.auth import verify_token

router = APIRouter(prefix="/contact", tags=["contact"])

class ContactCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    company: Optional[str]
    email: str
    message: str
    status: str
    date: str

class DevRequestCreate(BaseModel):
    name: str
    email: EmailStr
    project_type: str  # Sitio Web, App Móvil, Sitio Web + App Móvil
    description: str
    budget_range: Optional[str] = None

class DevRequestResponse(BaseModel):
    id: str
    name: str
    email: str
    project_type: str
    description: str
    budget_range: Optional[str]
    status: str
    date: str

@router.post("/", response_model=ContactResponse)
def submit_contact(contact_data: ContactCreate):
    try:
        contact_id = f"con-{uuid.uuid4().hex[:6]}"
        date_str = datetime.utcnow().isoformat() + "Z"
        
        new_contact = {
            "id": contact_id,
            "name": contact_data.name,
            "company": contact_data.company,
            "email": contact_data.email,
            "message": contact_data.message,
            "status": "Pendiente",
            "date": date_str
        }
        
        db.collection("contacts").document(contact_id).set(new_contact)
        return new_contact
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dev-request", response_model=DevRequestResponse)
def submit_dev_request(dev_data: DevRequestCreate):
    try:
        dev_id = f"dev-{uuid.uuid4().hex[:6]}"
        date_str = datetime.utcnow().isoformat() + "Z"
        
        new_dev_request = {
            "id": dev_id,
            "name": dev_data.name,
            "email": dev_data.email,
            "project_type": dev_data.project_type,
            "description": dev_data.description,
            "budget_range": dev_data.budget_range,
            "status": "Pendiente",
            "date": date_str
        }
        
        db.collection("leads").document(dev_id).set(new_dev_request)
        return new_dev_request
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
