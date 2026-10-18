import React from 'react';
import { ParkedTicket } from '../types';
import { X, Play, Trash2, Clock } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface ParkedTicketsModalProps {
  isOpen: boolean;
  parkedTickets: ParkedTicket[];
  onClose: () => void;
  onResumeTicket: (ticket: ParkedTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const ParkedTicketsModal: React.FC<ParkedTicketsModalProps> = ({
  isOpen,
  parkedTickets,
  onClose,
  onResumeTicket,
  onDeleteTicket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Tickets en Espera (Aparcados)
              </h3>
              <p className="text-xs text-slate-400">
                Recupere cualquier venta pausada para continuar el cobro
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

        {/* Content */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {parkedTickets.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No hay tickets en espera en este momento.
            </div>
          ) : (
            parkedTickets.map((ticket, index) => {
              const totalItems = ticket.items.reduce((s, i) => s + i.quantity, 0);
              const totalAmount = ticket.items.reduce((s, i) => {
                const price = ticket.tarifa === 'profesional' ? i.product.precioProConIva : i.product.pvp;
                return s + price * i.quantity;
              }, 0);

              const timeStr = new Date(ticket.timestamp).toLocaleTimeString();

              return (
                <div
                  key={ticket.id}
                  className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white">
                        Ticket en Espera #{index + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ticket.tarifa}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {totalItems} artículos · {timeStr}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[240px] mt-0.5">
                      {ticket.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-lg text-white tabular-nums">
                      {totalAmount.toFixed(2)} €
                    </span>

                    <button
                      onClick={() => {
                        playChimeSound('click');
                        onResumeTicket(ticket);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 touch-active shadow-md shadow-cyan-500/20"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Reanudar</span>
                    </button>

                    <button
                      onClick={() => onDeleteTicket(ticket.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/5 transition-colors"
                      title="Eliminar ticket aparcado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
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
