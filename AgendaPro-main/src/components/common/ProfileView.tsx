import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Calendar, 
  Save, 
  Check, 
  Sparkles,
  Camera,
  Scissors
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSwitchRole: (role: 'provider' | 'client') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onSwitchRole
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+57 300 123 4567');
  const [businessName, setBusinessName] = useState(currentUser.businessName || 'Studio Profesional');
  const [saved, setSaved] = useState(false);

  const isProvider = currentUser.role === 'provider';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      businessName
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-7 font-sans">
      
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full inline-block mb-1">
          CONFIGURACIÓN DE CUENTA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
          Perfil & Preferencias
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Administra la información de tu cuenta, datos de contacto y modalidad operativa.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Avatar and Role */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="relative">
            {isProvider ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold">
                CM
              </div>
            )}
            <button className="absolute bottom-0 right-0 p-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full shadow-xs">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {isProvider ? 'Rol: Proveedor de Servicios' : 'Rol: Cliente Preferente VIP'}
              </span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Cuenta Verificada
              </span>
            </div>
          </div>

          {/* Quick role switch button */}
          <button
            onClick={() => onSwitchRole(isProvider ? 'client' : 'provider')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Cambiar a modo {isProvider ? 'Cliente' : 'Proveedor'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {isProvider && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Comercial o Estudio</label>
                <div className="relative">
                  <Scissors className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Notificaciones y Canales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded-sm" />
                <div>
                  <div className="font-semibold text-slate-800">Alertas por WhatsApp</div>
                  <div className="text-[11px] text-slate-500">Recordatorios de reserva 2 horas antes</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded-sm" />
                <div>
                  <div className="font-semibold text-slate-800">Sincronización en la nube</div>
                  <div className="text-[11px] text-slate-500">Actualizar calendario de Google automáticamente</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Cambios Guardados' : 'Guardar Cambios'}</span>
            </button>

            {saved && (
              <span className="text-xs text-emerald-600 font-semibold animate-fade-in">
                ¡Información actualizada correctamente!
              </span>
            )}
          </div>
        </form>

      </div>

    </div>
  );
};
