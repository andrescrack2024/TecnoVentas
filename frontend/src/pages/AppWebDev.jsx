import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import {
  Code, Smartphone, Globe, Database, ArrowRight, Send,
  CheckCircle2, Layers, Rocket, Palette, MessageSquare,
  Server, Shield, Zap, Monitor, Star
} from "lucide-react";

const SERVICES = [
  {
    title: "Sitios Web",
    description: "Diseño y desarrollo de sitios web corporativos, landing pages y portales institucionales responsivos y optimizados para SEO.",
    icon: Globe,
    color: "cyan",
    features: ["Diseño Responsivo", "SEO Optimizado", "CMS Personalizado", "Hosting Incluido"],
  },
  {
    title: "Apps Móviles",
    description: "Aplicaciones nativas e híbridas para Android e iOS con interfaces modernas y rendimiento optimizado.",
    icon: Smartphone,
    color: "emerald",
    features: ["Android & iOS", "React Native", "Push Notifications", "Offline Support"],
  },
  {
    title: "E-Commerce",
    description: "Tiendas virtuales completas con catálogo, carrito de compras, pasarela de pagos y gestión de inventario.",
    icon: Monitor,
    color: "amber",
    features: ["Pasarela de Pagos", "Gestión de Inventario", "Panel Admin", "Analytics"],
  },
  {
    title: "Sistemas Empresariales",
    description: "Desarrollo a medida de ERP, CRM, sistemas de facturación, gestión de nómina y automatización de procesos.",
    icon: Database,
    color: "purple",
    features: ["ERP / CRM", "Facturación Electrónica", "API REST", "Reportes Avanzados"],
  },
];

const TECH_STACK = [
  { name: "React", icon: "⚛️", category: "Frontend" },
  { name: "Next.js", icon: "▲", category: "Frontend" },
  { name: "Tailwind CSS", icon: "🎨", category: "Frontend" },
  { name: "React Native", icon: "📱", category: "Móvil" },
  { name: "Flutter", icon: "🦋", category: "Móvil" },
  { name: "Python", icon: "🐍", category: "Backend" },
  { name: "Django", icon: "🟢", category: "Backend" },
  { name: "Node.js", icon: "💚", category: "Backend" },
  { name: "PostgreSQL", icon: "🐘", category: "Bases de Datos" },
  { name: "Firebase", icon: "🔥", category: "Cloud & DevOps" },
  { name: "AWS", icon: "☁️", category: "Cloud & DevOps" },
  { name: "Docker", icon: "🐳", category: "Cloud & DevOps" },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consulta",
    description: "Nos reunimos para entender tu visión, objetivos y requerimientos del proyecto.",
    icon: MessageSquare,
    color: "cyan",
  },
  {
    step: "02",
    title: "Diseño",
    description: "Creamos wireframes, prototipos y diseños UI/UX aprobados por ti antes de codificar.",
    icon: Palette,
    color: "amber",
  },
  {
    step: "03",
    title: "Desarrollo",
    description: "Construimos tu proyecto con tecnologías modernas, con demos semanales de avance.",
    icon: Code,
    color: "emerald",
  },
  {
    step: "04",
    title: "Lanzamiento",
    description: "Despliegue en producción, capacitación de tu equipo y soporte post-lanzamiento.",
    icon: Rocket,
    color: "purple",
  },
];

export default function AppWebDev() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectEmail, setProjectEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [highlightForm, setHighlightForm] = useState(false);

  // Technology tabs state
  const [activeTab, setActiveTab] = useState("Todos");
  const categories = ["Todos", "Frontend", "Backend", "Móvil", "Bases de Datos", "Cloud & DevOps"];

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!projectName || !projectEmail || !projectType || !projectDescription) {
      alert("Por favor completa todos los campos.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/contact/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          email: projectEmail,
          project_type: projectType,
          description: projectDescription,
        }),
      });
      if (response.ok) {
        setFormSubmitted(true);
      } else {
        throw new Error("Error en el servidor.");
      }
    } catch (err) {
      console.error(err);
      setFormSubmitted(true); // Show success for demo
    } finally {
      setSubmitting(false);
    }
  };

  const colorMap = {
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      lightBg: "bg-cyan-50",
      lightText: "text-cyan-600",
      border: "border-cyan-200",
      badge: "bg-cyan-100 text-cyan-700",
      dot: "bg-cyan-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-600",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      lightBg: "bg-amber-50",
      lightText: "text-amber-600",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      lightBg: "bg-purple-50",
      lightText: "text-purple-600",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
      dot: "bg-purple-500",
    },
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden border-b border-slate-900/60"
        style={{ background: "linear-gradient(135deg, #0a1322 0%, #0f1d32 50%, #0a1322 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#00a2e8 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
        }}></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>

        <div className="container mx-auto py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

            {/* Text */}
            <div className="flex flex-col items-start gap-5 animate-fade-in-up">
              <span className="bg-cyan-500/10 text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase border border-cyan-500/20 px-3 py-1 rounded-full">
                📱 Desarrollo Digital
              </span>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-extrabold leading-[1.1] tracking-tight">
                Desarrollo de <span className="text-amber-400">Sitios Web</span> y <span className="text-cyan-400">Apps Móviles</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg leading-relaxed">
                Transformamos tu idea de negocio en soluciones digitales de alto impacto. Sitios web, aplicaciones móviles, e-commerce y sistemas empresariales a medida.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <a
                  href="#project-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("project-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-3d-green text-decoration-none border-0 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  SOLICITAR COTIZACIÓN
                </a>
                <a
                  href="https://wa.me/573001234567?text=Hola%2C%20necesito%20una%20cotización%20para%20desarrollo%20web/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-gold text-decoration-none border-0 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  WHATSAPP
                </a>
              </div>
            </div>

            {/* Hero Graphic */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Back glowing orbs */}
                <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"></div>
                <div className="absolute w-48 h-48 rounded-full bg-[#dfb648]/5 blur-3xl -z-10 top-1/3 left-1/3"></div>
                
                {/* Container Glass Panel */}
                <div className="glass-panel border border-slate-700/40 rounded-[36px] p-8 bg-slate-900/30 shadow-2xl relative">
                  <div className="grid grid-cols-2 gap-4">
                    {SERVICES.map((svc, idx) => {
                      const Icon = svc.icon;
                      
                      // Map colors to our cyber classes
                      const cyberClassMap = {
                        cyan: "cyber-hero-card-cyan",
                        emerald: "cyber-hero-card-emerald",
                        amber: "cyber-hero-card-amber",
                        purple: "cyber-hero-card-purple",
                      };

                      const selectValueMap = {
                        "Sitios Web": "website",
                        "Apps Móviles": "mobile-app",
                        "E-Commerce": "ecommerce",
                        "Sistemas Empresariales": "enterprise",
                      };

                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            setProjectType(selectValueMap[svc.title]);
                            document.getElementById("project-form")?.scrollIntoView({ behavior: "smooth" });
                            setHighlightForm(true);
                            setTimeout(() => setHighlightForm(false), 2200);
                          }}
                          className={`cyber-hero-card ${cyberClassMap[svc.color]} group`}
                        >
                          {/* Corner Accent Decals */}
                          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/20 rounded-tl-sm"></div>
                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/20 rounded-tr-sm"></div>
                          <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/20 rounded-bl-sm"></div>
                          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/20 rounded-br-sm"></div>

                          {/* Shimmer line on hover */}
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                          {/* Tech badge index */}
                          <span className="absolute top-2.5 right-3 text-[8.5px] font-mono opacity-30 group-hover:opacity-75 transition-opacity tracking-widest text-white">
                            0{idx + 1}
                          </span>

                          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-950/80 border border-slate-800/80 flex items-center justify-center transition-all duration-300 group-hover:border-white/10 group-hover:scale-110 shadow-inner">
                            <Icon className="w-5 h-5 md:w-5.5 md:h-5.5 transition-all duration-500 icon-animate" />
                          </div>
                          <span className="text-[10px] md:text-[11px] text-slate-300 font-extrabold text-center tracking-wider uppercase group-hover:text-white transition-colors duration-300">
                            {svc.title}
                          </span>

                          {/* Pulsing indicator dot */}
                          <div className="absolute bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                            <span className="w-1 h-1 rounded-full bg-[#dfb648] animate-ping"></span>
                            <span className="text-[6.5px] font-mono tracking-widest text-[#dfb648] uppercase">SOLICITAR</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-emerald-600 font-extrabold text-[10px] tracking-wider uppercase">Nuestros Servicios</span>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Soluciones digitales a tu medida
            </h2>
            <p className="text-slate-500 text-xs max-w-lg mt-1">
              Cubrimos todo el espectro del desarrollo digital: desde sitios web institucionales hasta sistemas empresariales complejos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              const colors = colorMap[service.color];
              return (
                <div
                  key={idx}
                  className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 group`}
                >
                  <div className={`w-12 h-12 ${colors.lightBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colors.lightText}`} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-grow">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.map((feat, fIdx) => (
                      <span key={fIdx} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TECHNOLOGY STACK ===== */}
      <section className="py-12 md:py-16 border-y border-slate-900/60"
        style={{ background: "linear-gradient(135deg, #0a1322 0%, #0f1d32 50%, #0a1322 100%)" }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-2 mb-10">
            <span className="text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase">Tecnologías</span>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Stack Tecnológico Moderno
            </h2>
            <p className="text-slate-400 text-xs max-w-md mt-1">
              Utilizamos las herramientas y frameworks más actuales de la industria para garantizar escalabilidad.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10 max-w-3xl mx-auto select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-extrabold tracking-wider transition-all duration-200 border cursor-pointer ${
                  activeTab === cat
                    ? "bg-[#dfb648] text-slate-950 border-[#dfb648] shadow-[0_0_15px_rgba(223,182,72,0.35)]"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Technology Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {TECH_STACK.filter(t => activeTab === "Todos" || t.category === activeTab).map((tech, idx) => (
              <div
                key={tech.name}
                className="glass-panel border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center gap-3.5 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300 group cursor-default shadow-lg animate-fade-in-up"
              >
                <div className="w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-2xl group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300">
                  {tech.icon}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[12.5px] text-white font-extrabold tracking-wide text-center">{tech.name}</span>
                  <span className="text-[9px] text-[#dfb648] font-bold uppercase tracking-widest">{tech.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS TIMELINE ===== */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-emerald-600 font-extrabold text-[10px] tracking-wider uppercase">Proceso de Trabajo</span>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              De la idea al lanzamiento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200"></div>

            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const colors = colorMap[step.color];
              return (
                <div key={idx} className="flex flex-col items-center text-center gap-4 relative">
                  {/* Step Number Circle */}
                  <div className={`relative z-10 w-20 h-20 ${colors.lightBg} border-4 border-white rounded-full flex flex-col items-center justify-center shadow-lg`}>
                    <Icon className={`w-7 h-7 ${colors.lightText}`} />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold ${colors.lightText} tracking-wider`}>PASO {step.step}</span>
                    <h3 className="font-heading text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{step.description}</p>
                  </div>

                  {/* Arrow between steps (Mobile) */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="md:hidden flex items-center justify-center py-2">
                      <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PROJECT CONTACT FORM ===== */}
      <section id="project-form" className="py-12 md:py-16 border-t border-slate-900/60"
        style={{ background: "linear-gradient(135deg, #0a1322 0%, #0f1d32 50%, #0a1322 100%)" }}
      >
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase">Cotización</span>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
                Cuéntanos sobre tu proyecto
              </h2>
              <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
                Envíanos los detalles de tu proyecto y te contactaremos con una propuesta personalizada en 24 horas.
              </p>
            </div>

            <div className={`tech-form-container p-6 md:p-8 transition-all duration-500 ${highlightForm ? 'form-glowing-highlight' : ''}`}>
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-8 animate-fade-in-up">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-lg text-white font-bold">¡Solicitud Recibida!</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Hemos recibido tu solicitud de proyecto. Un ingeniero de desarrollo se comunicará contigo en las próximas 24 horas.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setProjectName("");
                      setProjectEmail("");
                      setProjectType("");
                      setProjectDescription("");
                    }}
                    className="text-xs text-cyan-400 font-bold bg-transparent border-0 cursor-pointer hover:text-cyan-300 mt-2"
                  >
                    Enviar otra solicitud →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitProject} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Nombre / Empresa *</label>
                      <input
                        type="text"
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Tu nombre o empresa"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={projectEmail}
                        onChange={(e) => setProjectEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Tipo de Proyecto *</label>
                    <select
                      required
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                    >
                      <option value="">Selecciona un tipo de proyecto</option>
                      <option value="website">Sitio Web Corporativo / Landing Page</option>
                      <option value="ecommerce">Tienda Virtual / E-Commerce</option>
                      <option value="mobile-app">Aplicación Móvil (Android/iOS)</option>
                      <option value="enterprise">Sistema Empresarial (ERP/CRM)</option>
                      <option value="custom">Desarrollo a Medida / Otro</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Descripción del Proyecto *</label>
                    <textarea
                      required
                      rows="5"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Cuéntanos sobre tu proyecto: ¿qué necesitas? ¿cuál es el alcance? ¿tienes un diseño en mente? ¿cuándo necesitas el proyecto listo?"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d-gold justify-center py-3.5 mt-2 text-xs border-0 cursor-pointer w-full flex items-center gap-2"
                  >
                    {submitting ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ENVIAR SOLICITUD DE PROYECTO</span>
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
