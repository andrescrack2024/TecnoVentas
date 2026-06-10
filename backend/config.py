import os
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend.config")

# Intentar inicializar Firebase Admin SDK real
firebase_initialized = False
db = None
auth = None

# Base de datos simulada en memoria en caso de no configurar Firebase real
class MockDoc:
    def __init__(self, doc_id: str, data: Dict[str, Any]):
        self.id = doc_id
        self._data = data

    def to_dict(self) -> Dict[str, Any]:
        return self._data

class MockQuery:
    def __init__(self, collection_name: str, documents: List[Dict[str, Any]]):
        self.collection_name = collection_name
        self.documents = documents
        self._filters = []

    def where(self, field: str, operator: str, value: Any):
        # Implementar filtro básico para simulación
        filtered_docs = []
        for doc in self.documents:
            val = doc.get(field)
            if operator == "==" and val == value:
                filtered_docs.append(doc)
            elif operator == "!=" and val != value:
                filtered_docs.append(doc)
            elif operator == "in" and isinstance(value, list) and val in value:
                filtered_docs.append(doc)
        self.documents = filtered_docs
        return self

    def order_by(self, field: str, direction: str = "ASCENDING"):
        # Ignorado en simulación simple
        return self

    def limit(self, count: int):
        self.documents = self.documents[:count]
        return self

    def stream(self):
        return [MockDoc(doc.get("id", "mock_id"), doc) for doc in self.documents]

    def get(self):
        return self.stream()

class MockCollection:
    def __init__(self, name: str, mock_db: "MockFirestore"):
        self.name = name
        self.mock_db = mock_db

    def document(self, doc_id: str = None):
        return MockDocumentReference(self.name, doc_id, self.mock_db)

    def add(self, data: Dict[str, Any]):
        import uuid
        doc_id = str(uuid.uuid4())
        data["id"] = doc_id
        if self.name not in self.mock_db.store:
            self.mock_db.store[self.name] = []
        self.mock_db.store[self.name].append(data)
        logger.info(f"[MockDB] Agregado documento en colección '{self.name}': {data}")
        return None, MockDocumentReference(self.name, doc_id, self.mock_db)

    def where(self, field: str, operator: str, value: Any):
        docs = self.mock_db.store.get(self.name, [])
        query = MockQuery(self.name, docs)
        return query.where(field, operator, value)

    def stream(self):
        docs = self.mock_db.store.get(self.name, [])
        return [MockDoc(doc.get("id", "mock_id"), doc) for doc in docs]

    def get(self):
        return self.stream()

class MockDocumentReference:
    def __init__(self, collection_name: str, doc_id: str, mock_db: "MockFirestore"):
        self.collection_name = collection_name
        self.id = doc_id
        self.mock_db = mock_db

    def get(self) -> MockDoc:
        docs = self.mock_db.store.get(self.collection_name, [])
        for doc in docs:
            if doc.get("id") == self.id:
                return MockDoc(self.id, doc)
        return MockDoc(self.id, {})

    def set(self, data: Dict[str, Any], merge: bool = False):
        if self.collection_name not in self.mock_db.store:
            self.mock_db.store[self.collection_name] = []
        
        # Buscar si ya existe
        found = False
        for i, doc in enumerate(self.mock_db.store[self.collection_name]):
            if doc.get("id") == self.id:
                if merge:
                    self.mock_db.store[self.collection_name][i].update(data)
                else:
                    data["id"] = self.id
                    self.mock_db.store[self.collection_name][i] = data
                found = True
                break
        
        if not found:
            data["id"] = self.id
            self.mock_db.store[self.collection_name].append(data)
        logger.info(f"[MockDB] Documento '{self.id}' guardado en '{self.collection_name}'")

    def update(self, data: Dict[str, Any]):
        docs = self.mock_db.store.get(self.collection_name, [])
        for doc in docs:
            if doc.get("id") == self.id:
                doc.update(data)
                logger.info(f"[MockDB] Documento '{self.id}' actualizado en '{self.collection_name}' con: {data}")
                return
        logger.warning(f"[MockDB] Intento de actualizar documento inexistente '{self.id}' en '{self.collection_name}'")

    def delete(self):
        docs = self.mock_db.store.get(self.collection_name, [])
        self.mock_db.store[self.collection_name] = [doc for doc in docs if doc.get("id") != self.id]
        logger.info(f"[MockDB] Documento '{self.id}' eliminado de '{self.collection_name}'")


class MockFirestore:
    def __init__(self):
        self.store: Dict[str, List[Dict[str, Any]]] = {}
        self._init_seed_data()

    def collection(self, name: str) -> MockCollection:
        return MockCollection(name, self)

    def _init_seed_data(self):
        # Productos del catálogo destacado y otros
        self.store["products"] = [
            # Category: desktop
            {
                "id": "pc-gamer-1",
                "name": "PC Gamer Pro - AMD Ryzen 5, RTX 4066",
                "category": "desktop",
                "price": 1999.00,
                "description": "Computador de escritorio optimizado para Gaming y productividad. AMD Ryzen 5, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4066 8GB.",
                "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80",
                "specs": {"cpu": "AMD Ryzen 5", "gpu": "RTX 4066 8GB", "ram": "16GB DDR5", "storage": "1TB SSD"},
                "tag": "DESKTOP"
            },
            {
                "id": "pc-workstation-2",
                "name": "Workstation",
                "category": "desktop",
                "price": 899.00,
                "description": "Estación de trabajo profesional optimizada para modelado 3D y edición de video. Intel Core i9, 32GB RAM DDR5, NVIDIA RTX Quadro, 2TB SSD NVMe.",
                "image_url": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&q=80",
                "specs": {"cpu": "Intel Core i9", "gpu": "RTX Quadro", "ram": "32GB DDR5", "storage": "2TB SSD"},
                "tag": "DESKTOP"
            },
            {
                "id": "pc-allinone-3",
                "name": "Workstation",
                "category": "laptops",
                "price": 1999.00,
                "description": "Todo en uno ultradelgado para hogar y oficina. Intel Core i5, 16GB RAM, 512GB SSD, Pantalla IPS 23.8' FHD sin bordes.",
                "image_url": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80",
                "specs": {"cpu": "Intel Core i5", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "23.8' FHD"},
                "tag": "DESKTOP"
            },
            # Category: laptops
            {
                "id": "laptop-asus-1",
                "name": "Laptop ASUS STRlx G16",
                "category": "laptops",
                "price": 1999.00,
                "description": "Portátil de alta gama para juegos y desarrollo de software. Intel Core i7 13a Gen, 16GB DDR5 RAM, 512GB SSD PCIe 4.0, NVIDIA RTX 4050.",
                "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
                "specs": {"cpu": "Intel Core i7", "gpu": "RTX 4050 6GB", "ram": "16GB DDR5", "storage": "512GB SSD"},
                "tag": "LAPTOP"
            },
            {
                "id": "laptop-hp-2",
                "name": "Laptop HP Envy - Intel Evo, Touchscreen",
                "category": "laptops",
                "price": 1199.90,
                "description": "Portátil premium convertible con pantalla táctil. Intel Core i7 con certificación Intel Evo, 16GB RAM, 1TB SSD, pantalla táctil OLED.",
                "image_url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80",
                "specs": {"cpu": "Intel i7 Evo", "ram": "16GB LPDDR5", "storage": "1TB SSD", "screen": "Tactil OLED"},
                "tag": "ULTRABOOK"
            },
            {
                "id": "laptop-chrome-3",
                "name": "Laptop Chromebook - 11 inch",
                "category": "laptops",
                "price": 299.90,
                "description": "Chromebook ligera y rápida de 11 pulgadas ideal para estudiantes, clases virtuales y navegación diaria.",
                "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
                "specs": {"cpu": "Intel Celeron", "ram": "4GB LPDDR4", "storage": "64GB eMMC", "display": "11.6' HD"},
                "tag": "CHROMEBOOK"
            },
            # Category: networks
            {
                "id": "net-router-1",
                "name": "Router TP-Link Archer AXXS5 Wi-Fi",
                "category": "networks",
                "price": 89.90,
                "description": "Router inteligente Gigabit Wi-Fi 6 de doble banda AX3000 con cobertura mejorada y gran alcance.",
                "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
                "specs": {"type": "Wi-Fi 6", "speed": "AX3000"},
                "tag": "NETWORKS"
            },
            {
                "id": "net-ap-2",
                "name": "Access Point Mesh - UniFi AC",
                "category": "networks",
                "price": 149.90,
                "description": "Punto de acceso inalámbrico empresarial de doble banda con tecnología Mesh de largo alcance.",
                "image_url": "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=500&q=80",
                "specs": {"frequency": "2.4GHz & 5GHz", "speed": "1167 Mbps"},
                "tag": "NETWORKS"
            },
            {
                "id": "net-switch-3",
                "name": "Network Switch - 16 port Gigabit",
                "category": "networks",
                "price": 69.90,
                "description": "Switch de red con 16 puertos RJ45 Gigabit para oficina y hogar. Carcasa metálica y diseño silencioso.",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80",
                "specs": {"ports": "16x Gigabit RJ45", "type": "Unmanaged"},
                "tag": "SWITCH"
            },
            # Category: cameras
            {
                "id": "cam-imou-1",
                "name": "Cámara de Seguridad IMOU Cruiser 2MP",
                "category": "cameras",
                "price": 59.90,
                "description": "Cámara de seguridad exterior Wi-Fi con rotación 360° panorámica, visión nocturna a color y detección humana IA.",
                "image_url": "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80",
                "specs": {"resolution": "1080p (2MP)", "night_vision": "Color", "rating": "IP66"},
                "tag": "DESKTOP"
            },
            {
                "id": "cam-nvr-2",
                "name": "NVR System",
                "category": "cameras",
                "price": 249.90,
                "description": "Grabador de video en red de 8 canales PoE de alta definición para CCTV corporativo.",
                "image_url": "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=500&q=80",
                "specs": {"channels": "8 PoE", "resolution": "Hasta 4K"},
                "tag": "VIGILANCA"
            },
            {
                "id": "cam-doorbell-3",
                "name": "Smart Video Doorbell - Wi-Fi",
                "category": "cameras",
                "price": 99.90,
                "description": "Timbre inteligente Wi-Fi con videocámara HD integrada, audio bidireccional y notificaciones en tiempo real al celular.",
                "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80",
                "specs": {"resolution": "2MP", "connection": "Wi-Fi", "battery": "Recargable"},
                "tag": "TIMBRE INTELIGENTE"
            },
            # Category: accessories
            {
                "id": "acc-keyboard-1",
                "name": "Teclado Mecánico Redragon K552 RGB",
                "category": "accessories",
                "price": 59.90,
                "description": "Teclado mecánico tenkeyless para juegos. Interruptores Outemu Blue, retroiluminación RGB dinámica.",
                "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
                "specs": {"switches": "Mecánico Outemu Blue", "layout": "TKL (sin teclado numérico)"},
                "tag": "ACCESSORIES"
            },
            {
                "id": "acc-mouse-2",
                "name": "Gaming Mouse - Logitech G Pro Wireless",
                "category": "accessories",
                "price": 89.90,
                "description": "Ratón gaming inalámbrico profesional con sensor HERO 25K y diseño ultraligero.",
                "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
                "specs": {"sensor": "HERO 25K", "weight": "80g", "battery_life": "Hasta 60h"},
                "tag": "ACCESSORIES"
            },
            {
                "id": "acc-headset-3",
                "name": "Gaming Headset - Razer BlackShark V2",
                "category": "accessories",
                "price": 79.90,
                "description": "Auriculares para juegos de deportes electrónicos con controladores TriForce de 50 mm y micrófono cardioide HyperClear.",
                "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
                "specs": {"drivers": "TriForce 50mm", "microphone": "Cardioide", "connection": "USB/3.5mm"},
                "tag": "ACCESSORIES"
            }
        ]
        
        # Historial de compras semilla para pruebas
        self.store["orders"] = [
            {
                "id": "ord-seed-001",
                "user_id": "seed-user-123",
                "date": "2026-05-15T14:30:00Z",
                "items": [
                    {"product_id": "router-tplink-1", "name": "Router TP-Link Archer AX55 Wi-Fi 6", "quantity": 1, "price": 89.90}
                ],
                "total": 89.90,
                "status": "Entregado"
            },
            {
                "id": "ord-seed-002",
                "user_id": "seed-user-123",
                "date": "2026-05-28T09:15:00Z",
                "items": [
                    {"product_id": "camara-imou-1", "name": "Cámara de Seguridad IMOU Cruiser 2MP", "quantity": 2, "price": 59.90}
                ],
                "total": 119.80,
                "status": "En Tránsito"
            }
        ]

        # Tickets de soporte semilla para pruebas
        self.store["tickets"] = [
            {
                "id": "tick-seed-001",
                "user_id": "seed-user-123",
                "subject": "Configuración de reenvío de puertos en router AX55",
                "description": "Necesito ayuda para abrir los puertos para mi servidor de base de datos local.",
                "created_at": "2026-05-30T10:00:00Z",
                "status": "Abierto",
                "priority": "Media",
                "replies": []
            }
        ]

        # Proyectos semilla para pruebas
        self.store["projects"] = [
            {
                "id": "PRJ-001",
                "name": "Sitio Web Corporativo",
                "clientEmail": "sharli@tecnoventas.com",
                "clientName": "Sharli Tecno",
                "description": "Diseño y desarrollo de portal web institucional con catálogo de productos y sistema de cotización.",
                "requirements": "Integración con pasarela de pagos, catálogo responsivo, panel de autogestión",
                "progress": 65,
                "status": "En Progreso",
                "startDate": "2026-01-15",
                "duration": "6 semanas"
            }
        ]

        # Auditoría semilla para pruebas
        self.store["audit_logs"] = [
            {
                "id": "1",
                "timestamp": "2026-06-09 10:15:32",
                "user": "admin@tecnoventas.com",
                "action": "Sesión iniciada correctamente (Simulado)"
            },
            {
                "id": "2",
                "timestamp": "2026-06-09 11:22:04",
                "user": "admin@tecnoventas.com",
                "action": "Sincronización de base de datos exitosa (Simulado)"
            }
        ]


class MockAuthModule:
    def verify_id_token(self, token: str) -> Dict[str, Any]:
        logger.info(f"[MockAuth] Verificando token simulado: {token[:15]}...")
        # En simulación, si el token empieza por "mock-user-google", simulamos un login de Google
        if token.startswith("mock-user-google"):
            return {
                "uid": "google-user-id-999",
                "name": "Maria Gomez (Google)",
                "email": "mariagomez.google@example.com",
                "picture": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
                "firebase": {"sign_in_provider": "google.com"}
            }
        elif token.startswith("mock-user-facebook"):
            return {
                "uid": "facebook-user-id-888",
                "name": "Carlos Ruiz (Facebook)",
                "email": "carlosruiz.fb@example.com",
                "picture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                "firebase": {"sign_in_provider": "facebook.com"}
            }
        elif token == "admin-token" or token.startswith("mock-admin-"):
            return {
                "uid": "admin-uid-999",
                "name": "Admin TecnoVentas",
                "email": "admin@tecnoventas.com",
                "firebase": {"sign_in_provider": "password"}
            }
        elif token.startswith("mock-user-") or token == "seed-user-token":
            return {
                "uid": "seed-user-123",
                "name": "Sharli Tecno",
                "email": "sharli@tecnoventas.com",
                "firebase": {"sign_in_provider": "password"}
            }
        
        # Fallback genérico para cualquier token no vacío
        if token and len(token) > 5:
            return {
                "uid": f"user-{hash(token) % 100000}",
                "name": "Usuario Simulado",
                "email": "simulado@example.com",
                "firebase": {"sign_in_provider": "anonymous"}
            }

            
        raise ValueError("Token inválido o expirado.")

# Intentar inicializar Firebase real si hay credenciales
try:
    import firebase_admin
    from firebase_admin import credentials, firestore, auth as firebase_auth
    
    # Comprobar si existe el archivo de cuenta de servicio
    service_key_path = "serviceAccountKey.json"
    if os.path.exists(service_key_path):
        cred = credentials.Certificate(service_key_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        auth = firebase_auth
        firebase_initialized = True
        logger.info("Firebase inicializado con éxito usando credenciales reales.")
    else:
        logger.info("No se encontró serviceAccountKey.json. Usando base de datos simulada.")
except Exception as e:
    logger.error(f"Error al inicializar Firebase real: {e}. Usando simulación.")

if not firebase_initialized:
    # Usar mock
    db = MockFirestore()
    auth = MockAuthModule()
    logger.info("Base de datos y Autenticación en modo SIMULADO activadas.")
