import React, { useState, useEffect } from 'react';
import { AuthenticatedUser, authenticateAccount, registerAccount } from './data/authStorage';
import {
  UserRole,
  CurrentView,
  Booking,
  ServiceItem,
  AvailabilitySlot,
  CalendarEvent,
} from './types';
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
import { ClientProfile,
  type ClientProfileData,
} from './components/screens/ClientProfile';
import { BookingConfirmationModal } from './components/modals/BookingConfirmationModal';
import { CancelBookingModal } from './components/modals/CancelBookingModal';
import { NewServiceModal } from './components/modals/NewServiceModal';
import { NewSlotModal } from './components/modals/NewSlotModal';
import { SharePublicLinkModal } from './components/modals/SharePublicLinkModal';
import { RescheduleBookingModal } from './components/modals/RescheduleBookingModal';
import { CheckCircle2 } from 'lucide-react'

function leerListaGuardada<T>(clave: string): T[] {
  try {
    const guardado = localStorage.getItem(clave);
    if (!guardado) return [];
    const datos: unknown = JSON.parse(guardado);
    return Array.isArray(datos) ? (datos as T[]) : [];
  } catch {
    return [];
  }
}

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [role, setRole] = useState<UserRole>('client');
  const [currentView, setCurrentView] = useState<CurrentView>('login');

  // Los arreglos empiezan vacíos: ya no se importan reservas, servicios ni horarios de demostración.
  const [bookings, setBookings] = useState<Booking[]>(() => leerListaGuardada<Booking>('agendapro_bookings_v2'));
  const [services, setServices] = useState<ServiceItem[]>(() => leerListaGuardada<ServiceItem>('agendapro_services_v2'));
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => leerListaGuardada<AvailabilitySlot>('agendapro_slots_v2'));
  const [calendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<ServiceItem | null>(null);

  const [clientProfile, setClientProfile] = useState<ClientProfileData>(() => {
    const saved = localStorage.getItem('agendapro_client_profile');

    if (saved) {
      try {
        return JSON.parse(saved) as ClientProfileData;
      } catch {
        localStorage.removeItem('agendapro_client_profile');
      }
    }

    return {
      name: 'Carlos Mendoza',
      phone: '+57 300 123 4567',
      email: 'carlos.mendoza@example.com',
    };
  });

  // Estados de Modales
const [confirmedBookingForModal, setConfirmedBookingForModal] = useState<Booking | null>(null);
const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

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

  // Limpiar una sola vez las claves antiguas que contenían los datos de demostración.
  useEffect(() => {
    const claveLimpieza = 'agendapro_demo_data_removed_v1';
    if (localStorage.getItem(claveLimpieza) !== 'true') {
      [
        'agendapro_role',
        'agendapro_bookings',
        'agendapro_services',
        'agendapro_slots',
        'agendapro_events',
        'agendapro_users',
        'agendapro_accounts',
        'agendapro_accounts_v1',
      ].forEach((clave) => localStorage.removeItem(clave));
      localStorage.setItem(claveLimpieza, 'true');
    }
  }, []);

  // Persistencia local del prototipo. Servicios y horarios publicados son visibles en el catálogo;
  // las pantallas de reservas filtran los registros por el correo del cliente o proveedor.
  useEffect(() => {
    localStorage.setItem('agendapro_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('agendapro_services_v2', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('agendapro_slots_v2', JSON.stringify(slots));
  }, [slots]);


  const entrarConCuenta = (usuario: AuthenticatedUser) => {
    setCurrentUser(usuario);
    setRole(usuario.role);
    setSelectedServiceToBook(null);
    setCurrentView(usuario.role === 'provider' ? 'provider-dashboard' : 'client-dashboard');
    showToast(`Bienvenido/a, ${usuario.name}.`);

 };

  useEffect(() => {
    localStorage.setItem(
      'agendapro_client_profile',
      JSON.stringify(clientProfile)
    );
  }, [clientProfile]);

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
  const handleLogin = async (email: string, password: string) => {
    const resultado = await authenticateAccount(email, password);
    if (resultado.success && resultado.user) {
      entrarConCuenta(resultado.user);
    }
    return resultado;
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    selectedRole: UserRole
  ) => {
    const resultado = await registerAccount(
      name,
      email,
      password,
      selectedRole
    );
    if (resultado.success && resultado.user) {
      entrarConCuenta(resultado.user);
    }
    return resultado;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedServiceToBook(null);
    setCurrentView('login');
    showToast('Sesión cerrada. Tus datos guardados no se borraron.');
  };

  // Acciones de reservas
  const handleConfirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );
    showToast('Reserva confirmada correctamente.');
  };

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleConfirmCancelModal = (bookingId: string, reason: string) => {
    const reservaCancelada = bookings.find((booking) => booking.id === bookingId);
    setBookings((prev) => prev.map((booking) =>
      booking.id === bookingId ? { ...booking, status: 'cancelled', notes: reason } : booking,
    ));
    if (reservaCancelada?.availabilitySlotId) {
      setSlots((prev) => prev.map((slot) => slot.id === reservaCancelada.availabilitySlotId
        ? { ...slot, isBooked: false }
        : slot));
    }
    setBookingToCancel(null);
    showToast('Reserva cancelada y horario liberado.');
  };

  const handleNewBookingCreated = (newBooking: Booking) => {
    const yaReservado = bookings.some((booking) => {
      if (booking.status !== 'pending' && booking.status !== 'confirmed') return false;
      if (newBooking.availabilitySlotId && booking.availabilitySlotId === newBooking.availabilitySlotId) return true;
      return Boolean(newBooking.dateISO && newBooking.startTime && booking.dateISO === newBooking.dateISO
        && booking.startTime === newBooking.startTime && booking.providerEmail === newBooking.providerEmail);
    });
    if (yaReservado) {
      showToast('Ese horario acaba de ser reservado. Elige otra franja.');
      return;
    }
    setBookings((prev) => [newBooking, ...prev]);
    if (newBooking.availabilitySlotId) {
      setSlots((prev) => prev.map((slot) => slot.id === newBooking.availabilitySlotId
        ? { ...slot, isBooked: true }
        : slot));
    }
    setConfirmedBookingForModal(newBooking);
    showToast('Solicitud de reserva enviada; falta la confirmación del proveedor.');
  };

  const handleRescheduleBooking = (bookingId: string, newSlot: AvailabilitySlot): boolean => {
    const reservaAnterior = bookings.find((booking) => booking.id === bookingId);
    const franjaActual = slots.find((slot) => slot.id === newSlot.id);
    if (!reservaAnterior || !franjaActual || franjaActual.isBooked) {
      showToast('Ese horario ya no está disponible. Selecciona otra franja.');
      return false;
    }

    const yaReservado = bookings.some((booking) => booking.id !== bookingId
      && (booking.status === 'pending' || booking.status === 'confirmed')
      && ((booking.availabilitySlotId && booking.availabilitySlotId === newSlot.id)
        || Boolean(booking.dateISO === newSlot.dateISO && booking.startTime === newSlot.startTime
          && booking.providerEmail === newSlot.providerEmail)));
    if (yaReservado) {
      showToast('Ese horario ya fue solicitado por otra reserva.');
      return false;
    }

    const horaNueva = newSlot.startTime ? (() => {
      const [horas, minutos] = newSlot.startTime!.split(':').map(Number);
      return `${String(horas % 12 || 12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${horas >= 12 ? 'PM' : 'AM'}`;
    })() : newSlot.timeRange;
    const fechaNueva = newSlot.fullDate || newSlot.dateISO || '';

    setBookings((prev) => prev.map((booking) => booking.id === bookingId
      ? {
          ...booking,
          date: fechaNueva,
          dateISO: newSlot.dateISO,
          time: horaNueva,
          startTime: newSlot.startTime,
          availabilitySlotId: newSlot.id,
          timeSlotFormatted: `${fechaNueva} • ${newSlot.timeRange}`,
          status: 'pending',
        }
      : booking));
    setSlots((prev) => prev.map((slot) => {
      if (slot.id === reservaAnterior.availabilitySlotId) return { ...slot, isBooked: false };
      if (slot.id === newSlot.id) return { ...slot, isBooked: true };
      return slot;
    }));
    showToast('Solicitud de reprogramación enviada al proveedor.');
    return true;
  };

  const handleAddService = (newService: ServiceItem) => {
    const servicioConPropietario: ServiceItem = {
      ...newService,
      providerEmail: currentUser?.email,
      providerName: currentUser?.name || newService.providerName,
      providerStudio: currentUser?.name || newService.providerStudio,
    };
    setServices((prev) => [servicioConPropietario, ...prev]);
    showToast(`Servicio "${servicioConPropietario.title}" publicado en el catálogo.`);
  };

  const handleUpdateService = (updatedService: ServiceItem) => {
    setServices((prev) => prev.map((service) => service.id === updatedService.id
      ? { ...updatedService, providerEmail: currentUser?.email || updatedService.providerEmail, providerName: currentUser?.name || updatedService.providerName, providerStudio: currentUser?.name || updatedService.providerStudio }
      : service));
    setEditingService(null);
    showToast(`Servicio "${updatedService.title}" actualizado correctamente.`);
  };

  const handleAddSlots = (newSlots: AvailabilitySlot[]) => {
    const slotsConPropietario = newSlots.map((slot) => ({ ...slot, providerEmail: currentUser?.email }));
    const slotsNuevos = slotsConPropietario.filter((slot) => !slots.some((existente) =>
      existente.providerEmail === slot.providerEmail
      && existente.dateISO === slot.dateISO
      && existente.startTime === slot.startTime,
    ));
    if (slotsNuevos.length === 0) {
      showToast('No se añadieron horarios: esas franjas ya existen.');
      return;
    }
    setSlots((prev) => [...slotsNuevos, ...prev]);
    showToast(`Se publicaron ${slotsNuevos.length} franja(s) horaria(s).`);
  };

  const handleDeleteSlot = (slotId: string) => {
    const reservaActiva = bookings.some((booking) => booking.availabilitySlotId === slotId
      && (booking.status === 'pending' || booking.status === 'confirmed'));
    if (reservaActiva) {
      showToast('No puedes eliminar un horario que tiene una reserva activa. Cancela la reserva primero.');
      return;
    }
    setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    showToast('Franja horaria eliminada.');
  };

  const handleToggleServiceActive = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
    showToast('Estado del servicio actualizado.');
  };

  const handleDeleteService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    showToast(`Servicio "${service?.title}" eliminado del catálogo.`);
  };

// Cada rol ve sus propias reservas. Los servicios y horarios publicados son compartidos en el catálogo.
  const reservasProveedor = currentUser
    ? bookings.filter((booking) => booking.providerEmail === currentUser.email)
    : [];
  const reservasCliente = currentUser
    ? bookings.filter(
        (booking) =>
          booking.clientEmail.trim().toLowerCase() ===
          currentUser.email.toLowerCase()
      )
    : [];
  const serviciosProveedor = currentUser
    ? services.filter((service) => service.providerEmail === currentUser.email)
    : [];
  const franjasProveedor = currentUser
    ? slots.filter((slot) => slot.providerEmail === currentUser.email)
    : [];
  const serviciosPublicos = services.filter((service) => service.isActive);

  const handleSaveClientProfile = (updatedProfile: ClientProfileData) => {
    setClientProfile(updatedProfile);
    showToast('Perfil actualizado correctamente.');
  };

  // Contadores
  const pendingBookingsCount = reservasProveedor.filter(
    (booking) => booking.status === 'pending'
  ).length;

  const activeClientBookingsCount = reservasCliente.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'pending'
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
      {currentView === 'login' || !currentUser ? (
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
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
            servicesCount={serviciosProveedor.length}
            availableSlotsCount={franjasProveedor.filter((slot) => !slot.isBooked).length}
            currentUserName={currentUser.name}
            currentUserEmail={currentUser.email}
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
              currentUserName={currentUser.name}
              currentUserEmail={currentUser.email}
            />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {/* Vistas Proveedor */}
              {currentView === 'provider-dashboard' && (
                <ProviderDashboard
                  bookings={reservasProveedor}
                  services={serviciosProveedor}
                  slots={franjasProveedor}
                  providerName={currentUser.name}
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
                  bookings={reservasProveedor}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onRescheduleBooking={(booking) => setBookingToReschedule(booking)}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'provider-agenda' && (
                <ProviderAgenda
                  events={calendarEvents}
                  bookings={reservasProveedor}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onOpenNewSlot={() => setIsNewSlotOpen(true)}
                />
              )}

              {currentView === 'provider-services' && (
                <ProviderServices
                  services={serviciosProveedor}
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
                  onDeleteService={handleDeleteService}
                />
              )}

              {currentView === 'provider-availability' && (
                <ProviderAvailability
                  slots={franjasProveedor}
                  onOpenNewSlot={() => setIsNewSlotOpen(true)}
                  onDeleteSlot={handleDeleteSlot}
                />
              )}

              {/* Vistas Cliente */}
              {currentView === 'client-dashboard' && (
                <ClientDashboard
                  bookings={reservasCliente}
                  services={serviciosPublicos}
                  clientName={currentUser.name}
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
                  services={serviciosPublicos}
                  onNavigate={(view) => setCurrentView(view)}
                  onSelectServiceToBook={(srv) => {
                    setSelectedServiceToBook(srv);
                    setCurrentView('client-booking');
                  }}
                />
              )}

              {currentView === 'client-booking' && (
                selectedServiceToBook ? (
                  <ClientBooking
                    service={selectedServiceToBook}
                    slots={slots}
                    bookings={bookings}
                    clientName={currentUser.name}
                    clientEmail={currentUser.email}
                    onNavigate={(view) => setCurrentView(view)}
                    onConfirmNewBooking={handleNewBookingCreated}
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                    <p className="text-sm font-bold text-slate-800">Primero selecciona un servicio</p>
                    <p className="text-xs text-slate-500">Explora el catálogo para consultar sus horarios disponibles.</p>
                    <button onClick={() => setCurrentView('client-explore')} className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold">Explorar servicios</button>
                  </div>
                )
              )}

              {currentView === 'client-reservations' && (
                <ClientReservations
                  bookings={reservasCliente}
                  onNavigate={(view) => setCurrentView(view)}
                  onCancelBooking={handleCancelBooking}
                  onRescheduleBooking={(booking) => setBookingToReschedule(booking)}
                />
              )}

              {currentView === 'client-profile' && role === 'client' && (
                <ClientProfile
                  profile={clientProfile}
                  onSave={handleSaveClientProfile}
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

      <RescheduleBookingModal
        booking={bookingToReschedule}
        slots={slots}
        bookings={bookings}
        onClose={() => setBookingToReschedule(null)}
        onConfirmReschedule={handleRescheduleBooking}
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
        onAddSlots={handleAddSlots}
      />

      <SharePublicLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenClientView={() => {
          setRole('client');
          setCurrentView(selectedServiceToBook ? 'client-booking' : 'client-explore');
        }}
      />
    </div>
  );
}

export default App;