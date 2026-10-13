import React, { useState, useEffect } from 'react';
import {
  UserRole,
  CurrentView,
  Booking,
  ServiceItem,
  AvailabilitySlot,
  CalendarEvent,
} from './types';
import {
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_SLOTS,
  INITIAL_CALENDAR_EVENTS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './components/screens/LoginScreen';
import { ProviderDashboard } from './components/screens/ProviderDashboard';
import { ProviderReservations } from './components/screens/ProviderReservations';
import { ProviderAgenda } from './components/screens/ProviderAgenda';
import { ProviderServices } from './components/screens/ProviderServices';
import { ProviderAvailability } from './components/screens/ProviderAvailability';
import { ClientDashboard } from './components/screens/ClientDashboard';
import { ClientExplore } from './components/screens/ClientExplore';
import { ClientBooking } from './components/screens/ClientBooking';
import { ClientReservations } from './components/screens/ClientReservations';
import { BookingConfirmationModal } from './components/modals/BookingConfirmationModal';
import { CancelBookingModal } from './components/modals/CancelBookingModal';
import { NewServiceModal } from './components/modals/NewServiceModal';
import { NewSlotModal } from './components/modals/NewSlotModal';
import { SharePublicLinkModal } from './components/modals/SharePublicLinkModal';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // Configuración de Rol
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('agendapro_role');
    return (saved as UserRole) || 'provider';
  });

  // Vista inicial obligatoria en Login al entrar a la página
  const [currentView, setCurrentView] = useState<CurrentView>('login');

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('agendapro_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('agendapro_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => {
    const saved = localStorage.getItem('agendapro_slots');
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
  });

  const [calendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('agendapro_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [selectedServiceToBook, setSelectedServiceToBook] = useState<ServiceItem>(
    services[0] || INITIAL_SERVICES[0]
  );

  // Estados de Modales
const [confirmedBookingForModal, setConfirmedBookingForModal] = useState<Booking | null>(null);
const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
const [editingService, setEditingService] = useState<ServiceItem | null>(null);

const [isNewSlotOpen, setIsNewSlotOpen] = useState(false);
const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Notificaciones Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sincronización con LocalStorage
  useEffect(() => {
    localStorage.setItem('agendapro_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('agendapro_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('agendapro_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('agendapro_slots', JSON.stringify(slots));
  }, [slots]);

  // Cambios de rol y login
  const handleSwitchRole = () => {
    if (role === 'provider') {
      setRole('client');
      setCurrentView('client-dashboard');
      showToast('Cambiado a Modo Cliente VIP (Carlos Mendoza)');
    } else {
      setRole('provider');
      setCurrentView('provider-dashboard');
      showToast('Cambiado a Modo Proveedor (Laura Morales)');
    }
  };

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'provider') {
      setCurrentView('provider-dashboard');
      showToast('¡Bienvenida, Laura Morales!');
    } else {
      setCurrentView('client-dashboard');
      showToast('¡Bienvenido, Carlos Mendoza!');
    }
  };

  const handleLogout = () => {
    setCurrentView('login');
    showToast('Sesión cerrada con éxito');
  };

  // Acciones de reservas
  const handleConfirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );
    showToast('¡Reserva confirmada con éxito! Se notificó al cliente.');
  };

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleConfirmCancelModal = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled', notes: reason } : b
      )
    );
    setBookingToCancel(null);
    showToast('Reserva cancelada y cupo liberado en el sistema.');
  };

  const handleNewBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBookingForModal(newBooking);
    showToast('¡Cita agendada con éxito!');
  };

  const handleAddService = (newService: ServiceItem) => {
    setServices((prev) => [newService, ...prev]);
    showToast(`Servicio "${newService.title}" publicado en tu catálogo.`);
  };

  const handleUpdateService = (updatedService: ServiceItem) => {
  setServices((prev) =>
    prev.map((service) =>
      service.id === updatedService.id ? updatedService : service
    )
  );

  setEditingService(null);

  showToast(`Servicio "${updatedService.title}" actualizado correctamente.`);
};

  const handleAddSlot = (newSlot: AvailabilitySlot) => {
    setSlots((prev) => [newSlot, ...prev]);
    showToast('Nueva franja horaria publicada con éxito.');
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    showToast('Franja horaria eliminada.');
  };

  const handleToggleServiceActive = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
    showToast('Estado del servicio actualizado.');
  };

  // Contadores
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const activeClientBookingsCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#0b1c30] flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Notificación flotante (Toast) */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Enrutador de pantallas */}
      {currentView === 'login' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="flex flex-1 min-h-screen">
          {/* Barra lateral */}
          <Sidebar
            role={role}
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
            pendingBookingsCount={pendingBookingsCount}
            activeClientBookingsCount={activeClientBookingsCount}
          />

          {/* Área de contenido principal */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              role={role}
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
              onSwitchRole={handleSwitchRole}
              onOpenNewService={() => setIsNewServiceOpen(true)}
              onOpenNewSlot={() => setIsNewSlotOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {/* Vistas Proveedor */}
              {currentView === 'provider-dashboard' && (
                <ProviderDashboard
                  bookings={bookings}
                  services={services}
                  slots={slots}
                  onNavigate={(view) => setCurrentView(view)}
                  onOpenNewService={() => setIsNewServiceOpen(true)}
                  onOpenNewSlot={() => setIsNewSlotOpen(true)}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onDeleteSlot={handleDeleteSlot}
                />
              )}

              {currentView === 'provider-reservations' && (
                <ProviderReservations
                  bookings={bookings}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'provider-agenda' && (
                <ProviderAgenda
                  events={calendarEvents}
                  bookings={bookings}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onOpenNewSlot={() => setIsNewSlotOpen(true)}
                />
              )}

              {currentView === 'provider-services' && (
                <ProviderServices
                  services={services}
                  onOpenNewService={() => {
                    setEditingService(null);
                    setIsNewServiceOpen(true);
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                  onToggleActive={handleToggleServiceActive}
                  onEditService={(service) => {
                    setEditingService(service);
                    setIsNewServiceOpen(true);
                  }}
                />
              )}

              {currentView === 'provider-availability' && (
                <ProviderAvailability
                  slots={slots}
                  onOpenNewSlot={() => setIsNewSlotOpen(true)}
                  onDeleteSlot={handleDeleteSlot}
                />
              )}

              {/* Vistas Cliente */}
              {currentView === 'client-dashboard' && (
                <ClientDashboard
                  bookings={bookings}
                  services={services}
                  onNavigate={(view) => setCurrentView(view)}
                  onSelectServiceToBook={(srv) => {
                    setSelectedServiceToBook(srv);
                    setCurrentView('client-booking');
                  }}
                  onCancelBooking={handleCancelBooking}
                />
              )}

              {currentView === 'client-explore' && (
                <ClientExplore
                  services={services}
                  onNavigate={(view) => setCurrentView(view)}
                  onSelectServiceToBook={(srv) => {
                    setSelectedServiceToBook(srv);
                    setCurrentView('client-booking');
                  }}
                />
              )}

              {currentView === 'client-booking' && (
                <ClientBooking
                  service={selectedServiceToBook}
                  onNavigate={(view) => setCurrentView(view)}
                  onConfirmNewBooking={handleNewBookingCreated}
                />
              )}

              {currentView === 'client-reservations' && (
                <ClientReservations
                  bookings={bookings}
                  onNavigate={(view) => setCurrentView(view)}
                  onCancelBooking={handleCancelBooking}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Modales */}
      <BookingConfirmationModal
        booking={confirmedBookingForModal}
        onClose={() => setConfirmedBookingForModal(null)}
        onGoToReservations={() => {
          setConfirmedBookingForModal(null);
          setRole('client');
          setCurrentView('client-reservations');
        }}
      />

      <CancelBookingModal
        booking={bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirmCancel={handleConfirmCancelModal}
      />

      <NewServiceModal
        isOpen={isNewServiceOpen}
        onClose={() => {
          setIsNewServiceOpen(false);
          setEditingService(null);
        }}
        onAddService={handleAddService}
        editingService={editingService}
        onUpdateService={handleUpdateService}
      />

      <NewSlotModal
        isOpen={isNewSlotOpen}
        onClose={() => setIsNewSlotOpen(false)}
        onAddSlot={handleAddSlot}
      />

      <SharePublicLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenClientView={() => {
          setRole('client');
          setCurrentView('client-booking');
        }}
      />
    </div>
  );
}

export default App;