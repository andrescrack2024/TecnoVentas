import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import AppWebDev from "./pages/AppWebDev";
import AdminLogin from "./pages/AdminLogin";

function AppContent() {
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();

  // Scroll a la parte superior en cada cambio de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("tecno_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al parsear carrito guardado:", e);
      }
    }
  }, []);

  // Guardar carrito en localStorage en cada cambio
  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("tecno_cart", JSON.stringify(updatedCart));
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
        quantity: 1
      });
    }
    saveCartToStorage(updatedCart);
    setCartDrawerOpen(true); // Abrir el panel del carrito automáticamente
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCartToStorage(updatedCart);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCartToStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Header cartCount={cartCount} onCartClick={() => setCartDrawerOpen(true)} />}
      
      {/* Reusable slide-over shopping cart panel */}
      <CartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/catalog" element={<Catalog onAddToCart={handleAddToCart} />} />
          <Route path="/products/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={
            <Cart 
              cartItems={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart} 
            />
          } />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/support" element={<Support />} />
          <Route path="/app-web-dev" element={<AppWebDev />} />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
