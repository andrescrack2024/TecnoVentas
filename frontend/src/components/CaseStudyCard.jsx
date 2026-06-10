import { ArrowRight } from 'lucide-react';

const CaseStudyCard = ({ study }) => {
  return (
    <div className="group relative bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500">
      {/* Image with Overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={study.image_url}
          alt={study.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Tag Badge */}
        {study.tag && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 backdrop-blur-sm">
              {study.tag}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pb-8 space-y-3">
        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors duration-300 font-['Outfit'] line-clamp-2">
          {study.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
          {study.description}
        </p>

        {/* Read More Link */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group/link py-1 px-0 leading-normal overflow-visible cursor-pointer">
            <span>Leer más</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
          </span>
        </div>
      </div>

      {/* Subtle glow border effect on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-cyan-500/20 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default CaseStudyCard;
