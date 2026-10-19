import React from 'react';
import { AvailabilitySlot } from '../../types';
import { Plus, Clock, Trash2, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

interface ProviderAvailabilityProps {
  slots: AvailabilitySlot[];
  onOpenNewSlot: () => void;
  onDeleteSlot: (id: string) => void;
}

export const ProviderAvailability: React.FC<ProviderAvailabilityProps> = ({
  slots,
  onOpenNewSlot,
  onDeleteSlot,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-display">
            Disponibilidad y Franjas Horarias
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publica franjas horarias específicas para que tus clientes puedan reservar de forma automática
          </p>
        </div>

        <button
          onClick={onOpenNewSlot}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar nuevo horario</span>
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h2 className="text-sm font-bold text-slate-800">No has publicado horarios</h2>
          <p className="mt-1 text-xs text-slate-500">Crea una franja individual o activa la repetición semanal para generar varias.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  {slot.dayLabel} • {slot.fullDate}
                </span>
                <button
                  onClick={() => onDeleteSlot(slot.id)}
                  disabled={slot.isBooked}
                  className="text-slate-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed p-1 rounded-lg transition-colors"
                  title={slot.isBooked ? 'No se puede eliminar una franja reservada' : 'Eliminar franja'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 font-display">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{slot.timeRange}</span>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                <p>
                  Capacidad:{' '}
                  <strong className="text-slate-800 font-bold">{slot.capacityText}</strong>
                </p>
                <p className="mt-0.5">
                  Aplica para:{' '}
                  <span className="text-blue-700 font-semibold">{slot.serviceTag}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`${slot.isBooked ? 'text-amber-700' : 'text-emerald-600'} font-bold flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${slot.isBooked ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                {slot.isBooked ? 'Horario reservado' : 'Cupo disponible'}
              </span>
              <span className="text-slate-400 text-[11px]">Visible para clientes</span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
