import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        {(product.tag || product.category) && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/90 text-white backdrop-blur-sm shadow-md">
            {product.tag || product.category}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/products/${product.id}`}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver Detalles
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Product Name */}
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Price & Action Row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-[#00a2e8] tracking-tight font-['Outfit']">
              ${product.price?.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="btn-3d-gold flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
