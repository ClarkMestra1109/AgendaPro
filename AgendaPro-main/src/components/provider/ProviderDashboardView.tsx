import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Scissors, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  MessageCircle, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Booking, ServiceItem, TimeSlot } from '../../types';

interface ProviderDashboardViewProps {
  onNavigateServices: () => void;
  onNavigateAvailability: () => void;
  onNavigateBookings: () => void;
  onNavigateCalendar: () => void;
  onPreviewClientView: () => void;
  bookings: Booking[];
  services: ServiceItem[];
  slots: TimeSlot[];
  onConfirmBooking: (bookingId: string) => void;
}

export const ProviderDashboardView: React.FC<ProviderDashboardViewProps> = ({
  onNavigateServices,
  onNavigateAvailability,
  onNavigateBookings,
  onNavigateCalendar,
  onPreviewClientView,
  bookings,
  services,
  slots,
  onConfirmBooking
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const filteredList = filterTab === 'pending' 
    ? pendingBookings 
    : filterTab === 'confirmed' 
    ? confirmedBookings 
    : bookings.slice(0, 5);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://agendapro.co/lauramorales-studio');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full inline-block mb-1">
            PANEL OPERATIVO PRINCIPAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Buenos días, Laura Morales
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestiona tus servicios, disponibilidades y próximas citas de tu negocio hoy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNavigateServices}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Nuevo servicio</span>
          </button>

          <button
            onClick={onNavigateAvailability}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Publicar horario</span>
          </button>

          <button
            onClick={onNavigateCalendar}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Ver mi agenda</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">SERVICIOS ACTIVOS</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded-md">
              +2 este mes
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1C30] tabular-nums">
              {services.filter(s => s.status === 'active').length || 8}
            </span>
            <span className="text-xs text-slate-400">servicios</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">RESERVAS PENDIENTES</span>
            <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-md">
              Requieren confirmación
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1C30] tabular-nums">
              {pendingBookings.length}
            </span>
            <span className="text-xs text-slate-400">pendientes</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">HORARIOS DISPONIBLES</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded-md">
              Esta semana
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1C30] tabular-nums">
              18
            </span>
            <span className="text-xs text-slate-400">cupos libres</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">RESERVAS CONFIRMADAS</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-md">
              +15% vs semana ant.
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1C30] tabular-nums">
              24
            </span>
            <span className="text-xs text-slate-400">confirmadas</span>
          </div>
        </div>

      </div>

      {/* Main Two Columns: Table on Left + Quick Slots & Link on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Area: Próximas Reservas de Hoy y Mañana Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Próximas Reservas de Hoy y Mañana
              </h3>
              <p className="text-xs text-slate-500">
                Gestiona el flujo de atención inmediato y valida cupos programados.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                  filterTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Pendientes</span>
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-bold">
                  {pendingBookings.length}
                </span>
              </button>
              <button
                onClick={() => setFilterTab('confirmed')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                  filterTab === 'confirmed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Confirmadas</span>
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-bold">
                  5
                </span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">CLIENTE</th>
                  <th className="py-3 px-3">SERVICIO</th>
                  <th className="py-3 px-3">HORARIO</th>
                  <th className="py-3 px-3">PRECIO</th>
                  <th className="py-3 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => {
                  const initials = item.clientName.split(' ').map(n => n[0]).join('').slice(0, 2);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{item.clientName}</div>
                            <div className="text-[11px] text-slate-400">{item.clientEmail}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{item.serviceTitle}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {item.address || item.modality}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">
                          {item.dateDisplay.includes('Jueves') ? 'Hoy' : 'Mañana'}, {item.timeDisplay}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.durationMinutes} min</div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-800 tabular-nums">
                        ${item.priceCOP.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-3">
                        {item.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Pendiente
                            </span>
                            <button
                              onClick={() => onConfirmBooking(item.id)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Confirmar
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Confirmada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Se muestran {filteredList.length} de 8 citas agendadas para las próximas 48 horas.</span>
            <button
              onClick={onNavigateBookings}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas las reservas en historial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Area: Próximos Horarios + Enlace Público de Reserva */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Horarios Disponibles Próximos */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Horarios Disponibles Próximos
                </h4>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                4 slots libres
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Cupos abiertos publicados en tu catálogo para reservas instantáneas de clientes.
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">04:00 PM - 05:00 PM</div>
                  <div className="text-[10px] text-slate-500">HOY · 1 cupo libre · Corte o Asesoría</div>
                </div>
                <button className="text-slate-400 hover:text-red-600 text-[11px]">⊖</button>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">05:30 PM - 06:30 PM</div>
                  <div className="text-[10px] text-slate-500">HOY · 1 cupo libre · Cualquier servicio</div>
                </div>
                <button className="text-slate-400 hover:text-red-600 text-[11px]">⊖</button>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">02:00 PM - 03:00 PM</div>
                  <div className="text-[10px] text-slate-500">MAÑ · 1 cupo libre · Clase / Fitness</div>
                </div>
                <button className="text-slate-400 hover:text-red-600 text-[11px]">⊖</button>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">04:30 PM - 05:30 PM</div>
                  <div className="text-[10px] text-slate-500">MAÑ · 1 cupo libre · Asesorías</div>
                </div>
                <button className="text-slate-400 hover:text-red-600 text-[11px]">⊖</button>
              </div>
            </div>

            <button
              onClick={onNavigateAvailability}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Gestionar disponibilidad
            </button>
          </div>

          {/* Tu Enlace Público de Reserva Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Tu Enlace Público de Reserva
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Comparte esta URL con tus clientes en WhatsApp, Instagram o sitio web para recibir citas directas 24/7.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="agendapro.co/lauramorales-studio"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-600 rounded-lg"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <button
                onClick={() => alert('Abriendo enlace directo para compartir por WhatsApp Web...')}
                className="flex-1 py-1.5 px-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setShowQRModal(true)}
                className="flex-1 py-1.5 px-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Ver Código QR</span>
              </button>
            </div>

            {/* Preview link to client experience */}
            <div
              onClick={onPreviewClientView}
              className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-blue-900">Vista del Cliente</div>
                <div className="text-[11px] text-blue-700">Página responsive optimizada</div>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-700" />
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Insights & Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Studio Photo & Google Sync */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[140px] flex flex-col justify-end p-5">
          <img
            src="/src/assets/images/barber_shop_chair_1791857352646.jpg"
            alt="Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              ESPACIO DE ATENCIÓN
            </span>
            <h4 className="font-bold text-sm text-white">Laura Morales Creative Studio</h4>
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sincronizado con Google Calendar</span>
            </div>
          </div>
        </div>

        {/* Card 2: Optimización de Agenda */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Optimización de Agenda
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tus horarios de la tarde suelen reservarse 3 veces más rápido. Considera habilitar cupos adicionales entre 4:00 PM y 7:00 PM.
          </p>
          <button
            onClick={onNavigateAvailability}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 self-start"
          >
            <span>Ajustar reglas automáticas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Ocupación Semanal Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">OCUPACIÓN SEMANAL</span>
            <span className="font-extrabold text-blue-700 tabular-nums">78%</span>
          </div>

          {/* Bar Chart Representation */}
          <div className="flex items-end justify-between gap-2 h-16 pt-2">
            {[
              { day: 'L', height: '60%' },
              { day: 'M', height: '40%' },
              { day: 'X', height: '95%', isPeak: true },
              { day: 'J', height: '75%' },
              { day: 'V', height: '85%' },
              { day: 'S', height: '50%' }
            ].map(col => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  style={{ height: col.height }}
                  className={`w-full rounded-t-md transition-all ${
                    col.isPeak ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                ></div>
                <span className="text-[10px] text-slate-400 font-medium">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Miércoles es tu día pico</span>
            <span className="font-semibold text-slate-700">6 reservas hoy</span>
          </div>
        </div>

      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Código QR de Reserva</h3>
            <div className="w-48 h-48 bg-slate-100 border-2 border-slate-300 rounded-xl mx-auto flex items-center justify-center p-3">
              <QrCode className="w-36 h-36 text-slate-800" />
            </div>
            <p className="text-xs text-slate-500">
              Coloca este QR en tu recepción o vitrina para que los clientes reserven al instante.
            </p>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
