import React from 'react';
import { ViewMode, User } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenNewTicketModal: () => void;
  currentUser: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenNewTicketModal,
  currentUser
}) => {
  return (
    <nav className="w-[240px] h-screen fixed left-0 top-0 border-r border-[#c3c6d7] dark:border-slate-800 bg-white dark:bg-[#0f172a] hidden md:flex flex-col py-6 z-50 transition-colors">
      {/* Brand Header */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#004ac6] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          S
        </div>
        <div>
          <h1 className="font-bold text-lg text-[#004ac6] dark:text-blue-400 leading-tight">SupportDesk</h1>
          <p className="text-xs text-[#434655] dark:text-slate-400">Portal do Administrador</p>
        </div>
      </div>

      {/* JSON File DB Badge */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-slate-800 border border-[#dce9ff] dark:border-slate-700 text-[11px] font-medium text-[#004ac6] dark:text-blue-400">
          <span className="material-symbols-outlined text-[15px]">folder_data</span>
          <span className="truncate">BD: /data/*.json</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 mb-6">
        <button
          onClick={onOpenNewTicketModal}
          className="w-full bg-[#2563eb] hover:bg-[#004ac6] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Chamado
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-1 w-full flex-1">
        <li>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors text-left ${
              currentView === 'dashboard'
                ? 'text-[#004ac6] dark:text-blue-400 border-l-4 border-[#004ac6] dark:border-blue-500 bg-[#eff4ff] dark:bg-slate-800/80'
                : 'text-[#434655] dark:text-slate-300 hover:bg-[#f8f9ff] dark:hover:bg-slate-800/50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentView === 'dashboard' ? 'material-symbols-filled' : ''}`}>
              dashboard
            </span>
            Painel
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('tickets')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors text-left ${
              currentView === 'tickets' || currentView === 'ticket-detail'
                ? 'text-[#004ac6] dark:text-blue-400 border-l-4 border-[#004ac6] dark:border-blue-500 bg-[#eff4ff] dark:bg-slate-800/80'
                : 'text-[#434655] dark:text-slate-300 hover:bg-[#f8f9ff] dark:hover:bg-slate-800/50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentView === 'tickets' || currentView === 'ticket-detail' ? 'material-symbols-filled' : ''}`}>
              confirmation_number
            </span>
            Chamados
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('users')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors text-left ${
              currentView === 'users'
                ? 'text-[#004ac6] dark:text-blue-400 border-l-4 border-[#004ac6] dark:border-blue-500 bg-[#eff4ff] dark:bg-slate-800/80'
                : 'text-[#434655] dark:text-slate-300 hover:bg-[#f8f9ff] dark:hover:bg-slate-800/50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentView === 'users' ? 'material-symbols-filled' : ''}`}>
              group
            </span>
            Usuários
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors text-left ${
              currentView === 'settings'
                ? 'text-[#004ac6] dark:text-blue-400 border-l-4 border-[#004ac6] dark:border-blue-500 bg-[#eff4ff] dark:bg-slate-800/80'
                : 'text-[#434655] dark:text-[#f8f9ff] hover:bg-[#f8f9ff] dark:hover:bg-slate-800/50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentView === 'settings' ? 'material-symbols-filled' : ''}`}>
              settings
            </span>
            Configurações
          </button>
        </li>
      </ul>

      {/* User Profile at Bottom */}
      <div className="mt-auto px-6">
        <div className="flex items-center gap-3 pt-4 border-t border-[#c3c6d7] dark:border-slate-800">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#c3c6d7] dark:border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#dce9ff] dark:bg-blue-900/60 text-[#004ac6] dark:text-blue-300 flex items-center justify-center font-bold text-xs border border-[#c3c6d7] dark:border-slate-700">
              {currentUser?.initials || 'UA'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0b1c30] dark:text-slate-100 truncate">{currentUser?.name || 'Usuário Admin'}</p>
            <p className="text-[11px] text-[#434655] dark:text-slate-400 truncate">{currentUser?.email || 'admin@supportdesk.com'}</p>
          </div>
          <button
            onClick={() => onNavigate('login')}
            title="Sair / Alterar Conta"
            className="text-[#737686] dark:text-slate-400 hover:text-[#ba1a1a] dark:hover:text-rose-400 p-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
