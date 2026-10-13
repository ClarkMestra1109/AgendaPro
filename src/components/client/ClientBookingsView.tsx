import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ExternalLink, 
  ArrowRight,
  CalendarCheck,
  History,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Booking } from '../../types';

interface ClientBookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onViewBookingDetails: (booking: Booking) => void;
  onRebook: (booking: Booking) => void;
}

export const ClientBookingsView: React.FC<ClientBookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onViewBookingDetails,
  onRebook
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'cancelled'>('upcoming');

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1">
            GESTIÓN DE CITAS · Actualizado hace 4 min
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Mis Reservas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Consulta, administra y da seguimiento a todas tus citas programadas e historial de servicios profesionales.
          </p>
        </div>

        {/* Counter cards in header */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tabular-nums">
                {upcomingBookings.length}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Próximas</div>
            </div>
          </div>

          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tabular-nums">
                {pastBookings.length || 8}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Próximas reservas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {upcomingBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Historial y Pasadas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {pastBookings.length || 8}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Canceladas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {cancelledBookings.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => alert('Sincronización con Google Calendar activada. Los eventos se mantendrán sincronizados automáticamente.')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Sincronizar Google Calendar</span>
        </button>
      </div>

      {/* Tab: Upcoming Cards Grid matching Image 3.jpeg */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Corte & Perfilado Barbería */}
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={b.serviceTitle.includes('Barber') ? '/src/assets/images/barber_shop_chair_1791857352646.jpg' : '/src/assets/images/acoustic_guitar_studio_1791857352959.jpg'}
                          alt={b.serviceTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#0B1C30]">
                          {b.serviceTitle}
                        </h3>
                        <div className="text-xs text-slate-500 font-medium">
                          {b.providerName}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        b.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                      {b.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </span>
                  </div>

                  {/* Date & details */}
                  <div className="mt-4 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{b.dateDisplay} a las {b.timeDisplay}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {b.durationMinutes} minutos
                      </span>
                      <span>·</span>
                      <span className="font-bold text-blue-700 tabular-nums">
                        ${b.priceCOP.toLocaleString('es-CO')} COP
                      </span>
                      <span>·</span>
                      <span>Modalidad {b.modality}</span>
                    </div>
                  </div>

                  {/* Location or Virtual Link */}
                  <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                    {b.address ? (
                      <>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{b.address}</span>
                        </div>
                        <button 
                          onClick={() => alert(`Ubicación: ${b.address}\nCoordenadas: Chicó Norte, Bogotá.`)}
                          className="text-blue-600 font-semibold hover:underline shrink-0 ml-2 cursor-pointer"
                        >
                          Ver mapa
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                          <span>Enlace de sesión habilitado 15 min antes</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ID: {b.virtualMeetingId || '849-204-118'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setCancelModalBooking(b)}
                    className="flex-1 py-2 px-3 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cancelar reserva</span>
                  </button>

                  {b.virtualMeetingUrl ? (
                    <button
                      onClick={() => alert(`Abriendo sala virtual: ${b.virtualMeetingUrl}`)}
                      className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Ver enlace virtual</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewBookingDetails(b)}
                      className="flex-1 py-2 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver detalles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Historial reciente Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-base text-[#0B1C30]">
                  Historial reciente
                </h3>
              </div>

              <button
                onClick={() => alert('Descargando comprobante oficial de reservas en formato PDF...')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>Descargar comprobantes en PDF</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">SERVICIO Y PROFESIONAL</th>
                    <th className="py-3 px-3">FECHA Y HORA</th>
                    <th className="py-3 px-3">MODALIDAD</th>
                    <th className="py-3 px-3 text-right">MONTO</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastBookings.concat(cancelledBookings).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{row.serviceTitle}</div>
                        <div className="text-[11px] text-slate-500">{row.providerName}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-700">{row.dateDisplay}</div>
                        <div className="text-[11px] text-slate-400">{row.timeDisplay}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {row.modality}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-800 tabular-nums">
                        ${row.priceCOP.toLocaleString('es-CO')} COP
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          row.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}></span>
                          {row.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {row.status === 'completed' ? (
                          <button
                            onClick={() => onRebook(row)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            Volver a reservar
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Motivo de cancelación: ${row.cancelReason || 'Choque de horario por imprevisto'}`)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                          >
                            Ver motivo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Past */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#0B1C30]">
            Historial de servicios completados ({pastBookings.length})
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {pastBookings.map((b) => (
              <div key={b.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{b.serviceTitle}</h4>
                  <div className="text-slate-500">{b.providerName} · {b.dateDisplay}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700 tabular-nums">${b.priceCOP.toLocaleString('es-CO')} COP</div>
                  <button
                    onClick={() => onRebook(b)}
                    className="text-blue-600 font-semibold hover:underline mt-1"
                  >
                    Volver a agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cancelled */}
      {activeTab === 'cancelled' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#0B1C30]">
            Citas canceladas ({cancelledBookings.length})
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {cancelledBookings.map((b) => (
              <div key={b.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{b.serviceTitle}</h4>
                  <div className="text-slate-500">{b.providerName} · {b.dateDisplay}</div>
                  <div className="text-[11px] text-rose-600 mt-0.5">Motivo: {b.cancelReason || 'Cancelada por el usuario'}</div>
                </div>
                <button
                  onClick={() => onRebook(b)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100"
                >
                  Reprogramar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Deseas cancelar esta reserva?
            </h3>
            <p className="text-xs text-slate-500">
              Estás a punto de cancelar tu turno para <strong className="text-slate-800">{cancelModalBooking.serviceTitle}</strong> el {cancelModalBooking.dateDisplay}.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onCancelBooking(cancelModalBooking.id);
                  setCancelModalBooking(null);
                }}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
              >
                Sí, cancelar reserva
              </button>
              <button
                onClick={() => setCancelModalBooking(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
