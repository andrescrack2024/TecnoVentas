from fastapi import APIRouter, Header, HTTPException, Depends
from typing import Dict, Any, Optional
from config import auth

router = APIRouter(prefix="/auth", tags=["auth"])

ADMIN_EMAILS = {"admin@tecnoventas.com", "admin@ecotur.com"}

def verify_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Falta cabecera de autorización")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Esquema de autorización inválido. Debe ser 'Bearer <token>'")
        
    token = parts[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido o expirado: {str(e)}")

@router.get("/verify", response_model=Dict[str, Any])
def verify_user(user_info: Dict[str, Any] = Depends(verify_token)):
    return {
        "status": "success",
        "uid": user_info.get("uid"),
        "name": user_info.get("name"),
        "email": user_info.get("email"),
        "picture": user_info.get("picture"),
        "provider": user_info.get("firebase", {}).get("sign_in_provider"),
        "role": "admin" if user_info.get("email") in ADMIN_EMAILS else "client"
    }

def verify_admin(user_info: Dict[str, Any] = Depends(verify_token)) -> Dict[str, Any]:
    email = user_info.get("email")
    if not email or email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="No autorizado. Acceso exclusivo para administradores.")
    return user_info

@router.get("/verify-admin", response_model=Dict[str, Any])
def verify_admin_user(user_info: Dict[str, Any] = Depends(verify_admin)):
    return {
        "status": "success",
        "uid": user_info.get("uid"),
        "name": user_info.get("name"),
        "email": user_info.get("email"),
        "role": "admin"
    }

