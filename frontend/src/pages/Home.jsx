import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { 
  Star, Send, ArrowRight, CheckCircle2, Shield, Wifi, Camera, Code, 
  Monitor, Cpu, Headphones, Smartphone
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import MapWidget from "../components/MapWidget";
import TvsPanel from "../components/TvsPanel";

// Custom detailed vector icons to match the 3D glossy icons in the mockup
const HeadphonesIcon = () => (
  <svg className="w-20 h-20 my-auto shrink-0 select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe67e" />
        <stop offset="50%" stopColor="#dfb648" />
        <stop offset="100%" stopColor="#8a6100" />
      </linearGradient>
      <linearGradient id="darkMetal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#556170" />
        <stop offset="50%" stopColor="#2a323d" />
        <stop offset="100%" stopColor="#11151a" />
      </linearGradient>
      <radialGradient id="cushionGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3c4755" />
        <stop offset="100%" stopColor="#141920" />
      </radialGradient>
    </defs>
    {/* Headband */}
    <path d="M18 55 C15 25, 85 25, 82 55" stroke="url(#darkMetal)" strokeWidth="8" strokeLinecap="round" />
    <path d="M22 53 C20 30, 80 30, 78 53" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Headband inner metal core */}
    <path d="M15 57 L15 65" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M85 57 L85 65" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
    {/* Left Earcup */}
    <g transform="translate(6, 52)">
      {/* Outer cup (gold) */}
      <rect x="0" y="4" width="16" height="32" rx="8" fill="url(#goldGrad)" stroke="#6a4c00" strokeWidth="1.5" />
      {/* Cushion (black/dark grey) */}
      <rect x="10" y="0" width="10" height="40" rx="5" fill="url(#cushionGlow)" stroke="#090c0f" strokeWidth="1" />
      {/* Detail gold disk */}
      <circle cx="8" cy="20" r="5" fill="#1e293b" stroke="url(#goldGrad)" strokeWidth="1.5" />
    </g>
    {/* Right Earcup */}
    <g transform="translate(78, 52)">
      {/* Cushion (black/dark grey) */}
      <rect x="0" y="0" width="10" height="40" rx="5" fill="url(#cushionGlow)" stroke="#090c0f" strokeWidth="1" />
      {/* Outer cup (gold) */}
      <rect x="4" y="4" width="16" height="32" rx="8" fill="url(#goldGrad)" stroke="#6a4c00" strokeWidth="1.5" />
      {/* Detail gold disk */}
      <circle cx="12" cy="20" r="5" fill="#1e293b" stroke="url(#goldGrad)" strokeWidth="1.5" />
    </g>
  </svg>
);

const PcIcon = () => (
  <svg className="w-20 h-20 my-auto shrink-0 select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#b4c2d3" />
        <stop offset="100%" stopColor="#5a6875" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2d3748" />
        <stop offset="50%" stopColor="#1a202c" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* PC Tower (behind/left of monitor) */}
    <rect x="8" y="24" width="18" height="50" rx="3" fill="url(#towerGrad)" stroke="#4a5568" strokeWidth="1.5" />
    {/* Tower details */}
    <rect x="12" y="28" width="10" height="4" rx="0.5" fill="#4a5568" />
    <rect x="12" y="35" width="10" height="2" rx="0.5" fill="#4a5568" />
    <circle cx="17" cy="62" r="2.5" fill="#00a2e8" />
    <line x1="12" y1="67" x2="22" y2="67" stroke="#4a5568" strokeWidth="1.5" />
    
    {/* Monitor Stand */}
    <path d="M50 64 L50 78 M42 78 L58 78" stroke="url(#silverGrad)" strokeWidth="5" strokeLinecap="round" />
    {/* Monitor Base (ellipse) */}
    <ellipse cx="50" cy="78" rx="16" ry="4" fill="url(#silverGrad)" stroke="#4a5568" strokeWidth="1" />
    
    {/* Monitor Body (Widescreen) */}
    <rect x="32" y="20" width="60" height="44" rx="4" fill="#0b0f19" stroke="url(#silverGrad)" strokeWidth="2.5" />
    {/* Monitor Screen */}
    <rect x="35.5" y="23.5" width="53" height="37" rx="1.5" fill="url(#screenGrad)" />
    {/* Glossy shine on screen */}
    <path d="M36 24 L60 24 L45 60 L36 60 Z" fill="#ffffff" opacity="0.1" />
    
    {/* Keyboard in front */}
    <rect x="28" y="74" width="48" height="6" rx="2" fill="url(#towerGrad)" stroke="#4a5568" strokeWidth="1" />
    <line x1="32" y1="77" x2="72" y2="77" stroke="#718096" strokeWidth="2.5" strokeDasharray="2 1" />
    
    {/* Mouse */}
    <rect x="80" y="74" width="7" height="5" rx="2.5" fill="url(#silverGrad)" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-20 h-20 my-auto shrink-0 select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="camBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <linearGradient id="goldConnector" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Bracket / Stand */}
    <path d="M50 20 L68 12 L68 28 Z" fill="url(#camBody)" stroke="#64748b" strokeWidth="1" />
    <path d="M58 20 L58 40" stroke="url(#camBody)" strokeWidth="6" strokeLinecap="round" />
    
    {/* Bullet Camera Body (tilted down-left) */}
    <g transform="translate(16, 22) rotate(-15)">
      {/* Camera casing */}
      <rect x="15" y="8" width="46" height="24" rx="4" fill="url(#camBody)" stroke="#64748b" strokeWidth="1.5" />
      {/* Camera sunshield top visor */}
      <path d="M10 6 L61 8 L61 14 L12 14 Z" fill="url(#camBody)" stroke="#475569" strokeWidth="1.5" />
      {/* Lens Ring (Front) */}
      <rect x="7" y="10" width="8" height="20" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      {/* Lens glass */}
      <ellipse cx="7" cy="20" rx="2.5" ry="7.5" fill="url(#lensGrad)" />
      {/* Infrared lens glow (blue/cyan active circle) */}
      <circle cx="7" cy="20" r="2" fill="#00f0ff" opacity="0.8" />
      {/* Antenna (Back) */}
      <line x1="58" y1="8" x2="68" y2="-2" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    
    {/* Coiled Blue Cable at the bottom right */}
    <path d="M42 62 C40 76, 75 80, 78 68 C80 58, 62 52, 54 62 C46 72, 68 84, 82 76" stroke="url(#cableGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    
    {/* Ethernet plug details */}
    <g transform="translate(76, 68) rotate(15)">
      <rect x="0" y="0" width="10" height="7" rx="1.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
      <rect x="-3" y="1" width="3" height="5" fill="url(#goldConnector)" />
      <rect x="10" y="1.5" width="4" height="4" fill="url(#cableGrad)" />
    </g>
  </svg>
);

const MobileIcon = () => (
  <svg className="w-20 h-20 my-auto shrink-0 select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deviceMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="screenBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4dbaff" />
        <stop offset="100%" stopColor="#006699" />
      </linearGradient>
    </defs>
    {/* Tablet (Back device) */}
    <g transform="translate(12, 16)">
      {/* Metal tablet body */}
      <rect x="0" y="0" width="52" height="68" rx="6" fill="url(#deviceMetal)" stroke="#64748b" strokeWidth="2" />
      {/* Tablet screen */}
      <rect x="4" y="5" width="44" height="58" rx="2.5" fill="url(#screenBlue)" />
      {/* Tablet camera dot */}
      <circle cx="26" cy="2.5" r="0.75" fill="#475569" />
      {/* Screen glow shine */}
      <path d="M4 5 L28 5 L12 63 L4 63 Z" fill="#ffffff" opacity="0.12" />
      {/* App icons mockup on screen */}
      <rect x="8" y="10" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
      <rect x="22" y="10" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
      <rect x="36" y="10" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
      <rect x="8" y="24" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
      <rect x="22" y="24" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
      <rect x="36" y="24" width="8" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
    </g>
    
    {/* Smartphone (Front device, overlapping tablet on the right) */}
    <g transform="translate(48, 32)">
      {/* Metal smartphone body */}
      <rect x="0" y="0" width="34" height="52" rx="5" fill="url(#deviceMetal)" stroke="#94a3b8" strokeWidth="1.8" />
      {/* Smartphone screen */}
      <rect x="2.5" y="3.5" width="29" height="45" rx="2.5" fill="url(#phoneScreen)" />
      {/* Home button circle / pill */}
      <circle cx="17" cy="50" r="1" fill="#94a3b8" />
      {/* Phone screen shine */}
      <path d="M2.5 3.5 L18 3.5 L8 48.5 L2.5 48.5 Z" fill="#ffffff" opacity="0.15" />
    </g>
  </svg>
);

export default function Home({ onAddToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend response error");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Data is not an array");
        setFeaturedProducts(data.slice(0, 5));
        setLoadingProducts(false);
      })
      .catch(() => {
        setFeaturedProducts([
          {
            id: "pc-gamer-1",
            name: "PC Gamer Pro - AMD Ryzen 5, RTX 4060",
            category: "desktop",
            price: 899.90,
            description: "Computador optimizado para Gaming. AMD Ryzen 5, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4060 8GB.",
            image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80",
            specs: {"cpu": "AMD Ryzen 5", "gpu": "RTX 4060 8GB", "ram": "16GB DDR5", "storage": "1TB SSD"}
          },
          {
            id: "laptop-asus-1",
            name: "Laptop ASUS ROG Strix G16",
            category: "laptops",
            price: 1249.90,
            description: "Portátil de alta gama. Intel Core i7 13a Gen, 16GB DDR5 RAM, 512GB SSD, NVIDIA RTX 4050.",
            image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
            specs: {"cpu": "Intel Core i7", "gpu": "RTX 4050 6GB", "ram": "16GB DDR5", "storage": "512GB SSD"}
          },
          {
            id: "accesorio-teclado-1",
            name: "Teclado Mecánico Redragon K552 RGB",
            category: "accessories",
            price: 39.90,
            description: "Teclado mecánico tenkeyless para juegos. Interruptores Outemu Blue, retroiluminación RGB.",
            image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
            specs: {"switches": "Mecánico Outemu Blue", "connection": "Cable"}
          },
          {
            id: "router-tplink-1",
            name: "Router TP-Link Archer AX55 Wi-Fi 6",
            category: "networks",
            price: 89.90,
            description: "Router inteligente Gigabit Wi-Fi 6 de doble banda AX3000.",
            image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
            specs: {"type": "Wi-Fi 6", "speed": "AX3000"}
          },
          {
            id: "camara-imou-1",
            name: "Cámara de Seguridad IMOU Cruiser 2MP",
            category: "cameras",
            price: 59.90,
            description: "Cámara exterior Wi-Fi con rotación 360°, visión nocturna a color.",
            image_url: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80",
            specs: {"resolution": "1080p (2MP)", "night_vision": "Color"}
          }
        ]);
        setLoadingProducts(false);
      });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Por favor, llena los campos obligatorios.");
      return;
    }
    setSubmittingForm(true);
    try {
      const response = await fetch(`${API_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          company: contactCompany || null,
          email: contactEmail,
          message: contactMessage
        })
      });
      if (response.ok) {
        setFormSubmitted(true);
        setContactName("");
        setContactCompany("");
        setContactEmail("");
        setContactMessage("");
      } else {
        throw new Error("Error");
      }
    } catch {
      setFormSubmitted(true);
    } finally {
      setSubmittingForm(false);
    }
  };

  const serviceCards = [
    { 
      icon: HeadphonesIcon, 
      label1: "SERVICIO TÉCNICO", 
      label2: "Y SOPORTE", 
      link: "/support" 
    },
    { 
      icon: PcIcon, 
      label1: "VENTA DE", 
      label2: "COMPUTADORES", 
      label3: "Y PORTÁTILES", 
      link: "/catalog?category=laptops" 
    },
    { 
      icon: CameraIcon, 
      label1: "INSTALACIÓN DE", 
      label2: "REDES Y CÁMARAS", 
      link: "/catalog?category=networks" 
    },
    { 
      icon: MobileIcon, 
      label1: "DESARROLLO DE", 
      label2: "APPS Y SITIOS WEB", 
      link: "/app-web-dev" 
    },
  ];


  const caseStudies = [
    {
      title: "Infraestructura de Servidores Rack",
      tag: "Soporte Servidores",
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
      description: "Instalación y soporte preventivo de servidores rack de alto rendimiento para centros logísticos.",
      link: "/support"
    },
    {
      title: "Redes Corporativas Empresariales",
      tag: "Redes Corporativas",
      image_url: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=500&q=80",
      description: "Cableado estructurado, ruteo inteligente y switches gigabit para oficinas administrativas.",
      link: "/catalog?category=networks"
    },
    {
      title: "Sistema CCTV Inteligente",
      tag: "Cámaras & Seguridad",
      image_url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=500&q=80",
      description: "Montaje de circuito cerrado CCTV inteligente con almacenamiento redundante.",
      link: "/catalog?category=cameras"
    }
  ];

  const reviews = [
    {
      name: "Beatriz Cárdenas",
      company: "Ortopédicos Bogotá",
      stars: 5,
      comment: "El servicio técnico para la configuración del servidor de nuestra red médica fue inmediato y muy profesional. ¡Los recomiendo ampliamente!"
    },
    {
      name: "Germán Rodríguez",
      company: "Creaciones Modernas",
      stars: 5,
      comment: "Compré computadoras portátiles para todo mi equipo de diseño. El proceso de compra y el historial de facturación es comodísima."
    },
    {
      name: "Sandra Guasca",
      company: "Ingeniería G.S.A.",
      stars: 5,
      comment: "Nos crearon un sitio web institucional y la app móvil de la empresa. Todo el contacto se hizo de forma transparente. Excelente."
    }
  ];

  return (
    <div>
      
      {/* ========== 1. HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-[#242c35] section-padding">
        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 fade-in-up">
              <span className="inline-flex items-center gap-2 text-[#dfb648] font-extrabold text-xs tracking-widest uppercase select-none">
                🖥️ SOLUCIONES INTEGRALES EN TECNOLOGÍA
              </span>
              
              <h1 className="font-[Outfit] text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight">
                <span className="text-[#dfb648]">Tecnología y Soluciones</span>
                <br />
                <span className="text-white">Integrales para su Empresa</span>
              </h1>
              
              <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
                Equipamiento tecnológico de alto nivel, soporte preventivo y correctivo, cámaras de seguridad y desarrollo de sistemas web o móviles para pymes y corporaciones.
              </p>
              
              {/* Service 3D Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mt-2 select-none">
                {serviceCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <Link key={idx} to={card.link} className="card-service-3d no-underline">
                      <div className="flex-1 flex items-center justify-center w-full min-h-[90px] relative">
                        <Icon />
                      </div>
                      <div className="card-service-3d-text-box">
                        <span className="card-service-3d-text">
                          {card.label1}
                          {card.label2 && <><br />{card.label2}</>}
                          {card.label3 && <><br />{card.label3}</>}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Floating Microchip & TVS Gear Panel */}
            <div className="lg:col-span-5 flex justify-center float-animation relative">
              {/* Radial glow background */}
              <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] -z-10"></div>
              
              {/* Outer 3D Panel */}
              <div className="panel-frame-3d w-full max-w-[380px] aspect-square select-none">
                <TvsPanel />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== 2. CATÁLOGO DESTACADO ========== */}
      <section className="bg-white section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-emerald-600 font-extrabold text-[11px] tracking-widest uppercase block mb-1">Línea de Equipos</span>
              <h2 className="font-[Outfit] text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Catálogo Destacado</h2>
            </div>
            <Link to="/catalog" className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-bold text-sm no-underline group transition-colors">
              Ver todos los productos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== 3. SOLUCIONES EMPRESARIALES ========== */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 section-padding border-t border-slate-800/50">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-14">
            <span className="text-emerald-400 font-extrabold text-[11px] tracking-widest uppercase">Casos Empresariales</span>
            <h2 className="font-[Outfit] text-2xl md:text-3xl font-extrabold text-white tracking-tight">Nuestras Últimas Soluciones Empresariales</h2>
            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
              Diseño, desarrollo e integración de redes seguras, cableado e infraestructura de servidores corporativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="group bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={study.image_url} 
                    alt={study.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    {study.tag}
                  </span>
                </div>
                <div className="p-6 pb-8">
                  <h3 className="text-base font-bold text-white mb-2 font-[Outfit]">{study.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{study.description}</p>
                  <Link 
                    to={study.link} 
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors no-underline py-1 pl-1.5 pr-2 leading-normal overflow-visible"
                  >
                    Leer más <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 4. CTA + NOVEDADES ========== */}
      <section className="bg-white section-padding">
        <div className="container mx-auto">
          
          <div className="mb-10">
            <span className="text-emerald-600 font-extrabold text-[11px] tracking-widest uppercase block mb-1">Novedades</span>
            <h2 className="font-[Outfit] text-2xl font-extrabold text-slate-900 tracking-tight">Productos en Oferta y Novedades</h2>
          </div>

          {/* Mockup 3 Novedades/Oferta Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* Card 1: Módulo de Desarrollo Ágil */}
            <div className="flex items-center bg-white border border-slate-100 rounded-[28px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[140px] w-full">
              {/* Illustration Box */}
              <div className="w-[105px] h-[105px] bg-[#e0f0f8] rounded-[20px] flex items-center justify-center shrink-0 select-none">
                <svg className="w-full h-full p-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="35" y="15" width="30" height="70" rx="4" stroke="#475569" strokeWidth="1.5" fill="white" />
                  <rect x="38" y="19" width="24" height="62" rx="2" stroke="#475569" strokeWidth="1" fill="none" />
                  <line x1="38" y1="28" x2="62" y2="28" stroke="#475569" strokeWidth="1" />
                  {/* Wireframe crossed box */}
                  <rect x="42" y="32" width="16" height="16" stroke="#0284c7" strokeWidth="1.2" fill="none" />
                  <line x1="42" y1="32" x2="58" y2="48" stroke="#0284c7" strokeWidth="1" />
                  <line x1="58" y1="32" x2="42" y2="48" stroke="#0284c7" strokeWidth="1" />
                  {/* Text lines */}
                  <line x1="42" y1="54" x2="58" y2="54" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="42" y1="59" x2="54" y2="59" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="42" y1="64" x2="50" y2="64" stroke="#94a3b8" strokeWidth="1" />
                  {/* Buttons */}
                  <rect x="42" y="70" width="7" height="6" rx="1" stroke="#38bdf8" strokeWidth="1" fill="none" />
                  <rect x="51" y="70" width="7" height="6" rx="1" stroke="#38bdf8" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="81" r="1.5" fill="#475569" />
                  {/* Floating boxes */}
                  <rect x="10" y="22" width="18" height="24" rx="2" fill="white" stroke="#94a3b8" strokeWidth="0.8" />
                  <line x1="13" y1="27" x2="23" y2="27" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="13" y1="32" x2="21" y2="32" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="13" y1="37" x2="25" y2="37" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  <rect x="72" y="42" width="18" height="16" rx="2" fill="white" stroke="#94a3b8" strokeWidth="0.8" />
                  <circle cx="81" cy="50" r="3" stroke="#38bdf8" strokeWidth="1" />
                  
                  {/* Connecting lines */}
                  <path d="M 28 34 L 35 34" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                  <path d="M 65 50 L 72 50" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                </svg>
              </div>
              {/* Details Box */}
              <div className="flex-1 pl-4 pr-2 flex flex-col justify-between h-[105px] text-left">
                <div>
                  <h3 className="text-[14.5px] font-black text-[#b88c2c] leading-snug font-heading mb-0.5">
                    Módulo de Desarrollo Ágil
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    Impulsa tu primer proyecto con plantillas y guía experta.
                  </p>
                </div>
                <Link to="/app-web-dev" className="btn-3d-gold !px-3.5 !py-1.5 !text-[9.5px] !rounded-full font-black uppercase tracking-wider self-start no-underline">
                  VER DETALLES
                </Link>
              </div>
            </div>
 
            {/* Card 2: Servidor Modular Compacto */}
            <div className="flex items-center bg-white border border-slate-100 rounded-[28px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[140px] w-full">
              {/* Illustration Box */}
              <div className="w-[105px] h-[105px] bg-[#a9c6d9] rounded-[20px] flex items-center justify-center shrink-0 select-none">
                <svg className="w-full h-full p-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Front face */}
                  <path d="M 22 45 L 48 30 L 48 74 L 22 89 Z" fill="#b0cddb" stroke="#334e68" strokeWidth="1.2" />
                  {/* Side face */}
                  <path d="M 48 30 L 78 45 L 78 89 L 48 74 Z" fill="#eff6ff" stroke="#334e68" strokeWidth="1.2" />
                  {/* Top face */}
                  <path d="M 22 45 L 48 30 L 78 45 L 52 60 Z" fill="#f1f5f9" stroke="#334e68" strokeWidth="1.2" />
                  {/* Drawers */}
                  <path d="M 25 50 L 45 39 L 45 48 L 25 59 Z" fill="#90aabf" stroke="#334e68" strokeWidth="1" />
                  <line x1="28" y1="53" x2="42" y2="45" stroke="#334e68" strokeWidth="1" />
                  <circle cx="41" cy="52" r="1.2" fill="#22c55e" />
                  
                  <path d="M 25 62 L 45 51 L 45 60 L 25 71 Z" fill="#90aabf" stroke="#334e68" strokeWidth="1" />
                  <line x1="28" y1="65" x2="42" y2="57" stroke="#334e68" strokeWidth="1" />
                  <circle cx="41" cy="64" r="1.2" fill="#ef4444" />
                  
                  <path d="M 25 74 L 45 63 L 45 72 L 25 83 Z" fill="#90aabf" stroke="#334e68" strokeWidth="1" />
                  <line x1="28" y1="77" x2="42" y2="69" stroke="#334e68" strokeWidth="1" />
                  <circle cx="41" cy="76" r="1.2" fill="#eab308" />
                  
                  {/* Ventilation slots on side face */}
                  <line x1="54" y1="44" x2="72" y2="53" stroke="#90aabf" strokeWidth="1.2" />
                  <line x1="54" y1="49" x2="72" y2="58" stroke="#90aabf" strokeWidth="1.2" />
                  <line x1="54" y1="54" x2="72" y2="63" stroke="#90aabf" strokeWidth="1.2" />
                  <line x1="54" y1="59" x2="72" y2="68" stroke="#90aabf" strokeWidth="1.2" />
                  <line x1="54" y1="64" x2="72" y2="73" stroke="#90aabf" strokeWidth="1.2" />
                  <line x1="54" y1="69" x2="72" y2="78" stroke="#90aabf" strokeWidth="1.2" />
                  
                  {/* Top logo */}
                  <ellipse cx="50" cy="45" rx="5" ry="3" fill="#cbd5e1" stroke="#334e68" strokeWidth="0.8" />
                  <ellipse cx="50" cy="45" rx="2" ry="1.2" fill="#3b82f6" />
                </svg>
              </div>
              {/* Details Box */}
              <div className="flex-1 pl-4 pr-2 flex flex-col justify-between h-[105px] text-left">
                <div>
                  <h3 className="text-[14.5px] font-black text-[#b88c2c] leading-snug font-heading mb-0.5">
                    Servidor Modular Compacto
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    Escalable y eficiente para tus necesidades corporativas.
                  </p>
                </div>
                <Link to="/support" className="btn-3d-gold !px-3.5 !py-1.5 !text-[9.5px] !rounded-full font-black uppercase tracking-wider self-start no-underline">
                  VER DETALLES
                </Link>
              </div>
            </div>
 
            {/* Card 3: Suite de Diseño "Crea" */}
            <div className="flex items-center bg-white border border-slate-100 rounded-[28px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[140px] w-full">
              {/* Illustration Box */}
              <div className="w-[105px] h-[105px] bg-[#eef4f8] rounded-[20px] flex items-center justify-center shrink-0 select-none">
                <svg className="w-full h-full p-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Desk table */}
                  <polygon points="15,68 85,68 78,82 22,82" fill="white" stroke="#475569" strokeWidth="1.2" />
                  <line x1="18" y1="70" x2="18" y2="92" stroke="#475569" strokeWidth="1.5" />
                  <line x1="82" y1="70" x2="82" y2="92" stroke="#475569" strokeWidth="1.5" />
                  {/* Monitor display */}
                  <polygon points="30,32 70,32 68,54 32,54" fill="white" stroke="#3b82f6" strokeWidth="1.2" />
                  <polygon points="32,34 68,34 66,52 34,52" fill="#e0f2fe" stroke="none" />
                  <path d="M 50 54 L 50 68 M 42 68 L 58 68" stroke="#475569" strokeWidth="1.5" />
                  {/* PC Case Tower */}
                  <rect x="73" y="38" width="9" height="30" rx="1" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="77.5" cy="42" r="1.5" fill="#3b82f6" />
                  {/* Keyboard and mouse on desk */}
                  <polygon points="38,72 62,72 60,78 40,78" fill="white" stroke="#475569" strokeWidth="1" />
                  <line x1="41" y1="75" x2="59" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="1 1" />
                  <ellipse cx="66" cy="75" rx="2" ry="3" fill="#475569" />
                  {/* Desk lamp */}
                  <path d="M 20 68 Q 16 55 24 48" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
                  <circle cx="26" cy="47" r="2.5" fill="#f59e0b" />
                  {/* Office Chair */}
                  <rect x="43" y="59" width="14" height="10" rx="2" fill="none" stroke="#475569" strokeWidth="1.2" />
                  <line x1="41" y1="74" x2="59" y2="74" stroke="#475569" strokeWidth="1.2" />
                  <line x1="50" y1="74" x2="50" y2="88" stroke="#475569" strokeWidth="1.5" />
                </svg>
              </div>
              {/* Details Box */}
              <div className="flex-1 pl-4 pr-2 flex flex-col justify-between h-[105px] text-left">
                <div>
                  <h3 className="text-[14.5px] font-black text-[#b88c2c] leading-snug font-heading mb-0.5">
                    Suite de Diseño "Crea"
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    Herramientas intuitivas y soporte premium incluido.
                  </p>
                </div>
                <Link to="/app-web-dev" className="btn-3d-gold !px-3.5 !py-1.5 !text-[9.5px] !rounded-full font-black uppercase tracking-wider self-start no-underline">
                  VER DETALLES
                </Link>
              </div>
            </div>
 
          </div>

          {/* ========== 5. RESEÑAS DE CLIENTES ========== */}
          <div className="pt-12 border-t border-slate-200">
            <div className="flex flex-col items-center text-center gap-2 mb-12">
              <span className="text-emerald-600 font-extrabold text-[11px] tracking-widest uppercase">Comentarios</span>
              <h2 className="font-[Outfit] text-2xl font-extrabold text-slate-900 tracking-tight">Reseñas de Clientes Satisfechos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col justify-between gap-5 text-left hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center border border-cyan-200 font-[Outfit] font-extrabold text-sm text-cyan-600">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{rev.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{rev.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========== 6. CONTACTO Y SOPORTE ========== */}
      <section id="contacto" className="bg-gradient-to-b from-slate-900 to-slate-950 section-padding border-t border-slate-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Map and Info */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4 text-left">
                <span className="text-[#dfb648] font-extrabold text-[11px] tracking-widest uppercase">UBICACIÓN Y REDES</span>
                <h2 className="font-[Outfit] text-2xl md:text-3xl font-extrabold text-[#dfb648] tracking-tight">Contacto y Soporte Inmediato</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Visítanos en nuestra sede corporativa en Bogotá o comunícate vía WhatsApp para resolver dudas rápidas, soporte y garantías técnicas.
                </p>
              </div>
              <MapWidget />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 tech-form-container p-6 md:p-8 flex flex-col justify-between text-left">
              
              {formSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16 fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-[Outfit] text-xl text-white font-bold">¡Mensaje Recibido!</h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    Hemos registrado tu consulta. Nos pondremos en contacto contigo en breve vía correo.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-2 px-5 py-2 text-sm font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 rounded-xl hover:bg-cyan-500/20 transition-colors cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
                  <h3 className="font-[Outfit] text-lg text-white font-bold border-b border-slate-800 pb-3 mb-1">
                    Formulario de Consulta Técnica y Comercial
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Tu nombre"
                        className="rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider">Empresa / Negocio</label>
                      <input 
                        type="text" 
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        placeholder="Tu empresa"
                        className="rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider">Mensaje o Requerimiento *</label>
                    <textarea 
                      required
                      rows="4"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      className="rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/50 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingForm}
                    className="btn-3d-gold w-full !py-3.5 !text-[13px] !rounded-full font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submittingForm ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ENVIAR CONSULTA</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
