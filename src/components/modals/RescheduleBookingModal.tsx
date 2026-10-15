import React, { useEffect, useState } from 'react';
import { Booking } from '../../types';
import { X, CalendarDays, Save } from 'lucide-react';

interface RescheduleBookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirmReschedule: (bookingId: string, newDate: string, newTime: string) => void;
}

const AVAILABLE_TIMES = [
  '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
];

const AVAILABLE_DAYS = [
  { label: 'Hoy, 24 Oct',     value: 'Hoy, 24 Oct' },
  { label: 'Jueves 25 Oct',   value: 'Jueves 25 Oct' },
  { label: 'Viernes 26 Oct',  value: 'Viernes 26 Oct' },
  { label: 'Sábado 27 Oct',   value: 'Sábado 27 Oct' },
  { label: 'Lunes 29 Oct',    value: 'Lunes 29 Oct' },
  { label: 'Martes 30 Oct',   value: 'Martes 30 Oct' },
  { label: 'Miércoles 31 Oct', value: 'Miércoles 31 Oct' },
];

export const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({
  booking,
  onClose,
  onConfirmReschedule,
}) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (booking) {
      setSelectedDay(booking.date);
      setSelectedTime(booking.time);
    }
  }, [booking]);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) return;
    onConfirmReschedule(booking.id, selectedDay, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-4">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Reprogramar Reserva
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona un nuevo día y hora disponible para esta cita.
            </p>
          </div>
        </div>

        {/* Booking summary */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">{booking.serviceTitle}</p>
          <p className="text-slate-500">
            Cliente: <span className="font-semibold text-slate-700">{booking.clientName}</span>
          </p>
          <p className="text-slate-500">
            Fecha actual:{' '}
            <span className="font-semibold text-slate-700">
              {booking.date} — {booking.time}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">

          {/* Day selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nuevo día disponible
            </label>
            <select
              required
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>Selecciona un día...</option>
              {AVAILABLE_DAYS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Time selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nueva hora disponible
            </label>
            <select
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>Selecciona una hora...</option>
              {AVAILABLE_TIMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedDay || !selectedTime}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar cambios</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
