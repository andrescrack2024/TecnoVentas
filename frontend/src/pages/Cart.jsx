import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

export default function Cart({ cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    alert("¡Compra procesada exitosamente! (Simulación)");
    onClearCart();
    navigate("/dashboard");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="font-[Outfit] text-2xl font-extrabold text-slate-800 mb-3">Tu carrito está vacío</h2>
          <p className="text-slate-500 text-sm mb-8">Agrega productos desde nuestro catálogo para comenzar tu compra.</p>
          <Link to="/catalog" className="btn-3d-green no-underline px-8 py-3">
            <ArrowLeft className="w-4 h-4" />
            VER CATÁLOGO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 py-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-cyan-400" />
            <h1 className="font-[Outfit] text-3xl font-extrabold text-white">Mi Carrito</h1>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h3>
                  <span className="text-[11px] text-slate-400 capitalize">{item.category}</span>
                  <p className="text-cyan-600 font-extrabold text-lg mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all bg-transparent border-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={onClearCart}
              className="self-start text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Vaciar carrito
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 flex flex-col">
              <h3 className="font-[Outfit] text-lg font-bold text-slate-800 mb-6">Resumen del Pedido</h3>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="font-semibold">{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full self-start">
                    ✓ Envío gratis por compras mayores a $500
                  </span>
                )}
                <hr className="border-slate-100 my-2" />
                <div className="flex justify-between text-slate-900 text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-cyan-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn-3d-gold w-full py-3.5 mt-6 mb-4 text-sm cursor-pointer border-0"
              >
                <CreditCard className="w-4 h-4" />
                {user ? 'PROCESAR COMPRA' : 'INGRESAR PARA COMPRAR'}
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Pago 100% seguro</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
