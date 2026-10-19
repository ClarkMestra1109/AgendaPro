import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  Info, 
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { AgendaProLogo } from '../common/AgendaProLogo';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLogin: (role: UserRole, email: string) => void;
  onNavigateRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onNavigateRegister
}) => {
  const [email, setEmail] = useState('laura.morales@agendapro.co');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Detect role based on email or user preference
  const detectedRole: UserRole = email.includes('carlos') || email.includes('cliente') ? 'client' : 'provider';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(detectedRole, email);
  };

  const handleQuickFill = (role: UserRole) => {
    if (role === 'provider') {
      setEmail('laura.morales@agendapro.co');
      setPassword('password123');
    } else {
      setEmail('carlos.mendoza@gmail.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col font-sans">
      {/* Top Bar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <AgendaProLogo size="md" />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Acceso Seguro de Usuarios</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 hidden sm:inline">¿Aún no tienes cuenta?</span>
          <button
            onClick={onNavigateRegister}
            className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
          >
            Crear cuenta
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          
          {/* Left Column: Brand Hero & Quick Provider Snapshot */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 tracking-wide uppercase">
              <span>ACCESO SEGURO · AUTENTICACIÓN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C30] tracking-tight leading-tight">
              Bienvenido de vuelta a tu espacio en <span className="text-[#2563EB]">AgendaPro</span>.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Inicia sesión para gestionar tus servicios, habilitar y retirar horarios disponibles, y confirmar las reservas de tus clientes en tiempo real.
            </p>

            {/* Provider Quick Preview Badge */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <img
                src="/src/assets/images/laura_morales_avatar_1791857350988.jpg"
                alt="Laura Morales"
                className="w-13 h-13 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm truncate">Laura Morales Studio</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    Proveedor
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate">laura.morales@agendapro.co</div>
                <div className="text-xs text-blue-600 font-medium flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>18 cupos libres · 3 reservas pendientes</span>
                </div>
              </div>
            </div>

            {/* Quick Access Checklist matching screenshot */}
            <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl text-xs space-y-2.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACCESO RÁPIDO:
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="line-through">Crear cuenta (Rol Proveedor)</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-semibold text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </div>
                  <span>Iniciar sesión con credenciales</span>
                </div>
                <span className="text-[11px] text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md font-bold">
                  Actual
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                  3
                </div>
                <span>Acceso directo a Dashboard del Proveedor</span>
              </div>
            </div>
          </div>

          {/* Right Column: Iniciar sesión Form Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-sm p-7 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0B1C30]">
                  Iniciar sesión
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  PROVEEDORES Y CLIENTES
                </span>
              </div>

              <p className="text-xs text-slate-500 -mt-3">
                Ingresa tus credenciales para acceder a tu panel de gestión.
              </p>

              {/* Demo auto-fill shortcuts */}
              <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill('provider')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                    detectedRole === 'provider' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Demo Proveedor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('client')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                    detectedRole === 'client' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Demo Cliente
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Para esta demostración, puedes usar cualquier contraseña o las credenciales automáticas.')}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & role detector */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                    />
                    <span>Recordar sesión</span>
                  </label>

                  <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <span>Rol detectado:</span>
                    <span className="font-bold text-blue-600 capitalize">
                      {detectedRole === 'provider' ? 'Proveedor' : 'Cliente'}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>Iniciar sesión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Demo disclaimer notice matching screenshot */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-2.5 text-[11px] text-slate-600 leading-normal">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Acceso de Demostración:</span> Al pulsar "Iniciar sesión", serás redirigido automáticamente al {detectedRole === 'provider' ? 'Dashboard del Proveedor' : 'Dashboard del Cliente'} para explorar y gestionar citas.
                </div>
              </div>

              {/* Footer register link */}
              <div className="text-center text-xs text-slate-500 pt-1">
                ¿No tienes una cuenta aún?{' '}
                <button
                  onClick={onNavigateRegister}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Crear cuenta gratis
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer text */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        AgendaPro Cloud v1.0 · Sistema Seguro
      </footer>
    </div>
  );
};
