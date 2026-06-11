import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onClearCart 
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate("/auth");
      return;
    }
    alert("¡Compra procesada exitosamente! (Simulación)");
    onClearCart();
    navigate("/dashboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#020617]/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out" 
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-[#0b1322] border-l border-slate-800 flex flex-col shadow-2xl animate-slide-in relative">
          
          {/* Header */}
          <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between bg-[#070c16]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-[Outfit] text-lg font-extrabold text-white">Tu Carrito</h2>
              <span className="bg-cyan-500/15 text-cyan-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-[Outfit] text-base font-bold text-white mb-1">El carrito está vacío</h3>
                <p className="text-slate-400 text-xs max-w-[220px] leading-relaxed">
                  Agrega productos tecnológicos del catálogo para comenzar.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/catalog");
                  }}
                  className="btn-3d-green text-xs mt-6 border-0 w-full"
                >
                  VER CATÁLOGO
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0f1a2e] border border-slate-800/50 rounded-xl p-3.5 flex gap-3.5 items-center hover:border-slate-700/60 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800/80">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-[12.5px] truncate" title={item.name}>{item.name}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
                    <p className="text-[#dfb648] font-extrabold text-[13.5px] mt-0.5">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button 
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-800/40 transition-colors bg-transparent border-0 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-[11px] font-bold text-slate-200">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summaries */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-800/80 bg-[#070c16] px-5 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Envío</span>
                  <span className="font-bold text-slate-200">
                    {shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full self-start">
                    ✓ Envío gratis por compras &gt; $500
                  </span>
                )}
                <hr className="border-slate-800/80 my-1" />
                <div className="flex justify-between text-white text-base font-extrabold">
                  <span>Total</span>
                  <span className="text-[#dfb648]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleCheckout}
                  className="btn-3d-gold w-full py-3.5 text-xs cursor-pointer border-0"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  {user ? "COMPRAR AHORA" : "INGRESAR PARA COMPRAR"}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      onClose();
                      navigate("/cart");
                    }}
                    className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 text-slate-200 font-bold text-xs tracking-wide rounded-lg transition-colors bg-transparent cursor-pointer"
                  >
                    VER DETALLE
                  </button>
                  <button 
                    onClick={onClearCart}
                    className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    title="Vaciar Carrito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>Pago y Transacción 100% segura</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
