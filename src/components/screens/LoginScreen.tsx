import React, { useState } from 'react';
import { BriefcaseBusiness, Eye, EyeOff, Lock, Mail, UserRound, ArrowRight, UserPlus } from 'lucide-react';
import { UserRole } from '../../types';
import { AuthResult } from '../../data/authStorage';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<AuthResult>;
  onRegister: (name: string, email: string, password: string, role: UserRole) => Promise<AuthResult>;
}

type AuthMode = 'login' | 'register';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('client');
    setAcceptTerms(false);
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }
      if (!acceptTerms) {
        setErrorMessage('Debes aceptar los términos para crear tu cuenta.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = mode === 'login'
        ? await onLogin(email, password)
        : await onRegister(name, email, password, role);
      if (!result.success) setErrorMessage(result.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className="border-b border-[#e5eaf2] bg-white px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <BriefcaseBusiness className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0b1c30]">AgendaPro</span>
        </div>
        <div className="text-xs text-slate-600">
          {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
          <button
            type="button"
            onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-700 font-bold hover:underline"
          >
            {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-6 py-10 my-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section className="space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight leading-tight">
            {mode === 'login' ? 'Ingresa a tu espacio en ' : 'Crea tu cuenta en '}
            <span className="text-blue-700">AgendaPro.</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
            {mode === 'login'
              ? 'Inicia sesión con el correo y la contraseña que registraste. Los campos comienzan vacíos.'
              : 'Regístrate como proveedor para publicar servicios y horarios, o como cliente para consultar la disponibilidad y solicitar citas.'}
          </p>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-950">
            <p className="font-bold mb-1">Datos limpios</p>
            <p className="text-xs leading-relaxed text-blue-900/80">
              Las cuentas nuevas no reciben servicios, horarios ni reservas de demostración. Los servicios y horarios que publique un proveedor aparecerán en el catálogo para que los clientes puedan consultarlos.
            </p>
          </div>
        </section>

        <section className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login' ? 'Escribe tus credenciales para continuar.' : 'Completa tus datos para registrarte.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="register-name" className="block text-xs font-bold text-slate-700 mb-1.5">Nombre completo</label>
                  <div className="relative">
                    <UserRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input id="register-name" type="text" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre completo" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de cuenta</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setRole('client')} className={`p-3 rounded-xl border text-xs font-bold transition-colors ${role === 'client' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>Cliente</button>
                    <button type="button" onClick={() => setRole('provider')} className={`p-3 rounded-xl border text-xs font-bold transition-colors ${role === 'provider' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>Proveedor</button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ejemplo@correo.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="auth-password" type={showPassword ? 'text' : 'password'} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : 'Tu contraseña'} className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                <button type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">Confirmar contraseña</label>
                  <input id="auth-confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite la contraseña" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300" />
                  <span>Acepto los términos y la política de privacidad de AgendaPro.</span>
                </label>
              </>
            )}

            {errorMessage && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition-all">
              {mode === 'login' ? <ArrowRight className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isSubmitting ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</span>
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-[#e5eaf2] bg-white py-4 px-6 text-center text-xs text-slate-400">
        AgendaPro · Prototipo académico de agenda de servicios
      </footer>
    </div>
  );
};
