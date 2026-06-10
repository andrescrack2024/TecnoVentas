import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatWidget = () => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = 'https://wa.me/573201234567';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip / Label - slides in on hover */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-xl border border-slate-700/50 transition-all duration-300 whitespace-nowrap ${
          isHovered
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <span className="text-emerald-400">💬</span>
        <span>Chat por WhatsApp</span>
        {/* Arrow pointing to button */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/50 rotate-[-45deg]" />
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
        aria-label="Chat por WhatsApp"
      >
        {/* Pulse Ring Animation */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-pulse" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-emerald-400/30">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>

        {/* WhatsApp Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          <span className="text-[8px] font-bold text-white">1</span>
        </div>
      </a>
    </div>
  );
};

export default ChatWidget;
