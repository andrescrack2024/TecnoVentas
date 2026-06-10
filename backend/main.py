import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes import products, auth, orders, support, contact, projects, audit

app = FastAPI(
    title="TecnoVentas y Servicios API",
    description="API de microservicios para el portal de TecnoVentas",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend (Vite por defecto usa el puerto 5173 o 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir a los dominios del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas de los microservicios
app.include_router(products.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(support.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(audit.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a la API de TecnoVentas y Servicios S.A.S.",
        "docs_url": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8005))
    host = "0.0.0.0" if "PORT" in os.environ else "127.0.0.1"
    reload = False if "PORT" in os.environ else True
    uvicorn.run("main:app", host=host, port=port, reload=reload)
