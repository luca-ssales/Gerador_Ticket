import React, { useState } from 'react';
import { User } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (user: Partial<User>) => Promise<void>;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onAddUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Suporte Nível 1');
  const [department, setDepartment] = useState('Suporte');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddUser({ name, email, role, department });
      setName('');
      setEmail('');
      setShowModal(false);
    } catch (err) {
      alert('Erro ao salvar usuário em data/users.json');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">Usuários do Sistema</h1>
          <p className="text-xs text-[#434655] mt-1">
            Membros da equipe de suporte e administradores salvos em <code className="text-[#004ac6]">data/users.json</code>.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Novo Usuário
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex items-center gap-4 shadow-2xs hover:border-[#004ac6] transition-all"
          >
            {u.avatar ? (
              <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#004ac6] font-bold text-sm flex items-center justify-center border border-[#c3c6d7]">
                {u.initials || 'US'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#0b1c30] truncate">{u.name}</h3>
              <p className="text-xs text-[#434655] truncate">{u.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#eff4ff] text-[#004ac6] border border-[#dce9ff]">
                  {u.role}
                </span>
                <span className="text-[10px] text-[#737686]">{u.department}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-[#c3c6d7] shadow-xl w-full max-w-md overflow-hidden p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#c3c6d7] pb-3">
              <h2 className="font-bold text-base text-[#0b1c30]">Adicionar Novo Usuário</h2>
              <button onClick={() => setShowModal(false)} className="text-[#737686] hover:text-[#0b1c30]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Gabriel Souza"
                  className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0b1c30]">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gabriel@supportdesk.com"
                  className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Função</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs bg-white focus:outline-none focus:border-[#004ac6]"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Ops de Sistema">Ops de Sistema</option>
                    <option value="Líder de Dev">Líder de Dev</option>
                    <option value="Suporte Nível 2">Suporte Nível 2</option>
                    <option value="Suporte Nível 1">Suporte Nível 1</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Departamento</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#c3c6d7] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#c3c6d7] rounded-lg text-xs font-medium text-[#434655]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar no JSON'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
