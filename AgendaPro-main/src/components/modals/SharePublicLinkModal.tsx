import React, { useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface SharePublicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClientView: () => void;
}

export const SharePublicLinkModal: React.FC<SharePublicLinkModalProps> = ({
  isOpen,
  onClose,
  onOpenClientView,
}) => {
  const [copied, setCopied] = useState(false);
  const linkUrl = typeof window !== 'undefined' ? window.location.origin : ''; 

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Consulta los servicios y horarios que publiqué en AgendaPro: ${linkUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-4 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
          <Share2 className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-display">
            Enlace Público de Reserva
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Vista previa local del prototipo. El enlace no publica una agenda externa ni sincroniza datos con un servidor.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-xs text-slate-500">
          El código QR y el enlace público estarán disponibles cuando se integre la publicación de agendas.
        </div>

        {/* URL Input */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <span className="truncate text-slate-700 font-semibold pl-1 select-all">{linkUrl}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Share buttons */}
        <div className="space-y-2 pt-1 text-xs font-bold">
          <button
            onClick={handleWhatsApp}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Compartir por WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenClientView();
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir vista previa del cliente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
