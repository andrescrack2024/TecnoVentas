import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { ShoppingCart, ArrowLeft, Cpu, HardDrive, MemoryStick, Monitor, Star, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock products
        const mockProducts = {
          "pc-gamer-1": {
            id: "pc-gamer-1",
            name: "PC Gamer Pro - AMD Ryzen 5, RTX 4060",
            category: "desktop",
            price: 899.90,
            description: "Computador de escritorio optimizado para Gaming y productividad. AMD Ryzen 5, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4060 8GB, Fuente 650W 80+ Gold. Chasis gaming con RGB, Wi-Fi 6 integrado. Ideal para juegos AAA en 1080p/1440p y trabajo de edición de video.",
            image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
            specs: { cpu: "AMD Ryzen 5 7600", gpu: "NVIDIA RTX 4060 8GB", ram: "16GB DDR5 5200MHz", storage: "1TB NVMe SSD" }
          },
          "laptop-asus-1": {
            id: "laptop-asus-1",
            name: "Laptop ASUS ROG Strix G16",
            category: "laptops",
            price: 1249.90,
            description: "Portátil gaming de alta gama. Intel Core i7 13a Gen, 16GB DDR5, 512GB SSD PCIe, NVIDIA RTX 4050. Pantalla 16\" FHD 165Hz. Teclado RGB per-key, batería de larga duración. Sistema de refrigeración avanzado con ventiladores duales.",
            image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
            specs: { cpu: "Intel Core i7-13650HX", gpu: "RTX 4050 6GB", ram: "16GB DDR5", storage: "512GB SSD PCIe 4.0" }
          },
          "accesorio-teclado-1": {
            id: "accesorio-teclado-1",
            name: "Teclado Mecánico Redragon K552 RGB",
            category: "accessories",
            price: 39.90,
            description: "Teclado mecánico tenkeyless con interruptores Outemu Blue clicky. Retroiluminación RGB dinámica con múltiples efectos. Teclas de doble inyección resistentes al desgaste. Construcción en metal para máxima durabilidad.",
            image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
            specs: { switches: "Mecánico Outemu Blue", connection: "USB Cable", layout: "TKL 87 teclas" }
          },
          "router-tplink-1": {
            id: "router-tplink-1",
            name: "Router TP-Link Archer AX55 Wi-Fi 6",
            category: "networks",
            price: 89.90,
            description: "Router inteligente Gigabit Wi-Fi 6 doble banda AX3000. Cobertura mejorada con 4 antenas de alto rendimiento. Compatible con Alexa, seguridad HomeCare integrada.",
            image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
            specs: { type: "Wi-Fi 6 AX3000", ports: "4x Gigabit LAN", security: "WPA3" }
          },
          "camara-imou-1": {
            id: "camara-imou-1",
            name: "Cámara de Seguridad IMOU Cruiser 2MP",
            category: "cameras",
            price: 59.90,
            description: "Cámara exterior Wi-Fi con rotación 360° panorámica, visión nocturna a color inteligente, detección de personas y vehículos, audio bidireccional. IP67 resistente al agua.",
            image_url: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&q=80",
            specs: { resolution: "1080p (2MP)", night_vision: "Color Inteligente", connection: "Wi-Fi 2.4GHz" }
          }
        };
        setProduct(mockProducts[id] || mockProducts["pc-gamer-1"]);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = () => {
    if (product) {
      onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-[Outfit] text-2xl font-bold text-slate-800 mb-4">Producto no encontrado</h2>
          <Link to="/catalog" className="btn-3d-green no-underline">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabels = {
    desktop: "Escritorio",
    laptops: "Portátil",
    accessories: "Accesorio",
    networks: "Redes",
    cameras: "Cámaras",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-cyan-600 no-underline text-slate-500">Inicio</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-cyan-600 no-underline text-slate-500">Catálogo</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full aspect-square object-cover"
              />
            </div>
            <span className="absolute top-4 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {categoryLabels[product.category] || product.category}
            </span>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-cyan-600 text-xs font-bold uppercase tracking-widest">{categoryLabels[product.category] || product.category}</span>
              <h1 className="font-[Outfit] text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-slate-400 ml-1">(12 reseñas)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-cyan-600">${product.price.toFixed(2)}</span>
              <span className="text-lg text-slate-400 line-through">${(product.price * 1.15).toFixed(2)}</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-15%</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="font-[Outfit] font-bold text-slate-800 text-sm mb-3">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{key}</span>
                        <span className="text-xs text-slate-700 font-semibold">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button 
                onClick={handleAdd}
                className={`btn-3d-gold flex-1 py-4 text-sm cursor-pointer border-0 ${added ? 'opacity-80' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? '¡AGREGADO! ✓' : 'AGREGAR AL CARRITO'}
              </button>
              <Link to="/cart" className="btn-3d-green flex-1 py-4 text-sm no-underline">
                VER MI CARRITO
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100">
                <Truck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-semibold">Envío a toda Colombia</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-semibold">Garantía oficial</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100">
                <RotateCcw className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] text-slate-500 font-semibold">30 días devolución</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
