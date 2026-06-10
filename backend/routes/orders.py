from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import uuid

from config import db
from routes.auth import verify_token, verify_admin


router = APIRouter(prefix="/orders", tags=["orders"])

class OrderItem(BaseModel):
    product_id: str
    name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total: float

class OrderResponse(BaseModel):
    id: str
    user_id: str
    date: str
    items: List[OrderItem]
    total: float
    status: str

@router.post("/", response_model=OrderResponse)
def create_order(order_data: OrderCreate, user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        user_id = user_info.get("uid")
        order_id = f"ord-{uuid.uuid4().hex[:8]}"
        date_str = datetime.utcnow().isoformat() + "Z"
        
        items_dict = [item.dict() for item in order_data.items]
        
        new_order = {
            "id": order_id,
            "user_id": user_id,
            "date": date_str,
            "items": items_dict,
            "total": order_data.total,
            "status": "Procesando"
        }
        
        db.collection("orders").document(order_id).set(new_order)
        return new_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[OrderResponse])
def get_user_orders(user_info: Dict[str, Any] = Depends(verify_token)):
    try:
        user_id = user_info.get("uid")
        docs = db.collection("orders").where("user_id", "==", user_id).stream()
        
        orders = []
        for doc in docs:
            data = doc.to_dict()
            orders.append(data)
            
        # Ordenar por fecha descendente
        orders.sort(key=lambda x: x.get("date", ""), reverse=True)
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        docs = db.collection("orders").stream()
        orders = []
        for doc in docs:
            data = doc.to_dict()
            orders.append(data)
            
        # Ordenar por fecha descendente
        orders.sort(key=lambda x: x.get("date", ""), reverse=True)
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OrderStatusUpdate(BaseModel):
    status: str

@router.put("/{order_id}", response_model=OrderResponse)
def update_order_status(order_id: str, status_data: OrderStatusUpdate, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("orders").document(order_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        order_dict = doc.to_dict()
        order_dict["status"] = status_data.status
        doc_ref.set(order_dict, merge=True)
        return order_dict
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

