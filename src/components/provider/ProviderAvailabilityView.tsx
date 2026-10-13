import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  CalendarX, 
  TrendingUp, 
  Plus, 
  Check, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Download, 
  Lock,
  MinusCircle,
  RotateCcw
} from 'lucide-react';
import { TimeSlot, ServiceItem } from '../../types';

interface ProviderAvailabilityViewProps {
  slots: TimeSlot[];
  services: ServiceItem[];
  onAddSlot: (newSlot: Partial<TimeSlot>) => void;
  onToggleSlotStatus: (slotId: string) => void;
}

export const ProviderAvailabilityView: React.FC<ProviderAvailabilityViewProps> = ({
  slots,
  services,
  onAddSlot,
  onToggleSlotStatus
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'srv-1');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'X', 'J', 'V']);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [intervalMin, setIntervalMin] = useState(60);
  const [repeatWeekly, setRepeatWeekly] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'week' | 'month'>('list');

  const daysList = [
    { id: 'L', label: 'L' },
    { id: 'M', label: 'M' },
    { id: 'X', label: 'X' },
    { id: 'J', label: 'J' },
    { id: 'V', label: 'V' },
    { id: 'S', label: 'S' },
    { id: 'D', label: 'D' },
  ];

  const toggleDay = (d: string) => {
    if (selectedDays.includes(d)) {
      setSelectedDays(selectedDays.filter(day => day !== d));
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  const handlePublishSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const svc = services.find(s => s.id === selectedServiceId) || services[0];
    onAddSlot({
      dateStr: '2024-10-28',
      dayLabel: 'Lunes, 28 Octubre',
      time: startTime,
      endTime: '09:00 AM',
      serviceId: svc.id,
      serviceName: `${svc.title} · Turno regular (${intervalMin}m)`,
      status: 'available',
      priceCOP: svc.priceCOP,
      modality: svc.modality
    });
    alert('¡Nuevos horarios publicados exitosamente en la agenda y sincronizados!');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-semibold text-slate-500">
              18 horarios disponibles activos en las próximas 2 semanas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Disponibilidad de Horarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Publica y gestiona los horarios y días disponibles para que tus clientes puedan reservar servicios de forma autónoma y sincronizada.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('publish-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start lg:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Publicar disponibilidad</span>
        </button>
      </div>

      {/* 4 Metrics Cards matching Image 16.jpeg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PUBLICADOS ACTIVOS
            </div>
            <div className="text-2xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              18
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">84% cupo promedio</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CITAS CONFIRMADAS
            </div>
            <div className="text-2xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              12
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Próximos 7 días</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              RETIRADOS / PAUSADOS
            </div>
            <div className="text-2xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              3
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sin colisión</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <CalendarX className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              EFICIENCIA DE AGENDA
            </div>
            <div className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">
              96%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Óptimo flujo</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
        </div>

      </div>

      {/* Main Two Columns: Left Form + Right Slots Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Publicar Nuevos Horarios */}
        <div id="publish-form" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-base text-[#0B1C30]">
              Publicar Nuevos Horarios
            </h3>
          </div>

          <form onSubmit={handlePublishSlot} className="space-y-4 text-xs">
            {/* Service dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Servicio o Especialidad
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Days selector toggles */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Días de Aplicación
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {daysList.map(d => {
                  const active = selectedDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDay(d.id)}
                      className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5">
                Frecuencia activa: Días hábiles estándar (Martes a Viernes).
              </div>
            </div>

            {/* Time range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hora de Inicio</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hora de Fin</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Slot interval buttons */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Intervalo por Franja / Turno
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setIntervalMin(mins)}
                    className={`py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      intervalMin === mins
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat weekly */}
            <div className="pt-1">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Repetir semanalmente</div>
                  <div className="text-[11px] text-slate-400">Extender automáticamente para las próximas 4 semanas</div>
                </div>
                <input
                  type="checkbox"
                  checked={repeatWeekly}
                  onChange={(e) => setRepeatWeekly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Publicar disponibilidad en agenda</span>
            </button>
          </form>
        </div>

        {/* Right Area: View Toggles & Slots Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          
          {/* View Mode & Week Navigator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Vista Lista
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Vista Semanal
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Vista Calendario Mensual
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>Semana 43 (24 - 30 Oct)</span>
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slots Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">FECHA & FRANJA HORARIA</th>
                  <th className="py-3 px-3">SERVICIO VINCULADO</th>
                  <th className="py-3 px-3">ESTADO</th>
                  <th className="py-3 px-3 text-right">GESTIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.slice(0, 6).map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{slot.dayLabel}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{slot.time} - {slot.endTime}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{slot.serviceName}</div>
                      {slot.bookedByClientName && (
                        <div className="text-[11px] text-blue-600 font-medium">
                          Cliente: {slot.bookedByClientName}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {slot.status === 'available' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          Disponible
                        </span>
                      ) : slot.status === 'booked' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          Reservado por {slot.bookedByClientName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Retirada (No disponible)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {slot.status === 'available' ? (
                        <button
                          onClick={() => onToggleSlotStatus(slot.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 justify-end ml-auto cursor-pointer"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                          <span>Retirar</span>
                        </button>
                      ) : slot.status === 'withdrawn' ? (
                        <button
                          onClick={() => onToggleSlotStatus(slot.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-end ml-auto cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Habilitar</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">Cita activa</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer integrations links */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Sincronizado con Google Calendar & iCal · Exportar disponibilidad (.ics)</span>
            </div>
            <button className="text-blue-600 font-semibold hover:underline">
              Reglas de antelación
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
