import React, { useState } from 'react';
import { 
  PROVIDER_LAURA, 
  CLIENT_CARLOS, 
  INITIAL_SERVICES, 
  INITIAL_BOOKINGS, 
  INITIAL_SLOTS, 
  INITIAL_ACTIVITIES 
} from './data/mockData';
import { 
  UserProfile, 
  UserRole, 
  ServiceItem, 
  Booking, 
  TimeSlot, 
  ActivityItem 
} from './types';
import { Sidebar, ActiveNavKey } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ClientHomeView } from './components/client/ClientHomeView';
import { ClientExploreServicesView } from './components/client/ClientExploreServicesView';
import { ClientBookingView } from './components/client/ClientBookingView';
import { ClientBookingsView } from './components/client/ClientBookingsView';
import { ProviderDashboardView } from './components/provider/ProviderDashboardView';
import { ProviderServicesView } from './components/provider/ProviderServicesView';
import { ProviderAvailabilityView } from './components/provider/ProviderAvailabilityView';
import { ProviderBookingsView } from './components/provider/ProviderBookingsView';
import { ProviderCalendarView } from './components/provider/ProviderCalendarView';
import { ProfileView } from './components/common/ProfileView';
import { BookingDetailModal } from './components/common/BookingDetailModal';
import { Sparkles, Eye, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function App() {
  // Authentication & Current User
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(PROVIDER_LAURA);
  
  // Navigation
  const [activeNav, setActiveNav] = useState<ActiveNavKey>('provider-dashboard');
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // Application Data State
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [slots, setSlots] = useState<TimeSlot[]>(INITIAL_SLOTS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Active Flow Items
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<ServiceItem>(INITIAL_SERVICES[0]);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch role helper
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'provider') {
      setCurrentUser(PROVIDER_LAURA);
      setActiveNav('provider-dashboard');
      setIsLoggedIn(true);
      showToast('Cambiado a modo Proveedor (Laura Morales)');
    } else {
      setCurrentUser(CLIENT_CARLOS);
      setActiveNav('client-home');
      setIsLoggedIn(true);
      showToast('Cambiado a modo Cliente (Carlos Mendoza)');
    }
  };

  const handleLogin = (role: UserRole, email: string) => {
    setIsLoggedIn(true);
    if (role === 'provider') {
      setCurrentUser({ ...PROVIDER_LAURA, email });
      setActiveNav('provider-dashboard');
      showToast('Bienvenida Laura Morales a tu Workspace');
    } else {
      setCurrentUser({ ...CLIENT_CARLOS, email });
      setActiveNav('client-home');
      showToast('Bienvenido Carlos Mendoza');
    }
  };

  const handleRegisterSuccess = (role: UserRole, name: string, email: string) => {
    setIsLoggedIn(true);
    if (role === 'provider') {
      setCurrentUser({
        ...PROVIDER_LAURA,
        name,
        email,
        businessName: `${name} Studio`
      });
      setActiveNav('provider-dashboard');
      showToast(`Cuenta de Proveedor creada para ${name}`);
    } else {
      setCurrentUser({
        ...CLIENT_CARLOS,
        name,
        email
      });
      setActiveNav('client-home');
      showToast(`Cuenta de Cliente creada para ${name}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthScreen('login');
    showToast('Sesión cerrada con éxito');
  };

  // Actions
  const handleAddService = (newSvcData: Partial<ServiceItem>) => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: newSvcData.title || 'Nuevo Servicio',
      subtitle: 'Laura Morales Studio',
      description: newSvcData.description || 'Descripción del servicio.',
      category: newSvcData.category || 'Barbería & Belleza',
      categoryBadge: (newSvcData.category || 'BARBERÍA').toUpperCase(),
      durationMinutes: newSvcData.durationMinutes || 45,
      modality: newSvcData.modality || 'Presencial',
      priceCOP: newSvcData.priceCOP || 30000,
      status: 'active',
      rating: 5.0,
      reviewsCount: 1,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      providerRoleTitle: 'Especialista Certificado',
      location: 'Sede Principal, Bogotá',
      image: '/src/assets/images/barber_shop_chair_1791857352646.jpg'
    };
    setServices([newService, ...services]);
    showToast(`Servicio "${newService.title}" creado con éxito en catálogo.`);
  };

  const handleToggleServiceStatus = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        showToast(`Servicio ${s.title} marcado como ${nextStatus === 'active' ? 'Activo' : 'Inactivo'}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleAddSlot = (newSlotData: Partial<TimeSlot>) => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      dateStr: newSlotData.dateStr || '2024-10-28',
      dayLabel: newSlotData.dayLabel || 'Lunes, 28 Octubre',
      time: newSlotData.time || '08:00 AM',
      endTime: newSlotData.endTime || '09:00 AM',
      serviceId: newSlotData.serviceId || 'srv-1',
      serviceName: newSlotData.serviceName || 'Servicio Publicado',
      status: 'available',
      priceCOP: newSlotData.priceCOP || 25000,
      modality: newSlotData.modality || 'Presencial'
    };
    setSlots([newSlot, ...slots]);
    showToast('Horario publicado exitosamente en agenda pública');
  };

  const handleToggleSlotStatus = (slotId: string) => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const nextStatus = s.status === 'available' ? 'withdrawn' : 'available';
        showToast(nextStatus === 'available' ? 'Horario reactivado' : 'Horario retirado de la agenda');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleConfirmBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        showToast(`Cita ${b.code} confirmada. Notificación enviada al cliente.`);
        return { ...b, status: 'confirmed' };
      }
      return b;
    }));
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        showToast(`Cita ${b.code} cancelada exitosamente.`);
        return { ...b, status: 'cancelled', cancelReason: 'Cancelada por el usuario' };
      }
      return b;
    }));
  };

  const handleBookingConfirmedByClient = (newBookingData: Partial<Booking>) => {
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      code: newBookingData.code || `#RS-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone || '+57 300 892 4110',
      clientId: currentUser.id,
      serviceId: newBookingData.serviceId || 'srv-1',
      serviceTitle: newBookingData.serviceTitle || 'Servicio',
      providerName: newBookingData.providerName || 'Laura Morales Studio',
      providerAvatar: newBookingData.providerAvatar || '/src/assets/images/laura_morales_avatar_1791857350988.jpg',
      dateStr: newBookingData.dateStr || '2024-10-27',
      dateDisplay: newBookingData.dateDisplay || 'Jueves, 27 de Octubre de 2024',
      timeDisplay: newBookingData.timeDisplay || '11:00 AM',
      timeRange: newBookingData.timeRange || '11:00 AM - 11:45 AM',
      durationMinutes: newBookingData.durationMinutes || 45,
      priceCOP: newBookingData.priceCOP || 25000,
      modality: newBookingData.modality || 'Presencial',
      status: 'confirmed',
      address: newBookingData.address,
      notes: newBookingData.notes,
      periodOfDay: 'Mañana'
    };

    setBookings([newBooking, ...bookings]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: 'Cita Agendada y Confirmada',
      description: `Reservaste ${newBooking.serviceTitle} para el ${newBooking.dateDisplay}.`,
      timestamp: 'Ahora',
      type: 'confirmed'
    };
    setActivities([newActivity, ...activities]);
    showToast(`¡Reserva ${newBooking.code} confirmada con éxito!`);
  };

  // If user is on Auth screens
  if (!isLoggedIn) {
    if (authScreen === 'register') {
      return (
        <RegisterView
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateLogin={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginView
        onLogin={handleLogin}
        onNavigateRegister={() => setAuthScreen('register')}
      />
    );
  }

  // Render Logged-In Workspace
  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col font-sans">
      
      {/* Top Demo Screen Quick Navigator Bar */}
      <div className="bg-[#0B1C30] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200">AgendaPro Interactive Demo:</span>
          <span className="text-slate-400 hidden sm:inline">Explora las 14 pantallas del sistema:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Provider screens */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <span className="text-[10px] font-bold text-blue-300 px-2 uppercase">PROVEEDOR:</span>
            <button
              onClick={() => {
                setCurrentUser(PROVIDER_LAURA);
                setActiveNav('provider-dashboard');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'provider' && activeNav === 'provider-dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentUser(PROVIDER_LAURA);
                setActiveNav('provider-services');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'provider' && activeNav === 'provider-services'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mis Servicios
            </button>
            <button
              onClick={() => {
                setCurrentUser(PROVIDER_LAURA);
                setActiveNav('provider-availability');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'provider' && activeNav === 'provider-availability'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Disponibilidad
            </button>
            <button
              onClick={() => {
                setCurrentUser(PROVIDER_LAURA);
                setActiveNav('provider-bookings');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'provider' && activeNav === 'provider-bookings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Reservas
            </button>
            <button
              onClick={() => {
                setCurrentUser(PROVIDER_LAURA);
                setActiveNav('provider-calendar');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'provider' && activeNav === 'provider-calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mi Agenda
            </button>
          </div>

          {/* Client screens */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <span className="text-[10px] font-bold text-emerald-300 px-2 uppercase">CLIENTE:</span>
            <button
              onClick={() => {
                setCurrentUser(CLIENT_CARLOS);
                setActiveNav('client-home');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'client' && activeNav === 'client-home'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => {
                setCurrentUser(CLIENT_CARLOS);
                setActiveNav('client-services');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'client' && activeNav === 'client-services'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Explorar
            </button>
            <button
              onClick={() => {
                setCurrentUser(CLIENT_CARLOS);
                setSelectedServiceToBook(services[0]);
                setActiveNav('client-booking' as any);
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'client' && (activeNav as any) === 'client-booking'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Agendar Cita
            </button>
            <button
              onClick={() => {
                setCurrentUser(CLIENT_CARLOS);
                setActiveNav('client-bookings');
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                currentUser.role === 'client' && activeNav === 'client-bookings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mis Reservas
            </button>
          </div>

          {/* Auth screens */}
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setAuthScreen('login');
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-slate-700"
          >
            Pantalla Login
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setAuthScreen('register');
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-slate-700"
          >
            Pantalla Registro
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex flex-1">
        
        {/* Persistent Left Sidebar */}
        <Sidebar
          currentUser={currentUser}
          activeNav={activeNav}
          onNavigate={(key) => setActiveNav(key)}
          onLogout={handleLogout}
        />

        {/* Right Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <Navbar
            currentUser={currentUser}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onQuickAction={(action) => {
              if (action === 'service') setActiveNav('provider-services');
              if (action === 'slot') setActiveNav('provider-availability');
              if (action === 'agenda') setActiveNav('provider-calendar');
            }}
            onSwitchRole={handleSwitchRole}
          />

          <main className="flex-1 pb-16">
            
            {/* PROVIDER SCREENS */}
            {currentUser.role === 'provider' && (
              <>
                {activeNav === 'provider-dashboard' && (
                  <ProviderDashboardView
                    bookings={bookings}
                    services={services}
                    slots={slots}
                    onNavigateServices={() => setActiveNav('provider-services')}
                    onNavigateAvailability={() => setActiveNav('provider-availability')}
                    onNavigateBookings={() => setActiveNav('provider-bookings')}
                    onNavigateCalendar={() => setActiveNav('provider-calendar')}
                    onPreviewClientView={() => handleSwitchRole('client')}
                    onConfirmBooking={handleConfirmBooking}
                  />
                )}

                {activeNav === 'provider-services' && (
                  <ProviderServicesView
                    services={services}
                    onAddService={handleAddService}
                    onToggleStatus={handleToggleServiceStatus}
                  />
                )}

                {activeNav === 'provider-availability' && (
                  <ProviderAvailabilityView
                    slots={slots}
                    services={services}
                    onAddSlot={handleAddSlot}
                    onToggleSlotStatus={handleToggleSlotStatus}
                  />
                )}

                {activeNav === 'provider-bookings' && (
                  <ProviderBookingsView
                    bookings={bookings}
                    onConfirmBooking={handleConfirmBooking}
                    onCancelBooking={handleCancelBooking}
                    onViewBookingDetails={(b) => setSelectedBookingForModal(b)}
                  />
                )}

                {activeNav === 'provider-calendar' && (
                  <ProviderCalendarView
                    bookings={bookings}
                    services={services}
                    onConfirmBooking={handleConfirmBooking}
                    onCancelBooking={handleCancelBooking}
                  />
                )}
              </>
            )}

            {/* CLIENT SCREENS */}
            {currentUser.role === 'client' && (
              <>
                {activeNav === 'client-home' && (
                  <ClientHomeView
                    services={services}
                    bookings={bookings}
                    activities={activities}
                    onNavigateExplore={() => setActiveNav('client-services')}
                    onNavigateMyBookings={() => setActiveNav('client-bookings')}
                    onSelectServiceToBook={(svc) => {
                      setSelectedServiceToBook(svc);
                      setActiveNav('client-booking' as any);
                    }}
                    onCancelBooking={handleCancelBooking}
                    onViewBookingDetails={(b) => setSelectedBookingForModal(b)}
                  />
                )}

                {activeNav === 'client-services' && (
                  <ClientExploreServicesView
                    services={services}
                    onSelectService={(svc) => {
                      setSelectedServiceToBook(svc);
                      setActiveNav('client-booking' as any);
                    }}
                  />
                )}

                {(activeNav as any) === 'client-booking' && (
                  <ClientBookingView
                    service={selectedServiceToBook}
                    onBack={() => setActiveNav('client-services')}
                    onBookingConfirmed={handleBookingConfirmedByClient}
                    onNavigateMyBookings={() => setActiveNav('client-bookings')}
                  />
                )}

                {activeNav === 'client-bookings' && (
                  <ClientBookingsView
                    bookings={bookings}
                    onCancelBooking={handleCancelBooking}
                    onViewBookingDetails={(b) => setSelectedBookingForModal(b)}
                    onRebook={(b) => {
                      const svc = services.find(s => s.id === b.serviceId) || services[0];
                      setSelectedServiceToBook(svc);
                      setActiveNav('client-booking' as any);
                    }}
                  />
                )}
              </>
            )}

            {/* COMMON: PROFILE VIEW */}
            {activeNav === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUpdateProfile={(updated) => {
                  setCurrentUser(prev => ({ ...prev, ...updated }));
                  showToast('Perfil actualizado');
                }}
                onSwitchRole={handleSwitchRole}
              />
            )}

          </main>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1C30] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 text-xs border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
