import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';
import { X, Clock, Plus } from 'lucide-react';

interface NewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlot: (slot: AvailabilitySlot) => void;
}

export const NewSlotModal: React.FC<NewSlotModalProps> = ({
  isOpen,
  onClose,
  onAddSlot,
}) => {
  const [dayLabel, setDayLabel] = useState<'HOY' | 'MAÑ' | 'VIE' | 'SÁB' | 'DOM'>('HOY');
  const [fullDate, setFullDate] = useState('Jueves 27 Octubre');
  const [timeRange, setTimeRange] = useState('06:00 PM - 07:00 PM');
  const [capacityText, setCapacityText] = useState('1 cupo libre');
  const [serviceTag, setServiceTag] = useState('Cualquier servicio');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayLabel,
      fullDate,
      timeRange,
      capacityText,
      serviceTag,
      isBooked: false,
    };
    onAddSlot(newSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Publicar Horario Libre
            </h3>
            <p className="text-xs text-slate-500">
              Abre una nueva franja en tu agenda disponible para reservas inmediatas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Día</label>
            <div className="grid grid-cols-4 gap-2">
              {(['HOY', 'MAÑ', 'VIE', 'SÁB'] as const).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDayLabel(d)}
                  className={`py-2 rounded-xl border text-center font-bold transition-all ${
                    dayLabel === d
                      ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha completa</label>
            <input
              type="text"
              required
              value={fullDate}
              onChange={(e) => setFullDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Intervalo de horas</label>
            <input
              type="text"
              required
              placeholder="Ej: 06:00 PM - 07:00 PM"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Servicio admitido</label>
            <input
              type="text"
              required
              value={serviceTag}
              onChange={(e) => setServiceTag(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

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
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar horario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
