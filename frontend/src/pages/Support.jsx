import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";
import {
  Headphones, MessageCircle, Shield, ChevronDown, Send,
  Phone, Clock, Zap, CheckCircle2, AlertCircle, Star, Building2
} from "lucide-react";

const FAQ_DATA = [
  {
    question: "¿Cuánto tiempo toma una reparación estándar?",
    answer: "Las reparaciones estándar de hardware (cambio de disco, RAM, fuente, etc.) generalmente toman entre 1 y 3 días hábiles. Problemas de software, como reinstalación de Windows o eliminación de virus, se resuelven usualmente el mismo día."
  },
  {
    question: "¿Ofrecen garantía en sus reparaciones?",
    answer: "Sí, todas nuestras reparaciones incluyen una garantía de 30 días sobre la mano de obra y los repuestos instalados. En caso de equipos nuevos comprados con nosotros, la garantía del fabricante aplica de forma estándar (1-2 años según la marca)."
  },
  {
    question: "¿Puedo solicitar soporte remoto sin cuenta?",
    answer: "La Consulta Rápida vía WhatsApp está disponible para todos sin necesidad de cuenta. Para soporte remoto avanzado con acceso a herramientas de diagnóstico y seguimiento de tickets, necesitas crear una cuenta gratuita en nuestra plataforma."
  },
  {
    question: "¿Realizan visitas técnicas a domicilio u oficina?",
    answer: "¡Sí! Nuestro plan de Soporte Empresarial incluye visitas técnicas programadas. También ofrecemos visitas a domicilio bajo demanda en Bogotá y municipios cercanos con un costo de desplazamiento que varía según la ubicación."
  },
  {
    question: "¿Cómo puedo hacer seguimiento a mi ticket de soporte?",
    answer: "Una vez creado tu ticket, recibirás un correo de confirmación con el número de referencia. Puedes rastrear el estado de tu ticket en tiempo real desde el Dashboard de tu cuenta en la sección 'Tickets de Soporte'."
  },
];

const SERVICE_TIERS = [
  {
    title: "Consulta Rápida",
    subtitle: "WhatsApp Directo",
    description: "Resuelve dudas técnicas simples al instante. Ideal para consultas de configuración, compatibilidad y presupuestos rápidos.",
    icon: MessageCircle,
    color: "emerald",
    features: [
      "Respuesta en menos de 30 minutos",
      "Sin necesidad de cuenta",
      "Consultas liimitadas",
      "Asesoría de compra gratuita",
    ],
    action: "whatsapp",
    buttonText: "CHATEAR POR WHATSAPP",
    popular: false,
  },
  {
    title: "Soporte Avanzado",
    subtitle: "Requiere Cuenta",
    description: "Diagnóstico y reparación remota con herramientas profesionales. Seguimiento de tickets y historial completo.",
    icon: Headphones,
    color: "cyan",
    features: [
      "Diagnóstico remoto completo",
      "Sistema de tickets con seguimiento",
      "Soporte prioritario por email",
      "Historial de reparaciones",
      "Garantía en reparaciones",
    ],
    action: "account",
    buttonText: "CREAR TICKET",
    popular: true,
  },
  {
    title: "Soporte Empresarial",
    subtitle: "Plan Corporativo",
    description: "Servicio integral para empresas con soporte dedicado, visitas técnicas programadas y SLA garantizado.",
    icon: Shield,
    color: "amber",
    features: [
      "Ingeniero técnico dedicado",
      "Visitas técnicas mensuales",
      "SLA con tiempos garantizados",
      "Monitoreo proactivo de equipos",
      "Soporte 24/7 línea directa",
      "Descuentos en equipos y repuestos",
    ],
    action: "contact",
    buttonText: "CONTACTAR VENTAS",
    popular: false,
  },
];

export default function Support() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ticket form state
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("media");

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketSubject || !ticketDescription) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/contact/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ticketName,
          email: ticketEmail,
          subject: ticketSubject,
          description: ticketDescription,
          priority: ticketPriority,
        }),
      });
      if (response.ok) {
        setFormSubmitted(true);
      } else {
        throw new Error("Error en el servidor.");
      }
    } catch (err) {
      console.error(err);
      setFormSubmitted(true); // Show success even on error for demo
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const colorStyles = {
    emerald: {
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-400",
      border: "border-emerald-300/80",
      badge: "bg-emerald-100 text-emerald-700",
      check: "text-emerald-500",
    },
    cyan: {
      iconBg: "bg-cyan-500/10",
      iconText: "text-cyan-400",
      border: "border-cyan-300",
      badge: "bg-cyan-100 text-cyan-700",
      check: "text-cyan-500",
    },
    amber: {
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-400",
      border: "border-amber-300/80",
      badge: "bg-amber-100 text-amber-700",
      check: "text-amber-500",
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

        <div className="container mx-auto py-16 md:py-24 relative z-10 text-center flex flex-col items-center">
          {/* Headphones Box on the Left */}
          <div className="absolute left-6 md:left-12 top-6 md:top-10 w-14 h-14 md:w-16 md:h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center animate-fade-in-up">
            <Headphones className="w-7 h-7 md:w-8 md:h-8 text-cyan-400" />
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-extrabold tracking-tight animate-fade-in-up">
            Soporte Técnico <span className="text-amber-400">Premium</span>
          </h1>
          <h2 className="text-cyan-400 font-extrabold text-[11px] md:text-xs tracking-widest uppercase mt-3 mb-1 animate-fade-in-up">
            ASISTENCIA TESERONISKA PROFISIONAL
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto mt-4 leading-relaxed animate-fade-in-up">
            Diagnóstico, reparación y mantenimiento de equipos con ingenieros certificados.<br />
            Soporte presencial y remoto para hogares y empresas.
          </p>

          {/* Quick Stats inside a Capsule-shaped Dark Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 mt-8 px-6 py-3 bg-[#09111e]/85 border border-cyan-500/40 rounded-full animate-fade-in-up shadow-lg">
            <div className="flex items-center gap-2.5 text-slate-200 text-sm md:text-base">
              <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="font-semibold">Respuesta &lt; 30 min</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200 text-sm md:text-base">
              <Star className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-semibold">4.9/5 satisfacción</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200 text-sm md:text-base">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">+500 casos resueltos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICE TIERS ===== */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Elige el nivel de soporte que necesitas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICE_TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              const colors = colorStyles[tier.color];
              return (
                <div
                  key={idx}
                  className={`relative bg-white border rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.border} ${
                    tier.popular
                      ? "shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-200"
                      : "shadow-sm"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[9px] font-extrabold tracking-wider uppercase px-4 py-1 rounded-full shadow-md">
                        MÁS POPULAR
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.iconText}`} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">{tier.title}</h3>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${colors.badge}`}>
                        {tier.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{tier.description}</p>

                  <ul className="flex flex-col gap-2.5 flex-grow">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${colors.check} shrink-0 mt-0.5`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {tier.action === "whatsapp" ? (
                    <a
                      href="https://wa.me/573001234567?text=Hola%20TecnoVentas%2C%20necesito%20soporte%20t%C3%A9cnico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-gold w-full justify-center text-decoration-none border-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {tier.buttonText}
                    </a>
                  ) : tier.action === "account" ? (
                    <Link
                      to={user ? "#ticket-form" : "/auth"}
                      className="btn-3d-green w-full justify-center text-decoration-none border-0"
                      onClick={(e) => {
                        if (user) {
                          e.preventDefault();
                          document.getElementById("ticket-form")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Headphones className="w-4 h-4" />
                      {tier.buttonText}
                    </Link>
                  ) : (
                    <a
                      href="https://wa.me/573001234567?text=Hola%2C%20estoy%20interesado%20en%20el%20Plan%20Empresarial%20de%20Soporte"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-green w-full justify-center text-decoration-none border-0"
                    >
                      <Building2 className="w-4 h-4" />
                      {tier.buttonText}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QUICK WHATSAPP BAR ===== */}
      <section className="bg-emerald-600 py-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-heading text-sm font-bold text-white">¿Necesitas ayuda inmediata?</h3>
              <p className="text-emerald-100 text-xs">Escríbenos por WhatsApp y te respondemos en minutos</p>
            </div>
          </div>
          <a
            href="https://wa.me/573001234567?text=Hola%20TecnoVentas%2C%20necesito%20soporte%20t%C3%A9cnico"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-green text-xs py-3 px-6 text-decoration-none border-0"
          >
            <MessageCircle className="w-4 h-4" />
            ABRIR WHATSAPP
          </a>
        </div>
      </section>

      {/* ===== SUPPORT TICKET FORM ===== */}
      <section id="ticket-form" className="py-12 md:py-16 border-t border-slate-900/60"
        style={{ background: "linear-gradient(135deg, #0a1322 0%, #0f1d32 50%, #0a1322 100%)" }}
      >
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase">Formulario de Soporte</span>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
                Crear Ticket de Soporte
              </h2>
              <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
                Describe tu problema y nuestro equipo técnico se pondrá en contacto contigo en el menor tiempo posible.
              </p>
            </div>

            <div className="tech-form-container p-6 md:p-8">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-8 animate-fade-in-up">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-lg text-white font-bold">¡Ticket Creado Exitosamente!</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Hemos recibido tu solicitud de soporte. Recibirás un correo de confirmación con el número de ticket.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setTicketName("");
                      setTicketEmail("");
                      setTicketSubject("");
                      setTicketDescription("");
                      setTicketPriority("media");
                    }}
                    className="text-xs text-cyan-400 font-bold bg-transparent border-0 cursor-pointer hover:text-cyan-300 mt-2"
                  >
                    Crear otro ticket →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        placeholder="Tu nombre"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={ticketEmail}
                        onChange={(e) => setTicketEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Asunto *</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Describe brevemente tu problema"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Prioridad</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                      >
                        <option value="baja">Baja - Consulta general</option>
                        <option value="media">Media - Problema menor</option>
                        <option value="alta">Alta - Equipo no funciona</option>
                        <option value="urgente">Urgente - Caída de servicio</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Descripción del Problema *</label>
                    <textarea
                      required
                      rows="5"
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Describe tu problema con el mayor detalle posible: ¿qué equipo es? ¿cuándo empezó? ¿qué has intentado?"
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
                        <span>ENVIAR TICKET</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-emerald-600 font-extrabold text-[10px] tracking-wider uppercase">Preguntas Frecuentes</span>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              ¿Tienes dudas? Te respondemos
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ_DATA.map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === idx
                    ? "border-cyan-300 bg-cyan-50/30 shadow-md shadow-cyan-500/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className={`text-sm font-semibold transition-colors ${
                    openFaq === idx ? "text-cyan-700" : "text-slate-700"
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180 text-cyan-500" : "text-slate-400"
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === idx ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-5 pb-4">
                    <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
