import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Check, 
  Lock, 
  ArrowLeft, 
  Star, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { ServiceItem, Booking } from '../../types';

interface ClientBookingViewProps {
  service: ServiceItem;
  onBack: () => void;
  onBookingConfirmed: (newBooking: Partial<Booking>) => void;
  onNavigateMyBookings: () => void;
}

export const ClientBookingView: React.FC<ClientBookingViewProps> = ({
  service,
  onBack,
  onBookingConfirmed,
  onNavigateMyBookings
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // JUE 27
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState('');

  const weekDays = [
    { dayName: 'LUN', dateNumber: '24', status: 'no_slots', label: 'Sin turnos' },
    { dayName: 'MAR', dateNumber: '25', status: 'available', label: '' },
    { dayName: 'MIÉ', dateNumber: '26', status: 'available', label: '' },
    { dayName: 'JUE', dateNumber: '27', status: 'today_available', label: 'HOY' },
    { dayName: 'VIE', dateNumber: '28', status: 'available', label: '' },
    { dayName: 'SÁB', dateNumber: '29', status: 'available', label: '' },
    { dayName: 'DOM', dateNumber: '30', status: 'closed', label: 'Cerrado' },
  ];

  const timeSlots = [
    { time: '09:00 AM', status: 'available' },
    { time: '10:00 AM', status: 'occupied' },
    { time: '11:00 AM', status: 'available' },
    { time: '02:00 PM', status: 'available' },
    { time: '03:30 PM', status: 'available' },
    { time: '04:30 PM', status: 'occupied' },
    { time: '05:30 PM', status: 'available' },
  ];

  const handleConfirm = () => {
    const code = `#RS-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBookingCode(code);

    onBookingConfirmed({
      code,
      serviceId: service.id,
      serviceTitle: service.title,
      providerName: service.providerName,
      providerAvatar: service.providerAvatar,
      dateStr: '2024-10-27',
      dateDisplay: 'Jueves, 27 de Octubre de 2024',
      timeDisplay: selectedSlot,
      timeRange: `${selectedSlot} - ${selectedSlot === '11:00 AM' ? '11:45 AM' : 'Finaliza en ' + service.durationMinutes + 'm'}`,
      durationMinutes: service.durationMinutes,
      priceCOP: service.priceCOP,
      modality: service.modality,
      status: 'confirmed',
      address: service.location,
      notes: notes || 'Reserva generada con éxito.',
      periodOfDay: selectedSlot.includes('AM') ? 'Mañana' : 'Tarde'
    });

    setShowConfirmationSuccess(true);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={onBack} className="hover:text-blue-600 transition-colors cursor-pointer">
          Explorar servicios
        </button>
        <span>&gt;</span>
        <span>{service.subtitle}</span>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800">{service.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
          Horarios Disponibles y Confirmación de Reserva
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 self-start sm:self-auto">
          <span>⚡ Disponibilidad en tiempo real</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Service Overview, Date Picker & Time Slots */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Service Banner Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={service.image}
                alt={service.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Destacado
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  SERVICIO ESPECIALIZADO
                </span>
                <div className="text-right">
                  <div className="text-base font-extrabold text-blue-800 tabular-nums">
                    ${service.priceCOP.toLocaleString('es-CO')} COP
                  </div>
                  <div className="text-[10px] text-slate-400">IVA incluido</div>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {service.title}
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duración: <strong className="text-slate-800">{service.durationMinutes} minutos</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Modalidad: <strong className="text-slate-800">{service.modality}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Proveedor: <strong className="text-slate-800">{service.providerName}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Picker Week Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Selecciona una fecha
                </h3>
                <span className="text-xs text-slate-400 ml-1">
                  Semana del 24 al 30 de Octubre de 2024
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Week buttons */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const isDisabled = day.status === 'no_slots' || day.status === 'closed';

                return (
                  <button
                    key={day.dayName}
                    disabled={isDisabled}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`py-3 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white shadow-md ring-2 ring-blue-600/30'
                        : isDisabled
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'
                        : 'bg-slate-50/80 hover:bg-blue-50/60 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {day.label && (
                      <span className={`text-[9px] font-bold uppercase mb-0.5 ${
                        isSelected ? 'text-blue-200' : 'text-slate-400'
                      }`}>
                        {day.label}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold">{day.dayName}</span>
                    <span className="text-base font-extrabold my-0.5">{day.dateNumber}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : day.status === 'available' ? 'bg-blue-600' : 'bg-transparent'
                    }`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Horarios disponibles para Jueves, 27 de Octubre
                </h3>
                <div className="text-[11px] text-slate-400">
                  Zona horaria: America/Bogota (GMT-5)
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Libre
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  Ocupado
                </span>
              </div>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const isOccupied = slot.status === 'occupied';

                if (isOccupied) {
                  return (
                    <div
                      key={slot.time}
                      className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/70 text-slate-400 flex items-center justify-between cursor-not-allowed select-none"
                    >
                      <div>
                        <div className="text-xs font-semibold line-through">{slot.time}</div>
                        <div className="text-[10px] text-slate-400">Ocupado</div>
                      </div>
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  );
                }

                return (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white border-blue-600 shadow-sm'
                        : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{slot.time}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>
                        {isSelected ? 'Seleccionado' : 'Libre'}
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Los horarios en gris no están disponibles o ya han sido reservados previamente por otros clientes.</span>
            </div>
          </div>

          {/* Provider Bio Card at bottom */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={service.providerAvatar}
                alt={service.providerName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{service.providerName}</h4>
                <div className="text-xs text-slate-500">{service.providerRoleTitle}</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  <span>4.96</span>
                  <span className="text-slate-400">(184 valoraciones)</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">Sede Chicó Norte</div>
                <div className="text-[11px] text-slate-500">Calle 93 #14-20, Bogotá</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Resumen de la reserva */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              Resumen de la reserva
            </h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              En progreso
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-slate-500">Servicio</span>
              <span className="font-bold text-slate-800 text-right">{service.title}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500">Proveedor</span>
              <span className="font-semibold text-slate-800 text-right">{service.subtitle}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500">Fecha</span>
              <span className="font-semibold text-slate-800 text-right">Jueves, 27 Oct 2024</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500">Horario pactado</span>
              <span className="font-bold text-blue-700 text-right">{selectedSlot} - 11:45 AM</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500">Duración</span>
              <span className="font-semibold text-slate-800 text-right">{service.durationMinutes} minutos</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500">Dirección</span>
              <span className="font-medium text-slate-700 text-right max-w-[180px] leading-tight">
                {service.location}
              </span>
            </div>
          </div>

          {/* Notes textarea */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Notas opcionales
              </label>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones o detalles especiales (ej. requerimientos de barba, preferencia de corte)..."
              className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            />
          </div>

          {/* Price total box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PRECIO TOTAL
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-[#0B1C30] tabular-nums">
                ${service.priceCOP.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
              </span>
              <span className="text-[10px] font-bold bg-blue-100/70 text-blue-800 px-2 py-0.5 rounded-md">
                Pago en sede
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirmar reserva</span>
            </button>

            <button
              onClick={onBack}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Volver a servicios
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cancelación gratuita hasta 2 horas antes</span>
          </div>

          {/* Support callout */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">¿Tienes preguntas sobre tu cita?</div>
            <div>Llama directo a la recepción: <strong className="text-blue-700">+57 (601) 745-9000</strong></div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmationSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Cita Agendada Exitosamente
              </span>
              <h3 className="text-xl font-extrabold text-[#0B1C30] mt-1">
                ¡Tu reserva está confirmada!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hemos enviado un correo y notificación con el código de seguimiento:
              </p>
              <div className="mt-2 text-sm font-bold text-blue-800 bg-blue-50 py-1.5 px-3 rounded-lg inline-block">
                {confirmedBookingCode}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-left space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Servicio:</span>
                <span className="font-bold text-slate-800">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horario:</span>
                <span className="font-bold text-slate-800">Jue 27 Oct · {selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total a pagar:</span>
                <span className="font-bold text-blue-700">${service.priceCOP.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onNavigateMyBookings}
                className="flex-1 py-2.5 px-4 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Ver mis reservas
              </button>
              <button
                onClick={() => setShowConfirmationSuccess(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
