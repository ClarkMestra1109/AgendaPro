import React from 'react';
import { Booking, ServiceItem, CurrentView } from '../../types';
import { Compass, Calendar, BookmarkCheck, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface ClientDashboardProps {
  bookings: Booking[];
  services: ServiceItem[];
  clientName: string;
  onNavigate: (view: CurrentView) => void;
  onSelectServiceToBook: (service: ServiceItem) => void;
  onCancelBooking: (booking: Booking) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  bookings,
  services,
  clientName,
  onNavigate,
  onSelectServiceToBook,
}) => {
  const reservasActivas = bookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed');
  const reservasCompletadas = bookings.filter((booking) => booking.status === 'completed');
  const proximaReserva = [...reservasActivas].sort((a, b) => (a.dateISO || '').localeCompare(b.dateISO || ''))[0];
  const serviciosRecomendados = services.filter((service) => service.isActive).slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200"><Sparkles className="w-4 h-4" /> Panel de cliente</span><h1 className="text-2xl sm:text-3xl font-extrabold">Hola, {clientName}</h1><p className="text-blue-100/80 text-sm">Consulta los servicios publicados, revisa tus reservas y solicita una cita en los horarios disponibles.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => onNavigate('client-explore')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Compass className="w-4 h-4" /> Explorar servicios</button><button onClick={() => onNavigate('client-reservations')} className="bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><BookmarkCheck className="w-4 h-4" /> Mis reservas</button></div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ title: 'Reservas activas', value: reservasActivas.length, text: 'Pendientes o confirmadas', icon: Calendar }, { title: 'Servicios completados', value: reservasCompletadas.length, text: 'En tu historial', icon: CheckCircle2 }, { title: 'Servicios publicados', value: services.length, text: 'Disponibles para explorar', icon: Compass }].map((metric) => {
          const Icon = metric.icon;
          return <div key={metric.title} className="bg-white p-5 rounded-2xl border border-slate-200/80"><div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{metric.title}</span><Icon className="w-5 h-5 text-blue-600" /></div><div className="mt-3 text-3xl font-extrabold text-[#0b1c30]">{metric.value}</div><p className="text-[11px] text-slate-500 mt-1">{metric.text}</p></div>;
        })}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h2 className="text-base font-extrabold text-[#0b1c30]">Tu próxima reserva</h2><p className="text-xs text-slate-500 mt-1">Estado actualizado según la solicitud que hayas realizado.</p></div><button onClick={() => onNavigate('client-reservations')} className="text-xs font-bold text-blue-700 hover:underline">Ver todas</button></div>
        {proximaReserva ? (
          <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 className="font-bold text-slate-900">{proximaReserva.serviceTitle}</h3><p className="text-xs text-slate-500 mt-1">{proximaReserva.date} · {proximaReserva.time}</p><span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${proximaReserva.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{proximaReserva.status === 'confirmed' ? 'Confirmada' : 'Pendiente de confirmación'}</span></div><div className="text-right"><p className="font-extrabold text-blue-700">${proximaReserva.price.toLocaleString('es-CO')} COP</p><p className="text-[11px] text-slate-500">{proximaReserva.locationName}</p></div></div>
        ) : (
          <div className="py-8 text-center"><Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm font-bold text-slate-700">Todavía no tienes reservas</p><p className="text-xs text-slate-500 mt-1">Cuando solicites una cita, su estado aparecerá aquí.</p><button onClick={() => onNavigate('client-explore')} className="mt-3 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold">Buscar un servicio</button></div>
        )}
      </section>

      <section className="space-y-3"><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-extrabold text-[#0b1c30]">Servicios publicados recientemente</h2><p className="text-xs text-slate-500 mt-1">Solo se muestran servicios creados por proveedores.</p></div><button onClick={() => onNavigate('client-explore')} className="text-xs font-bold text-blue-700 hover:underline">Explorar catálogo <ArrowRight className="inline w-3 h-3" /></button></div>
        {serviciosRecomendados.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{serviciosRecomendados.map((service) => <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"><div><span className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">{service.category}</span><h3 className="font-extrabold text-slate-900 mt-1">{service.title}</h3><p className="text-xs text-slate-500 mt-1">{service.providerName}</p></div><div className="flex items-center justify-between text-xs"><span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.durationMinutes} min</span><strong className="text-blue-700">${service.price.toLocaleString('es-CO')}</strong></div><button onClick={() => onSelectServiceToBook(service)} className="w-full px-3 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold">Consultar disponibilidad</button></div>)}</div> : <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center"><p className="text-sm font-bold text-slate-700">No hay servicios publicados todavía</p><p className="text-xs text-slate-500 mt-1">Cuando un proveedor publique un servicio, aparecerá en esta sección.</p></div>}
      </section>
    </div>
  );
};
