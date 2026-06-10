import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Package, Headphones, Code, ShoppingBag, LayoutDashboard,
  LogOut, User, Clock, CheckCircle2, AlertCircle, ChevronRight,
  Calendar, Hash, DollarSign, Tag, MessageSquare, Settings,
  ClipboardList, Eye, EyeOff, Activity, Plus, Trash2, Send, Edit3, UserCheck, Image, ShoppingCart,
  Menu, X, Cloud, CloudOff
} from "lucide-react";
import {
  fetchCollection,
  addDocument,
  updateDocument,
  deleteDocument
} from "../firebase";

const MOCK_PURCHASES = [
  {
    id: "ORD-2024-001",
    date: "2024-11-15",
    products: "PC Gamer Pro AMD Ryzen 5",
    total: 899.90,
    status: "Entregado",
  },
  {
    id: "ORD-2024-002",
    date: "2024-12-03",
    products: "Teclado Mecánico Redragon K552",
    total: 39.90,
    status: "Entregado",
  },
  {
    id: "ORD-2025-003",
    date: "2025-01-22",
    products: "Laptop ASUS ROG Strix G16",
    total: 1249.90,
    status: "En Tránsito",
  },
  {
    id: "ORD-2025-004",
    date: "2025-03-10",
    products: "Kit DVR Hikvision 4 Cámaras",
    total: 189.90,
    status: "Procesando",
  },
];

const MOCK_TICKETS = [
  {
    id: "TK-0042",
    subject: "Problema con instalación de cámaras",
    date: "2025-02-14",
    priority: "Alta",
    status: "Abierto",
    description: "Las cámaras IMOU no se conectan al DVR después de la instalación.",
    replies: [
      { id: 1, sender: "Soporte TVS", text: "Hola, ¿podrías indicarnos si las cámaras encienden sus leds de alimentación?", date: "2025-02-14" }
    ]
  },
  {
    id: "TK-0038",
    subject: "Actualización de drivers para RTX 4060",
    date: "2025-01-28",
    priority: "Media",
    status: "Resuelto",
    description: "Necesito asistencia para actualizar los drivers NVIDIA en mi PC Gamer.",
    replies: [
      { id: 1, sender: "Soporte TVS", text: "Instala el aplicativo GeForce Experience para descargas limpias.", date: "2025-01-28" },
      { id: 2, sender: "Cliente", text: "Listo, solucionado, gracias.", date: "2025-01-28" }
    ]
  },
  {
    id: "TK-0051",
    subject: "Configuración de red empresarial",
    date: "2025-03-05",
    priority: "Alta",
    status: "En Progreso",
    description: "Necesito configurar VLANs en el switch Cisco para separar tráfico de oficina.",
    replies: []
  },
];

const FALLBACK_PRODUCTS = [
  { id: "pc-gamer-1", name: "PC Gamer Pro - AMD Ryzen 5, RTX 4066", category: "desktop", price: 1999.00, description: "Computador de escritorio optimizado para Gaming y productividad.", image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80" },
  { id: "laptop-asus-1", name: "Laptop ASUS ROG Strix G16", category: "laptops", price: 1999.00, description: "Portátil de alta gama para juegos y desarrollo.", image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80" },
  { id: "net-router-1", name: "Router TP-Link Archer AXXS5 Wi-Fi 6", category: "networks", price: 89.90, description: "Router inteligente Gigabit Wi-Fi 6.", image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" },
  { id: "cam-imou-1", name: "Cámara de Seguridad IMOU Cruiser 2MP", category: "cameras", price: 59.90, description: "Cámara exterior Wi-Fi con rotación 360°.", image_url: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80" },
  { id: "acc-keyboard-1", name: "Teclado Mecánico Redragon K552 RGB", category: "accessories", price: 59.90, description: "Teclado mecánico tenkeyless para juegos.", image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" }
];

const NAV_ITEMS = [
  { key: "overview", label: "Resumen", icon: LayoutDashboard },
  { key: "purchases", label: "Compras", icon: ShoppingBag },
  { key: "tickets", label: "Soporte", icon: Headphones },
  { key: "projects", label: "Proyectos", icon: Code },
  { key: "categories", label: "Categorías", icon: Tag },
  { key: "audit", label: "Auditoría", icon: ClipboardList },
  { key: "settings", label: "Configuración", icon: Settings },
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
];

const SALES_CHART_DATA = [
  { month: "Ene", sales: 1200, activity: 15 },
  { month: "Feb", sales: 1850, activity: 28 },
  { month: "Mar", sales: 1500, activity: 22 },
  { month: "Abr", sales: 2400, activity: 42 },
  { month: "May", sales: 2100, activity: 35 },
  { month: "Jun", sales: 3250, activity: 55 },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- PERSISTENCIA FIRESTORE ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [dbStatus, setDbStatus] = useState("connecting"); // "connected" | "offline" | "connecting"

  // --- CONFIGURACIÓN DE CUENTA INTERACTIVA ---
  const [adminName, setAdminName] = useState(() => {
    const savedUser = localStorage.getItem("tecno_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser).name;
      } catch (e) {}
    }
    return user?.name || "Admin";
  });

  const [adminPicture, setAdminPicture] = useState(() => {
    const savedUser = localStorage.getItem("tecno_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser).picture;
      } catch (e) {}
    }
    return user?.picture || "";
  });

  const [isDragging, setIsDragging] = useState(false);

  const [notifEmail, setNotifEmail] = useState(() => {
    return localStorage.getItem("tecno_notif_email") || "admin@ecotur.com";
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // --- ESTADOS DE GESTIÓN TABS ---
  // Soporte
  const [selectedTicketId, setSelectedTicketId] = useState(MOCK_TICKETS[0]?.id || null);
  const [replyText, setReplyText] = useState("");
  const [ticketFilter, setTicketFilter] = useState("todos");

  // Proyectos Formulario
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projForm, setProjForm] = useState({
    id: "",
    name: "",
    clientName: "",
    description: "",
    requirements: "",
    progress: 50,
    status: "En Progreso"
  });

  // Categorías/Productos Formulario CRUD
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    category: "desktop",
    price: "",
    description: "",
    image_url: "",
    is_published: true
  });

  // Gráfico de Resumen
  const [chartView, setChartView] = useState("sales");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Redirección si no hay usuario o no es administrador
  useEffect(() => {
    const ADMIN_EMAILS = ["admin@tecnoventas.com", "admin@ecotur.com"];
    const isUserAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
    if (!user || !isUserAdmin) {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  // ─── CARGA DESDE FIRESTORE ───────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadAllData() {
      try {
        // Productos
        const firestoreProducts = await fetchCollection("products");
        if (!cancelled) {
          if (firestoreProducts.length > 0) {
            setProducts(firestoreProducts.map(p => ({ ...p, is_published: p.is_published ?? true })));
          } else {
            // Sembrar productos iniciales si la colección está vacía
            const seed = FALLBACK_PRODUCTS.map(p => ({ ...p, is_published: true }));
            setProducts(seed);
          }
          setLoadingProducts(false);
        }

        // Proyectos
        const firestoreProjects = await fetchCollection("projects");
        if (!cancelled) {
          if (firestoreProjects.length > 0) {
            setProjects(firestoreProjects);
          } else {
            setProjects([{
              id: "PRJ-001",
              name: "Sitio Web Corporativo",
              clientName: "Inversiones Bogotá S.A.",
              description: "Diseño y desarrollo de portal web institucional con catálogo de productos y sistema de cotización.",
              requirements: "Integración con pasarela de pagos, catálogo responsivo, panel de autogestión",
              progress: 65,
              status: "En Progreso",
              startDate: "2025-01-15",
              duration: "6 semanas"
            }]);
          }
          setLoadingProjects(false);
        }

        // Tickets
        const firestoreTickets = await fetchCollection("tickets");
        if (!cancelled) {
          setTickets(firestoreTickets.length > 0 ? firestoreTickets : MOCK_TICKETS);
          setLoadingTickets(false);
        }

        // Auditoría
        const firestoreAudit = await fetchCollection("audit", "timestamp");
        if (!cancelled) {
          if (firestoreAudit.length > 0) {
            setAuditLogs(firestoreAudit);
          } else {
            setAuditLogs([
              { id: Date.now(), timestamp: new Date().toLocaleString("es-CO"), user: user?.email || "admin", action: "Sistema conectado a Firebase Firestore exitosamente" }
            ]);
          }
          setLoadingAudit(false);
        }

        if (!cancelled) setDbStatus("connected");
      } catch (err) {
        console.error("Error al conectar con Firestore:", err);
        if (!cancelled) {
          setDbStatus("offline");
          // Fallback local
          setProducts(FALLBACK_PRODUCTS.map(p => ({ ...p, is_published: true })));
          setLoadingProducts(false);
          setLoadingProjects(false);
          setLoadingTickets(false);
          setLoadingAudit(false);
        }
      }
    }

    if (user) loadAllData();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // --- HELPER LOG AUDITORÍA → FIRESTORE ---
  const addAuditLog = useCallback(async (actionText) => {
    const timestamp = new Date().toLocaleString("es-CO");
    const newLog = {
      id: Date.now(),
      timestamp,
      user: user?.email || "admin",
      action: actionText
    };
    // Actualizar UI inmediatamente
    setAuditLogs(prev => [newLog, ...prev]);
    // Persistir en Firestore
    await addDocument("audit", newLog);
  }, [user]);

  // --- COMPORTAMIENTO DE CARGA DE IMAGEN (DRAG & DROP) ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAdminPicture(event.target.result);
      addAuditLog("Cargó una nueva imagen de perfil desde su computador");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // --- ACCIONES DE PRODUCTOS → FIRESTORE ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const priceNum = parseFloat(productForm.price);
    if (isCreatingProduct) {
      const newProduct = {
        ...productForm,
        id: `prod-${Math.floor(100 + Math.random() * 900)}`,
        price: priceNum,
        is_published: true
      };
      const fsId = await addDocument("products", newProduct);
      setProducts(prev => [...prev, { ...newProduct, firestoreId: fsId }]);
      addAuditLog(`Añadió producto: '${newProduct.name}' (${newProduct.category}, $${priceNum})`);
    } else {
      const updated = { ...productForm, price: priceNum };
      if (productForm.firestoreId) {
        await updateDocument("products", productForm.firestoreId, updated);
      }
      setProducts(prev => prev.map(p => p.id === productForm.id ? { ...p, ...updated } : p));
      addAuditLog(`Editó producto: '${productForm.name}' ($${priceNum})`);
    }

    setIsCreatingProduct(false);
    setEditingProduct(null);
    setProductForm({ id: "", name: "", category: "desktop", price: "", description: "", image_url: "", is_published: true });
    setToastMsg("Producto guardado en la nube ☁️");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;
    const target = products.find(p => p.id === productId);
    if (target?.firestoreId) await deleteDocument("products", target.firestoreId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    addAuditLog(`Eliminó el producto '${name}' (ID: ${productId})`);
    setToastMsg("Producto eliminado");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleEditProductClick = (product) => {
    setProductForm(product);
    setEditingProduct(product);
    setIsCreatingProduct(false);
  };

  const handleCreateProductClick = () => {
    setProductForm({
      id: "",
      name: "",
      category: "desktop",
      price: "",
      description: "",
      image_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80",
      is_published: true
    });
    setIsCreatingProduct(true);
    setEditingProduct(null);
  };

  const togglePublish = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const nextStatus = !product.is_published;
    if (product.firestoreId) {
      await updateDocument("products", product.firestoreId, { is_published: nextStatus });
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_published: nextStatus } : p));
    addAuditLog(`${nextStatus ? "Publicó" : "Desmontó"} el producto '${product.name}'`);
  };

  const changeCategory = async (productId, newCategory) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.firestoreId) {
      await updateDocument("products", product.firestoreId, { category: newCategory });
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, category: newCategory } : p));
    addAuditLog(`Cambió categoría de '${product.name}' a '${newCategory}'`);
  };

  // --- ACCIONES SOPORTE → FIRESTORE ---
  const handleReplyTicket = async (ticketId, text, shouldResolve = false) => {
    if (!text.trim() && !shouldResolve) return;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const newReplies = [...(ticket.replies || [])];
    if (text.trim()) {
      newReplies.push({
        id: Date.now(),
        sender: "Administrador",
        text,
        date: new Date().toISOString().split('T')[0]
      });
    }
    const nextStatus = shouldResolve ? "Resuelto" : "En Progreso";
    const updated = { ...ticket, status: nextStatus, replies: newReplies };
    if (ticket.firestoreId) {
      await updateDocument("tickets", ticket.firestoreId, { status: nextStatus, replies: newReplies });
    } else {
      const fsId = await addDocument("tickets", updated);
      updated.firestoreId = fsId;
    }
    setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
    addAuditLog(`${shouldResolve ? "Resolvió y cerró" : "Respondió al"} ticket '${ticket.subject}' (${ticketId})`);
    setReplyText("");
    setToastMsg(shouldResolve ? "Ticket resuelto exitosamente" : "Respuesta enviada");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // --- ACCIONES PROYECTOS → FIRESTORE ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projForm.name || !projForm.clientName) return;

    if (isCreatingProject) {
      const newProj = {
        ...projForm,
        id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
        startDate: new Date().toISOString().split('T')[0],
        duration: "Variable"
      };
      const fsId = await addDocument("projects", newProj);
      setProjects(prev => [...prev, { ...newProj, firestoreId: fsId }]);
      addAuditLog(`Creó el proyecto '${newProj.name}'`);
    } else {
      if (projForm.firestoreId) {
        await updateDocument("projects", projForm.firestoreId, projForm);
      }
      setProjects(prev => prev.map(p => p.id === projForm.id ? { ...p, ...projForm } : p));
      addAuditLog(`Actualizó el proyecto '${projForm.name}'`);
    }

    setIsCreatingProject(false);
    setEditingProject(null);
    setProjForm({ id: "", name: "", clientName: "", description: "", requirements: "", progress: 50, status: "En Progreso" });
    setToastMsg("Proyecto guardado en la nube ☁️");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleDeleteProject = async (projId, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proyecto "${name}"?`)) return;
    const target = projects.find(p => p.id === projId);
    if (target?.firestoreId) await deleteDocument("projects", target.firestoreId);
    setProjects(prev => prev.filter(p => p.id !== projId));
    addAuditLog(`Eliminó el proyecto '${name}' (ID: ${projId})`);
    setToastMsg("Proyecto eliminado");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleEditProjectClick = (project) => {
    setProjForm(project);
    setEditingProject(project);
    setIsCreatingProject(false);
  };

  const handleCreateProjectClick = () => {
    setProjForm({
      id: "",
      name: "",
      clientName: "",
      description: "",
      requirements: "",
      progress: 50,
      status: "En Progreso"
    });
    setIsCreatingProject(true);
    setEditingProject(null);
  };

  // --- ACCIÓN GUARDAR CONFIGURACIÓN ---
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: adminName,
      picture: adminPicture
    };
    localStorage.setItem("tecno_user", JSON.stringify(updatedUser));
    localStorage.setItem("tecno_notif_email", notifEmail);

    addAuditLog(`Actualizó configuración de cuenta. Nombre: '${adminName}', Correo Notif: '${notifEmail}'`);

    if (newPassword) {
      addAuditLog("Actualizó la contraseña de seguridad del panel");
      setCurrentPassword("");
      setNewPassword("");
    }

    setToastMsg("Configuración guardada exitosamente");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusBadge = (status) => {
    const styles = {
      "Entregado": "bg-[#203a5e] text-white",
      "En Tránsito": "bg-[#203a5e] text-white",
      "Procesando": "bg-amber-100 text-amber-700 border-amber-200",
      "Abierto": "bg-[#f47321] text-white",
      "Resuelto": "bg-[#203a5e] text-white",
      "En Progreso": "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      <span className={`inline-flex items-center px-4.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-full ${styles[status] || "bg-slate-100 text-slate-650"}`}>
        {status}
      </span>
    );
  };

  const getPriorityText = (priority) => {
    const styles = {
      "Alta": "text-red-600 font-extrabold",
      "Media": "text-amber-600 font-extrabold",
      "Baja": "text-blue-600 font-extrabold",
    };
    return (
      <span className={`text-xs sm:text-sm ml-1.5 ${styles[priority] || "text-slate-500"}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#e2ebf5] text-slate-800 flex flex-col relative font-body">
      
      {/* --- NOTIFICACIÓN TOAST PREMIUM --- */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#203a5e] border-2 border-[#dfb648] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in-up font-heading font-black text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* --- INDICADOR ESTADO FIREBASE --- */}
      <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-black uppercase tracking-wider border transition-all ${
        dbStatus === "connected"
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : dbStatus === "offline"
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-amber-50 border-amber-200 text-amber-600"
      }`}>
        {dbStatus === "connected" ? <Cloud className="w-4 h-4" /> : dbStatus === "offline" ? <CloudOff className="w-4 h-4" /> : <Cloud className="w-4 h-4 animate-pulse" />}
        {dbStatus === "connected" ? "Firebase OK" : dbStatus === "offline" ? "Sin conexión" : "Conectando..."}
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER CORPORATIVO SUPERIOR COMPLETO (IDÉNTICO AL MOCKUP)              */}
      {/* ========================================================================= */}
      {/* --- HEADER ADMINISTRATIVO MÓVIL (COMPACTO Y RESPONSIVO) --- */}
      <header className="lg:hidden w-full bg-[#1b3a60] text-white px-5 py-4 flex items-center justify-between shadow-md border-b border-white/10 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white hover:text-[#dfb648] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer flex items-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-extrabold text-base tracking-normal text-[#dfb648]">TecnoVentas Admin</span>
        </div>
        
        {/* Quick Back to Site */}
        <Link to="/" className="text-xs font-black text-slate-350 hover:text-white no-underline bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 uppercase tracking-wider">
          Ver Sitio
        </Link>
      </header>

      {/* --- SIDEBAR BACKDROP PARA MÓVIL --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. AREA INFERIOR: SIDEBAR Y CONTENIDO                                    */}
      {/* ========================================================================= */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto min-h-0 relative">
        
        {/* --- SIDEBAR AZUL PREMIUM (RESPONSIVO Y FIEL) --- */}
        <aside 
          className={`flex flex-col w-full lg:w-64 shrink-0 shadow-2xl text-white transition-all duration-300 lg:min-h-[calc(100vh-5rem)] z-40
            fixed lg:static top-0 bottom-0 left-0 h-full lg:h-auto ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          style={{ background: "#203a5e" }}
        >
          <div className="flex flex-col justify-between h-full flex-grow">
            
            {/* Top Section */}
            <div className="flex flex-col">
              {/* Tarjeta de Bienvenida del Admin */}
              <div className="p-5 border-b border-white/10 relative">
                
                {/* Botón de cerrar sidebar en móvil */}
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden absolute top-4 right-4 p-1 text-slate-300 hover:text-white bg-transparent border-0 cursor-pointer"
                  title="Cerrar Menú"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="bg-[#13253f]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  
                  {/* Avatar dark square */}
                  <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-center text-white font-heading font-black text-xl shadow-md shrink-0">
                    {adminPicture ? (
                      <img src={adminPicture} alt={adminName} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      adminName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="text-sm sm:text-base font-bold leading-tight truncate">
                      Bienvenido, <span className="text-[#dfb648] font-black">{adminName}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 truncate mt-0.5 font-semibold">{user.email}</span>
                    
                    {/* Back link */}
                    <Link to="/" className="text-xs sm:text-sm text-cyan-400 font-bold hover:underline mt-1.5 flex items-center gap-1">
                      ← Volver al Sitio
                    </Link>
                  </div>

                </div>
              </div>

              {/* Menú de Navegación */}
              <nav className="p-3.5 flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveSection(item.key);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-lg font-extrabold border-0 cursor-pointer transition-all duration-150 text-left ${
                        isActive
                          ? "bg-[#0c1829]/40 text-[#dfb648] border-r-4 border-r-[#f37021] rounded-r-none"
                          : "bg-transparent text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-5.5 h-5.5 ${isActive ? "text-[#dfb648]" : "text-slate-300"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Botón de Cerrar Sesión Abajo a la Izquierda */}
            <div className="mt-auto p-5 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl text-lg font-extrabold border-0 cursor-pointer text-slate-300 hover:text-red-400 hover:bg-white/5 transition-all text-left uppercase tracking-wider"
              >
                <LogOut className="w-5.5 h-5.5 text-slate-300" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-grow p-5 sm:p-6 md:p-8 min-w-0">
          
          {/* === RESUMEN (ESTILO MOCKUP EXCELENCIA) === */}
          {activeSection === "overview" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              
              {/* Tarjetas de Estadísticas Fieles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* Total Compras Celeste */}
                <div className="bg-[#b4dce8] rounded-[24px] p-6 flex items-center gap-4.5 shadow-sm border border-[#a2cfdc]">
                  <div className="w-14 h-14 bg-[#f47321] rounded-xl flex items-center justify-center shrink-0 shadow">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base text-slate-800 font-black uppercase tracking-wider leading-tight">TOTAL COMPRAS</span>
                    <span className="text-5xl sm:text-6xl font-heading font-black text-slate-900 leading-none mt-1.5">4</span>
                    <span className="text-base text-slate-700 font-bold mt-1.5">$2.379,60 total</span>
                  </div>
                </div>

                {/* Tickets Soporte Amarillo */}
                <div className="bg-[#f9da9b] rounded-[24px] p-6 flex items-center gap-4.5 shadow-sm border border-[#eec57c]">
                  <div className="w-14 h-14 bg-[#f47321] rounded-xl flex items-center justify-center shrink-0 shadow">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base text-slate-800 font-black uppercase tracking-wider leading-tight">TICKETS SOPORTE</span>
                    <span className="text-5xl sm:text-6xl font-heading font-black text-slate-900 leading-none mt-1.5">{tickets.length}</span>
                    <span className="text-base text-slate-700 font-bold mt-1.5">{tickets.filter(t => t.status !== "Resuelto").length} activos</span>
                  </div>
                </div>

                {/* Proyectos Verde */}
                <div className="bg-[#b2d8ad] rounded-[24px] p-6 flex items-center gap-4.5 shadow-sm border border-[#9fcba7]">
                  <div className="w-14 h-14 bg-[#f47321] rounded-xl flex items-center justify-center shrink-0 shadow">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base text-slate-800 font-black uppercase tracking-wider leading-tight">PROYECTOS</span>
                    <span className="text-5xl sm:text-6xl font-heading font-black text-slate-900 leading-none mt-1.5">{projects.length}</span>
                    <span className="text-base text-slate-700 font-bold mt-1.5">{projects.filter(p => p.status === "En Progreso").length} en desarrollo</span>
                  </div>
                </div>

              </div>

              {/* Gráfico SVG Oculto/Reducido en Mockup (Opcional, lo mantenemos como opción premium visual) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-sm font-black text-slate-800 uppercase tracking-wide">Rendimiento Operativo</h3>
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    <button onClick={() => setChartView("sales")} className={`px-3 py-1.5 rounded-md text-[9px] font-black border-0 cursor-pointer uppercase ${chartView === "sales" ? "bg-white text-[#f37021]" : "bg-transparent text-slate-500"}`}>Ventas</button>
                    <button onClick={() => setChartView("activity")} className={`px-3 py-1.5 rounded-md text-[9px] font-black border-0 cursor-pointer uppercase ${chartView === "activity" ? "bg-white text-cyan-600" : "bg-transparent text-slate-500"}`}>Actividad</button>
                  </div>
                </div>
                <div className="h-[140px] w-full bg-slate-50/50 rounded-xl border border-slate-100 p-2">
                  <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f37021" stopOpacity="0.45"/><stop offset="100%" stopColor="#f37021" stopOpacity="0.0"/></linearGradient>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00a2e8" stopOpacity="0.45"/><stop offset="100%" stopColor="#00a2e8" stopOpacity="0.0"/></linearGradient>
                    </defs>
                    <line x1="30" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="70" x2="480" y2="70" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
                    {chartView === "sales" ? (
                      <>
                        <path d="M 30,110 L 30,100 Q 120,70 210,85 T 390,45 L 480,20 L 480,110 Z" fill="url(#salesGrad)" />
                        <path d="M 30,100 Q 120,70 210,85 T 390,45 L 480,20" fill="none" stroke="#f37021" strokeWidth="3" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <path d="M 30,110 L 30,105 Q 120,80 210,88 T 390,65 L 480,30 L 480,110 Z" fill="url(#actGrad)" />
                        <path d="M 30,105 Q 120,80 210,88 T 390,65 L 480,30" fill="none" stroke="#00a2e8" strokeWidth="3" strokeLinecap="round" />
                      </>
                    )}
                    {SALES_CHART_DATA.map((d, idx) => {
                      const xCoord = 30 + idx * 90;
                      const yCoordsSales = [100, 78, 85, 65, 45, 20];
                      const yCoordsAct = [105, 87, 88, 70, 65, 30];
                      const yCoord = chartView === "sales" ? yCoordsSales[idx] : yCoordsAct[idx];
                      const isHovered = hoveredPoint === idx;
                      return (
                        <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                          <circle cx={xCoord} cy={yCoord} r={isHovered ? "6" : "4"} fill={chartView === "sales" ? "#f37021" : "#00a2e8"} stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Tabla de Últimas Compras con Cabecera Azul Premium */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4.5 bg-[#8caac8] text-slate-900 border-b border-[#7b9ab9]">
                  <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Últimas Compras</h3>
                  <button
                    onClick={() => setActiveSection("purchases")}
                    className="text-sm sm:text-base text-white font-black hover:underline bg-transparent border-0 cursor-pointer flex items-center gap-0.5 uppercase tracking-wider"
                  >
                    Ver todas <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#e6f0fa]/80 border-b border-slate-200">
                        <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Pedido</th>
                        <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Producto</th>
                        <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Fecha</th>
                        <th className="text-right px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Total</th>
                        <th className="text-center px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PURCHASES.slice(0, 3).map((purchase) => (
                        <tr key={purchase.id} className="border-t border-slate-150 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 text-base sm:text-lg font-black text-[#203a5e] underline">
                            <Link to="/cart" className="text-[#203a5e]">{purchase.id}</Link>
                          </td>
                          <td className="px-6 py-5 text-base sm:text-lg text-slate-800 font-bold">{purchase.products}</td>
                          <td className="px-6 py-5 text-sm sm:text-base text-slate-500 font-semibold">{purchase.date}</td>
                          <td className="px-6 py-5 text-base sm:text-lg text-slate-900 font-black text-right">
                            ${purchase.total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-5 text-center">{getStatusBadge(purchase.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tickets Recientes con Cabecera Azul Premium */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4.5 bg-[#8caac8] text-slate-900 border-b border-[#7b9ab9]">
                  <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Tickets de Soporte Recientes</h3>
                  <button
                    onClick={() => setActiveSection("tickets")}
                    className="text-sm sm:text-base text-white font-black hover:underline bg-transparent border-0 cursor-pointer flex items-center gap-0.5 uppercase tracking-wider"
                  >
                    Ver todos <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-150">
                  {tickets.slice(0, 2).map((ticket) => (
                    <div key={ticket.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-base text-slate-705 font-bold">
                          <span className="text-slate-500 font-extrabold">{ticket.id}</span>
                          {getPriorityText(ticket.priority)}
                        </div>
                        <h4 className="text-base sm:text-lg text-slate-808 font-black leading-tight">{ticket.subject}</h4>
                      </div>
                      <div className="shrink-0">{getStatusBadge(ticket.status)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* === HISTORIAL COMPRAS === */}
          {activeSection === "purchases" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
              <div className="px-6 py-4.5 bg-[#8caac8] text-slate-900 border-b border-[#7b9ab9]">
                <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Historial General de Compras</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#e6f0fa]/80 border-b border-slate-200">
                      <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Pedido</th>
                      <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Producto</th>
                      <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Fecha</th>
                      <th className="text-right px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Total</th>
                      <th className="text-center px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PURCHASES.map((purchase) => (
                      <tr key={purchase.id} className="border-t border-slate-150 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 text-base sm:text-lg font-black text-[#203a5e] underline">{purchase.id}</td>
                        <td className="px-6 py-5 text-base sm:text-lg text-slate-800 font-bold">{purchase.products}</td>
                        <td className="px-6 py-5 text-sm sm:text-base text-slate-550 font-semibold">{purchase.date}</td>
                        <td className="px-6 py-5 text-base sm:text-lg text-slate-900 font-black text-right">
                          ${purchase.total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-5 text-center">{getStatusBadge(purchase.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === SOPORTE TÉCNICO INTERACTIVO === */}
          {activeSection === "tickets" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 flex flex-col md:flex-row gap-6">
                
                {/* Listado Izquierdo */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 border-r border-slate-100 pr-0 md:pr-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-heading text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider">Bandeja de Tickets</h3>
                    <span className="text-sm font-black text-[#dfb648] bg-slate-900 px-3 py-1.5 rounded-lg shadow-sm">{tickets.length}</span>
                  </div>
                  <div className="flex gap-1.5 bg-slate-50 p-2 rounded-xl">
                    {["todos", "Abierto", "Resuelto"].map(f => (
                      <button key={f} onClick={() => setTicketFilter(f)} className={`flex-grow py-3 rounded-lg text-sm sm:text-base font-black border-0 cursor-pointer uppercase ${ticketFilter === f ? "bg-white text-slate-800 shadow-sm" : "bg-transparent text-slate-400"}`}>
                        {f === "todos" ? "Todos" : f}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[450px]">
                    {tickets.filter(t => ticketFilter === "todos" || t.status === ticketFilter).map((ticket) => {
                      const isSelected = selectedTicketId === ticket.id;
                      return (
                        <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className={`p-5 border rounded-xl cursor-pointer transition-all ${isSelected ? "border-cyan-500 bg-cyan-50/30" : "border-slate-200/80 hover:bg-slate-50/50"}`}>
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="text-sm font-mono font-black text-slate-400">{ticket.id}</span>
                            {getPriorityText(ticket.priority)}
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-slate-808 truncate">{ticket.subject}</h4>
                          <div className="flex items-center justify-between mt-3 text-sm font-semibold text-slate-500">
                            <span>{ticket.date}</span>
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detalle Derecho */}
                <div className="flex-grow flex flex-col justify-between min-h-[400px]">
                  {(() => {
                    const activeTicket = tickets.find(t => t.id === selectedTicketId);
                    if (!activeTicket) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                          <MessageSquare className="w-14 h-14 text-slate-300" />
                          <p className="text-base font-bold mt-2">Selecciona un ticket de soporte para responder.</p>
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-black text-slate-400 bg-slate-100 border px-2.5 py-1 rounded-lg">{activeTicket.id}</span>
                              {getPriorityText(activeTicket.priority)}
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">{activeTicket.subject}</h4>
                          </div>
                          <div>{getStatusBadge(activeTicket.status)}</div>
                        </div>

                        <div className="bg-slate-50/50 rounded-2xl p-5 flex-grow overflow-y-auto max-h-[300px] flex flex-col gap-4 border border-slate-100">
                          <div className="bg-white p-4 rounded-xl border border-slate-200/50 max-w-[85%] self-start shadow-sm">
                            <span className="text-xs sm:text-sm font-black text-slate-500 block mb-1">Usuario</span>
                            <p className="text-sm sm:text-base text-slate-700 font-bold leading-relaxed">{activeTicket.description}</p>
                          </div>
                          {activeTicket.replies && activeTicket.replies.map((rep) => {
                            const isAdmin = rep.sender === "Administrador";
                            return (
                              <div key={rep.id} className={`p-4 rounded-xl max-w-[85%] shadow-sm ${isAdmin ? "bg-[#203a5e] text-white self-end" : "bg-white text-slate-700 border border-slate-200/50 self-start"}`}>
                                <span className="text-xs sm:text-sm font-black block mb-1">{rep.sender}</span>
                                <p className="text-sm sm:text-base font-bold leading-relaxed">{rep.text}</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                          <textarea
                            placeholder="Escribe la respuesta formal para el usuario..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold text-slate-800 focus:outline-none focus:border-cyan-500 shadow-inner"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <button onClick={() => handleReplyTicket(activeTicket.id, "", true)} className="px-5 py-4 border border-slate-300 hover:bg-slate-100 rounded-xl text-sm sm:text-base font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5">
                              <UserCheck className="w-5 h-5" /> Resolver y Cerrar
                            </button>
                            <button onClick={() => handleReplyTicket(activeTicket.id, replyText)} className="btn-3d-gold border-0 px-6 py-4 rounded-xl text-sm sm:text-base font-black flex items-center gap-1.5 shadow-md">
                              <Send className="w-5 h-5" /> Enviar Respuesta
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* === PROYECTOS INTERACTIVA === */}
          {activeSection === "projects" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-wide">Proyectos de Ingeniería</h3>
                  <p className="text-base text-slate-600 font-bold mt-1">Gestión y avance de desarrollos contratados</p>
                </div>
                {!isCreatingProject && !editingProject && (
                  <button onClick={handleCreateProjectClick} className="btn-3d-green border-0 px-6 py-4 rounded-xl text-base font-black flex items-center gap-1.5 shadow-md">
                    <Plus className="w-5.5 h-5.5" /> NUEVO PROYECTO
                  </button>
                )}
              </div>

              {(isCreatingProject || editingProject) && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md animate-fade-in-up">
                  <h3 className="font-heading text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b">
                    {isCreatingProject ? "Crear Nuevo Proyecto" : `Editar Proyecto ${projForm.id}`}
                  </h3>
                  <form onSubmit={handleSaveProject} className="flex flex-col gap-4.5 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Nombre del Proyecto</label>
                        <input type="text" required value={projForm.name} onChange={(e) => setProjForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Ej. Portal Ecommerce" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Cliente / Empresa</label>
                        <input type="text" required value={projForm.clientName} onChange={(e) => setProjForm(prev => ({ ...prev, clientName: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Ej. Distribuidora S.A.S." />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Descripción del Proyecto</label>
                      <textarea value={projForm.description} onChange={(e) => setProjForm(prev => ({ ...prev, description: e.target.value }))} rows="2" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Alcance del software..." />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Requisitos (separados por comas)</label>
                      <input type="text" value={projForm.requirements} onChange={(e) => setProjForm(prev => ({ ...prev, requirements: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Ej. Pasarela de pagos, Autenticación Google" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-sm sm:text-base font-black uppercase tracking-wider">
                          <label className="text-slate-550">Porcentaje de Avance</label>
                          <span className="text-[#f37021]">{projForm.progress}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={projForm.progress} onChange={(e) => setProjForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))} className="w-full accent-[#f37021] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-1" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Estado Operativo</label>
                        <select value={projForm.status} onChange={(e) => setProjForm(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3.5 text-base font-bold text-slate-700 cursor-pointer focus:outline-none">
                          <option value="Procesando">Procesando</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button type="submit" className="btn-3d-green border-0 px-6 py-4.5 rounded-xl text-base font-black shadow-md">Guardar Proyecto</button>
                      <button type="button" onClick={() => { setIsCreatingProject(false); setEditingProject(null); }} className="px-5.5 py-4.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-xl text-base font-black transition-all cursor-pointer">Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              {!isCreatingProject && !editingProject && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono font-black text-slate-400 uppercase tracking-widest">{proj.id}</span>
                            <h4 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider mt-0.5">{proj.name}</h4>
                          </div>
                          {getStatusBadge(proj.status)}
                        </div>
                        <div className="flex flex-col gap-2.5 mt-4">
                          <div>
                            <span className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Cliente:</span>
                            <span className="text-base text-slate-800 font-bold ml-1.5">{proj.clientName}</span>
                          </div>
                          <div>
                            <span className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Alcance:</span>
                            <p className="text-base text-slate-600 font-semibold mt-1 leading-normal">{proj.description}</p>
                          </div>
                          {proj.requirements && (
                            <div>
                              <span className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Requisitos:</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {proj.requirements.split(",").map((req, i) => (
                                  <span key={i} className="text-sm font-black bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md">{req.trim()}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center text-sm sm:text-base mb-2 font-black uppercase tracking-wider">
                          <span className="text-slate-450">Progreso</span>
                          <span className="text-[#203a5e] text-base font-black">{proj.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-[#203a5e] rounded-full" style={{ width: `${proj.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-end gap-2.5 mt-5">
                          <button onClick={() => handleEditProjectClick(proj)} className="px-4 py-2.5 border border-slate-205 bg-slate-50 text-slate-700 rounded-xl text-sm sm:text-base font-black transition-all flex items-center gap-1.5 cursor-pointer"><Edit3 className="w-4.5 h-4.5" />Editar</button>
                          <button onClick={() => handleDeleteProject(proj.id, proj.name)} className="px-4 py-2.5 border border-red-200 bg-red-50/10 text-red-655 hover:bg-red-100 rounded-xl text-sm sm:text-base font-black transition-all flex items-center gap-1.5 cursor-pointer"><Trash2 className="w-4.5 h-4.5" />Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === GESTIÓN CATÁLOGO (CATEGORÍAS) === */}
          {activeSection === "categories" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-wide">Gestión de Categorías y Catálogo</h3>
                  <p className="text-base text-slate-600 font-bold mt-1">Control completo de productos</p>
                </div>
                {!isCreatingProduct && !editingProduct && (
                  <button onClick={handleCreateProductClick} className="btn-3d-green border-0 px-6 py-4 rounded-xl text-base font-black flex items-center gap-1.5 shadow-md">
                    <Plus className="w-5.5 h-5.5" /> NUEVO PRODUCTO
                  </button>
                )}
              </div>

              {(isCreatingProduct || editingProduct) && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md animate-fade-in-up">
                  <h3 className="font-heading text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b">
                    {isCreatingProduct ? "Añadir Nuevo Producto" : `Editar Producto ${productForm.id}`}
                  </h3>
                  <form onSubmit={handleSaveProduct} className="flex flex-col gap-4.5 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Nombre del Producto</label>
                        <input type="text" required value={productForm.name} onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none animate-none" placeholder="Ej. Teclado Mecánico RGB" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Precio ($ USD)</label>
                        <input type="number" step="0.01" required value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Ej. 59.90" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Categoría</label>
                        <select value={productForm.category} onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3.5 text-base font-bold text-slate-700 cursor-pointer focus:outline-none">
                          <option value="desktop">Desktop</option>
                          <option value="laptops">Laptops</option>
                          <option value="networks">Redes</option>
                          <option value="cameras">Cámaras</option>
                          <option value="accessories">Accesorios</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">URL de Imagen</label>
                        <input type="text" required value={productForm.image_url} onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="https://images.unsplash.com/..." />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Descripción del Producto</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))} rows="3" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none" placeholder="Detalles..." />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button type="submit" className="btn-3d-green border-0 px-6 py-4.5 rounded-xl text-base font-black shadow-md">Guardar Producto</button>
                      <button type="button" onClick={() => { setIsCreatingProduct(false); setEditingProduct(null); }} className="px-5.5 py-4.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-xl text-base font-black transition-all cursor-pointer">Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              {!isCreatingProduct && !editingProduct && (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4.5 bg-[#8caac8] text-slate-900 border-b border-[#7b9ab9]">
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Listado General de Productos</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full font-body">
                      <thead>
                        <tr className="bg-[#e6f0fa]/80 border-b border-slate-200">
                          <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Producto</th>
                          <th className="text-left px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Categoría</th>
                          <th className="text-center px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Estado</th>
                          <th className="text-right px-6 py-4 text-sm sm:text-base text-slate-700 font-extrabold uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-t border-slate-150 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3.5">
                                <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200/50 shrink-0 shadow-sm" />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-base sm:text-lg font-black text-slate-855">{product.name}</span>
                                  <span className="text-sm sm:text-base text-slate-550 font-extrabold uppercase tracking-wider mt-0.5">ID: {product.id} • ${product.price}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <select value={product.category} onChange={(e) => changeCategory(product.id, e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-base font-bold text-slate-700 focus:outline-none cursor-pointer">
                                <option value="desktop">Desktop</option>
                                <option value="laptops">Laptops</option>
                                <option value="networks">Redes</option>
                                <option value="cameras">Cámaras</option>
                                <option value="accessories">Accesorios</option>
                              </select>
                            </td>
                            <td className="px-6 py-5 text-center">
                              {product.is_published ? (
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm sm:text-base font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full uppercase tracking-wider"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Publicado</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm sm:text-base font-black text-slate-500 bg-slate-100 border border-slate-200 rounded-full uppercase tracking-wider"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>Desmontado</span>
                              )}
                            </td>
                            <td className="px-6 py-5 text-right flex justify-end items-center gap-2 text-sm sm:text-base">
                              {product.is_published ? (
                                <button onClick={() => togglePublish(product.id)} className="inline-flex items-center gap-1 px-3.5 py-3 border border-red-200 bg-red-50/40 text-red-650 rounded-xl font-extrabold hover:bg-red-100 cursor-pointer transition-all"><EyeOff className="w-4.5 h-4.5" />Desmontar</button>
                              ) : (
                                <button onClick={() => togglePublish(product.id)} className="inline-flex items-center gap-1 px-3.5 py-3 border border-emerald-200 bg-emerald-50 text-emerald-600 rounded-xl font-extrabold hover:bg-emerald-100 cursor-pointer transition-all"><Eye className="w-4.5 h-4.5" />Montar</button>
                              )}
                              <button onClick={() => handleEditProductClick(product)} className="inline-flex items-center gap-1 px-3.5 py-3 border border-slate-205 bg-slate-50 text-slate-700 rounded-xl font-extrabold hover:bg-slate-100 cursor-pointer transition-all"><Edit3 className="w-4.5 h-4.5" />Editar</button>
                              <button onClick={() => handleDeleteProduct(product.id, product.name)} className="inline-flex items-center gap-1 px-3.5 py-3 border border-red-105 bg-red-50/10 text-red-600 rounded-xl font-extrabold hover:bg-red-100 cursor-pointer transition-all"><Trash2 className="w-4.5 h-4.5" />Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* === SECCIÓN AUDITORÍA (SÓLO LECTURA) === */}
        {activeSection === "audit" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full animate-fade-in-up font-body">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-[#8caac8] text-slate-900">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5.5 h-5.5 text-slate-900" />
                <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Bitácora de Auditoría de Actividad</h3>
              </div>
              <span className="text-sm sm:text-base font-black text-white bg-slate-900 px-4 py-2 rounded-xl uppercase tracking-wider shadow">
                {auditLogs.length} eventos
              </span>
            </div>
            <div className="p-6 overflow-y-auto max-h-[600px] flex flex-col gap-5">
              {auditLogs.map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-slate-200 pb-3 last:pb-0">
                  <div className="absolute left-0 top-1.5 -translate-x-[50%] w-3 h-3 rounded-full bg-[#dfb648] border-2 border-white ring-4 ring-[#dfb648]/10"></div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-slate-500 font-extrabold tracking-wider uppercase font-mono">{log.timestamp} • {log.user}</span>
                    <span className="text-base sm:text-lg font-bold text-slate-700 leading-normal">{log.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === SECCIÓN CONFIGURACIÓN COMPLETA === */}
        {activeSection === "settings" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4.5 bg-[#8caac8] text-slate-900 border-b border-[#7b9ab9]">
              <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider leading-none">Configuración de Cuenta del Administrador</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5.5 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Nombre del Administrador</label>
                    <input type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-805 focus:outline-none shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Correo de Notificaciones</label>
                    <input type="email" required value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-805 focus:outline-none shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold text-slate-808 focus:outline-none shadow-sm" placeholder="Dejar vacío si no se cambia" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Correo de Acceso</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-base font-bold text-slate-400 cursor-not-allowed shadow-inner" />
                  </div>
                </div>
                 <div className="flex flex-col gap-3.5 pb-2">
                  <label className="text-sm sm:text-base text-slate-500 font-black uppercase tracking-wider">Imagen de Perfil</label>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Current Preview */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 bg-slate-950/85 border-2 border-[#dfb648] rounded-2xl flex items-center justify-center text-white font-heading font-black text-3xl shadow-md overflow-hidden">
                        {adminPicture ? (
                          <img src={adminPicture} alt="Previsualización de perfil" className="w-full h-full object-cover" />
                        ) : (
                          adminName.charAt(0).toUpperCase()
                        )}
                      </div>
                      {adminPicture && (
                        <button
                          type="button"
                          onClick={() => setAdminPicture("")}
                          className="absolute -top-2.5 -right-2.5 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow transition-all border-0 cursor-pointer flex items-center"
                          title="Quitar imagen"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Drag & Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("profile-file-input").click()}
                      className={`flex-grow w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 min-h-[110px] ${
                        isDragging
                          ? "border-[#dfb648] bg-amber-50/20"
                          : "border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-400"
                      }`}
                    >
                      <input
                        id="profile-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Image className="w-7 h-7 text-slate-400" />
                      <div className="text-center">
                        <span className="text-sm font-bold text-slate-700 block">
                          Arrastra tu imagen de perfil aquí, o <span className="text-cyan-600 underline">haz clic para buscar</span>
                        </span>
                        <span className="text-xs text-slate-450 font-semibold mt-1 block">
                          PNG, JPG, JPEG o WEBP (se guardará localmente)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-3d-green w-fit mt-2 border-0 flex items-center gap-2.5 px-6 py-4.5 rounded-xl text-base font-black shadow-lg">
                  <CheckCircle2 className="w-5 h-5" /> GUARDAR CONFIGURACIÓN
                </button>
              </form>
            </div>
          </div>
        )}

        </main>
      </div>

    </div>
  );
}
