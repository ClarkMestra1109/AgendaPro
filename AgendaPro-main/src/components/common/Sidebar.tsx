import React from 'react';
import { 
  LayoutDashboard, 
  Scissors, 
  Clock, 
  CalendarCheck, 
  CalendarDays, 
  User, 
  Compass, 
  LogOut, 
  CheckCircle2
} from 'lucide-react';
import { AgendaProLogo } from './AgendaProLogo';
import { UserProfile } from '../../types';

export type ActiveNavKey = 
  | 'provider-dashboard'
  | 'provider-services'
  | 'provider-availability'
  | 'provider-bookings'
  | 'provider-calendar'
  | 'client-home'
  | 'client-services'
  | 'client-bookings'
  | 'profile';

interface SidebarProps {
  currentUser: UserProfile;
  activeNav: ActiveNavKey;
  onNavigate: (key: ActiveNavKey) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeNav,
  onNavigate,
  onLogout
}) => {
  const isProvider = currentUser.role === 'provider';

  const providerNavItems: { key: ActiveNavKey; label: string; icon: React.ReactNode }[] = [
    { key: 'provider-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'provider-services', label: 'Mis servicios', icon: <Scissors className="w-5 h-5" /> },
    { key: 'provider-availability', label: 'Disponibilidad', icon: <Clock className="w-5 h-5" /> },
    { key: 'provider-bookings', label: 'Reservas', icon: <CalendarCheck className="w-5 h-5" /> },
    { key: 'provider-calendar', label: 'Mi agenda', icon: <CalendarDays className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  const clientNavItems: { key: ActiveNavKey; label: string; icon: React.ReactNode }[] = [
    { key: 'client-home', label: 'Inicio', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'client-services', label: 'Explorar servicios', icon: <Compass className="w-5 h-5" /> },
    { key: 'client-bookings', label: 'Mis reservas', icon: <CalendarCheck className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = isProvider ? providerNavItems : clientNavItems;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between min-h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 pb-6 border-b border-slate-100 flex items-center">
          <AgendaProLogo size="md" showSubtitle subtitleText={isProvider ? 'SAAS WORKSPACE' : 'WORKSPACE'} />
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-3">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with user profile info */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Logout action */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/60 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
          <span>Cerrar sesión</span>
        </button>

        {/* User plan badge or client info */}
        {isProvider ? (
          <div className="p-3 bg-[#F8FAFF] rounded-lg border border-blue-100/70 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#1E3A8A] uppercase tracking-wider mb-0.5">
              <span>PLAN PROFESIONAL</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-medium text-slate-800 truncate">{currentUser.businessName || 'Laura Morales Studio'}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sincronización activa</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#F8FAFF] rounded-lg border border-slate-200/80 flex items-center gap-2.5 text-xs">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Cliente VIP</span>
                <span>·</span>
                <span className="text-emerald-600 font-medium">Activa</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
