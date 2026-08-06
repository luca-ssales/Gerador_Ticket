import React, { useState, useMemo } from 'react';
import { Ticket } from '../types';

interface TicketsListViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onOpenNewTicketModal: () => void;
}

export const TicketsListView: React.FC<TicketsListViewProps> = ({
  tickets,
  onSelectTicket,
  onOpenNewTicketModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'Todos' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'Todas' || t.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'Todas' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">Chamados</h1>
          <p className="text-xs text-[#434655] mt-1">Gerencie e acompanhe as solicitações de suporte salvas em arquivo JSON.</p>
        </div>
        <button
          onClick={onOpenNewTicketModal}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Chamado
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#c3c6d7] rounded-xl p-4 flex flex-wrap gap-4 items-end shadow-2xs">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-[#434655]">Pesquisar</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#434655] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ID ou Título..."
              className="w-full pl-9 pr-3 py-1.5 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 w-36">
          <label className="text-xs font-semibold text-[#434655]">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-1.5 border border-[#c3c6d7] rounded-lg text-xs bg-white focus:outline-none focus:border-[#004ac6]"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Pendente">Pendente</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1 w-40">
          <label className="text-xs font-semibold text-[#434655]">Prioridade</label>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-1.5 border border-[#c3c6d7] rounded-lg text-xs bg-white focus:outline-none focus:border-[#004ac6]"
          >
            <option value="Todas">Todas as Prioridades</option>
            <option value="Crítico">Crítico</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 w-40">
          <label className="text-xs font-semibold text-[#434655]">Categoria</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-1.5 border border-[#c3c6d7] rounded-lg text-xs bg-white focus:outline-none focus:border-[#004ac6]"
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Rede">Rede</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Acesso">Acesso</option>
            <option value="Infraestrutura / Banco de Dados">Infraestrutura</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('Todos');
            setPriorityFilter('Todas');
            setCategoryFilter('Todas');
          }}
          className="px-3.5 py-1.5 bg-[#eff4ff] text-[#004ac6] border border-[#c3c6d7] hover:bg-[#dce9ff] transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
          Limpar Filtros
        </button>
      </div>

      {/* Ticket Table */}
      <div className="bg-white border border-[#c3c6d7] rounded-xl overflow-hidden flex flex-col shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c3c6d7] bg-[#eff4ff]">
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap w-24">ID</th>
                <th className="p-4 text-xs font-semibold text-[#434655] min-w-[260px]">Título</th>
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap">Status</th>
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap">Prioridade</th>
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap">Categoria</th>
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap">Responsável</th>
                <th className="p-4 text-xs font-semibold text-[#434655] whitespace-nowrap">Criado em</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7] text-xs">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#737686]">
                    Nenhum chamado encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t.id)}
                    className="hover:bg-[#f8f9ff] transition-colors group cursor-pointer border-l-2 border-transparent hover:border-[#004ac6]"
                  >
                    <td className="p-4 font-semibold text-[#434655] whitespace-nowrap">#{t.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
                        {t.title}
                      </div>
                      <div className="text-[#434655] text-[11px] mt-0.5 truncate max-w-md">
                        {t.description}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          t.status === 'Aberto'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : t.status === 'Em Andamento'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : 'bg-[#dcfce7] text-[#166534]'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          t.priority === 'Crítico' || t.priority === 'Alta'
                            ? 'text-[#ba1a1a]'
                            : t.priority === 'Média'
                            ? 'text-[#653e00]'
                            : 'text-[#434655]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {t.priority === 'Crítico' || t.priority === 'Alta'
                            ? 'arrow_upward'
                            : t.priority === 'Média'
                            ? 'remove'
                            : 'arrow_downward'}
                        </span>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 text-[#434655] whitespace-nowrap">{t.category}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {t.assignee.avatar ? (
                          <img
                            src={t.assignee.avatar}
                            alt={t.assignee.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#cbdbf5] flex items-center justify-center text-[10px] font-bold text-[#004ac6]">
                            {t.assignee.initials || 'SJ'}
                          </div>
                        )}
                        <span className="text-[#0b1c30]">{t.assignee.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#434655] whitespace-nowrap">{t.timeAgo || 'há pouco'}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#434655] opacity-0 group-hover:opacity-100 hover:text-[#004ac6] transition-all">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-[#c3c6d7] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <span className="text-xs text-[#434655]">
            Exibindo {paginatedTickets.length} de {filteredTickets.length} entradas
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-[#c3c6d7] rounded-lg text-[#434655] hover:bg-[#eff4ff] transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-[#2563eb] text-white'
                    : 'border border-[#c3c6d7] text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-[#c3c6d7] rounded-lg text-[#434655] hover:bg-[#eff4ff] transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
