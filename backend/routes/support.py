from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from config import db
from routes.auth import verify_token, verify_admin, ADMIN_EMAILS

router = APIRouter(prefix="/support", tags=["support"])

class TicketCreate(BaseModel):
    subject: str
    description: str
    priority: str = "Media"  # Baja, Media, Alta

class TicketResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    description: str
    created_at: str
    status: str  # Abierto, En Progreso, Resuelto, Cerrado
    priority: str
    replies: Optional[List[Dict[str, Any]]] = []

class TicketReplyCreate(BaseModel):
    text: str

class TicketStatusUpdate(BaseModel):
    status: str

@router.post("/tickets", response_model=TicketResponse)
def create_ticket(ticket_data: TicketCreate, user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        user_id = user_info.get("uid")
        ticket_id = f"tick-{uuid.uuid4().hex[:6]}"
        date_str = datetime.utcnow().isoformat() + "Z"
        
        new_ticket = {
            "id": ticket_id,
            "user_id": user_id,
            "subject": ticket_data.subject,
            "description": ticket_data.description,
            "created_at": date_str,
            "status": "Abierto",
            "priority": ticket_data.priority,
            "replies": []
        }
        
        db.collection("tickets").document(ticket_id).set(new_ticket)
        return new_ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tickets", response_model=List[TicketResponse])
def get_user_tickets(user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        user_id = user_info.get("uid")
        docs = db.collection("tickets").where("user_id", "==", user_id).stream()
        
        tickets = []
        for doc in docs:
            data = doc.to_dict()
            if "replies" not in data:
                data["replies"] = []
            tickets.append(data)
            
        tickets.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tickets/all", response_model=List[TicketResponse])
def get_all_tickets(user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        docs = db.collection("tickets").stream()
        
        tickets = []
        for doc in docs:
            data = doc.to_dict()
            if "replies" not in data:
                data["replies"] = []
            tickets.append(data)
            
        tickets.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tickets/{ticket_id}/replies", response_model=TicketResponse)
def reply_ticket(ticket_id: str, reply_data: TicketReplyCreate, user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        doc_ref = db.collection("tickets").document(ticket_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Ticket no encontrado")
        
        ticket_dict = doc.to_dict()
        replies = ticket_dict.get("replies", [])
        
        email = user_info.get("email")
        sender = "Administrador" if email in ADMIN_EMAILS else (user_info.get("name") or "Cliente")
        
        new_reply = {
            "id": int(datetime.utcnow().timestamp() * 1000),
            "sender": sender,
            "text": reply_data.text,
            "date": datetime.utcnow().isoformat().split('T')[0]
        }
        
        replies.append(new_reply)
        ticket_dict["replies"] = replies
        
        # Si responde el admin, cambiamos estado a 'En Progreso' si estaba 'Abierto'
        if email in ADMIN_EMAILS and ticket_dict.get("status") == "Abierto":
            ticket_dict["status"] = "En Progreso"
            
        doc_ref.set(ticket_dict, merge=True)
        return ticket_dict
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/tickets/{ticket_id}/status", response_model=TicketResponse)
def update_ticket_status(ticket_id: str, status_data: TicketStatusUpdate, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("tickets").document(ticket_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Ticket no encontrado")
        
        ticket_dict = doc.to_dict()
        ticket_dict["status"] = status_data.status
        doc_ref.set(ticket_dict, merge=True)
        return ticket_dict
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
