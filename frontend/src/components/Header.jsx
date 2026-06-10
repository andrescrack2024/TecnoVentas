import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";

export default function Header({ cartCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "INICIO" },
    { path: "/catalog", label: "PRODUCTOS" },
    { path: "/support", label: "SOPORTE" },
    { path: "/app-web-dev", label: "PROYECTOS" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-transparent">
      <div className="container mx-auto bg-[#333b47]/80 backdrop-blur-xl border border-slate-600/40 rounded-full px-4 lg:px-6 shadow-2xl">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group no-underline shrink-0">
            <div className="relative shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Monitor stand */}
                <path d="M26 50 L38 50 M32 42 L32 50" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 53 L44 53" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                {/* Monitor body */}
                <rect x="6" y="12" width="52" height="32" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
                {/* Screen board (Green CPU chip) */}
                <rect x="12" y="18" width="16" height="16" rx="2" fill="#1b4314" stroke="#8ec540" strokeWidth="1.5" />
                {/* CPU core */}
                <rect x="17" y="23" width="6" height="6" rx="1" fill="#ffc72c" />
                {/* Connections */}
                <path d="M20 18 v-2 M20 34 v2 M12 26 h-2 M28 26 h2" stroke="#8ec540" strokeWidth="1.5" strokeLinecap="round" />
                {/* Gear with TVS (Top Right overlay) */}
                <g transform="translate(36, 6)">
                  {/* Blue Gear Body */}
                  <path d="M16 4.5l1.5 2.5 2.9-.8.5 2.9 2.5 1.5-1.5 2.5 1.5 2.5 2.5-1.5.5 2.9-2.9-.8-1.5 2.5H16l-1.5-2.5-2.9.8-.5-2.9-2.5-1.5 1.5-2.5-1.5-2.5-2.5 1.5-.5-2.9 2.9.8L16 4.5z" fill="#0284c7" stroke="#00a2e8" strokeWidth="1" />
                  <circle cx="16" cy="16" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  {/* Gear center */}
                  <circle cx="16" cy="16" r="6" fill="#0284c7" />
                  {/* TVS text */}
                  <text x="16" y="19.5" fill="white" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="Outfit, sans-serif" letterSpacing="-0.5">TVS</text>
                </g>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-[Outfit] font-extrabold text-base lg:text-lg tracking-normal text-[#dfb648] group-hover:text-amber-400 transition-colors leading-none">
                TecnoVentas
              </span>
              <span className="text-[9px] text-slate-300 font-bold tracking-wide leading-none mt-0.5">
                Y SERVICIOS S.A.S.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative px-4 py-2 text-[13px] font-bold tracking-wide no-underline transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-[#dfb648]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a 
              href="#contacto" 
              className="px-4 py-2 text-[13px] font-bold tracking-wide text-slate-300 hover:text-white no-underline transition-all duration-200"
            >
              CONTACTO
            </a>
          </nav>

          {/* Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Shopping Cart */}
            <Link 
              to="/cart" 
              className="relative p-2.5 text-white hover:text-[#dfb648] bg-[#4e5a6a]/25 border border-slate-600/30 rounded-xl transition-all duration-200 no-underline"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-[9px] min-w-[18px] h-4.5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Pill with Avatar and Name */}
                <div className="flex items-center gap-2 bg-[#d1d8e0]/90 border border-slate-400/40 rounded-full pl-1 pr-3.5 py-1 select-none">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-6.5 h-6.5 rounded-full object-cover border border-slate-400/30" />
                  ) : (
                    <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-[#dfb648] to-[#b88c2b] text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[11.5px] font-bold text-slate-800 tracking-wide">
                    {user.name}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="text-slate-300 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer flex items-center p-1"
                  title="Cerrar Sesión"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/40 text-white hover:text-[#dfb648] hover:border-slate-500 font-bold text-xs tracking-wide rounded-xl transition-all duration-200 no-underline"
              >
                <User className="w-4 h-4" />
                <span>INGRESAR</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link 
              to="/cart" 
              className="relative p-2 text-white hover:text-[#dfb648] bg-slate-800/80 border border-slate-700/50 rounded-xl no-underline"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/50 rounded-xl transition-all bg-transparent border-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="container mx-auto mt-2 bg-slate-900/90 border border-slate-800 rounded-xl py-3 px-5 flex flex-col gap-1 shadow-2xl">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-4 rounded-lg font-semibold text-sm no-underline transition-all ${
                isActive(link.path)
                  ? "text-[#dfb648] bg-slate-800"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a 
            href="#contacto" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 px-4 rounded-lg text-slate-300 hover:text-white font-semibold text-sm no-underline transition-all"
          >
            CONTACTO
          </a>
          
          <hr className="border-slate-800 my-2" />
          
          {user ? (
            <div className="flex flex-col gap-2 py-1">
              <Link 
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-4 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 no-underline"
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#dfb648] to-[#b88c2b] text-white font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>Mi Panel ({user.name})</span>
              </Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 py-2.5 px-4 text-red-400 bg-transparent border-0 cursor-pointer font-semibold text-left text-sm rounded-lg hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/80 border border-slate-700/50 text-white font-bold text-sm rounded-lg no-underline mt-1"
            >
              <User className="w-4 h-4" />
              <span>INGRESAR</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
