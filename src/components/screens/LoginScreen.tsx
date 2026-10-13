import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('provider');
  const [email, setEmail] = useState('laura.morales@agendapro.co');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'provider') {
      setEmail('laura.morales@agendapro.co');
      setPassword('••••••••••••');
    } else {
      setEmail('carlos.mendoza@email.com');
      setPassword('••••••••••••');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <header className="border-b border-[#e5eaf2] bg-white px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <span className="material-symbols-outlined text-2xl">event_upcoming</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#0b1c30] font-display">
              AgendaPro
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-600">
          ¿Aún no tienes cuenta?{' '}
          <button
            onClick={() => onLogin('client')}
            className="text-blue-700 font-bold hover:underline"
          >
            Crear cuenta
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Col: Hero Welcome */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight leading-[1.15] font-display">
            Bienvenido de vuelta a tu espacio en{' '}
            <span className="text-blue-700">AgendaPro</span>.
          </h1>

          <p className="text-slate-600 text-base leading-relaxed max-w-xl">
            Accede con tu cuenta para gestionar tus servicios, revisar solicitudes pendientes
            y organizar tu agenda de manera eficiente y centralizada.
          </p>

          {/* Quick Profile Switcher Preview Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-lg">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Perfiles listos para demostración
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Laura Morales */}
              <button
                type="button"
                onClick={() => handleSelectRole('provider')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  selectedRole === 'provider'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC01S9TmngYbMx1mcz1769UTr0MwfdANXcck-mr_a1Aky0nR-UOZpZIBD8QP316pQqWVSJVPCEKbsZIWVWBoqAl1IJOLpSB3shCG2Z9ta8dgVJbfTd5Vya-qoOl2Pc6CfyIpLI_CJSYdsXf8MAFzBtstqUjSZIR4bJXsscMm4YNhIMpiVnWTv3bDmrwkADMfgOwRYn1eCKQSHefjoxh0N0zD-IPnuE427de4wwSgFq9ePhQVf_Fu_Q5dQ"
                  alt="Laura Morales"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Laura Morales</div>
                  <div className="text-[11px] font-medium text-blue-700">Proveedor · Negocio</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    18 cupos • 3 pendientes
                  </span>
                </div>
              </button>

              {/* Carlos Mendoza */}
              <button
                type="button"
                onClick={() => handleSelectRole('client')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  selectedRole === 'client'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Carlos Mendoza"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Carlos Mendoza</div>
                  <div className="text-[11px] font-medium text-emerald-700">Cliente VIP</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    2 reservas activas
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Flow Checkpoints */}
          <div className="pt-2 space-y-2.5 max-w-lg">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Validación de credenciales y roles en tiempo real</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Detección automática de panel (Proveedor Laura o Cliente Carlos)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sincronización instantánea de citas, cupos y reservas</span>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-display">
                Iniciar sesión
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tus credenciales para continuar al panel de control.
              </p>
            </div>

            {/* Role indicator tab */}
            <div className="mb-5 p-1 bg-slate-100 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => handleSelectRole('provider')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'provider'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Laura (Proveedor)
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('client')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'client'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Carlos (Cliente)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                    placeholder="ejemplo@agendapro.co"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-blue-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                    placeholder="Tu contraseña secreta"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Recordar sesión en este equipo</span>
                </label>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                className="w-full mt-2 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition-all"
              >
                <span>Iniciar sesión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-left">
              <p className="text-[11px] font-semibold text-blue-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Acceso demo rápido
              </p>
              <p className="text-[11px] text-blue-700/80 mt-0.5">
                Presiona "Iniciar sesión" directamente para entrar al panel con el rol seleccionado.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5eaf2] bg-white py-4 px-6 text-center text-xs text-slate-400">
        © 2026 AgendaPro Inc. • Plataforma de gestión de reservas, citas y servicios para profesionales y clientes.
      </footer>
    </div>
  );
};