import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Check, 
  X, 
  Eye, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { Booking } from '../../types';

interface ProviderBookingsViewProps {
  bookings: Booking[];
  onConfirmBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onViewBookingDetails: (booking: Booking) => void;
}

export const ProviderBookingsView: React.FC<ProviderBookingsViewProps> = ({
  bookings,
  onConfirmBooking,
  onCancelBooking,
  onViewBookingDetails
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-semibold text-slate-500">
              Gestión Activa de Citas · Sistema en línea
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Gestión de Reservas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Supervisa, confirma y gestiona todas las solicitudes de reserva recibidas para tus servicios.
          </p>
        </div>

        {/* Counter cards in header matching Image 18.jpeg */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-center">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              PENDIENTES
            </div>
            <div className="text-xl font-extrabold text-amber-800 tabular-nums">
              {pendingBookings.length}
            </div>
          </div>

          <div className="px-3.5 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-center">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              CONFIRMADAS
            </div>
            <div className="text-xl font-extrabold text-emerald-800 tabular-nums">
              18
            </div>
          </div>

          <div className="px-3.5 py-2 bg-rose-50/70 border border-rose-200/80 rounded-xl text-center">
            <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              CANCELADAS
            </div>
            <div className="text-xl font-extrabold text-rose-800 tabular-nums">
              2
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Todas</span>
          <span className="text-[10px] opacity-80">(23)</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Pendientes por confirmar</span>
          <span className="text-[10px] opacity-80">({pendingBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'confirmed'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Confirmadas</span>
          <span className="text-[10px] opacity-80">(18)</span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Canceladas</span>
          <span className="text-[10px] opacity-80">(2)</span>
        </button>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, correo o servicio..."
            className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Semana en curso (24 Oct - 30 Oct)</span>
          </div>

          <button 
            onClick={() => alert('Filtros avanzados abiertos')}
            className="flex items-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtros</span>
          </button>

          <button 
            onClick={() => alert('Exportando lista de reservas en formato CSV/Excel...')}
            className="flex items-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/60">
                <th className="py-3.5 px-4">CLIENTE</th>
                <th className="py-3.5 px-4">CONTACTO</th>
                <th className="py-3.5 px-4">SERVICIO SOLICITADO</th>
                <th className="py-3.5 px-4">FECHA Y HORA</th>
                <th className="py-3.5 px-4">DURACIÓN / VALOR</th>
                <th className="py-3.5 px-4">ESTADO</th>
                <th className="py-3.5 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Cliente */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {b.clientAvatar ? (
                        <img
                          src={b.clientAvatar}
                          alt={b.clientName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {b.clientName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">
                          {b.clientName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ID: {b.code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="py-4 px-4">
                    <div className="text-slate-700">{b.clientEmail}</div>
                    <div className="text-[11px] text-slate-400">{b.clientPhone}</div>
                  </td>

                  {/* Servicio */}
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {b.serviceTitle}
                  </td>

                  {/* Fecha y hora */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{b.dateDisplay}</div>
                    <div className="text-[11px] text-slate-500">
                      {b.timeDisplay} ({b.periodOfDay || 'Mañana'})
                    </div>
                  </td>

                  {/* Duración / Valor */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-blue-700 tabular-nums">
                      ${b.priceCOP.toLocaleString('es-CO')} COP
                    </div>
                    <div className="text-[11px] text-slate-400">{b.durationMinutes} min</div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    {b.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pendiente
                      </span>
                    ) : b.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Confirmada
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Cancelada
                        </span>
                        {b.cancelReason && (
                          <div className="text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate">
                            Motivo: {b.cancelReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-4 text-right">
                    {b.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onConfirmBooking(b.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirmar</span>
                        </button>
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    ) : b.status === 'confirmed' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewBookingDetails(b)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Ver detalles
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="text-xs font-semibold text-slate-500 hover:text-red-600 hover:underline"
                        >
                          Reprogramar / Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onViewBookingDetails(b)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                      >
                        Ver historial
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Mostrando {filteredBookings.length} de 23 reservas del periodo seleccionado</span>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Anterior
            </button>
            {[1, 2, 3].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg font-bold text-xs ${
                  currentPage === p ? 'bg-[#1E3A8A] text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
              className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
