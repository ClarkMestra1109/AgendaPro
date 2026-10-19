import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Bell, 
  Plus, 
  ChevronDown, 
  Check, 
  Sparkles,
  Clock,
  Scissors
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentUser: UserProfile;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onQuickAction?: (action: 'service' | 'slot' | 'agenda') => void;
  onSwitchRole: (role: 'provider' | 'client') => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  searchTerm,
  onSearchChange,
  onQuickAction,
  onSwitchRole,
  unreadNotificationsCount = 2
}) => {
  const isProvider = currentUser.role === 'provider';
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isProvider
                ? 'Buscar cita, cliente, servicio... (Ctrl+K)'
                : 'Buscar citas, tratamientos, locales o profesionales...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Right Tools & User Info */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* Date Display Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{isProvider ? 'Miércoles, 24 Octubre 2024' : 'Hoy, 24 Octubre 2024'}</span>
        </div>

        {/* Provider "+ + Acción" dropdown */}
        {isProvider && (
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Acción</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>

            {showActionMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-40 text-xs"
                onClick={() => setShowActionMenu(false)}
              >
                <button
                  onClick={() => onQuickAction && onQuickAction('service')}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                >
                  <Scissors className="w-4 h-4 text-blue-600" />
                  <span>Crear nuevo servicio</span>
                </button>
                <button
                  onClick={() => onQuickAction && onQuickAction('slot')}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                >
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Publicar horarios</span>
                </button>
                <button
                  onClick={() => onQuickAction && onQuickAction('agenda')}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Ver mi agenda semanal</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 text-xs"
              onClick={() => setShowNotifications(false)}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-900">
                <span>Notificaciones recientes</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">2 nuevas</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="font-semibold text-slate-800">Nueva solicitud de reserva</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Carlos Mendoza solicitó Corte & Perfilado para Jue 27 Oct 11:00 AM.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Hace 15 minutos</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-800">Recordatorio sincronizado</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Calendario de Google actualizado automáticamente.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Hace 2 horas</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Toggle & Profile */}
        <div className="relative border-l border-slate-200 pl-3">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded-lg transition-colors text-left"
          >
            {isProvider ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                CM
              </div>
            )}
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                {currentUser.subtitle}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 text-xs"
              onClick={() => setShowRoleMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-slate-500 text-[11px]">{currentUser.email}</div>
                <div className="mt-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-sm inline-block">
                  {isProvider ? 'Modo Proveedor Activo' : 'Modo Cliente Activo'}
                </div>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Cambiar vista de demostración
              </div>

              <button
                onClick={() => onSwitchRole('provider')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                  isProvider ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Laura Morales</div>
                    <div className="text-[10px] text-slate-500">Panel de Proveedor & Agenda</div>
                  </div>
                </div>
                {isProvider && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => onSwitchRole('client')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mt-1 ${
                  !isProvider ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">C</div>
                  <div>
                    <div className="font-semibold">Carlos Mendoza</div>
                    <div className="text-[10px] text-slate-500">Panel de Cliente & Reservas</div>
                  </div>
                </div>
                {!isProvider && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
