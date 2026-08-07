import React from 'react';
import { Ticket, Stats } from '../types';
import { TicketHeatmap } from './TicketHeatmap';

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
            {(stats?.total ?? 0).toLocaleString('pt-BR')}
          </div>
          <div className="text-xs font-medium text-[#006c49] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyTotalTrend || '0 nesta semana'}
          </div>
        </div>

        {/* Abertos */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Abertos</span>
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">error</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.open ?? 0}
          </div>
          <div className="text-xs font-medium text-[#ba1a1a] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyOpenTrend || '0 nesta semana'}
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Em Andamento</span>
            <span className="material-symbols-outlined text-[18px] text-[#784b00]">pending</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {stats?.inProgress ?? 0}
          </div>
          <div className="text-xs font-medium text-[#434655] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">remove</span>
            {stats?.weeklyInProgressTrend || 'Sem chamados'}
          </div>
        </div>

        {/* Resolvidos */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-col gap-2 shadow-2xs hover:border-[#004ac6] transition-colors">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-xs font-semibold">Resolvidos</span>
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">check_circle</span>
          </div>
          <div className="text-3xl font-bold text-[#0b1c30]">
            {(stats?.resolved ?? 0).toLocaleString('pt-BR')}
          </div>
          <div className="text-xs font-medium text-[#006c49] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {stats?.weeklyResolvedTrend || '0 nesta semana'}
          </div>
        </div>
      </div>

      {/* Main Data Section (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GitHub-style Ticket Volume Heatmap */}
        <TicketHeatmap tickets={recentTickets} isCleanState={stats?.isCleanState} />

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
            {recentTickets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#f8f9ff] rounded-lg border border-dashed border-[#c3c6d7]">
                <span className="material-symbols-outlined text-[36px] text-[#004ac6] mb-2">inbox</span>
                <p className="text-xs font-semibold text-[#0b1c30]">Nenhum chamado registrado</p>
                <p className="text-[11px] text-[#737686] mt-1 max-w-[200px]">
                  O sistema está zerado e pronto para o seu uso em produção.
                </p>
              </div>
            ) : (
              recentTickets.slice(0, 4).map((ticket) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
