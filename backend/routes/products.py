from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid

from config import db
from routes.auth import verify_admin

router = APIRouter(prefix="/products", tags=["products"])

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    price: float
    description: str
    image_url: str
    specs: Optional[dict] = {}
    tag: Optional[str] = None
    is_published: Optional[bool] = True

@router.get("/", response_model=List[Product])
def get_products(category: Optional[str] = Query(None, description="Filtrar por categoría (desktop, laptops, networks, cameras, accessories)")):
    try:
        products_ref = db.collection("products")
        if category:
            docs = products_ref.where("category", "==", category).stream()
        else:
            docs = products_ref.stream()
            
        products = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            products.append(data)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    try:
        doc = db.collection("products").document(product_id).get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        data = doc.to_dict()
        data["id"] = doc.id
        return data
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Product)
def create_product(product: Product, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        prod_id = product.id or f"prod-{uuid.uuid4().hex[:8]}"
        product_dict = product.dict()
        product_dict["id"] = prod_id
        db.collection("products").document(prod_id).set(product_dict)
        return product_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: str, product: Product, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("products").document(product_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        product_dict = product.dict()
        product_dict["id"] = product_id
        doc_ref.set(product_dict, merge=True)
        return product_dict
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}")
def delete_product(product_id: str, user_info: Dict[str, Any] = Depends(verify_admin)):
    try:
        doc_ref = db.collection("products").document(product_id)
        doc = doc_ref.get()
        if not doc.to_dict():
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        doc_ref.delete()
        return {"status": "success", "message": f"Producto {product_id} eliminado."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
