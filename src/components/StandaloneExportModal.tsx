import React, { useState } from 'react';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';
import { X, Download, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    playChimeSound('success');
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      const htmlContent = generateStandaloneHtml();
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      playChimeSound('click');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Exportar Código en 1 Solo Archivo HTML
              </h3>
              <p className="text-xs text-slate-400">
                100% autónomo, listo para guardar como 'index.html' y abrir en local
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center touch-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Totalmente Autónomo:</strong> Incluye HTML, CSS moderno con Tailwind CDN, y JavaScript funcional sin dependencias de Node.js o servidores.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Persistencia en LocalStorage:</strong> Guarda todas las ventas, productos y turnos en el navegador del equipo de la tienda.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Desglose Lumier Táctil:</strong> Conteo de billetes y monedas en tiempo real y cálculo exacto de cambio.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          <button
            onClick={handleDownload}
            className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 touch-active transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descargar 'index.html'</span>
          </button>

          <button
            onClick={handleCopy}
            className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 border border-white/10 touch-active transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copiar Todo el Código</span>
              </>
            )}
          </button>

        </div>

        {/* Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
