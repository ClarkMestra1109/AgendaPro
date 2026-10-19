import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';
import { X, Clock, Plus, CalendarDays, Repeat2 } from 'lucide-react';

interface NewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlots: (slots: AvailabilitySlot[]) => void;
}

const DIAS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

function fechaLocalISO(fecha = new Date()): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function fechaDesdeISO(valor: string): Date {
  const [anio, mes, dia] = valor.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function minutosDesdeHora(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

function horaDesdeMinutos(minutosTotales: number): string {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

function horaAmPm(hora: string): string {
  const [horas, minutos] = hora.split(':').map(Number);
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  const horas12 = horas % 12 || 12;
  return `${String(horas12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${sufijo}`;
}

function fechaLegible(fecha: Date): string {
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const NewSlotModal: React.FC<NewSlotModalProps> = ({ isOpen, onClose, onAddSlots }) => {
  const hoy = fechaLocalISO();
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [intervalo, setIntervalo] = useState('60');
  const [repetirSemanalmente, setRepetirSemanalmente] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([new Date().getDay()]);
  const [servicioAdmitido, setServicioAdmitido] = useState('Cualquier servicio');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const alternarDia = (dia: number) => {
    setDiasSeleccionados((dias) =>
      dias.includes(dia) ? dias.filter((actual) => actual !== dia) : [...dias, dia],
    );
  };

  const limpiarFormulario = () => {
    setFechaInicio(fechaLocalISO());
    setHoraInicio('');
    setHoraFin('');
    setIntervalo('60');
    setRepetirSemanalmente(false);
    setDiasSeleccionados([new Date().getDay()]);
    setServicioAdmitido('Cualquier servicio');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const hoyActual = fechaLocalISO();
    if (fechaInicio < hoyActual) {
      setError('La fecha inicial no puede estar en el pasado.');
      return;
    }
    if (!horaInicio || !horaFin || minutosDesdeHora(horaInicio) >= minutosDesdeHora(horaFin)) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }
    if (repetirSemanalmente && diasSeleccionados.length === 0) {
      setError('Selecciona al menos un día para repetir el horario.');
      return;
    }

    const duracion = Number(intervalo);
    const inicioMinutos = minutosDesdeHora(horaInicio);
    const finMinutos = minutosDesdeHora(horaFin);
    const ahora = new Date();
    const minutoActual = ahora.getHours() * 60 + ahora.getMinutes();
    if (!repetirSemanalmente && fechaInicio === hoyActual && inicioMinutos <= minutoActual) {
      setError('La hora de inicio no puede estar en el pasado.');
      return;
    }
    const primeraFecha = fechaDesdeISO(fechaInicio);
    const diasDeGeneracion = repetirSemanalmente ? 28 : 1;
    const franjasGeneradas: AvailabilitySlot[] = [];

    for (let desplazamiento = 0; desplazamiento < diasDeGeneracion; desplazamiento += 1) {
      const fecha = new Date(primeraFecha);
      fecha.setDate(primeraFecha.getDate() + desplazamiento);

      if (repetirSemanalmente && !diasSeleccionados.includes(fecha.getDay())) continue;

      const fechaISO = fechaLocalISO(fecha);
      for (let minuto = inicioMinutos; minuto + duracion <= finMinutos; minuto += duracion) {
        // Si la repetición comienza hoy, no publiques franjas cuya hora ya pasó.
        if (fechaISO === hoyActual && minuto <= minutoActual) continue;
        const inicio = horaDesdeMinutos(minuto);
        const fin = horaDesdeMinutos(minuto + duracion);
        const indice = franjasGeneradas.length;

        franjasGeneradas.push({
          id: `slot-${fechaISO}-${inicio.replace(':', '')}-${Date.now()}-${indice}`,
          dayLabel: fecha.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
          fullDate: fechaLegible(fecha),
          dateISO: fechaISO,
          startTime: inicio,
          endTime: fin,
          durationMinutes: duracion,
          timeRange: `${horaAmPm(inicio)} - ${horaAmPm(fin)}`,
          capacityText: '1 cupo libre',
          serviceTag: servicioAdmitido.trim() || 'Cualquier servicio',
          isBooked: false,
        });
      }
    }

    if (franjasGeneradas.length === 0) {
      setError('No se generaron franjas. Revisa el intervalo, las horas y los días seleccionados.');
      return;
    }

    onAddSlots(franjasGeneradas);
    limpiarFormulario();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-5 p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            {repetirSemanalmente ? <Repeat2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Publicar disponibilidad</h3>
            <p className="text-xs text-slate-500">Define una franja o genera horarios automáticamente cada semana.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="slot-start-date" className="block font-bold text-slate-700 mb-1.5">Fecha inicial</label>
            <div className="relative">
              <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input id="slot-start-date" type="date" required min={hoy} value={fechaInicio} onChange={(event) => setFechaInicio(event.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="slot-start-time" className="block font-bold text-slate-700 mb-1.5">Hora de inicio</label>
              <input id="slot-start-time" type="time" required value={horaInicio} onChange={(event) => setHoraInicio(event.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label htmlFor="slot-end-time" className="block font-bold text-slate-700 mb-1.5">Hora de finalización</label>
              <input id="slot-end-time" type="time" required value={horaFin} onChange={(event) => setHoraFin(event.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div>
            <label htmlFor="slot-interval" className="block font-bold text-slate-700 mb-1.5">Duración de cada cita</label>
            <select id="slot-interval" value={intervalo} onChange={(event) => setIntervalo(event.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
              <option value="90">90 minutos</option>
              <option value="120">120 minutos</option>
            </select>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={repetirSemanalmente} onChange={(event) => setRepetirSemanalmente(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
              <span>
                <span className="block font-bold text-slate-900">Repetir semanalmente</span>
                <span className="block text-slate-600 mt-0.5">Genera las franjas seleccionadas durante 4 semanas, contando desde la fecha inicial.</span>
              </span>
            </label>

            {repetirSemanalmente && (
              <div>
                <span className="block font-bold text-slate-700 mb-2">Días en los que se repetirá</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DIAS.map((dia) => (
                    <label key={dia.value} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 cursor-pointer ${diasSeleccionados.includes(dia.value) ? 'border-blue-600 bg-white text-blue-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                      <input type="checkbox" checked={diasSeleccionados.includes(dia.value)} onChange={() => alternarDia(dia.value)} className="h-3.5 w-3.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
                      <span>{dia.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="slot-service" className="block font-bold text-slate-700 mb-1.5">Servicio admitido</label>
            <input id="slot-service" type="text" value={servicioAdmitido} onChange={(event) => setServicioAdmitido(event.target.value)} placeholder="Cualquier servicio o nombre del servicio" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <p className="text-[10px] text-slate-500 mt-1">Usa «Cualquier servicio» para ofrecer la franja a todos tus servicios.</p>
          </div>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{error}</div>}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={() => { limpiarFormulario(); onClose(); }} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>{repetirSemanalmente ? 'Generar horarios' : 'Publicar horario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
