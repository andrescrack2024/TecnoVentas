import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function AdminLogin() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Lista de correos autorizados como admin
  const ADMIN_EMAILS = ["admin@tecnoventas.com", "admin@ecotur.com"];

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validar que sea un correo administrativo
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      setError("Acceso denegado. Este portal es exclusivo para personal administrativo autorizado.");
      setLoading(false);
      return;
    }

    try {
      // 2. Intentar login
      await loginWithEmail(cleanEmail, password);
      
      // Mostrar éxito brevemente antes de redirigir
      setAuthorized(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const prefillAdmin = () => {
    setEmail("admin@tecnoventas.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-sans"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a222d 50%, #0c1017 100%)"
      }}
    >
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#dfb648]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className="flex items-center gap-3 no-underline group mb-4">
            <svg className="w-14 h-14 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26 50 L38 50 M32 42 L32 50" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <path d="M20 53 L44 53" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <rect x="6" y="12" width="52" height="32" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
              <rect x="12" y="18" width="16" height="16" rx="2" fill="#1b4314" stroke="#8ec540" strokeWidth="1.5" />
              <rect x="17" y="23" width="6" height="6" rx="1" fill="#ffc72c" />
              <path d="M20 18 v-2 M20 34 v2 M12 26 h-2 M28 26 h2" stroke="#8ec540" strokeWidth="1.5" strokeLinecap="round" />
              <g transform="translate(36, 6)">
                <path d="M16 4.5l1.5 2.5 2.9-.8.5 2.9 2.5 1.5-1.5 2.5 1.5 2.5 2.5-1.5.5 2.9-2.9-.8-1.5 2.5H16l-1.5-2.5-2.9.8-.5-2.9-2.5-1.5 1.5-2.5-1.5-2.5-2.5 1.5-.5-2.9 2.9.8L16 4.5z" fill="#0284c7" stroke="#00a2e8" strokeWidth="1" />
                <circle cx="16" cy="16" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="16" cy="16" r="6" fill="#0284c7" />
                <text x="16" y="19.5" fill="white" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="Outfit, sans-serif" letterSpacing="-0.5">TVS</text>
              </g>
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-[Outfit] font-extrabold text-xl tracking-normal text-[#dfb648] group-hover:text-amber-400 transition-colors leading-none">
                TecnoVentas
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wide leading-none mt-1">
                PORTAL ADMINISTRATIVO
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/60 rounded-[32px] p-8 shadow-2xl relative">
          
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-xl font-[Outfit] font-black text-white uppercase tracking-wider text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#dfb648]" />
              Acceso Administrativo
            </h2>
            <p className="text-xs text-slate-400 font-medium text-center">
              Ingresa tus credenciales autorizadas de TecnoVentas
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs py-3 px-4 rounded-2xl mb-5 flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {authorized && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs py-3.5 px-4 rounded-2xl mb-5 flex items-center gap-2.5 font-bold uppercase tracking-wider">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Acceso concedido. Redirigiendo...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            
            {/* Email input */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">Correo Administrativo</label>
              <div className="relative flex items-center">
                <Mail 
                  className="w-5 h-5 text-slate-500 absolute pointer-events-none"
                  style={{ left: "18px" }}
                />
                <input
                  type="email"
                  required
                  disabled={loading || authorized}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tecnoventas.com"
                  className="w-full h-[52px] rounded-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/40 border-0 transition-all"
                  style={{ paddingLeft: "3.25rem", paddingRight: "1.5rem" }}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">Contraseña</label>
              <div className="relative flex items-center">
                <Lock 
                  className="w-5 h-5 text-slate-500 absolute pointer-events-none"
                  style={{ left: "18px" }}
                />
                <input
                  type="password"
                  required
                  disabled={loading || authorized}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[52px] rounded-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#dfb648]/40 border-0 transition-all"
                  style={{ paddingLeft: "3.25rem", paddingRight: "1.5rem" }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || authorized}
              className="btn-3d-gold h-[52px] rounded-full text-xs font-black uppercase tracking-widest border-0 cursor-pointer flex items-center justify-center gap-2 mt-2 w-full"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-[#1a222d] border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <span>INGRESAR AL PANEL</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Mock Prefill */}
          <div 
            onClick={prefillAdmin}
            className="mt-6 bg-[#131b26]/50 border border-slate-700/40 rounded-2xl p-3 text-center cursor-pointer hover:bg-[#131b26]/80 hover:border-slate-600/60 transition-all"
          >
            <span className="text-[10.5px] font-bold text-slate-400 block">
              💻 Modo Desarrollo: <span className="text-[#dfb648] underline">Autocompletar credenciales de prueba</span>
            </span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-xs font-bold text-[#dfb648] hover:text-white transition-colors no-underline uppercase tracking-wider"
          >
            ← Volver al sitio principal
          </Link>
        </div>

      </div>
    </div>
  );
}
