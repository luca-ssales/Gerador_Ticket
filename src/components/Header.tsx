import React from 'react';
import { User, ViewMode } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User | null;
  onNavigate: (view: ViewMode) => void;
  onToggleMobileSidebar?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onNavigate,
  onToggleMobileSidebar,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-[#f8f9ff] dark:bg-[#0f172a] sticky top-0 z-40 border-b border-[#c3c6d7] dark:border-slate-800 shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-[#434655] dark:text-slate-300 hover:text-[#004ac6] dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-[#e5eeff] dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Global Search Bar */}
        <div className="flex items-center bg-[#eff4ff] dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#004ac6] dark:focus-within:ring-blue-500 w-64 md:w-80 transition-all">
          <span className="material-symbols-outlined text-[#434655] dark:text-slate-400 mr-2 text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar chamados..."
            className="bg-transparent border-none outline-none text-xs w-full text-[#0b1c30] dark:text-slate-100 placeholder-[#737686] dark:placeholder-slate-400 focus:ring-0 p-0"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#737686] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-slate-100 text-xs ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* DB Indicator Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-xs font-medium text-[#434655] dark:text-slate-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span>Banco JSON: Ativo</span>
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="text-[#434655] dark:text-slate-300 hover:text-[#004ac6] dark:hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-[#e5eeff] dark:hover:bg-slate-800 flex items-center justify-center"
          title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notification Button */}
        <button
          onClick={() => alert('Notificações do Sistema SupportDesk (Dados salvos em JSON)')}
          className="text-[#434655] dark:text-slate-300 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-[#e5eeff] dark:hover:bg-slate-800 relative"
          title="Notificações"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        {/* Help Button */}
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#434655] dark:text-slate-300 hover:text-[#004ac6] dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-[#e5eeff] dark:hover:bg-slate-800"
          title="Ajuda e Configurações"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        {/* User Avatar */}
        <button
          onClick={() => onNavigate('users')}
          className="w-8 h-8 rounded-full overflow-hidden border border-[#c3c6d7] dark:border-slate-700 hover:ring-2 hover:ring-[#004ac6] dark:hover:ring-blue-500 transition-all"
          title={currentUser?.name || 'Perfil'}
        >
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#004ac6] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.initials || 'UA'}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
