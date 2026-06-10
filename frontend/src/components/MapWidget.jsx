import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const MapWidget = () => {
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
      {/* Map Visual Area */}
      <div className="relative h-56 bg-slate-800 overflow-hidden">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(223,182,72,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(223,182,72,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Map Illustration */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 224"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Abstract road lines */}
          <path
            d="M0 140 Q100 120 200 130 T400 110"
            stroke="rgba(223,182,72,0.18)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 170 Q150 155 250 165 T400 145"
            stroke="rgba(223,182,72,0.12)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M120 0 Q130 80 140 224"
            stroke="rgba(223,182,72,0.12)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M280 0 Q270 100 260 224"
            stroke="rgba(223,182,72,0.12)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Area blocks */}
          <rect x="30" y="60" width="60" height="40" rx="4" fill="rgba(223,182,72,0.06)" stroke="rgba(223,182,72,0.1)" strokeWidth="1" />
          <rect x="160" y="40" width="80" height="55" rx="4" fill="rgba(223,182,72,0.06)" stroke="rgba(223,182,72,0.1)" strokeWidth="1" />
          <rect x="310" y="70" width="55" height="35" rx="4" fill="rgba(223,182,72,0.06)" stroke="rgba(223,182,72,0.1)" strokeWidth="1" />
          <rect x="50" y="150" width="50" height="30" rx="4" fill="rgba(223,182,72,0.06)" stroke="rgba(223,182,72,0.1)" strokeWidth="1" />
          <rect x="300" y="155" width="65" height="40" rx="4" fill="rgba(223,182,72,0.06)" stroke="rgba(223,182,72,0.1)" strokeWidth="1" />

          {/* Pulsing location marker center */}
          <circle cx="200" cy="112" r="24" fill="rgba(223,182,72,0.08)" className="animate-ping" />
          <circle cx="200" cy="112" r="14" fill="rgba(223,182,72,0.15)" />
          <circle cx="200" cy="112" r="6" fill="#dfb648" />
        </svg>

        {/* Location Pin Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#dfb648]/20 backdrop-blur-sm border border-[#dfb648]/30 flex items-center justify-center shadow-lg shadow-[#dfb648]/20">
              <MapPin className="w-5 h-5 text-[#dfb648]" />
            </div>
            {/* Pin shadow/reflection */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-[#dfb648]/20 rounded-full blur-sm" />
          </div>
        </div>

        {/* Location Label */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-white font-['Outfit']">Bogotá, Colombia</p>
                <p className="text-[11px] text-slate-400">Sede Principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="p-5 space-y-3">
        <h4 className="text-sm font-bold text-[#dfb648] font-['Outfit'] uppercase tracking-wider">
          Información de Contacto
        </h4>

        <div className="space-y-2.5 text-left">
          {/* Phone */}
          <a
            href="tel:+573201234567"
            className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#dfb648] transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#ffc72c] to-[#f37021] border border-[#ab4b11] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span>+57 320 123 4567</span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@tecnoventas.com"
            className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#dfb648] transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#ffc72c] to-[#f37021] border border-[#ab4b11] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span>info@tecnoventas.com</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/573201234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#dfb648] transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#ffc72c] to-[#f37021] border border-[#ab4b11] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span>WhatsApp Directo</span>
          </a>
        </div>

        {/* Open in Maps Button */}
        <a
          href="https://maps.google.com/?q=Bogota+Colombia"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-[#dfb648] bg-[#dfb648]/10 border border-[#dfb648]/20 rounded-xl hover:bg-[#dfb648]/20 hover:border-[#dfb648]/30 transition-all duration-200"
        >
          <MapPin className="w-3.5 h-3.5 text-[#dfb648]" />
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
};

export default MapWidget;
