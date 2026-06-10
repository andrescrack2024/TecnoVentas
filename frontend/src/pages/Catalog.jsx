import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../config";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, X } from "lucide-react";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { key: "desktop", label: "DESKTOP" },
  { key: "laptops", label: "LAPTOPS" },
  { key: "networks", label: "NETWORKS" },
  { key: "cameras", label: "CAMERAS" },
  { key: "acsessirs", label: "ACSESSIRS" },
  { key: "accessories", label: "ACCESSORIES" },
];

const FALLBACK_PRODUCTS = [
  // Category: desktop
  {
    id: "pc-gamer-1",
    name: "PC Gamer Pro - AMD Ryzen 5, RTX 4066",
    category: "desktop",
    price: 1999.00,
    description: "Computador de escritorio optimizado para Gaming y productividad. AMD Ryzen 5, 16GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4066 8GB.",
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80",
    specs: { cpu: "AMD Ryzen 5", gpu: "RTX 4066 8GB", ram: "16GB DDR5", storage: "1TB SSD" },
    tag: "DESKTOP"
  },
  {
    id: "pc-workstation-2",
    name: "Workstation",
    category: "desktop",
    price: 899.00,
    description: "Estación de trabajo profesional optimizada para modelado 3D y edición de video. Intel Core i9, 32GB RAM DDR5, NVIDIA RTX Quadro, 2TB SSD NVMe.",
    image_url: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&q=80",
    specs: { cpu: "Intel Core i9", gpu: "RTX Quadro", ram: "32GB DDR5", storage: "2TB SSD" },
    tag: "DESKTOP"
  },
  // Category: laptops
  {
    id: "pc-allinone-3",
    name: "Workstation",
    category: "laptops",
    price: 1999.00,
    description: "Todo en uno ultradelgado para hogar y oficina. Intel Core i5, 16GB RAM, 512GB SSD, Pantalla IPS 23.8' FHD sin bordes.",
    image_url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80",
    specs: { cpu: "Intel Core i5", ram: "16GB DDR4", storage: "512GB SSD" },
    tag: "DESKTOP"
  },
  {
    id: "laptop-asus-1",
    name: "Laptop ASUS STRIx G16",
    category: "laptops",
    price: 1999.00,
    description: "Portátil de alta gama para juegos y desarrollo de software. Intel Core i7 13a Gen, 16GB DDR5 RAM, 512GB SSD PCIe 4.0, NVIDIA RTX 4050.",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    specs: { cpu: "Intel Core i7", gpu: "RTX 4050 6GB", ram: "16GB DDR5", storage: "512GB SSD" },
    tag: "LAPTOP"
  },
  {
    id: "laptop-hp-2",
    name: "Laptop HP Envy - Intel Evo, Touchscreen",
    category: "laptops",
    price: 1199.90,
    description: "Portátil premium convertible con pantalla táctil. Intel Core i7 con certificación Intel Evo, 16GB RAM, 1TB SSD, pantalla táctil OLED.",
    image_url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80",
    specs: { cpu: "Intel i7 Evo", ram: "16GB LPDDR5", storage: "1TB SSD" },
    tag: "ULTRABOOK"
  },
  {
    id: "laptop-chrome-3",
    name: "Laptop Chromebook - 11 inch",
    category: "laptops",
    price: 299.90,
    description: "Chromebook ligera y rápida de 11 pulgadas ideal para estudiantes, clases virtuales y navegación diaria.",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    specs: { cpu: "Intel Celeron", ram: "4GB LPDDR4", storage: "64GB eMMC" },
    tag: "CHROMEBOOK"
  },
  // Category: networks
  {
    id: "net-router-1",
    name: "Router TP-Link Archer AXXS5 Wi-Fi",
    category: "networks",
    price: 89.90,
    description: "Router inteligente Gigabit Wi-Fi 6 de doble banda AX3000 con cobertura mejorada y gran alcance.",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    specs: { type: "Wi-Fi 6", speed: "AX3000" },
    tag: "NETWORKS"
  },
  {
    id: "net-ap-2",
    name: "Access Point Mesh - UniFi AC",
    category: "networks",
    price: 149.90,
    description: "Punto de acceso inalámbrico empresarial de doble banda con tecnología Mesh de largo alcance.",
    image_url: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=500&q=80",
    specs: { frequency: "2.4GHz & 5GHz" },
    tag: "NETWORKS"
  },
  {
    id: "net-switch-3",
    name: "Network Switch - 16 port Gigabit",
    category: "networks",
    price: 69.90,
    description: "Switch de red con 16 puertos RJ45 Gigabit para oficina y hogar. Carcasa metálica y diseño silencioso.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80",
    specs: { ports: "16x Gigabit RJ45" },
    tag: "SWITCH"
  },
  // Category: cameras
  {
    id: "cam-imou-1",
    name: "Cámara de Seguridad IMOU Cruiser 2MP",
    category: "cameras",
    price: 59.90,
    description: "Cámara de seguridad exterior Wi-Fi con rotación 360° panorámica, visión nocturna a color y detección humana IA.",
    image_url: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80",
    specs: { resolution: "1080p (2MP)" },
    tag: "DESKTOP"
  },
  {
    id: "cam-nvr-2",
    name: "NVR System",
    category: "cameras",
    price: 249.90,
    description: "Grabador de video en red de 8 canales PoE de alta definición para CCTV corporativo.",
    image_url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=500&q=80",
    specs: { channels: "8 PoE" },
    tag: "VIGILANCA"
  },
  {
    id: "cam-doorbell-3",
    name: "Smart Video Doorbell - Wi-Fi",
    category: "cameras",
    price: 99.90,
    description: "Timbre inteligente Wi-Fi con videocámara HD integrada, audio bidireccional y notificaciones en tiempo real al celular.",
    image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80",
    specs: { resolution: "2MP" },
    tag: "TIMBRE INTELIGENTE"
  },
  // Category: accessories
  {
    id: "acc-keyboard-1",
    name: "Teclado Mecánico Redragon K552 RGB",
    category: "accessories",
    price: 59.90,
    description: "Teclado mecánico tenkeyless para juegos. Interruptores Outemu Blue, retroiluminación RGB dinámica.",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    specs: { switches: "Mecánico Outemu Blue" },
    tag: "ACCESSORIES"
  },
  {
    id: "acc-mouse-2",
    name: "Gaming Mouse - Logitech G Pro Wireless",
    category: "accessories",
    price: 89.90,
    description: "Ratón gaming inalámbrico profesional con sensor HERO 25K y diseño ultraligero.",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    specs: { sensor: "HERO 25K" },
    tag: "ACCESSORIES"
  },
  {
    id: "acc-headset-3",
    name: "Gaming Headset - Razer BlackShark V2",
    category: "accessories",
    price: 79.90,
    description: "Auriculares para juegos de deportes electrónicos con controladores TriForce de 50 mm y micrófono cardioide HyperClear.",
    image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
    specs: { drivers: "TriForce 50mm" },
    tag: "ACCESSORIES"
  }
];

const DISPLAY_CATEGORIES = [
  { key: "desktop", title: "DESKTOP", label: "DESKTOPS Y EQUIPOS DE ESCRITORIO" },
  { key: "laptops", title: "LAPTOPS", label: "LAPTOPS Y PORTÁTILES" },
  { key: "networks", title: "NETWORKS", label: "REDES Y CONECTIVIDAD" },
  { key: "cameras", title: "CAMERAS", label: "CÁMARAS Y VIGILANCIA" },
  { key: "accessories", title: "ACCESSORIES", label: "ACCESORIOS Y PERIFÉRICOS" },
];

export default function Catalog({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products/`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error("Empty or invalid");
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using fallback products:", err);
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (key) => {
    if (key === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", key);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const displayProductsCount = useMemo(() => {
    if (activeCategory === "all") return filteredProducts.length;
    const cat = activeCategory === "acsessirs" ? "accessories" : activeCategory;
    return filteredProducts.filter((p) => p.category === cat).length;
  }, [filteredProducts, activeCategory]);

  const handleScrollRight = (key) => {
    const el = document.getElementById(`scroll-${key}`);
    if (el) {
      el.scrollLeft += 320;
    }
  };

  const sortLabels = {
    default: "Ordenar por",
    "price-asc": "Precio: Menor a Mayor",
    "price-desc": "Precio: Mayor a Menor",
    "name-asc": "Nombre: A - Z",
  };

  // Render a slider row for a specific category
  const renderCategoryRow = (cat) => {
    const categoryProducts = filteredProducts.filter((p) => p.category === cat.key);
    if (categoryProducts.length === 0) return null;

    return (
      <div key={cat.key} className="mb-10 w-full">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-gradient-to-b from-[#dfb648] to-[#f37021] rounded-full shadow-sm"></div>
            <h2 className="font-heading text-sm md:text-base font-black text-slate-800 tracking-wide uppercase">
              {cat.label}
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {categoryProducts.length} artículo{categoryProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Carousel Slider Wrapper */}
        <div className="relative group">
          {/* Scrollable Row */}
          <div 
            id={`scroll-${cat.key}`}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x pb-4 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryProducts.map((product) => (
              <div key={product.id} className="w-[285px] sm:w-[300px] shrink-0 snap-start">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>

          {/* Right Chevron Button */}
          {categoryProducts.length > 3 && (
            <button 
              onClick={() => handleScrollRight(cat.key)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 bg-white border border-slate-200/80 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors z-20 cursor-pointer active:scale-95"
              aria-label="Ver más"
            >
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        
        {/* Title and Counter Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 border-b border-slate-100 pb-3 gap-2">
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            Catálogo General y Categorías
          </h1>
          <p className="text-xs text-slate-400 font-semibold shrink-0">
            {displayProductsCount} producto{displayProductsCount !== 1 ? "s" : ""} encontrado{displayProductsCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search + Sort + Filters Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8 sticky top-16 bg-white z-20 border-b border-slate-100 pb-3">
          {/* Filters Pills Row */}
          <div className="flex flex-wrap gap-2 py-1">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide border cursor-pointer transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-[#333b47] text-white border-[#333b47] shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              TODOS
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide border cursor-pointer transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "bg-[#333b47] text-white border-[#333b47] shadow-sm"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" 
                style={{ left: "16px" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all"
                style={{
                  paddingLeft: "44px",
                  paddingRight: "36px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  lineHeight: "20px"
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-bold hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto justify-between sm:justify-start"
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  lineHeight: "20px"
                }}
              >
                <span>{sortLabels[sortBy]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)}></div>
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-30 overflow-hidden">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setSortBy(key); setShowSortDropdown(false); }}
                        className={`w-full text-left border-0 cursor-pointer transition-colors ${
                          sortBy === key
                            ? "bg-slate-50 text-slate-900 font-bold"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                        style={{
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          fontSize: "14px"
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Categories grid (3-column layout on Desktop when ALL is selected) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-slate-400 text-sm">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-700 mb-1">No se encontraron productos</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Intenta ajustar los filtros o el término de búsqueda para encontrar lo que necesitas.
            </p>
          </div>
        ) : (
          <div>
            {activeCategory === "all" ? (
              // Row-by-row layout (Full Width Sliders)
              <div className="flex flex-col gap-8">
                {DISPLAY_CATEGORIES.map((cat) => renderCategoryRow(cat))}
              </div>
            ) : (
              // Filtered: Show only selected category row in full width
              <div className="max-w-4xl mx-auto">
                {renderCategoryRow(
                  DISPLAY_CATEGORIES.find(
                    (c) => c.key === (activeCategory === "acsessirs" ? "accessories" : activeCategory)
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer actions & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
          <Link to="/" className="text-[#0284c7] hover:underline font-black text-sm no-underline flex items-center gap-1 transition-colors">
            Ver todos los productos <ChevronRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-slate-400 font-semibold">
            © 2026 Tecnoventas S.A.S. - Catálogo Premium
          </span>
        </div>

      </div>
    </div>
  );
}
