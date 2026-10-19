import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Video,
  FileText
} from 'lucide-react';
import { Booking } from '../../types';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirm?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onConfirm,
  onCancel
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              CÓDIGO: {booking.code}
            </span>
            <h3 className="text-lg font-extrabold text-[#0B1C30]">
              Detalle de Reserva
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge & Service */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">{booking.serviceTitle}</h4>
            <div className="text-xs text-slate-500">{booking.providerName}</div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
            booking.status === 'confirmed'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : booking.status === 'pending'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : booking.status === 'completed'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            ● {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending' ? 'Pendiente' : booking.status === 'completed' ? 'Completada' : 'Cancelada'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              <span>Fecha y Turno</span>
            </div>
            <div className="font-bold text-slate-800 mt-1">{booking.dateDisplay}</div>
            <div className="text-slate-500 text-[11px]">{booking.timeDisplay} ({booking.durationMinutes} min)</div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Precio y Pago</span>
            </div>
            <div className="font-extrabold text-blue-700 text-sm mt-1 tabular-nums">
              ${booking.priceCOP.toLocaleString('es-CO')} COP
            </div>
            <div className="text-slate-500 text-[11px]">Pago al finalizar / En sede</div>
          </div>
        </div>

        {/* Client & Contact Info */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
          <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
            Información del Cliente
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{booking.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{booking.clientPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{booking.clientEmail}</span>
            </div>
          </div>
        </div>

        {/* Location or Virtual Link */}
        {booking.address && (
          <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Dirección física:</strong> {booking.address}
            </div>
          </div>
        )}

        {booking.virtualMeetingUrl && (
          <div className="flex items-start gap-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-xl border border-blue-200">
            <Video className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-900">Sala Virtual:</strong>{' '}
              <a href={booking.virtualMeetingUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">
                {booking.virtualMeetingUrl}
              </a>
              <div className="text-[11px] text-slate-500">ID de Reunión: {booking.virtualMeetingId || '849-204-118'}</div>
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Instrucciones o requerimientos especiales:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{booking.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {booking.status === 'pending' && onConfirm && (
            <button
              onClick={() => {
                onConfirm(booking.id);
                onClose();
              }}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Confirmar Reserva
            </button>
          )}

          {booking.status !== 'cancelled' && onCancel && (
            <button
              onClick={() => {
                onCancel(booking.id);
                onClose();
              }}
              className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancelar Cita
            </button>
          )}

          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
