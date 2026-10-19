import React, { useMemo, useState } from 'react';
import { ServiceItem, Booking, CurrentView, AvailabilitySlot } from '../../types';
import { Calendar as CalendarIcon, Clock, MapPin, ShieldCheck, ChevronLeft, Star, Check, AlertCircle } from 'lucide-react';

interface ClientBookingProps {
  service: ServiceItem;
  slots: AvailabilitySlot[];
  bookings: Booking[];
  clientName: string;
  clientEmail: string;
  onNavigate: (view: CurrentView) => void;
  onConfirmNewBooking: (newBooking: Booking) => void;
}

interface DiaDisponible {
  dateISO: string;
  label: string;
  numero: string;
  nombreCompleto: string;
  disponibles: number;
}

function fechaLocalISO(fecha = new Date()): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function franjaEmpiezaEnElFuturo(franja: AvailabilitySlot): boolean {
  if (!franja.dateISO) return false;
  const hoy = fechaLocalISO();
  if (franja.dateISO > hoy) return true;
  if (franja.dateISO < hoy || !franja.startTime) return false;
  const [horas, minutos] = franja.startTime.split(':').map(Number);
  const ahora = new Date();
  return horas * 60 + minutos > ahora.getHours() * 60 + ahora.getMinutes();
}

function fechaDesdeISO(valor: string): Date {
  const [anio, mes, dia] = valor.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function nombreFecha(valor: string, incluirAnio = false): string {
  return fechaDesdeISO(valor).toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', ...(incluirAnio ? { year: 'numeric' } : {}),
  });
}

function horaAMPM(valor: string): string {
  const [horas, minutos] = valor.split(':').map(Number);
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  return `${String(horas % 12 || 12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${sufijo}`;
}

function coincideServicio(franja: AvailabilitySlot, servicio: ServiceItem): boolean {
  const etiqueta = (franja.serviceTag || '').trim().toLowerCase();
  return !etiqueta || ['cualquier servicio', 'todos los servicios', 'todos'].includes(etiqueta)
    || etiqueta === servicio.title.trim().toLowerCase()
    || etiqueta === servicio.category.trim().toLowerCase()
    || etiqueta === servicio.categorySlug.trim().toLowerCase();
}

function tieneReservaActiva(franja: AvailabilitySlot, reservas: Booking[]): boolean {
  return reservas.some((reserva) => {
    if (reserva.status !== 'pending' && reserva.status !== 'confirmed') return false;
    if (reserva.availabilitySlotId && reserva.availabilitySlotId === franja.id) return true;
    return Boolean(
      franja.dateISO && reserva.dateISO === franja.dateISO && reserva.startTime && franja.startTime
      && reserva.startTime === franja.startTime
      && (!reserva.providerEmail || !franja.providerEmail || reserva.providerEmail === franja.providerEmail),
    );
  });
}

export const ClientBooking: React.FC<ClientBookingProps> = ({
  service,
  slots,
  bookings,
  clientName,
  clientEmail,
  onNavigate,
  onConfirmNewBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reservasActivas = useMemo(
    () => bookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed'),
    [bookings],
  );

  const franjasDelServicio = useMemo(() => slots
    .filter(franjaEmpiezaEnElFuturo)
    .filter((franja) => Boolean(service.providerEmail) && franja.providerEmail === service.providerEmail)
    .filter((franja) => coincideServicio(franja, service))
    .sort((a, b) => (a.dateISO || '').localeCompare(b.dateISO || '') || (a.startTime || '').localeCompare(b.startTime || '')),
  [slots, service]);

  const diasDisponibles: DiaDisponible[] = useMemo(() => {
    const porFecha = new Map<string, AvailabilitySlot[]>();
    franjasDelServicio.forEach((franja) => {
      const fecha = franja.dateISO!;
      if (!porFecha.has(fecha)) porFecha.set(fecha, []);
      porFecha.get(fecha)!.push(franja);
    });

    return Array.from(porFecha.entries()).map(([dateISO, franjas]) => {
      const fecha = fechaDesdeISO(dateISO);
      const libres = franjas.filter((franja) => !franja.isBooked && !tieneReservaActiva(franja, reservasActivas)).length;
      return {
        dateISO,
        label: fecha.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
        numero: String(fecha.getDate()),
        nombreCompleto: nombreFecha(dateISO, true),
        disponibles: libres,
      };
    });
  }, [franjasDelServicio, reservasActivas]);

  const fechaElegida = diasDisponibles.some((dia) => dia.dateISO === selectedDate)
    ? selectedDate
    : (diasDisponibles[0]?.dateISO || '');

  const franjasDeFecha = franjasDelServicio.filter((franja) => franja.dateISO === fechaElegida);
  const franjaElegida = franjasDeFecha.find((franja) => franja.id === selectedSlotId
    && !franja.isBooked && !tieneReservaActiva(franja, reservasActivas)) || null;

  const crearReserva = () => {
    if (!franjaElegida) {
      setErrorMessage('Selecciona un horario que siga disponible.');
      return;
    }

    // Revalidación local antes de crear la solicitud; el backend deberá repetirla al integrarse.
    if (tieneReservaActiva(franjaElegida, reservasActivas) || franjaElegida.isBooked) {
      setErrorMessage('Ese horario ya no está disponible. Selecciona otra franja.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const iniciales = clientName.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase() || '').join('');
    const hora = franjaElegida.startTime ? horaAMPM(franjaElegida.startTime) : franjaElegida.timeRange;

    const nuevaReserva: Booking = {
      id: `RES-${Date.now()}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: '',
      clientInitials: iniciales || 'CL',
      providerEmail: service.providerEmail,
      availabilitySlotId: franjaElegida.id,
      dateISO: franjaElegida.dateISO,
      startTime: franjaElegida.startTime,
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.category,
      locationName: service.providerStudio,
      date: nombreFecha(franjaElegida.dateISO!, true),
      time: hora,
      timeSlotFormatted: `${nombreFecha(franjaElegida.dateISO!, true)} • ${hora}`,
      durationMinutes: service.durationMinutes,
      price: service.price,
      status: 'pending',
      modality: service.modalityBadge.toLowerCase().includes('virtual')
        ? 'Virtual'
        : service.modalityBadge.toLowerCase().includes('domicilio')
        ? 'A domicilio'
        : 'Presencial',
      notes: clientNotes.trim(),
    };

    onConfirmNewBooking(nuevaReserva);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('client-explore')} className="hover:text-blue-700 font-medium flex items-center gap-1 text-xs text-slate-500">
        <ChevronLeft className="w-4 h-4" /> Volver al catálogo
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-3 h-36 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
          {service.imageUrl ? <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" /> : <CalendarIcon className="w-10 h-10 text-slate-300" />}
        </div>
        <div className="md:col-span-9 space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{service.providerStudio || service.providerName}</span>
          <h1 className="text-2xl font-extrabold text-[#0b1c30]">{service.title}</h1>
          <p className="text-xs text-slate-600 leading-relaxed">{service.description || 'Información adicional no registrada para este servicio.'}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600" />{service.durationMinutes} minutos</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" />{service.modalityBadge}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" />{service.rating > 0 ? service.rating.toFixed(1) : 'Sin calificaciones'}</span>
            <span className="flex items-center gap-1.5 text-emerald-600"><ShieldCheck className="w-4 h-4" />Solicitud sujeta a confirmación del proveedor</span>
          </div>
        </div>
      </div>

      {franjasDelServicio.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <CalendarIcon className="w-9 h-9 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Todavía no hay horarios publicados</h2>
          <p className="text-xs text-slate-500">El proveedor aún no ha publicado franjas futuras para este servicio.</p>
          <button onClick={() => onNavigate('client-explore')} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">Volver al catálogo</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center">1</span>
                <h2 className="text-base font-extrabold text-[#0b1c30]">Selecciona una fecha</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {diasDisponibles.map((dia) => (
                  <button key={dia.dateISO} onClick={() => { setSelectedDate(dia.dateISO); setSelectedSlotId(''); }} className={`p-3 rounded-2xl border text-center transition-all ${fechaElegida === dia.dateISO ? 'bg-blue-700 text-white border-blue-700' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'}`}>
                    <span className={`block text-[11px] font-bold ${fechaElegida === dia.dateISO ? 'text-blue-100' : 'text-slate-400'}`}>{dia.label}</span>
                    <span className="block text-xl font-extrabold mt-1">{dia.numero}</span>
                    <span className={`block mt-1 text-[9px] font-bold ${fechaElegida === dia.dateISO ? 'text-blue-100' : dia.disponibles ? 'text-emerald-600' : 'text-slate-400'}`}>{dia.disponibles} libres</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center">2</span>
                <div>
                  <h2 className="text-base font-extrabold text-[#0b1c30]">Selecciona un horario</h2>
                  <p className="text-[11px] text-slate-500">{fechaElegida ? nombreFecha(fechaElegida, true) : ''}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {franjasDeFecha.map((franja) => {
                  const ocupado = franja.isBooked || tieneReservaActiva(franja, reservasActivas);
                  const seleccionado = selectedSlotId === franja.id && !ocupado;
                  return (
                    <button key={franja.id} type="button" disabled={ocupado} onClick={() => { setSelectedSlotId(franja.id); setErrorMessage(''); }} className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 ${ocupado ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : seleccionado ? 'bg-blue-700 text-white border-blue-700' : 'bg-white hover:border-blue-300 border-slate-200 text-slate-800'}`}>
                      <span>{franja.timeRange}</span>
                      {seleccionado ? <Check className="w-3.5 h-3.5" /> : <span className={`text-[9px] font-normal ${ocupado ? 'text-slate-400' : 'text-emerald-600'}`}>{ocupado ? 'Ocupado' : 'Libre'}</span>}
                    </button>
                  );
                })}
              </div>
              {franjasDeFecha.length === 0 && <p className="text-xs text-slate-500">No hay franjas para esta fecha.</p>}
              <div className="pt-2">
                <label htmlFor="booking-notes" className="block text-xs font-bold text-slate-700 mb-1.5">Notas para el proveedor (opcional)</label>
                <textarea id="booking-notes" value={clientNotes} onChange={(event) => setClientNotes(event.target.value)} placeholder="Información adicional para tu cita" rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs sticky top-24 space-y-5">
              <h3 className="text-base font-extrabold text-[#0b1c30] pb-3 border-b border-slate-100">Resumen de solicitud</h3>
              <div className="space-y-3 text-xs">
                <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Servicio</span><span className="font-bold text-slate-900 text-sm">{service.title}</span><span className="text-slate-500 block">{service.providerStudio || service.providerName}</span></div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100"><span className="text-[10px] font-bold text-slate-400 uppercase block">Fecha</span><span className="font-bold text-slate-800">{fechaElegida ? nombreFecha(fechaElegida, true) : 'No seleccionada'}</span></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100"><span className="text-[10px] font-bold text-slate-400 uppercase block">Hora</span><span className="font-bold text-blue-700">{franjaElegida?.timeRange || 'No seleccionada'}</span></div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-slate-900"><span>Total</span><span className="text-blue-700 text-lg">${service.price.toLocaleString('es-CO')} COP</span></div>
              {errorMessage && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{errorMessage}</div>}
              <button type="button" disabled={!franjaElegida || isSubmitting} onClick={crearReserva} className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all">{isSubmitting ? 'Enviando…' : 'Solicitar reserva'}</button>
              <p className="text-[10px] text-slate-400 text-center">La reserva quedará pendiente hasta que el proveedor la confirme.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
