import React, { useState } from 'react';
import { 
  Briefcase, 
  User, 
  Mail, 
  Lock, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Scissors,
  GraduationCap,
  Dumbbell,
  Camera,
  Headphones
} from 'lucide-react';
import { AgendaProLogo } from '../common/AgendaProLogo';
import { UserRole } from '../../types';

interface RegisterViewProps {
  onRegisterSuccess: (role: UserRole, name: string, email: string) => void;
  onNavigateLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onNavigateLogin
}) => {
  const [role, setRole] = useState<UserRole>('provider');
  const [name, setName] = useState('Laura Morales');
  const [email, setEmail] = useState('laura.morales@agendapro.co');
  const [password, setPassword] = useState('segura123456');
  const [confirmPassword, setConfirmPassword] = useState('segura123456');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    onRegisterSuccess(role, name, email);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <AgendaProLogo size="md" />
          <div className="hidden sm:inline-block px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-xs text-slate-600 font-medium">
            Plataforma General de Servicios
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 hidden sm:inline">¿Ya tienes una cuenta?</span>
          <button
            onClick={onNavigateLogin}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-stretch">
          
          {/* Left Column: Rich Gradient Card matching Image 9.jpeg */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-400/10 blur-2xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wider uppercase text-blue-100">
                PLATAFORMA INTEGRAL · REGISTRO
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Organiza tus servicios.<br />
                <span className="text-blue-200">Reserva tu tiempo.</span>
              </h1>

              <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
                AgendaPro facilita la gestión integral de citas, disponibilidad y catálogo de servicios para profesionales independientes y empresas en cualquier industria.
              </p>

              {/* Multiple sectors chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                  ADAPTABLE A MÚLTIPLES SECTORES:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium">
                    <Scissors className="w-3.5 h-3.5 text-blue-300" />
                    Barbería & Belleza
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                    Clases & Educación
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium">
                    <Dumbbell className="w-3.5 h-3.5 text-blue-300" />
                    Entrenamiento Personal
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium">
                    <Camera className="w-3.5 h-3.5 text-blue-300" />
                    Sesiones de Fotografía
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white font-medium">
                    <Headphones className="w-3.5 h-3.5 text-blue-300" />
                    Soporte & Consultoría
                  </span>
                </div>
              </div>

              {/* Callout box */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-white/95 space-y-1 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold text-blue-100">
                  <Briefcase className="w-4 h-4 text-blue-300" />
                  <span>¿Te registras como Proveedor?</span>
                </div>
                <p className="text-[11px] text-blue-100 leading-relaxed">
                  Tendrás acceso inmediato a tu Dashboard, catálogo de servicios, control de disponibilidad con franjas y la agenda semanal sincronizada.
                </p>
              </div>
            </div>

            {/* Bottom branding inside card */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-blue-200 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-bold text-white text-[11px]">
                  AP
                </div>
                <div>
                  <div className="font-bold text-white">SaaS Cloud Multi-negocio</div>
                  <div className="text-[10px] text-blue-200">Sincronización en tiempo real 24/7</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Register Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                    NUEVO REGISTRO
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30]">
                    Crear una cuenta
                  </h2>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Paso 1 de 2
                </div>
              </div>

              <p className="text-xs text-slate-500 -mt-3">
                Completa tus datos para acceder a las funcionalidades de AgendaPro.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role selection radio buttons cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    TIPO DE CUENTA O ROL *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Proveedor option */}
                    <div
                      onClick={() => setRole('provider')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        role === 'provider'
                          ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span>Proveedor</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          role === 'provider' ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {role === 'provider' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Ofrece servicios, gestiona agenda, disponibilidad y confirma reservas de clientes.
                      </p>
                    </div>

                    {/* Cliente option */}
                    <div
                      onClick={() => setRole('client')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        role === 'client'
                          ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Cliente</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          role === 'client' ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {role === 'client' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Explora servicios en línea y programa citas de manera rápida.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Full name input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Laura Morales"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="laura.morales@agendapro.co"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Passwords grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Segura</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmar contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Las contraseñas coinciden</span>
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                    />
                    <span>
                      Acepto los <span className="text-blue-600 font-semibold hover:underline">Términos de Servicio</span> y la <span className="text-blue-600 font-semibold hover:underline">Política de Privacidad</span> de AgendaPro.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer mt-2"
                >
                  <User className="w-4 h-4" />
                  <span>Crear cuenta</span>
                </button>
              </form>

              {/* Already have account */}
              <div className="text-center text-xs text-slate-500 pt-2">
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  onClick={onNavigateLogin}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Iniciar sesión
                </button>
              </div>
            </div>

            {/* Bottom info badges */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Conexión SSL segura</span>
              </div>
              <div>Versión 1.0 · Producción</div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer note */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-100 flex items-center justify-center gap-6">
        <span>AgendaPro — Sistema SaaS de Gestión y Reserva de Servicios Multi-rubro.</span>
        <div className="hidden sm:flex gap-4 text-slate-500">
          <span className="hover:underline cursor-pointer">Servicios</span>
          <span className="hover:underline cursor-pointer">Proveedores</span>
          <span className="hover:underline cursor-pointer">Términos</span>
          <span className="hover:underline cursor-pointer">Ayuda y Soporte</span>
        </div>
      </footer>
    </div>
  );
};
