import React, { useState, useEffect } from 'react';
import { Ticket, Comment, User } from '../types';
import { fetchComments, createComment, updateTicket } from '../api';

interface TicketDetailViewProps {
  ticket: Ticket;
  users: User[];
  onBack: () => void;
  onTicketUpdated: (updatedTicket: Ticket) => void;
  currentUser: User | null;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  users,
  onBack,
  onTicketUpdated,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Editable properties state
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [selectedPriority, setSelectedPriority] = useState(ticket.priority);
  const [selectedAssigneeEmail, setSelectedAssigneeEmail] = useState(ticket.assignee.email);
  const [isUpdatingProps, setIsUpdatingProps] = useState(false);

  // Sync ticket state if prop changes
  useEffect(() => {
    setSelectedStatus(ticket.status);
    setSelectedPriority(ticket.priority);
    setSelectedAssigneeEmail(ticket.assignee.email);

    // Load comments from backend JSON database
    fetchComments(ticket.id)
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [ticket]);

  const handleUpdateProperties = async () => {
    setIsUpdatingProps(true);
    const assignedUser = users.find((u) => u.email === selectedAssigneeEmail) || ticket.assignee;

    try {
      const updated = await updateTicket(ticket.id, {
        status: selectedStatus,
        priority: selectedPriority,
        assignee: {
          name: assignedUser.name,
          initials: assignedUser.initials,
          email: assignedUser.email,
          avatar: assignedUser.avatar
        },
        updatedBy: currentUser?.name || 'Usuário Admin'
      });
      onTicketUpdated(updated);
      alert('Propriedades salvas com sucesso em data/tickets.json!');
    } catch (err) {
      alert('Erro ao atualizar chamado no arquivo JSON');
    } finally {
      setIsUpdatingProps(false);
    }
  };

  const handleQuickToggleStatus = async () => {
    setIsUpdatingProps(true);
    const newStatus = ticket.status === 'Resolvido' ? 'Aberto' : 'Resolvido';
    try {
      const updated = await updateTicket(ticket.id, {
        status: newStatus,
        updatedBy: currentUser?.name || 'Usuário Admin'
      });
      onTicketUpdated(updated);
      setSelectedStatus(newStatus);
    } catch (err) {
      alert('Erro ao atualizar status do chamado no arquivo JSON');
    } finally {
      setIsUpdatingProps(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsPostingComment(true);
    try {
      const created = await createComment(ticket.id, {
        author: currentUser?.name || 'Usuário Admin',
        role: currentUser?.role || 'Administrador',
        initials: currentUser?.initials || 'UA',
        avatar: currentUser?.avatar,
        content: newCommentText.trim()
      });
      setComments((prev) => [...prev, created]);
      setNewCommentText('');
    } catch (err) {
      alert('Erro ao publicar comentário em data/comments.json');
    } finally {
      setIsPostingComment(false);
    }
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#434655]">
        <button
          onClick={onBack}
          className="hover:text-[#004ac6] transition-colors flex items-center gap-1 font-semibold"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Todos os Chamados
        </button>
        <span>/</span>
        <span className="text-[#0b1c30] font-bold">{ticket.id}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN: Ticket Content Canvas */}
        <div className="w-full lg:flex-1 flex flex-col gap-6 min-w-0">
          {/* Primary Details Card */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col gap-6 shadow-2xs">
            {/* Title & Status Pills Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-[#0b1c30] leading-tight mb-2">
                  {ticket.title}
                </h1>
                <p className="text-xs text-[#434655]">
                  Relatado por <span className="font-semibold text-[#0b1c30]">{ticket.reporter.name}</span> • {ticket.timeAgo || 'recentemente'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Priority Pill */}
                <div className="bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#ffdad6]">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  {ticket.priority}
                </div>
                {/* Status Pill */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    ticket.status === 'Resolvido'
                      ? 'bg-[#dcfce7] text-[#166534] border-[#86efac]'
                      : ticket.status === 'Em Andamento'
                      ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                      : 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6]'
                  }`}
                >
                  {ticket.status}
                </div>

                {/* Quick Action Button: Concluir / Reabrir */}
                <button
                  disabled={isUpdatingProps}
                  onClick={handleQuickToggleStatus}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                    ticket.status === 'Resolvido'
                      ? 'bg-white border border-[#c3c6d7] text-[#434655] hover:bg-[#f8f9ff]'
                      : 'bg-[#006c49] hover:bg-[#005237] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {ticket.status === 'Resolvido' ? 'undo' : 'check_circle'}
                  </span>
                  {ticket.status === 'Resolvido' ? 'Reabrir Chamado' : 'Concluir Chamado'}
                </button>
              </div>
            </div>

            <hr className="border-[#c3c6d7]" />

            {/* Description Body */}
            <div className="text-xs text-[#0b1c30] leading-relaxed flex flex-col gap-3 whitespace-pre-line">
              <p>{ticket.description}</p>

              {ticket.codeSnippet && (
                <pre className="bg-[#eff4ff] p-3 rounded-lg text-[11px] font-mono border border-[#c3c6d7] overflow-x-auto text-[#434655] mt-2">
                  {ticket.codeSnippet}
                </pre>
              )}
            </div>

            {/* Attachments Section */}
            <div className="mt-2">
              <h3 className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-3">
                Anexos ({ticket.attachments?.length || 2})
              </h3>
              <div className="flex flex-wrap gap-3">
                {(ticket.attachments && ticket.attachments.length > 0
                  ? ticket.attachments
                  : [
                      { name: 'datadog_metrics_spike.png', size: '1.4 MB', type: 'Image', icon: 'monitoring' },
                      { name: 'app_server_logs.txt', size: '256 KB', type: 'Text', icon: 'description' }
                    ]
                ).map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 border border-[#c3c6d7] rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    <div className="w-10 h-10 bg-[#eff4ff] text-[#004ac6] rounded flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">{att.icon || 'file_present'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0b1c30] truncate">{att.name}</p>
                      <p className="text-[11px] text-[#434655]">
                        {att.size} • {att.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments and History Tabs */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl overflow-hidden flex flex-col shadow-2xs">
            {/* Tab Headers */}
            <div className="flex border-b border-[#c3c6d7] bg-[#f8f9ff]">
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-3 text-xs font-bold transition-colors ${
                  activeTab === 'comments'
                    ? 'text-[#004ac6] border-b-2 border-[#004ac6] bg-white'
                    : 'text-[#434655] hover:text-[#0b1c30]'
                }`}
              >
                Comentários ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 text-xs font-bold transition-colors ${
                  activeTab === 'history'
                    ? 'text-[#004ac6] border-b-2 border-[#004ac6] bg-white'
                    : 'text-[#434655] hover:text-[#0b1c30]'
                }`}
              >
                Logs de Histórico
              </button>
            </div>

            {/* Tab Content: Comments */}
            {activeTab === 'comments' && (
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  {comments.length === 0 ? (
                    <p className="text-xs text-[#737686] italic">
                      Nenhum comentário registrado para este chamado em <code>data/comments.json</code>.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="flex gap-4">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.author}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#c3c6d7]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#dce9ff] text-[#004ac6] font-bold text-xs flex items-center justify-center shrink-0 border border-[#c3c6d7]">
                            {c.initials || 'UA'}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-[#0b1c30]">{c.author}</span>
                            <span className="text-[11px] text-[#434655]">
                              {c.role} • {c.time}
                            </span>
                          </div>
                          <div className="bg-[#f8f9ff] p-3 border border-[#c3c6d7] rounded-lg rounded-tl-none text-xs text-[#0b1c30] leading-relaxed">
                            {c.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <hr className="border-[#c3c6d7]" />

                {/* Reply Box */}
                <form onSubmit={handleAddComment} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#c3c6d7] hidden sm:block">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold">
                        {currentUser?.initials || 'UA'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <textarea
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Adicionar um comentário ou nota interna (salvo em data/comments.json)..."
                      className="w-full bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg p-3 text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:border-[#004ac6] outline-none"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => alert('Anexar arquivo')}
                        className="text-[#434655] hover:text-[#004ac6] transition-colors flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded"
                      >
                        <span className="material-symbols-outlined text-[18px]">attach_file</span> Anexar
                      </button>
                      <button
                        type="submit"
                        disabled={isPostingComment}
                        className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                      >
                        {isPostingComment ? 'Publicando...' : 'Publicar Comentário'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Tab Content: History Logs */}
            {activeTab === 'history' && (
              <div className="p-6 flex flex-col gap-4 relative">
                <div className="absolute left-[31px] top-8 bottom-8 w-px bg-[#c3c6d7]"></div>
                {(ticket.logs && ticket.logs.length > 0
                  ? ticket.logs
                  : [
                      { text: 'Status atualizado para Em Andamento', user: 'Sistema', time: 'há 2 horas' },
                      { text: 'Prioridade elevada para Crítico', user: 'Sarah Jenkins', time: 'há 2.5 horas' },
                      { text: 'Chamado Criado', user: 'Michael Chen', time: 'há 3 horas' }
                    ]
                ).map((log, idx) => (
                  <div key={idx} className="flex gap-4 relative z-10 items-start">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#004ac6]"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#0b1c30]">{log.text}</p>
                      <p className="text-[11px] text-[#434655]">
                        por {log.user} • {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket Properties Sidebar */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
          {/* Properties Card */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex flex-col gap-4 shadow-2xs">
            <h2 className="font-semibold text-base text-[#0b1c30] border-b border-[#c3c6d7] pb-3">
              Propriedades
            </h2>

            {/* Assignee */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Atribuído a</label>
              <select
                value={selectedAssigneeEmail}
                onChange={(e) => setSelectedAssigneeEmail(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg p-2 text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg p-2 text-xs font-semibold text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] outline-none"
              >
                <option value="Aberto">Aberto</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Pendente">Pendente</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Prioridade</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="w-full bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg p-2 text-xs font-semibold text-[#ba1a1a] focus:ring-2 focus:ring-[#004ac6] outline-none"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Categoria</label>
              <div className="p-2 border border-[#c3c6d7] rounded-lg bg-[#f8f9ff] text-xs text-[#0b1c30]">
                {ticket.category}
              </div>
            </div>

            <button
              onClick={handleUpdateProperties}
              disabled={isUpdatingProps}
              className="w-full bg-[#eff4ff] border border-[#c3c6d7] text-[#004ac6] font-bold py-2 rounded-lg text-xs hover:bg-[#dce9ff] transition-colors mt-2"
            >
              {isUpdatingProps ? 'Gravando em JSON...' : 'Atualizar Propriedades'}
            </button>
          </div>

          {/* SLA Card */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex flex-col gap-4 shadow-2xs">
            <h2 className="text-[11px] font-bold text-[#434655] uppercase tracking-wider border-b border-[#c3c6d7] pb-2">
              Acordo de Nível de Serviço (SLA)
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <div className="text-[#434655]">Tempo de Resposta</div>
              <div className="text-right text-[#006c49] font-bold">
                {ticket.sla?.responseTime || 'Cumprido (5m)'}
              </div>
              <div className="text-[#434655]">Prazo de Resolução</div>
              <div className="text-right text-[#ba1a1a] font-bold">
                {ticket.sla?.resolutionDeadline || 'em 1h 30min'}
              </div>
              <div className="col-span-2 mt-2 h-1.5 w-full bg-[#eff4ff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ba1a1a] rounded-full"
                  style={{ width: `${ticket.sla?.progressPercent || 75}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
