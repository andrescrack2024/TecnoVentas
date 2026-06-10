from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

from config import db
from routes.auth import verify_admin, verify_token

router = APIRouter(prefix="/audit", tags=["audit"])

class AuditLog(BaseModel):
    id: Optional[str] = None
    timestamp: str
    user: str
    action: str

@router.get("/all", response_model=List[AuditLog])
def get_all_audit_logs(user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        docs = db.collection("audit_logs").stream()
        logs = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            logs.append(data)
        
        # Ordenar por timestamp descendente
        logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=AuditLog)
def create_audit_log(log: AuditLog, user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        log_id = log.id or f"log-{int(datetime.utcnow().timestamp() * 1000)}"
        log_dict = log.dict()
        log_dict["id"] = log_id
        db.collection("audit_logs").document(log_id).set(log_dict)
        return log_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
