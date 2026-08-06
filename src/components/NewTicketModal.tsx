import React, { useState } from 'react';
import { Ticket, User } from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: Partial<Ticket>) => Promise<void>;
  users: User[];
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta' | 'Crítico'>('Média');
  const [category, setCategory] = useState('Software');
  const [assigneeEmail, setAssigneeEmail] = useState(users[0]?.email || 'sarah.jenkins@supportdesk.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const selectedUser = users.find((u) => u.email === assigneeEmail) || {
      name: 'Sarah Jenkins',
      initials: 'SJ',
      email: 'sarah.jenkins@supportdesk.com'
    };

    try {
      await onSubmit({
        title,
        description,
        codeSnippet: codeSnippet.trim() || undefined,
        priority,
        category,
        status: 'Aberto',
        assignee: {
          name: selectedUser.name,
          initials: selectedUser.initials,
          email: selectedUser.email
        }
      });
      // reset form
      setTitle('');
      setDescription('');
      setCodeSnippet('');
      setPriority('Média');
      setCategory('Software');
      onClose();
    } catch (err) {
      alert('Erro ao salvar no arquivo JSON');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-[#c3c6d7] shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#c3c6d7] flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6]">confirmation_number</span>
            <h2 className="font-semibold text-lg text-[#0b1c30]">Criar Novo Chamado</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#737686] hover:text-[#0b1c30] p-1 rounded-lg hover:bg-[#e5eeff] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs text-[#004ac6] font-medium">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Este chamado será salvo diretamente no arquivo JSON <code>data/tickets.json</code></span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Título do Chamado *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Falha na conexão com banco de dados em produção"
              className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] bg-white focus:outline-none focus:border-[#004ac6]"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] bg-white focus:outline-none focus:border-[#004ac6]"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Rede">Rede</option>
                <option value="Acesso">Acesso</option>
                <option value="Infraestrutura / Banco de Dados">Infraestrutura / Banco de Dados</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Atribuído a</label>
              <select
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] bg-white focus:outline-none focus:border-[#004ac6]"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Descrição detalhada *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema ocorrido, ambiente, passos para reprodução..."
              className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#434655]">
              Log ou Trecho de Código de Erro (Opcional)
            </label>
            <textarea
              rows={2}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Error: ETIMEDOUT connect 10.0.1.45:5432..."
              className="w-full px-3 py-2 border border-[#c3c6d7] rounded-lg text-[11px] font-mono text-[#0b1c30] bg-[#f8f9ff] focus:outline-none focus:border-[#004ac6]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#c3c6d7] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#c3c6d7] text-xs font-medium text-[#434655] rounded-lg hover:bg-[#eff4ff] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span> Salvando em JSON...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span> Salvar Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
