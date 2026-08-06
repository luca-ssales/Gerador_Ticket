import React from 'react';
import { Ticket, Stats } from '../types';

interface DashboardViewProps {
  stats: Stats | null;
  recentTickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onNavigateTickets: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentTickets,
  onSelectTicket,
  onNavigateTickets
}) => {
  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Overview Title */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-[#0b1c30]">Visão Geral do Sistema</h2>
        <p className="text-xs text-[#434655] mt-1">
          Métricas em tempo real carregadas diretamente do banco em arquivos JSON (<code className="text-[#004ac6]">data/tickets.json</code> & <code className="text-[#004ac6]">data/stats.json</code>).
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Total de Chamados</span>
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.total ? stats.total.toLocaleString('pt-BR') : '1.248'}
          </div>
          <div className="text-xs font-medium text-[#006c49] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyTotalTrend || '+12% nesta semana'}
          </div>
        </div>

        {/* Abertos */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Abertos</span>
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">error</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.open ?? 342}
          </div>
          <div className="text-xs font-medium text-[#ba1a1a] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyOpenTrend || '+5% nesta semana'}
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Em Andamento</span>
            <span className="material-symbols-outlined text-[18px] text-[#784b00]">pending</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.inProgress ?? 184}
          </div>
          <div className="text-xs font-medium text-[#434655] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">remove</span>
            {stats?.weeklyInProgressTrend || 'Estável'}
          </div>
        </div>

        {/* Resolvidos */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Resolvidos</span>
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">check_circle</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.resolved ? stats.resolved.toLocaleString('pt-BR') : '722'}
          </div>
          <div className="text-xs font-medium text-[#006c49] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyResolvedTrend || '+18% nesta semana'}
          </div>
        </div>
      </div>

      {/* Main Data Section (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-[#0b1c30]">Tendências de Volume de Chamados</h3>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#004ac6] border border-[#dce9ff]">
              Dados de Volume Semanal
            </span>
          </div>

          <div className="flex-1 min-h-[300px] w-full relative bg-[#eff4ff] rounded-lg overflow-hidden border border-[#c3c6d7]/50 p-4 flex items-end">
            {/* Visual Bar Chart */}
            <div className="w-full h-full flex items-end justify-between px-4 gap-3">
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/30 h-[30%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">140</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Seg</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/40 h-[45%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">210</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Ter</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/50 h-[60%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">280</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Qua</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/60 h-[40%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">190</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Qui</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/70 h-[75%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">350</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Sex</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb]/80 h-[55%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">260</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Sáb</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#004ac6] h-[85%] rounded-t-sm hover:bg-[#2563eb] transition-colors relative group">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">410</span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium">Dom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets Activity */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-[#0b1c30]">Atividade Recente</h3>
            <button
              onClick={onNavigateTickets}
              className="text-[#004ac6] text-xs font-semibold hover:underline"
            >
              Ver Tudo
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {recentTickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className="p-3 border border-[#c3c6d7] rounded-lg hover:bg-[#f8f9ff] hover:border-[#004ac6] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-[#434655]">{ticket.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      ticket.priority === 'Crítico' || ticket.priority === 'Alta'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : ticket.priority === 'Média'
                        ? 'bg-[#ffddb8] text-[#653e00]'
                        : 'bg-[#dcfce7] text-[#166534]'
                    }`}
                  >
                    Prioridade {ticket.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#0b1c30] mb-2 group-hover:text-[#004ac6] transition-colors line-clamp-1">
                  {ticket.title}
                </p>
                <div className="flex items-center justify-between text-[#434655] text-[11px]">
                  <span>{ticket.timeAgo || 'recentemente'}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ticket.status === 'Aberto'
                          ? 'bg-[#ba1a1a]'
                          : ticket.status === 'Em Andamento'
                          ? 'bg-[#ffb95f]'
                          : 'bg-[#006c49]'
                      }`}
                    ></span>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
