import React, { useEffect, useMemo, useState } from 'react';
import { Booking, AvailabilitySlot } from '../../types';
import { X, CalendarDays, Save } from 'lucide-react';

interface RescheduleBookingModalProps {
  booking: Booking | null;
  slots: AvailabilitySlot[];
  bookings: Booking[];
  onClose: () => void;
  onConfirmReschedule: (bookingId: string, newSlot: AvailabilitySlot) => Promise<boolean>;
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

function fechaLegible(fechaISO: string): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function horaAMPM(hora: string): string {
  const [horas, minutos] = hora.split(':').map(Number);
  return `${String(horas % 12 || 12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${horas >= 12 ? 'PM' : 'AM'}`;
}

function servicioCompatible(franja: AvailabilitySlot, reserva: Booking): boolean {
  const etiqueta = (franja.serviceTag || '').trim().toLowerCase();
  return !etiqueta || ['cualquier servicio', 'todos los servicios', 'todos'].includes(etiqueta)
    || etiqueta === reserva.serviceTitle.trim().toLowerCase()
    || etiqueta === reserva.category.trim().toLowerCase();
}

function estaOcupada(franja: AvailabilitySlot, reservaActual: Booking, reservas: Booking[]): boolean {
  if (franja.isBooked) return true;
  return reservas.some((reserva) => {
    if (reserva.id === reservaActual.id || (reserva.status !== 'pending' && reserva.status !== 'confirmed')) return false;
    if (reserva.availabilitySlotId && reserva.availabilitySlotId === franja.id) return true;
    return Boolean(franja.dateISO && franja.startTime && reserva.dateISO === franja.dateISO
      && reserva.startTime === franja.startTime
      && reserva.providerEmail === franja.providerEmail);
  });
}

export const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({
  booking,
  slots,
  bookings,
  onClose,
  onConfirmReschedule,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedSlotId('');
    setErrorMessage('');
  }, [booking]);

  const horariosDisponibles = useMemo(() => {
    if (!booking) return [];
    return slots
      .filter((franja) => Boolean(franja.dateISO && franja.startTime))
      .filter(franjaEmpiezaEnElFuturo)
      .filter((franja) => franja.id !== booking.availabilitySlotId)
      .filter((franja) => franja.providerEmail === booking.providerEmail)
      .filter((franja) => servicioCompatible(franja, booking))
      .filter((franja) => !estaOcupada(franja, booking, bookings))
      .sort((a, b) => (a.dateISO || '').localeCompare(b.dateISO || '') || (a.startTime || '').localeCompare(b.startTime || ''));
  }, [booking, slots, bookings]);

  if (!booking) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nuevaFranja = horariosDisponibles.find((franja) => franja.id === selectedSlotId);
    if (!nuevaFranja) {
      setErrorMessage('Selecciona una franja disponible para reprogramar la cita.');
      return;
    }
    setIsSubmitting(true);
    try {
      const resultado = await onConfirmReschedule(booking.id, nuevaFranja);
      if (resultado) onClose();
      else setErrorMessage('Ese horario acaba de ocuparse. Selecciona otra franja.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo reprogramar la reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-4">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Reprogramar reserva</h3>
            <p className="text-xs text-slate-500">Selecciona otro horario publicado que siga disponible.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">{booking.serviceTitle}</p>
          <p className="text-slate-500">Fecha actual: <span className="font-semibold text-slate-700">{booking.date} — {booking.time}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="reschedule-slot" className="block font-bold text-slate-700 mb-1.5">Nuevo horario disponible</label>
            <select
              id="reschedule-slot"
              required
              value={selectedSlotId}
              onChange={(event) => { setSelectedSlotId(event.target.value); setErrorMessage(''); }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>Selecciona una franja...</option>
              {horariosDisponibles.map((franja) => (
                <option key={franja.id} value={franja.id}>
                  {fechaLegible(franja.dateISO!)} · {franja.startTime ? horaAMPM(franja.startTime) : franja.timeRange}
                </option>
              ))}
            </select>
            {horariosDisponibles.length === 0 && (
              <p className="mt-2 text-slate-500">No hay otros horarios compatibles disponibles publicados por este proveedor.</p>
            )}
          </div>

          {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-700">{errorMessage}</p>}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold">Cancelar</button>
            <button type="submit" disabled={!selectedSlotId || isSubmitting} className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Enviando…' : 'Confirmar nuevo horario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
