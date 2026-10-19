import React, { useState } from 'react';
import { UserRole, CurrentView } from '../types';
import {
  Search,
  Calendar,
  Plus,
  Bell,
  Briefcase,
  Clock,
  Ban,
  ArrowLeftRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  onSwitchRole: () => void;
  onOpenNewService: () => void;
  onOpenNewSlot: () => void;
  onOpenShareModal: () => void;
  currentUserName: string;
  currentUserEmail: string;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  currentView,
  onNavigate,
  onSwitchRole,
  onOpenNewService,
  onOpenNewSlot,
  onOpenShareModal,
  currentUserName,
  currentUserEmail,
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      id="app-header"
      className="bg-white/95 backdrop-blur-md border-b border-[#e5eaf2] h-16 px-6 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              role === 'provider'
                ? 'Buscar servicio, cliente o fecha...'
                : 'Buscar servicio, categoría o profesional...'
            }
            className="w-full pl-9 pr-12 py-1.5 bg-[#f5f7fc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {/* Share Public Link Button (Provider mode) */}
        {role === 'provider' && (
          <button
            onClick={onOpenShareModal}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Enlace de Reserva</span>
          </button>
        )}

        {/* Quick Action Dropdown for Provider */}
        {role === 'provider' && (
          <div className="relative">
            <button
              id="header-action-button"
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Acción</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>

            {showActionMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    onOpenNewService();
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Nuevo servicio</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    onOpenNewSlot();
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Publicar horario libre</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    onNavigate('provider-agenda');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-700 rounded-lg transition-colors"
                >
                  <Ban className="w-4 h-4 text-amber-500" />
                  <span>Bloquear franja en agenda</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Toggle Switcher */}
        <button
          id="header-switch-role"
          onClick={onSwitchRole}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            role === 'provider'
              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
          title="Cerrar sesión para entrar con otra cuenta"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir / Cambiar cuenta</span>
          <span className="sm:hidden">Salir</span>
        </button>

        {/* Notifications: el prototipo todavía no tiene un servicio de notificaciones */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notificaciones"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="text-xs font-bold text-slate-800 mb-2">Notificaciones</div>
              <p className="text-xs text-slate-500">No hay notificaciones disponibles en este prototipo.</p>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-extrabold ring-2 ring-blue-50">
            {currentUserName.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase() || '').join('')}
          </div>
          <div className="hidden md:block text-left leading-tight max-w-40">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUserName}</p>
            <p className="text-[10px] font-semibold text-slate-500 truncate">{currentUserEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
