import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

// Custom SVG Brand Icons since they are not in this version of lucide-react
const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" fill="currentColor" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const Youtube = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const servicios = [
    { label: 'Soporte Técnico', to: '/support' },
    { label: 'Instalación de Cámaras', to: '/catalog?category=cameras' },
    { label: 'Desarrollo Web', to: '/app-web-dev' },
    { label: 'Apps Móviles', to: '/app-web-dev' },
  ];

  const productos = [
    { label: 'PCS Gamer', to: '/catalog?category=desktop' },
    { label: 'Laptops', to: '/catalog?category=laptops' },
    { label: 'Accesorios', to: '/catalog?category=accessories' },
    { label: 'Redes y Networking', to: '/catalog?category=networks' },
  ];

  const soporte = [
    { label: 'Tickets de Soporte', to: '/support' },
    { label: 'WhatsApp Rápido', to: 'https://wa.me/573201234567', isExternal: true },
    { label: 'Garantías', to: '/support' },
    { label: 'FAQ', to: '/support' },
  ];

  return (
    <footer className="bg-[#1a222d] text-slate-300 font-sans border-t border-slate-800/40">
      {/* Main Footer Content */}
      <div className="container pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 lg:gap-6 justify-between items-start">
          
          {/* Logo & Brand Column */}
          <div className="w-full md:w-[45%] lg:w-[25%] shrink-0 space-y-5">
            <Link to="/" className="flex items-center gap-3 group no-underline">
              {/* Custom SVG logo representing a monitor + chip + blue TVS gear */}
              <div className="relative shrink-0">
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <span className="font-[Outfit] font-extrabold text-xl lg:text-2xl tracking-normal text-[#dfb648]">
                  TecnoVentas
                </span>
                <span className="text-[10px] lg:text-[11px] text-slate-300 font-bold -mt-0.5 leading-none tracking-wide">
                  y Servicios S.A.S.
                </span>
              </div>
            </Link>
            
            <p className="text-[13px] text-slate-300 leading-relaxed tracking-wide max-w-sm">
              Soluciones tecnológicas integrales<br />
              para empresas y hogares en<br />
              hogares en Colombia.<br /><br />
              Calidad, innovación y soporte de primer nivel.
            </p>
            
            {/* Social Icons matching color scheme */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com/tecnoventas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#dfb648] hover:text-white transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/tecnoventas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#dfb648] hover:text-white transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/tecnoventas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#dfb648] hover:text-white transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/tecnoventas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#dfb648] hover:text-white transition-colors duration-200"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Servicios Column */}
          <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[12%] shrink-0 space-y-6">
            <h4 className="text-sm font-bold text-[#dfb648] uppercase tracking-wider font-[Outfit]">
              SERVICIOS
            </h4>
            <ul className="space-y-5">
              {servicios.map(({ label, to }) => (
                <li key={label} className="flex items-center">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#8ec540] inline-block mr-2.5 shrink-0"></span>
                  <Link
                    to={to}
                    className="text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Productos Column */}
          <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[12%] shrink-0 space-y-6">
            <h4 className="text-sm font-bold text-[#dfb648] uppercase tracking-wider font-[Outfit]">
              PRODUCTOS
            </h4>
            <ul className="space-y-5">
              {productos.map(({ label, to }) => (
                <li key={label} className="flex items-center">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#8ec540] inline-block mr-2.5 shrink-0"></span>
                  <Link
                    to={to}
                    className="text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte Column */}
          <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[12%] shrink-0 space-y-6">
            <h4 className="text-sm font-bold text-[#dfb648] uppercase tracking-wider font-[Outfit]">
              SOPORTE
            </h4>
            <ul className="space-y-5">
              {soporte.map(({ label, to, isExternal }) => (
                <li key={label} className="flex items-center">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#8ec540] inline-block mr-2.5 shrink-0"></span>
                  {isExternal ? (
                    <a
                      href={to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 no-underline"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={to}
                      className="text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 no-underline"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto Column */}
          <div className="w-full md:w-[45%] lg:w-[32%] shrink-0 space-y-6">
            <h4 className="text-sm font-bold text-[#dfb648] uppercase tracking-wider font-[Outfit]">
              CONTACTO
            </h4>
            <div className="flex flex-row justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
              <ul className="space-y-5">
                <li>
                  <a
                    href="https://maps.google.com/?q=Bogota+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 group no-underline"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#dfb648]" />
                    <span className="tracking-wide">Bogotá, Colombia</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+573201234567"
                    className="flex items-center gap-3 text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 group no-underline"
                  >
                    <Phone className="w-4 h-4 shrink-0 text-[#dfb648]" />
                    <span className="tracking-wide">+57 320 123 4567</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@tecnoventas.com"
                    className="flex items-center gap-3 text-[13px] text-slate-300 hover:text-[#dfb648] tracking-wide transition-colors duration-200 group no-underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-[#dfb648]" />
                    <span className="tracking-wide">info@tecnoventas.com</span>
                  </a>
                </li>
              </ul>

              {/* In-footer WhatsApp Badge and Button */}
              <div className="flex items-center gap-2 pt-1.5 justify-start shrink-0">
                {/* Gold Speech Bubble */}
                <div className="relative bg-[#dfb648] text-[#1a222d] font-extrabold text-xs py-1.5 pl-3 pr-4 rounded-lg shadow-md flex items-center justify-center font-['Outfit'] select-none">
                  WhatsApp
                  {/* Speech Bubble Arrow pointing to the right */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2.5 h-2.5 bg-[#dfb648] rotate-45" />
                </div>
                
                {/* WhatsApp Circle Button */}
                <a
                  href="https://wa.me/573201234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-11 h-11 bg-gradient-to-br from-[#dfb648] to-[#b88c2b] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  title="Soporte WhatsApp"
                >
                  {/* WhatsApp Logo SVG */}
                  <svg className="w-5 h-5 text-[#1a222d]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  
                  {/* Unread Badge "1" */}
                  <div className="absolute -top-1 -right-1.5 w-5 h-5 bg-[#c2d0d6] rounded-full flex items-center justify-center border border-[#1a222d] shadow-sm select-none">
                    <span className="text-[9.5px] font-black text-[#1a222d]">1</span>
                  </div>
                  
                  {/* Subtle spark glow effect */}
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-white rounded-full opacity-60 filter blur-[1px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-slate-800" />
      </div>

      {/* Copyright Bar */}
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © 2026 TecnoVentas Y Servicios S.A.S. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 font-medium">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200 no-underline">
              Política de Privacidad
            </Link>
            <span className="text-slate-600 select-none">•</span>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors duration-200 no-underline">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
