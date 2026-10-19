import React from 'react';
import { Booking, ServiceItem, AvailabilitySlot, CurrentView } from '../../types';
import { Plus, Calendar, Clock, BriefcaseBusiness, CheckCircle2, AlertCircle, Trash2, Share2 } from 'lucide-react';

interface ProviderDashboardProps {
  bookings: Booking[];
  services: ServiceItem[];
  slots: AvailabilitySlot[];
  providerName: string;
  onNavigate: (view: CurrentView) => void;
  onOpenNewService: () => void;
  onOpenNewSlot: () => void;
  onConfirmBooking: (id: string) => void;
  onCancelBooking: (booking: Booking) => void;
  onOpenShareModal: () => void;
  onDeleteSlot: (id: string) => void;
}

function fechaCorta(reserva: Booking): string {
  return reserva.dateISO
    ? new Date(`${reserva.dateISO}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    : reserva.date;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  bookings,
  services,
  slots,
  providerName,
  onNavigate,
  onOpenNewService,
  onOpenNewSlot,
  onConfirmBooking,
  onCancelBooking,
  onOpenShareModal,
  onDeleteSlot,
}) => {
  const reservasPendientes = bookings.filter((booking) => booking.status === 'pending');
  const reservasConfirmadas = bookings.filter((booking) => booking.status === 'confirmed');
  const franjasLibres = slots.filter((slot) => !slot.isBooked);

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Panel de proveedor</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hola, {providerName}</h1>
          <p className="text-blue-100/80 text-sm">Administra los servicios, horarios y solicitudes que publiques en AgendaPro.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onOpenNewService} className="bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Plus className="w-4 h-4" /> Nuevo servicio</button>
          <button onClick={onOpenNewSlot} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Clock className="w-4 h-4" /> Publicar horario</button>
          <button onClick={onOpenShareModal} className="bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Compartir</button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Mis servicios', value: services.length, detail: 'Publicados por tu cuenta', icon: BriefcaseBusiness },
          { title: 'Solicitudes pendientes', value: reservasPendientes.length, detail: 'Esperan tu confirmación', icon: AlertCircle },
          { title: 'Horarios libres', value: franjasLibres.length, detail: 'Todavía se pueden reservar', icon: Clock },
          { title: 'Reservas confirmadas', value: reservasConfirmadas.length, detail: 'Citas aceptadas', icon: CheckCircle2 },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between gap-3"><span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{metric.title}</span><Icon className="w-5 h-5 text-blue-600" /></div>
              <div className="mt-3 text-3xl font-extrabold text-[#0b1c30]">{metric.value}</div>
              <p className="text-[11px] text-slate-500 mt-1">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div><h2 className="text-base font-extrabold text-[#0b1c30]">Solicitudes de reserva</h2><p className="text-xs text-slate-500 mt-1">Las solicitudes se muestran cuando un cliente pide una franja publicada.</p></div>
          <button onClick={() => onNavigate('provider-reservations')} className="text-xs font-bold text-blue-700 hover:underline">Ver todas</button>
        </div>
        {bookings.length === 0 ? (
          <div className="py-8 text-center"><Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm font-bold text-slate-700">Aún no tienes reservas</p><p className="text-xs text-slate-500 mt-1">Cuando los clientes soliciten una cita, aparecerá aquí.</p></div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 6).map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100 rounded-xl p-3">
                <div className="min-w-0"><p className="font-bold text-sm text-slate-900">{booking.serviceTitle}</p><p className="text-xs text-slate-500 mt-1">{booking.clientName} · {fechaCorta(booking)} · {booking.time}</p><span className={`inline-block mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'cancelled' ? 'Cancelada' : booking.status === 'completed' ? 'Completada' : 'Pendiente'}</span></div>
                <div className="flex gap-2 shrink-0">
                  {booking.status === 'pending' && <button onClick={() => onConfirmBooking(booking.id)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold">Confirmar</button>}
                  {(booking.status === 'pending' || booking.status === 'confirmed') && <button onClick={() => onCancelBooking(booking)} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold">Cancelar</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h2 className="text-base font-extrabold text-[#0b1c30]">Horarios publicados</h2><p className="text-xs text-slate-500 mt-1">Los clientes solo pueden solicitar las franjas que estén libres.</p></div><button onClick={() => onNavigate('provider-availability')} className="text-xs font-bold text-blue-700 hover:underline">Gestionar horarios</button></div>
        {slots.length === 0 ? (
          <div className="py-8 text-center"><Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm font-bold text-slate-700">No has publicado horarios</p><p className="text-xs text-slate-500 mt-1">Publica una franja o repite tu disponibilidad semanalmente.</p><button onClick={onOpenNewSlot} className="mt-3 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold">Crear horario</button></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {slots.slice(0, 9).map((slot) => <div key={slot.id} className="border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-900">{slot.fullDate}</p><p className="text-xs text-blue-700 font-bold mt-1">{slot.timeRange}</p><p className={`text-[10px] mt-2 font-semibold ${slot.isBooked ? 'text-amber-700' : 'text-emerald-700'}`}>{slot.isBooked ? 'Reservado' : 'Disponible'}</p></div><button aria-label="Eliminar horario" onClick={() => onDeleteSlot(slot.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div>)}
          </div>
        )}
      </section>
    </div>
  );
};
