import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Lock, 
  Check, 
  X, 
  ExternalLink, 
  Download, 
  Globe, 
  User, 
  Phone, 
  FileText, 
  Sparkles,
  AlertCircle,
  Scissors
} from 'lucide-react';
import { Booking, ServiceItem } from '../../types';

interface ProviderCalendarViewProps {
  bookings: Booking[];
  services: ServiceItem[];
  onConfirmBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

interface CalendarAppointment {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  dayIndex: number; // 0=Lun, 1=Mar, 2=Mie, 3=Jue
  startTime: string;
  timeRange: string;
  duration: string;
  priceCOP: number;
  modality: string;
  status: 'pending' | 'confirmed' | 'blocked' | 'available';
  color: 'yellow' | 'green' | 'blue' | 'gray';
  notes: string;
  code: string;
}

export const ProviderCalendarView: React.FC<ProviderCalendarViewProps> = ({
  bookings,
  services,
  onConfirmBooking,
  onCancelBooking
}) => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('Mantenimiento de equipos');

  const initialAppointments: CalendarAppointment[] = [
    {
      id: 'apt-1',
      title: 'Corte & Perfilado Barbería',
      clientName: 'Carlos Gómez',
      clientPhone: '+57 300 123 4567',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      dayIndex: 0,
      startTime: '10:00 AM',
      timeRange: 'Lun 24, 10:00 - 10:45 AM',
      duration: '45 minutos',
      priceCOP: 22000,
      modality: 'En Sitio',
      status: 'pending',
      color: 'yellow',
      notes: 'Cliente solicitó recordatorio vía WhatsApp con 2 horas de anticipación. Sin requerimientos especiales.',
      code: '#AP-88421'
    },
    {
      id: 'apt-2',
      title: 'Clase de Guitarra',
      clientName: 'David Silva',
      clientPhone: '+57 312 994 2201',
      dayIndex: 1,
      startTime: '09:00 AM',
      timeRange: 'Mar 25, 09:00 - 10:00 AM',
      duration: '60 minutos',
      priceCOP: 40000,
      modality: 'En Sitio',
      status: 'pending',
      color: 'yellow',
      notes: 'Traer guitarra acústica afinada en standard.',
      code: '#AP-88422'
    },
    {
      id: 'apt-3',
      title: 'Entrenamiento Personalizado',
      clientName: 'Camila Torres',
      clientPhone: '+57 318 440 1928',
      dayIndex: 2,
      startTime: '11:00 AM',
      timeRange: 'Mié 26, 11:00 - 12:00 PM',
      duration: '60 minutos',
      priceCOP: 35000,
      modality: 'Zona Fitness',
      status: 'confirmed',
      color: 'green',
      notes: 'Plan de piernas y tren superior intermedio.',
      code: '#AP-88423'
    },
    {
      id: 'apt-4',
      title: 'Mantenimiento Portátil',
      clientName: 'Felipe Mendoza',
      clientPhone: '+57 311 880 2931',
      dayIndex: 3,
      startTime: '11:00 AM',
      timeRange: 'Jue 27, 11:00 - 12:30 PM',
      duration: '90 minutos',
      priceCOP: 65000,
      modality: 'Soporte Lab',
      status: 'confirmed',
      color: 'green',
      notes: 'Revisión por sobrecalentamiento.',
      code: '#AP-88424'
    },
    {
      id: 'apt-5',
      title: 'Asesoría Contable',
      clientName: 'Mariana Restrepo',
      clientPhone: '+57 317 234 1908',
      dayIndex: 2,
      startTime: '02:30 PM',
      timeRange: 'Mié 26, 02:30 - 03:30 PM',
      duration: '60 minutos',
      priceCOP: 85000,
      modality: 'Videollamada',
      status: 'confirmed',
      color: 'green',
      notes: 'Revisión balances fiscales trimestrales.',
      code: '#AP-88425'
    },
    {
      id: 'apt-6',
      title: 'Sesión Fotográfica Set',
      clientName: 'Valentina Restrepo',
      clientPhone: '+57 315 777 8899',
      dayIndex: 3,
      startTime: '02:00 PM',
      timeRange: 'Jue 27, 02:00 - 04:00 PM',
      duration: '2 Horas',
      priceCOP: 180000,
      modality: 'Estudio Central - Set',
      status: 'confirmed',
      color: 'green',
      notes: 'Fotografía comercial editorial de producto.',
      code: '#AP-88426'
    },
    {
      id: 'apt-7',
      title: 'Horario Bloqueado',
      clientName: 'Mantenimiento de Estudio',
      clientPhone: 'Uso interno',
      dayIndex: 3,
      startTime: '03:00 PM',
      timeRange: 'Jue 27, 03:00 - 05:00 PM',
      duration: '2 Horas',
      priceCOP: 0,
      modality: 'Bloqueado',
      status: 'blocked',
      color: 'gray',
      notes: 'Desinfección de cabina y calibración de instrumental.',
      code: '#BLK-009'
    }
  ];

  const [appointments, setAppointments] = useState<CalendarAppointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment>(initialAppointments[0]);

  const handleConfirmCurrent = () => {
    setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...a, status: 'confirmed', color: 'green' } : a));
    setSelectedAppointment(prev => ({ ...prev, status: 'confirmed', color: 'green' }));
    alert('¡Cita confirmada exitosamente! Se notificó al cliente vía WhatsApp y correo.');
  };

  const handleCancelCurrent = () => {
    setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
    alert('Cita cancelada y horario liberado para nuevos clientes.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              PLANIFICACIÓN SEMANAL · Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Mi Agenda de Servicios
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>GMT-5 (Hora estándar de Colombia / Perú)</span>
          </div>

          <button
            onClick={() => alert('Exportando calendario en formato universal iCal (.ics)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar agenda (iCal / Google)</span>
          </button>

          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Bloquear Horario</span>
          </button>
        </div>
      </div>

      {/* Week Navigation & View Mode */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg">
            Hoy
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 ml-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Semana del 24 al 30 de Octubre de 2024</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
            <option>Todos los servicios (6 activos)</option>
            <option>Corte & Perfilado Barbería</option>
            <option>Clase de Guitarra</option>
            <option>Entrenamiento Funcional</option>
          </select>

          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedView('day')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedView === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setSelectedView('week')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedView === 'week' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setSelectedView('month')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedView === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Schedule on Left + Quick Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Weekly Time Grid */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Days Header */}
          <div className="grid grid-cols-5 border-b border-slate-200 text-center text-xs font-bold">
            <div className="p-3 border-r border-slate-100 text-slate-400 bg-slate-50/70 text-[10px] uppercase">
              HORA
            </div>
            
            <div className="p-3 border-r border-slate-100 text-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">LUN</span>
              <span className="text-base font-extrabold text-[#0B1C30]">24</span>
              <div className="text-[10px] text-slate-400 font-normal">2 citas</div>
            </div>

            <div className="p-3 border-r border-slate-100 text-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">MAR</span>
              <span className="text-base font-extrabold text-[#0B1C30]">25</span>
              <div className="text-[10px] text-slate-400 font-normal">2 citas</div>
            </div>

            <div className="p-3 border-r border-slate-100 bg-blue-50/60 text-blue-900">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">HOY · MIÉ</span>
              <span className="text-base font-extrabold text-blue-700 bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center my-0.5">26</span>
              <div className="text-[10px] text-blue-600 font-semibold">1 evento</div>
            </div>

            <div className="p-3 text-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">JUE</span>
              <span className="text-base font-extrabold text-[#0B1C30]">27</span>
              <div className="text-[10px] text-slate-400 font-normal">1 cita</div>
            </div>
          </div>

          {/* Time Rows Container with Current Time Marker */}
          <div className="relative divide-y divide-slate-100 text-xs">
            
            {/* Red Current Time Marker at 10:45 AM */}
            <div 
              style={{ top: '24%' }} 
              className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
            >
              <div className="w-16 text-right pr-2">
                <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
                  10:45 AM
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-rose-500 relative">
                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white"></div>
              </div>
            </div>

            {/* Time Slot Rows */}
            {[
              '08:00 AM',
              '09:00 AM',
              '10:00 AM',
              '11:00 AM',
              '12:00 PM',
              '01:00 PM',
              '02:00 PM',
              '03:00 PM',
              '04:00 PM',
              '05:00 PM',
              '06:00 PM'
            ].map((timeLabel, index) => (
              <div key={timeLabel} className="grid grid-cols-5 min-h-[64px] group hover:bg-slate-50/30">
                
                {/* Time column */}
                <div className="p-2 border-r border-slate-100 text-slate-400 text-[11px] font-mono select-none">
                  {timeLabel}
                </div>

                {/* Day 0: Lunes */}
                <div className="p-1.5 border-r border-slate-100 relative">
                  {timeLabel === '09:00 AM' && (
                    <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                      <div className="font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        DISPONIBLE
                      </div>
                      <div className="text-[10px] text-blue-600">Cupo libre publicado</div>
                    </div>
                  )}
                  {timeLabel === '10:00 AM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[0])}
                      className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 cursor-pointer shadow-xs hover:border-amber-400"
                    >
                      <div className="font-bold">Corte... 10:00 AM</div>
                      <div className="text-[10px] text-amber-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Carlos Gó...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Day 1: Martes */}
                <div className="p-1.5 border-r border-slate-100 relative">
                  {timeLabel === '09:00 AM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[1])}
                      className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 cursor-pointer shadow-xs hover:border-amber-400"
                    >
                      <div className="font-bold">Clase... 09:00 AM</div>
                      <div className="text-[10px] text-amber-700">David Silva</div>
                    </div>
                  )}
                </div>

                {/* Day 2: Miércoles (Hoy) */}
                <div className="p-1.5 border-r border-slate-100 bg-blue-50/20 relative">
                  {timeLabel === '11:00 AM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[2])}
                      className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 cursor-pointer shadow-xs hover:border-emerald-400"
                    >
                      <div className="font-bold">Entre... 11:00 AM</div>
                      <div className="text-[10px] text-emerald-700">Camila Tor...</div>
                    </div>
                  )}
                  {timeLabel === '02:00 PM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[4])}
                      className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 cursor-pointer shadow-xs hover:border-emerald-400"
                    >
                      <div className="font-bold">Ases... 02:30 PM</div>
                      <div className="text-[10px] text-emerald-700">Mariana Re...</div>
                    </div>
                  )}
                  {timeLabel === '03:00 PM' && (
                    <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                      <div className="font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        DISPONIBLE
                      </div>
                      <div className="text-[10px] text-blue-600">Espacio publicado (2h)</div>
                    </div>
                  )}
                </div>

                {/* Day 3: Jueves */}
                <div className="p-1.5 relative">
                  {timeLabel === '11:00 AM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[3])}
                      className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 cursor-pointer shadow-xs hover:border-emerald-400"
                    >
                      <div className="font-bold">Mante... 11:00 AM</div>
                      <div className="text-[10px] text-emerald-700">Felipe Men... $65.000</div>
                    </div>
                  )}
                  {timeLabel === '02:00 PM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[5])}
                      className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 cursor-pointer shadow-xs hover:border-emerald-400"
                    >
                      <div className="font-bold">Se... 2 Horas</div>
                      <div className="text-[10px] text-emerald-700">Valentina · $180.000</div>
                    </div>
                  )}
                  {timeLabel === '03:00 PM' && (
                    <div
                      onClick={() => setSelectedAppointment(appointments[6])}
                      className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-600 cursor-pointer shadow-xs"
                    >
                      <div className="font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Horario Bloqueado</span>
                      </div>
                      <div className="text-[10px] text-slate-400">03:00 PM - 05:00 PM</div>
                    </div>
                  )}
                </div>

              </div>
            ))}

          </div>

          {/* Footer note matching Image 24.jpeg */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Workspace Confirmada</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Workspace Pendiente</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Workspace Disponible</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span> Bloqueado</span>
            </div>
            <span>Clic en un bloque para inspeccionar y gestionar</span>
          </div>
        </div>

        {/* Right Side: Detalle Rápido Inspector Panel matching Image 24.jpeg */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5 sticky top-20">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-base text-slate-900">
                Detalle Rápido
              </h3>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
              selectedAppointment.status === 'confirmed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : selectedAppointment.status === 'pending'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {selectedAppointment.status === 'confirmed' ? 'Confirmada' : selectedAppointment.status === 'pending' ? 'Pendiente' : 'Bloqueado'}
            </span>
          </div>

          {/* Client info */}
          <div className="flex items-center gap-3">
            {selectedAppointment.clientAvatar ? (
              <img
                src={selectedAppointment.clientAvatar}
                alt={selectedAppointment.clientName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center text-sm">
                {selectedAppointment.clientName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{selectedAppointment.clientName}</h4>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{selectedAppointment.clientPhone}</span>
              </div>
            </div>
          </div>

          {/* Service requested */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SERVICIO SOLICITADO
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Scissors className="w-4 h-4 text-blue-600" />
              <span>{selectedAppointment.title}</span>
            </div>
          </div>

          {/* Metadata table grid */}
          <div className="grid grid-cols-2 gap-3 text-xs p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60">
            <div>
              <div className="text-[10px] text-slate-400">Horario y Día</div>
              <div className="font-bold text-slate-800">{selectedAppointment.timeRange}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">Duración</div>
              <div className="font-bold text-slate-800">{selectedAppointment.duration}</div>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <div className="text-[10px] text-slate-400">Tarifa del Servicio</div>
              <div className="font-extrabold text-blue-800 text-sm tabular-nums">
                ${selectedAppointment.priceCOP.toLocaleString('es-CO')} COP
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <div className="text-[10px] text-slate-400">Modalidad</div>
              <div className="font-bold text-slate-800">{selectedAppointment.modality}</div>
            </div>
          </div>

          {/* Notes */}
          <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Nota de reserva</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {selectedAppointment.notes}
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {selectedAppointment.status === 'pending' && (
              <button
                onClick={handleConfirmCurrent}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirmar Cita</span>
              </button>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => alert(`Reprogramando cita para ${selectedAppointment.clientName}...`)}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Reprogramar
              </button>
              <button
                onClick={handleCancelCurrent}
                className="text-rose-600 hover:text-rose-800 font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar Cita</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 text-center pt-2 border-t border-slate-100">
            Reservado vía Web Widget · ID: {selectedAppointment.code}
          </div>

        </div>

      </div>

      {/* Block Schedule Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Bloquear Horario de Agenda</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Bloquea un rango de tiempo para descanso personal, mantenimiento o actividades privadas fuera de servicio.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motivo del bloqueo</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desde</label>
                  <input type="text" defaultValue="03:00 PM" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hasta</label>
                  <input type="text" defaultValue="05:00 PM" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  alert('Horario bloqueado con éxito en el calendario.');
                }}
                className="flex-1 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-lg text-xs"
              >
                Confirmar Bloqueo
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
