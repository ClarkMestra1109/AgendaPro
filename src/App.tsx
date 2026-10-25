import React, { useEffect, useState } from 'react';
import { AuthenticatedUser, authenticateAccount, cerrarSesion, registerAccount } from './data/authStorage';
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
import { ClientProfile, type ClientProfileData } from './components/screens/ClientProfile';
import { BookingConfirmationModal } from './components/modals/BookingConfirmationModal';
import { CancelBookingModal } from './components/modals/CancelBookingModal';
import { NewServiceModal, type NuevoServicioPayload } from './components/modals/NewServiceModal';
import { NewSlotModal, type NuevaFranjaPayload } from './components/modals/NewSlotModal';
import { SharePublicLinkModal } from './components/modals/SharePublicLinkModal';
import { RescheduleBookingModal } from './components/modals/RescheduleBookingModal';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  UsuarioResponse,
  actualizarPerfil,
  actualizarServicio,
  catalogoFranjasDeServicio,
  catalogoServicios,
  clearToken,
  crearReserva,
  crearServicio,
  eliminarServicio,
  getMiPerfil,
  getToken,
  listarFranjasDeServicioPropio,
  mensajeDeApiError,
  miAgenda,
  misServicios,
  publicarFranja,
  publicarFranjaRecurrente,
  cancelarReserva,
  reprogramarReserva,
  retirarFranja,
} from './lib/api';
import {
  catalogoAServiceItem,
  franjaASlot,
  reservaABooking,
  servicioPropioAServiceItem,
  usuarioAAuthenticatedUser,
} from './lib/adapters';

const DIAS_JAVA = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const ABREVIATURAS_DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function construirEventosAgenda(bookings: Booking[]): CalendarEvent[] {
  const hoy = new Date();
  const desplazamientoLunes = (hoy.getDay() + 6) % 7;
  const inicioSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - desplazamientoLunes);
  const etiquetasPorFecha = new Map<string, string>();
  for (let i = 0; i < 4; i += 1) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + i);
    const esHoy = fecha.toDateString() === hoy.toDateString();
    const claveISO = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    etiquetasPorFecha.set(claveISO, `${esHoy ? 'Hoy ' : ''}${ABREVIATURAS_DIA[fecha.getDay()]} ${fecha.getDate()}`);
  }

  return bookings
    .filter((b) => b.status === 'confirmed' && b.dateISO && etiquetasPorFecha.has(b.dateISO))
    .map((b) => {
      const [horas, minutos] = (b.startTime || '00:00').split(':').map(Number);
      return {
        id: b.id,
        title: b.serviceTitle,
        client: b.clientName,
        timeRange: b.time,
        day: etiquetasPorFecha.get(b.dateISO!) as string,
        startHour: horas + minutos / 60,
        durationHours: b.durationMinutes / 60,
        status: 'confirmed' as const,
        color: 'bg-emerald-100 border-emerald-500 text-emerald-900',
        price: `$${b.price.toLocaleString('es-CO')} COP`,
        location: b.locationName,
      };
    });
}

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [role, setRole] = useState<UserRole>('client');
  const [currentView, setCurrentView] = useState<CurrentView>('login');
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [clientBookingSlots, setClientBookingSlots] = useState<AvailabilitySlot[]>([]);
  const [rescheduleSlots, setRescheduleSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<ServiceItem | null>(null);

  const [clientProfile, setClientProfile] = useState<ClientProfileData>({ name: '', phone: '', email: '' });

  const [confirmedBookingForModal, setConfirmedBookingForModal] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [isNewSlotOpen, setIsNewSlotOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const aplicarPerfil = (perfil: UsuarioResponse) => {
    setClientProfile({ name: perfil.nombre, phone: perfil.telefono || '', email: perfil.correo });
  };

  // --- Carga de datos según el rol autenticado ---

  const cargarDatosProveedor = async (nombreProveedor: string) => {
    try {
      const propios = await misServicios();
      const serviciosAdaptados = propios.map((s) => servicioPropioAServiceItem(s, nombreProveedor));
      setServices(serviciosAdaptados);

      const franjasPorServicio = await Promise.all(
        propios.map((s) => listarFranjasDeServicioPropio(s.id).catch(() => [])),
      );
      const franjasAdaptadas = propios.flatMap((s, indice) =>
        franjasPorServicio[indice].map((f) => franjaASlot(f, s.nombre)),
      );
      franjasAdaptadas.sort((a, b) => (a.dateISO || '').localeCompare(b.dateISO || '') || (a.startTime || '').localeCompare(b.startTime || ''));
      setSlots(franjasAdaptadas);

      const agenda = await miAgenda();
      setBookings(agenda.map((r) => reservaABooking(r)));
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudieron cargar tus datos.'));
    }
  };

  const cargarDatosCliente = async () => {
    try {
      const catalogo = await catalogoServicios();
      setServices(catalogo.map(catalogoAServiceItem));

      const agenda = await miAgenda();
      setBookings((previas) =>
        agenda.map((r) => {
          const previa = previas.find((b) => b.id === String(r.id));
          return reservaABooking(r, {
            clientPhone: previa?.clientPhone,
            notes: previa?.notes,
            modality: previa?.modality,
          });
        }),
      );
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudieron cargar los datos.'));
    }
  };

  const entrarConPerfil = (perfil: UsuarioResponse) => {
    const usuario = usuarioAAuthenticatedUser(perfil);
    setCurrentUser(usuario);
    setRole(usuario.role);
    aplicarPerfil(perfil);
    setSelectedServiceToBook(null);
    setCurrentView(usuario.role === 'provider' ? 'provider-dashboard' : 'client-dashboard');
    if (usuario.role === 'provider') {
      void cargarDatosProveedor(usuario.name);
    } else {
      void cargarDatosCliente();
    }
  };

  // Restaura la sesión si ya existe un token guardado de una visita anterior.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsRestoringSession(false);
      return;
    }
    (async () => {
      try {
        const perfil = await getMiPerfil();
        entrarConPerfil(perfil);
      } catch {
        clearToken();
      } finally {
        setIsRestoringSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const resultado = await authenticateAccount(email, password);
    if (resultado.success) {
      try {
        const perfil = await getMiPerfil();
        entrarConPerfil(perfil);
        showToast(`Bienvenido/a, ${perfil.nombre}.`);
      } catch (err) {
        return { success: false, message: mensajeDeApiError(err, 'No se pudo cargar tu perfil.') };
      }
    }
    return resultado;
  };

  const handleRegister = async (name: string, email: string, password: string, selectedRole: UserRole) => {
    const resultado = await registerAccount(name, email, password, selectedRole);
    if (resultado.success) {
      try {
        const perfil = await getMiPerfil();
        entrarConPerfil(perfil);
        showToast(`Bienvenido/a, ${perfil.nombre}.`);
      } catch (err) {
        return { success: false, message: mensajeDeApiError(err, 'No se pudo cargar tu perfil.') };
      }
    }
    return resultado;
  };

  const handleLogout = () => {
    cerrarSesion();
    setCurrentUser(null);
    setSelectedServiceToBook(null);
    setBookings([]);
    setServices([]);
    setSlots([]);
    setClientBookingSlots([]);
    setRescheduleSlots([]);
    setCurrentView('login');
  };

  // Este prototipo representa cuentas reales: cambiar de rol implica cerrar sesión
  // y entrar con otra cuenta, tal como ya lo indicaba la interfaz ("Salir / Cambiar cuenta").
  const handleSwitchRole = () => {
    handleLogout();
    showToast('Sesión cerrada. Inicia sesión con la otra cuenta.');
  };

  // El backend confirma la reserva en el momento de crearla (HU14): no existe un paso
  // de aprobación posterior por parte del proveedor.
  const handleConfirmBooking = (_bookingId: string) => {
    showToast('Esta reserva ya quedó confirmada al momento de solicitarse.');
  };

  // HU15 y HU16 son operaciones del cliente sobre su propia reserva; el proveedor no
  // tiene un endpoint equivalente en el backend.
  const handleCancelBooking = (booking: Booking) => {
    if (role !== 'client') {
      showToast('Solo el cliente puede cancelar su propia reserva.');
      return;
    }
    setBookingToCancel(booking);
  };

  const handleConfirmCancelModal = async (bookingId: string, _reason: string) => {
    try {
      const respuesta = await cancelarReserva(Number(bookingId));
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? reservaABooking(respuesta, { clientPhone: b.clientPhone, notes: b.notes, modality: b.modality }) : b)),
      );
      showToast('Reserva cancelada y horario liberado.');
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo cancelar la reserva.'));
    } finally {
      setBookingToCancel(null);
    }
  };

  const abrirReprogramar = async (booking: Booking) => {
    if (role !== 'client') {
      showToast('Solo el cliente puede reprogramar su propia reserva.');
      return;
    }
    try {
      const franjas = await catalogoFranjasDeServicio(Number(booking.serviceId));
      const candidatas = franjas
        .filter((f) => String(f.id) !== booking.availabilitySlotId)
        .map((f) => franjaASlot(f, booking.serviceTitle));
      setRescheduleSlots(candidatas);
      setBookingToReschedule(booking);
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudieron cargar los horarios disponibles.'));
    }
  };

  const handleRescheduleBooking = async (bookingId: string, newSlot: AvailabilitySlot): Promise<boolean> => {
    try {
      const respuesta = await reprogramarReserva(Number(bookingId), Number(newSlot.id));
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? reservaABooking(respuesta, { clientPhone: b.clientPhone, notes: b.notes, modality: b.modality }) : b)),
      );
      showToast('Reserva reprogramada correctamente.');
      return true;
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo reprogramar la reserva.'));
      return false;
    }
  };

  const handleNewBookingCreated = async (newBooking: Booking) => {
    if (!newBooking.availabilitySlotId) {
      showToast('Selecciona un horario válido para reservar.');
      return;
    }
    try {
      const respuesta = await crearReserva(Number(newBooking.availabilitySlotId));
      const reservaAdaptada = reservaABooking(respuesta, {
        clientPhone: newBooking.clientPhone,
        notes: newBooking.notes,
        modality: newBooking.modality,
      });
      setBookings((prev) => [reservaAdaptada, ...prev]);
      setClientBookingSlots((prev) => prev.filter((slot) => slot.id !== newBooking.availabilitySlotId));
      setConfirmedBookingForModal(reservaAdaptada);
      showToast('¡Reserva confirmada!');
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo completar la reserva.'));
      if (selectedServiceToBook) {
        try {
          const franjas = await catalogoFranjasDeServicio(Number(selectedServiceToBook.id));
          setClientBookingSlots(franjas.map((f) => franjaASlot(f, selectedServiceToBook.title)));
        } catch {
          // Si tampoco se puede refrescar, el cliente simplemente verá la lista anterior.
        }
      }
    }
  };

  const handleAddService = async (payload: NuevoServicioPayload) => {
    const nuevo = await crearServicio({
      nombre: payload.title,
      descripcion: payload.description,
      duracionMin: payload.durationMinutes,
      precio: payload.price,
    });
    setServices((prev) => [servicioPropioAServiceItem(nuevo, currentUser?.name || ''), ...prev]);
    showToast(`Servicio "${nuevo.nombre}" publicado en el catálogo.`);
  };

  const handleUpdateService = async (id: string, payload: NuevoServicioPayload) => {
    const actualizado = await actualizarServicio(Number(id), {
      nombre: payload.title,
      descripcion: payload.description,
      duracionMin: payload.durationMinutes,
      precio: payload.price,
    });
    setServices((prev) => prev.map((s) => (s.id === id ? servicioPropioAServiceItem(actualizado, currentUser?.name || '') : s)));
    setEditingService(null);
    showToast(`Servicio "${actualizado.nombre}" actualizado correctamente.`);
  };

  const handleToggleServiceActive = async (serviceId: string) => {
    const servicio = services.find((s) => s.id === serviceId);
    if (!servicio) return;
    try {
      const actualizado = await actualizarServicio(Number(serviceId), {
        nombre: servicio.title,
        descripcion: servicio.description || '',
        duracionMin: servicio.durationMinutes,
        precio: servicio.price,
        estado: servicio.isActive ? 'INACTIVO' : 'ACTIVO',
      });
      setServices((prev) => prev.map((s) => (s.id === serviceId ? servicioPropioAServiceItem(actualizado, currentUser?.name || '') : s)));
      showToast('Estado del servicio actualizado.');
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo actualizar el servicio.'));
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const servicio = services.find((s) => s.id === serviceId);
    try {
      await eliminarServicio(Number(serviceId));
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      showToast(`Servicio "${servicio?.title}" eliminado del catálogo.`);
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo eliminar el servicio.'));
    }
  };

  const handleCreateSlots = async (payload: NuevaFranjaPayload) => {
    const servicioIdNumero = Number(payload.servicioId);
    const servicio = services.find((s) => s.id === payload.servicioId);
    const serviceTag = servicio?.title || '';

    let nuevasFranjas;
    if (payload.repetirSemanalmente) {
      nuevasFranjas = await publicarFranjaRecurrente(servicioIdNumero, {
        horaInicio: payload.horaInicio,
        horaFin: payload.horaFin,
        diasSemana: payload.diasSemana.map((d) => DIAS_JAVA[d]),
        repetirHasta: payload.repetirHasta,
        cupoTotal: payload.cupoTotal,
      });
    } else {
      const inicioISO = `${payload.fechaInicio}T${payload.horaInicio}:00-05:00`;
      const finISO = `${payload.fechaInicio}T${payload.horaFin}:00-05:00`;
      nuevasFranjas = [await publicarFranja(servicioIdNumero, inicioISO, finISO, payload.cupoTotal)];
    }

    const adaptadas = nuevasFranjas.map((f) => franjaASlot(f, serviceTag));
    setSlots((prev) => [...adaptadas, ...prev]);
    showToast(`Se publicaron ${adaptadas.length} franja(s) horaria(s).`);
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await retirarFranja(Number(slotId));
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      showToast('Horario retirado correctamente.');
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo retirar el horario.'));
    }
  };

  const handleSelectServiceToBook = async (service: ServiceItem) => {
    setSelectedServiceToBook(service);
    setCurrentView('client-booking');
    try {
      const franjas = await catalogoFranjasDeServicio(Number(service.id));
      setClientBookingSlots(franjas.map((f) => franjaASlot(f, service.title)));
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudieron cargar los horarios de este servicio.'));
      setClientBookingSlots([]);
    }
  };

  const handleSaveClientProfile = async (updatedProfile: ClientProfileData) => {
    try {
      const actualizado = await actualizarPerfil(updatedProfile.name, updatedProfile.email, updatedProfile.phone);
      aplicarPerfil(actualizado);
      setCurrentUser((prev) => (prev ? { ...prev, name: actualizado.nombre, email: actualizado.correo } : prev));
      showToast('Perfil actualizado correctamente.');
    } catch (err) {
      showToast(mensajeDeApiError(err, 'No se pudo actualizar el perfil.'));
    }
  };

  const reservasProveedor = role === 'provider' ? bookings : [];
  const reservasCliente = role === 'client' ? bookings : [];
  const serviciosProveedor = role === 'provider' ? services : [];
  const franjasProveedor = role === 'provider' ? slots : [];
  const serviciosPublicos = role === 'client' ? services : [];
  const calendarEvents = construirEventosAgenda(reservasProveedor);

  const pendingBookingsCount = reservasProveedor.filter((booking) => booking.status === 'pending').length;
  const activeClientBookingsCount = reservasCliente.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'pending',
  ).length;

  if (isRestoringSession) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#0b1c30] flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-3 text-xs font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentView === 'login' || !currentUser ? (
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <div className="flex flex-1 min-h-screen">
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
                  onRescheduleBooking={abrirReprogramar}
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

              {currentView === 'client-dashboard' && (
                <ClientDashboard
                  bookings={reservasCliente}
                  services={serviciosPublicos}
                  clientName={currentUser.name}
                  onNavigate={(view) => setCurrentView(view)}
                  onSelectServiceToBook={handleSelectServiceToBook}
                  onCancelBooking={handleCancelBooking}
                />
              )}

              {currentView === 'client-explore' && (
                <ClientExplore
                  services={serviciosPublicos}
                  onNavigate={(view) => setCurrentView(view)}
                  onSelectServiceToBook={handleSelectServiceToBook}
                />
              )}

              {currentView === 'client-booking' && (
                selectedServiceToBook ? (
                  <ClientBooking
                    service={selectedServiceToBook}
                    slots={clientBookingSlots}
                    bookings={reservasCliente}
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
                  onRescheduleBooking={abrirReprogramar}
                />
              )}

              {currentView === 'client-profile' && (
                <ClientProfile profile={clientProfile} onSave={handleSaveClientProfile} />
              )}
            </main>
          </div>
        </div>
      )}

      <BookingConfirmationModal
        booking={confirmedBookingForModal}
        onClose={() => setConfirmedBookingForModal(null)}
        onGoToReservations={() => {
          setConfirmedBookingForModal(null);
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
        slots={rescheduleSlots}
        bookings={reservasCliente}
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
        services={serviciosProveedor.filter((s) => s.isActive)}
        onCreate={handleCreateSlots}
      />

      <SharePublicLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenClientView={() => setCurrentView(selectedServiceToBook ? 'client-booking' : 'client-explore')}
      />
    </div>
  );
}

export default App;
