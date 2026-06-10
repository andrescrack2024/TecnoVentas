import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Volume2,
  Check
} from "lucide-react";

// reCAPTCHA Challenges Data (Unsplash image grid)
const captchaChallenges = [
  {
    target: "automóviles",
    targetType: "car",
    images: [
      { id: 1, type: "car", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop&q=60" },
      { id: 2, type: "tree", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150&h=150&fit=crop&q=60" },
      { id: 3, type: "bike", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=150&h=150&fit=crop&q=60" },
      { id: 4, type: "car", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=150&h=150&fit=crop&q=60" },
      { id: 5, type: "store", url: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=150&h=150&fit=crop&q=60" },
      { id: 6, type: "car", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&h=150&fit=crop&q=60" },
      { id: 7, type: "bus", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&h=150&fit=crop&q=60" },
      { id: 8, type: "traffic", url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=150&h=150&fit=crop&q=60" },
      { id: 9, type: "car", url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=150&h=150&fit=crop&q=60" }
    ]
  },
  {
    target: "semáforos",
    targetType: "traffic",
    images: [
      { id: 1, type: "store", url: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=150&h=150&fit=crop&q=60" },
      { id: 2, type: "traffic", url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=150&h=150&fit=crop&q=60" },
      { id: 3, type: "tree", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150&h=150&fit=crop&q=60" },
      { id: 4, type: "bike", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=150&h=150&fit=crop&q=60" },
      { id: 5, type: "traffic", url: "https://images.unsplash.com/photo-1508586988897-25615d70204a?w=150&h=150&fit=crop&q=60" },
      { id: 6, type: "car", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&h=150&fit=crop&q=60" },
      { id: 7, type: "bus", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&h=150&fit=crop&q=60" },
      { id: 8, type: "traffic", url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=150&h=150&fit=crop&q=60" },
      { id: 9, type: "cat", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&q=60" }
    ]
  }
];

export default function Auth() {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithPhone, 
    sendEmailOTP, 
    verifyEmailOTP 
  } = useAuth();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Login inputs (standard email + password / social only, no OTP)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register inputs (always name, email/phone, password + verification code step)
  const [regName, setRegName] = useState("");
  const [regEmailOrPhone, setRegEmailOrPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState("");
  const [regConfirmationResult, setRegConfirmationResult] = useState(null);

  // reCAPTCHA states
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);

  // Custom Image Grid reCAPTCHA states
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaChallengeIndex, setCaptchaChallengeIndex] = useState(0);
  const [captchaSelectedIds, setCaptchaSelectedIds] = useState([]);
  const [captchaShake, setCaptchaShake] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // Dev OTP storage to show on-screen for testing convenience
  const [devOtpCode, setDevOtpCode] = useState("");

  // Timer for OTP resending
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Clean states when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setInfoMessage("");
    setRegOtpSent(false);
    setDevOtpCode("");
    setRecaptchaChecked(false);
    setTimer(0);
  };

  // Standard Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    if (!loginEmail || !loginPassword) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPassword);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
        setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Send Registration OTP
  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setDevOtpCode("");

    if (!regName) {
      setError("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!regEmailOrPhone) {
      setError("Por favor ingresa tu correo electrónico o número de teléfono.");
      return;
    }
    if (!regPassword || !regConfirmPassword) {
      setError("Por favor completa los campos de contraseña.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (regPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!recaptchaChecked) {
      setError("Por favor verifica que no eres un robot en el reCAPTCHA.");
      return;
    }

    setLoading(true);
    try {
      const isPhone = /^\+?[0-9\s\-]{8,20}$/.test(regEmailOrPhone);
      if (isPhone) {
        if (!window.recaptchaVerifier) {
          const { RecaptchaVerifier } = await import("firebase/auth");
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible"
          });
        }
        const confirmation = await loginWithPhone(regEmailOrPhone, window.recaptchaVerifier);
        setRegConfirmationResult(confirmation);
        setRegOtpSent(true);
        setTimer(60);
        setInfoMessage("Se ha enviado un código de verificación SMS a tu teléfono.");
      } else {
        if (!regEmailOrPhone.includes("@")) {
          throw new Error("Ingresa un correo electrónico o teléfono válido (+ para internacional).");
        }
        const res = await sendEmailOTP(regEmailOrPhone);
        setRegOtpSent(true);
        setDevOtpCode(res.code);
        setTimer(60);
        setInfoMessage("Se ha enviado un código de verificación de 6 dígitos a tu correo.");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/configuration-not-found") {
        setError("Este proveedor de autenticación (teléfono) no está habilitado en Firebase Console. Por favor actívalo.");
      } else {
        setError(err.message || "Error al enviar el código de verificación.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify Registration OTP & Complete Register
  const handleVerifyRegisterOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!regOtpCode) {
      setError("Por favor ingresa el código de verificación.");
      return;
    }

    setLoading(true);
    try {
      const isPhone = /^\+?[0-9\s\-]{8,20}$/.test(regEmailOrPhone);
      if (isPhone && regConfirmationResult) {
        await regConfirmationResult.confirm(regOtpCode);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: regName });
        }
        navigate("/dashboard");
      } else {
        // Verificar código de correo
        const docRef = await import("firebase/firestore").then(m => m.doc(auth.app.container.providers.db.getImmediate(), "email_otps", regEmailOrPhone));
        const docSnap = await import("firebase/firestore").then(m => m.getDoc(docRef));

        if (!docSnap.exists() || docSnap.data().code !== regOtpCode) {
          throw new Error("El código de verificación es incorrecto o ha expirado.");
        }

        await registerWithEmail(regName, regEmailOrPhone, regPassword);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: regName });
        }
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al verificar el código o crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  // Custom reCAPTCHA Click: Launches the Image Challenge Modal
  const handleRecaptchaClick = () => {
    if (recaptchaChecked || recaptchaLoading) return;
    setRecaptchaLoading(true);
    setTimeout(() => {
      setRecaptchaLoading(false);
      // Select random challenge and open modal
      setCaptchaChallengeIndex(Math.floor(Math.random() * captchaChallenges.length));
      setCaptchaSelectedIds([]);
      setCaptchaError(false);
      setShowCaptchaModal(true);
    }, 800);
  };

  // Toggle grid image selection
  const handleCaptchaImageSelect = (id) => {
    setCaptchaSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Verify Captcha Challenge
  const handleCaptchaVerify = () => {
    const challenge = captchaChallenges[captchaChallengeIndex];
    const correctIds = challenge.images
      .filter(img => img.type === challenge.targetType)
      .map(img => img.id);

    const isCorrect = 
      captchaSelectedIds.length === correctIds.length &&
      captchaSelectedIds.every(id => correctIds.includes(id));

    if (isCorrect) {
      setShowCaptchaModal(false);
      setRecaptchaChecked(true);
      setError("");
    } else {
      setCaptchaShake(true);
      setCaptchaError(true);
      setTimeout(() => {
        setCaptchaShake(false);
        // Switch to the other challenge for a fresh retry
        setCaptchaChallengeIndex((prev) => (prev + 1) % captchaChallenges.length);
        setCaptchaSelectedIds([]);
      }, 400);
    }
  };

  // Skip / Refresh challenge manually
  const handleRefreshChallenge = () => {
    setCaptchaChallengeIndex((prev) => (prev + 1) % captchaChallenges.length);
    setCaptchaSelectedIds([]);
    setCaptchaError(false);
  };

  const handleGoogleLoginClick = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/configuration-not-found") {
        setError("El inicio de sesión con Google no está habilitado en tu proyecto de Firebase. Actívalo en la consola.");
      } else {
        setError(err.message || "Error al iniciar sesión con Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLoginClick = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithFacebook();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/configuration-not-found") {
        setError("El inicio de sesión con Facebook no está configurado en Firebase Console. Asegúrate de añadir las credenciales de Facebook Developer.");
      } else {
        setError(err.message || "Error al iniciar sesión con Facebook.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentChallenge = captchaChallenges[captchaChallengeIndex];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1322 0%, #0f1d32 50%, #0a1322 100%)" }}
    >
      {/* Container invisible requerido para el reCAPTCHA de Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(#00a2e8 1.5px, transparent 1.5px)',
        backgroundSize: '30px 30px',
      }}></div>
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">

        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#00a2e8] to-[#8ec540] rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/20 mb-4 border-2 border-cyan-300/30 animate-pulse-glow">
            🖥️
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            TecnoVentas
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Accede a tu cuenta o regístrate para continuar
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* Developer Mode OTP Box (Only shown in register OTP phase) */}
          {devOtpCode && regOtpSent && (
            <div className="bg-amber-500/10 border-b border-amber-500/30 p-3 text-center flex items-center justify-center gap-2 animate-fade-in-up text-amber-300 text-xs">
              <span className="font-bold uppercase tracking-wider bg-amber-500/25 px-1.5 py-0.5 rounded text-[10px]">Modo Dev</span>
              <span>Código OTP Generado: <strong>{devOtpCode}</strong></span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(devOtpCode);
                  setInfoMessage("¡Código copiado al portapapeles!");
                }}
                className="text-cyan-400 hover:text-cyan-300 underline font-bold bg-transparent border-0 cursor-pointer ml-1 text-[11px]"
              >
                Copiar
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4.5 text-sm font-extrabold tracking-wide border-0 cursor-pointer transition-all duration-200 ${
                activeTab === "login"
                  ? "text-cyan-400 bg-cyan-500/10 border-b-2 border-b-cyan-400"
                  : "text-slate-500 bg-transparent hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              <LogIn className="w-4.5 h-4.5" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4.5 text-sm font-extrabold tracking-wide border-0 cursor-pointer transition-all duration-200 ${
                activeTab === "register"
                  ? "text-cyan-400 bg-cyan-500/10 border-b-2 border-b-cyan-400"
                  : "text-slate-500 bg-transparent hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              <UserPlus className="w-4.5 h-4.5" />
              Registrarse
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6 md:p-8">

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-4 mb-5 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div className="flex items-start gap-2.5 p-4 mb-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl animate-fade-in-up">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-cyan-300 leading-relaxed font-medium">{infoMessage}</p>
              </div>
            )}

            {/* ─────────── LOGIN FLOW (Standard Only) ─────────── */}
            {activeTab === "login" && (
              <div className="flex flex-col gap-5">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  
                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail 
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                        style={{ left: "18px" }}
                      />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="w-full pr-5 bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                        style={{ paddingLeft: "3.25rem" }}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock 
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                        style={{ left: "18px" }}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                        style={{ paddingLeft: "3.25rem", paddingRight: "3.25rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-3d-green w-full mt-2 border-0 cursor-pointer justify-center rounded-full h-[52px] text-sm"
                  >
                    {loading ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>INICIAR SESIÓN</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to register */}
                <div className="text-center mt-2">
                  <p className="text-sm text-slate-400">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("register")}
                      className="text-cyan-400 font-extrabold hover:underline hover:text-cyan-300 bg-transparent border-0 cursor-pointer p-0 ml-1"
                    >
                      Crea una aquí
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ─────────── REGISTER FLOW (Requires OTP verification) ─────────── */}
            {activeTab === "register" && (
              <div className="flex flex-col gap-5">
                {!regOtpSent ? (
                  <form onSubmit={handleSendRegisterOtp} className="flex flex-col gap-4">
                    
                    {/* Name field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                          style={{ left: "18px" }}
                        />
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="w-full pr-5 bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                          style={{ paddingLeft: "3.25rem" }}
                        />
                      </div>
                    </div>

                    {/* Email or Phone field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4 flex items-center justify-between">
                        <span>Correo o Teléfono</span>
                        <span className="text-[9px] text-slate-400 normal-case font-normal flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" /> Usar + para teléfono
                        </span>
                      </label>
                      <div className="relative">
                        <Mail 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                          style={{ left: "18px" }}
                        />
                        <input
                          type="text"
                          value={regEmailOrPhone}
                          onChange={(e) => setRegEmailOrPhone(e.target.value)}
                          placeholder="correo@ejemplo.com o +573001234567"
                          className="w-full pr-5 bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                          style={{ paddingLeft: "3.25rem" }}
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                          style={{ left: "18px" }}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                          style={{ paddingLeft: "3.25rem", paddingRight: "3.25rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <Lock 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                          style={{ left: "18px" }}
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repite tu contraseña"
                          className="w-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-medium rounded-full text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                          style={{ paddingLeft: "3.25rem", paddingRight: "3.25rem" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Custom reCAPTCHA widget */}
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between mt-1 select-none">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={handleRecaptchaClick}
                          className={`w-7 h-7 rounded border-2 transition-all flex items-center justify-center cursor-pointer bg-transparent ${
                            recaptchaChecked 
                              ? "border-emerald-500 bg-emerald-500/10" 
                              : "border-slate-500 hover:border-slate-400"
                          }`}
                        >
                          {recaptchaLoading ? (
                            <span className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></span>
                          ) : recaptchaChecked ? (
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </button>
                        <span className="text-sm font-semibold text-slate-300">No soy un robot</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-[9px] text-slate-500 font-medium">
                        <img 
                          src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                          alt="reCAPTCHA logo" 
                          className="w-8 h-8 opacity-80 mb-0.5 filter grayscale hover:grayscale-0 transition-all"
                        />
                        <span>reCAPTCHA</span>
                        <span className="text-[7px]">Privacidad - Condiciones</span>
                      </div>
                    </div>

                    {/* Submit Button (Send OTP) */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-3d-green w-full mt-1 border-0 cursor-pointer justify-center rounded-full h-[52px] text-sm"
                    >
                      {loading ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>REGISTRARSE</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // OTP Verify Form
                  <form onSubmit={handleVerifyRegisterOtp} className="flex flex-col gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRegOtpSent(false)}
                        className="p-1 text-cyan-400 hover:text-cyan-300 bg-transparent border-0 cursor-pointer flex items-center gap-1 text-xs font-bold"
                      >
                        <ArrowLeft className="w-4 h-4" /> Cambiar datos
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#dfb648] font-bold uppercase tracking-wider pl-4">
                        Código de Verificación
                      </label>
                      <div className="relative">
                        <ShieldCheck 
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
                          style={{ left: "18px" }}
                        />
                        <input
                          type="text"
                          maxLength="6"
                          value={regOtpCode}
                          onChange={(e) => setRegOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full bg-[#eae8e4] text-slate-900 placeholder-slate-500 font-bold tracking-widest text-center rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/25 border-0 transition-all h-[52px] shadow-inner"
                          style={{ paddingLeft: "3.25rem" }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-3d-green w-full mt-2 border-0 cursor-pointer justify-center rounded-full h-[52px] text-sm"
                    >
                      {loading ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>REGISTRARSE</span>
                        </>
                      )}
                    </button>

                    <div className="text-center mt-2">
                      <button
                        type="button"
                        disabled={timer > 0 || loading}
                        onClick={handleSendRegisterOtp}
                        className={`text-xs font-bold bg-transparent border-0 cursor-pointer ${
                          timer > 0 ? "text-slate-500 cursor-not-allowed" : "text-cyan-400 hover:underline"
                        }`}
                      >
                        {timer > 0 ? `Reenviar código en ${timer}s` : "Reenviar código"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Switch to login */}
                <div className="text-center mt-2">
                  <p className="text-sm text-slate-400">
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("login")}
                      className="text-cyan-400 font-extrabold hover:underline hover:text-cyan-300 bg-transparent border-0 cursor-pointer p-0 ml-1"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Social Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-grow h-px bg-slate-800"></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">o continúa con</span>
              <div className="flex-grow h-px bg-slate-800"></div>
            </div>

            {/* Social Buttons (Tall & Pill Side-by-Side) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button
                onClick={handleGoogleLoginClick}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 w-full bg-white text-slate-800 font-bold text-sm border border-slate-200 rounded-full hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-md h-[52px]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookLoginClick}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 w-full bg-[#1877F2] text-white font-bold text-sm border-0 rounded-full hover:bg-[#166FE5] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-md h-[52px]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-[11px] text-slate-500 mt-6 leading-relaxed">
          Al continuar, aceptas nuestros{" "}
          <span className="text-cyan-400 cursor-pointer hover:underline">Términos de Servicio</span>{" "}
          y{" "}
          <span className="text-cyan-400 cursor-pointer hover:underline">Política de Privacidad</span>.
        </p>
      </div>

      {/* ─────────── CUSTOM reCAPTCHA CHALLENGE MODAL ─────────── */}
      {showCaptchaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-[360px] w-full border border-slate-200 select-none text-slate-800">
            
            {/* Modal Header */}
            <div className="bg-[#1a73e8] p-5 text-white">
              <p className="text-xs uppercase font-semibold opacity-90 tracking-wider">
                Selecciona todas las imágenes de
              </p>
              <h2 className="text-2xl font-black mt-1 uppercase tracking-tight">
                {currentChallenge.target}
              </h2>
              <p className="text-xs mt-2 opacity-80">
                Si no hay ninguna, haz clic en Saltar.
              </p>
            </div>

            {/* Modal Grid */}
            <div className="p-2 bg-slate-100">
              <div 
                className={`grid grid-cols-3 gap-1.5 transition-all ${captchaShake ? "animate-shake" : ""}`}
                style={{ aspectRatio: "1 / 1" }}
              >
                {currentChallenge.images.map((img) => {
                  const isSelected = captchaSelectedIds.includes(img.id);
                  return (
                    <div 
                      key={img.id}
                      onClick={() => handleCaptchaImageSelect(img.id)}
                      className="relative overflow-hidden cursor-pointer rounded bg-slate-300 group"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      {/* Image */}
                      <img 
                        src={img.url} 
                        alt="Captcha grid item" 
                        className={`w-full h-full object-cover transition-all duration-150 ${
                          isSelected ? "scale-[0.82] rounded-md" : "scale-100 group-hover:scale-105"
                        }`}
                      />

                      {/* Selected Blue Checkbox Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#1a73e8]/20 flex items-center justify-center rounded border-4 border-[#1a73e8] pointer-events-none">
                          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#1a73e8] flex items-center justify-center border border-white text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Challenge Error Banner */}
              {captchaError && (
                <div className="text-[11px] text-red-600 font-bold mt-2 text-center animate-fade-in-up">
                  ❌ Selección incorrecta. Por favor, vuelve a intentarlo.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-3.5 text-slate-500 pl-1">
                <button 
                  type="button"
                  onClick={handleRefreshChallenge}
                  className="hover:text-slate-800 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                  title="Cambiar reto"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={() => alert("Función de audio no disponible en este entorno.")}
                  className="hover:text-slate-800 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                  title="Audio Captcha"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={() => alert("Haz clic en los cuadros que contengan el objeto indicado. Al terminar presiona Verificar.")}
                  className="hover:text-slate-800 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                  title="Ayuda"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCaptchaVerify}
                className="py-2.5 px-6 rounded bg-[#1a73e8] hover:bg-[#155ab5] text-white font-bold text-xs uppercase tracking-wide transition-all cursor-pointer border-0 shadow"
              >
                {captchaSelectedIds.length > 0 ? "Verificar" : "Saltar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
