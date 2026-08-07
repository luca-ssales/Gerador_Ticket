import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (user: Partial<User>) => Promise<void>;
  onUpdateUser: (id: string, user: Partial<User>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('Suporte Nível 1');
  const [department, setDepartment] = useState('Suporte');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    });
  }, [users, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('123456');
    setRole('Suporte Nível 1');
    setDepartment('Suporte');
    setShowModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password || '');
    setRole(user.role || 'Suporte Nível 1');
    setDepartment(user.department || 'Geral');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingUser) {
        await onUpdateUser(editingUser.id, { name, email, password, role, department });
      } else {
        await onAddUser({ name, email, password, role, department });
      }
      setShowModal(false);
    } catch (err) {
      alert('Erro ao salvar usuário em data/users.json');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja remover o usuário "${user.name}"?`)) return;

    setDeletingId(user.id);
    try {
      await onDeleteUser(user.id);
    } catch (err) {
      alert('Erro ao remover usuário.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">Usuários do Sistema</h1>
          <p className="text-xs text-[#434655] mt-1">
            Gerencie membros da equipe de suporte e administradores salvos em <code className="text-[#004ac6]">data/users.json</code>.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Novo Usuário
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#c3c6d7] rounded-xl p-3 flex items-center gap-3 shadow-2xs">
        <span className="material-symbols-outlined text-[#434655] text-[20px]">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por nome, e-mail, função ou departamento..."
          className="w-full bg-transparent border-none outline-none text-xs text-[#0b1c30] placeholder-[#737686]"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-[#737686] hover:text-[#0b1c30] px-2">
            Limpar
          </button>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white border border-[#c3c6d7] rounded-xl p-12 text-center text-[#737686] flex flex-col items-center">
            <span className="material-symbols-outlined text-[42px] text-[#004ac6] mb-2">group_off</span>
            <p className="text-sm font-semibold text-[#0b1c30]">Nenhum usuário encontrado</p>
            <p className="text-xs mt-1">Tente ajustar a busca ou adicione um novo usuário.</p>
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:border-[#004ac6] transition-all group relative"
            >
              <div className="flex items-start gap-4">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#004ac6] font-bold text-sm flex items-center justify-center border border-[#c3c6d7] shrink-0">
                    {u.initials || 'US'}
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="text-sm font-bold text-[#0b1c30] truncate">{u.name}</h3>
                  <p className="text-xs text-[#434655] truncate">{u.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#eff4ff] text-[#004ac6] border border-[#dce9ff]">
                      {u.role}
                    </span>
                    {u.department && (
                      <span className="text-[10px] text-[#737686] font-medium">{u.department}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Action Buttons (Edit & Delete) */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(u)}
                  className="p-1.5 text-[#434655] hover:text-[#004ac6] hover:bg-[#eff4ff] rounded-lg transition-colors"
                  title="Editar Usuário"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>

                <button
                  disabled={deletingId === u.id}
                  onClick={() => handleDelete(u)}
                  className="p-1.5 text-[#434655] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-lg transition-colors disabled:opacity-40"
                  title="Excluir Usuário"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-[#c3c6d7] shadow-xl w-full max-w-md overflow-hidden p-6 flex flex-col gap-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#c3c6d7] pb-3">
              <h2 className="font-bold text-base text-[#0b1c30]">
                {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </h2>
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Senha de Acesso *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha do usuário"
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
                    <option value="Técnico de Hardware">Técnico de Hardware</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Departamento</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: TI / Operações"
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
                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  {isSubmitting
                    ? 'Salvação em andamento...'
                    : editingUser
                    ? 'Salvar Alterações'
                    : 'Adicionar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
