import React, { useEffect, useState } from 'react';
import { ServiceItem } from '../../types';
import { X, Clock, Plus, CalendarDays, Repeat2 } from 'lucide-react';

export interface NuevaFranjaPayload {
  servicioId: string;
  fechaInicio: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  cupoTotal: number;
  repetirSemanalmente: boolean;
  diasSemana: number[]; // 0 (domingo) .. 6 (sábado)
  repetirHasta: string; // YYYY-MM-DD, solo si repetirSemanalmente
}

interface NewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  onCreate: (payload: NuevaFranjaPayload) => Promise<void>;
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

function minutosDesdeHora(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

function sumarDias(fechaISO: string, dias: number): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia + dias);
  return fechaLocalISO(fecha);
}

export const NewSlotModal: React.FC<NewSlotModalProps> = ({ isOpen, onClose, services, onCreate }) => {
  const hoy = fechaLocalISO();
  const [servicioId, setServicioId] = useState('');
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cupoTotal, setCupoTotal] = useState('1');
  const [repetirSemanalmente, setRepetirSemanalmente] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([new Date().getDay()]);
  const [repetirHasta, setRepetirHasta] = useState(sumarDias(hoy, 28));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !servicioId && services.length > 0) {
      setServicioId(services[0].id);
    }
  }, [isOpen, services, servicioId]);

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
    setCupoTotal('1');
    setRepetirSemanalmente(false);
    setDiasSeleccionados([new Date().getDay()]);
    setRepetirHasta(sumarDias(fechaLocalISO(), 28));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!servicioId) {
      setError('Selecciona el servicio al que aplicará este horario.');
      return;
    }
    const hoyActual = fechaLocalISO();
    if (fechaInicio < hoyActual) {
      setError('La fecha inicial no puede estar en el pasado.');
      return;
    }
    if (!horaInicio || !horaFin || minutosDesdeHora(horaInicio) >= minutosDesdeHora(horaFin)) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }
    if (repetirSemanalmente) {
      if (diasSeleccionados.length === 0) {
        setError('Selecciona al menos un día para repetir el horario.');
        return;
      }
      if (!repetirHasta || repetirHasta <= hoyActual) {
        setError('La fecha límite de repetición debe ser posterior a hoy.');
        return;
      }
    }
    const cupo = Number(cupoTotal);
    if (!(cupo >= 1 && cupo <= 100)) {
      setError('El cupo debe ser un número entre 1 y 100.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        servicioId,
        fechaInicio,
        horaInicio,
        horaFin,
        cupoTotal: cupo,
        repetirSemanalmente,
        diasSemana: diasSeleccionados,
        repetirHasta,
      });
      limpiarFormulario();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar el horario.');
    } finally {
      setIsSubmitting(false);
    }
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

        {services.length === 0 ? (
          <p className="text-xs text-slate-500">Primero debes publicar al menos un servicio para poder abrir horarios.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="slot-service" className="block font-bold text-slate-700 mb-1.5">Servicio</label>
              <select id="slot-service" required value={servicioId} onChange={(event) => setServicioId(event.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>{srv.title}</option>
                ))}
              </select>
            </div>

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
              <label htmlFor="slot-cupo" className="block font-bold text-slate-700 mb-1.5">Cupo (personas que pueden reservar esta franja)</label>
              <input id="slot-cupo" type="number" min={1} max={100} required value={cupoTotal} onChange={(event) => setCupoTotal(event.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={repetirSemanalmente} onChange={(event) => setRepetirSemanalmente(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
                <span>
                  <span className="block font-bold text-slate-900">Repetir semanalmente</span>
                  <span className="block text-slate-600 mt-0.5">Genera esta franja en los días que elijas, cada semana, hasta la fecha límite.</span>
                </span>
              </label>

              {repetirSemanalmente && (
                <>
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
                  <div>
                    <label htmlFor="slot-repeat-until" className="block font-bold text-slate-700 mb-1.5">Repetir hasta</label>
                    <input id="slot-repeat-until" type="date" required min={sumarDias(hoy, 1)} value={repetirHasta} onChange={(event) => setRepetirHasta(event.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </>
              )}
            </div>

            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{error}</div>}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => { limpiarFormulario(); onClose(); }} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Publicando…' : repetirSemanalmente ? 'Generar horarios' : 'Publicar horario'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
