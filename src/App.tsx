import React, { useState, useEffect } from 'react';
import { ViewMode, Ticket, User, Stats } from './types';
import { fetchTickets, fetchUsers, fetchStats, createTicket, fetchTicketById } from './api';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TicketsListView } from './components/TicketsListView';
import { TicketDetailView } from './components/TicketDetailView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';
import { NewTicketModal } from './components/NewTicketModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('TCK-0001');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr-1',
    name: 'Usuário Admin',
    email: 'admin@supportdesk.com',
    role: 'Administrador',
    department: 'TI / Operações',
    initials: 'UA',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADqUgTw7MD9m8PWAOgcSrGJYgBUBqzv4XvJ2YRYJ3PPcJWVw5AzQyc51SnrK84utlrpOyJYYqXrkvlUCcqBmIVBhzOetLlfwHd6upCznu-STlAiBnUFOJdsi3fw0oN2zu_JPEzmwqvMdH2BodBzm6aVEQ1ReBUr6ed-MnVDQdkizRs7aYBCbD2k4lxoIJqcIu1uP4Ft0-BxR_WXhgtzVNnQl_mtIsSj9FIOoz3WhzEkluwtm_gh3o'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load Initial Data from Node.js Express REST API backed by JSON files
  const reloadData = async () => {
    try {
      const [tList, uList, sData] = await Promise.all([
        fetchTickets(),
        fetchUsers(),
        fetchStats()
      ]);
      setTickets(tList);
      setUsers(uList);
      setStats(sData);
    } catch (err) {
      console.error('Erro ao conectar com API de arquivos JSON:', err);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Sync selected ticket details when selectedTicketId changes or view changes to detail
  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketById(selectedTicketId)
        .then((data) => setSelectedTicket(data))
        .catch(() => setSelectedTicket(null));
    }
  }, [selectedTicketId]);

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCurrentView('ticket-detail');
    setIsMobileSidebarOpen(false);
  };

  const handleCreateTicket = async (ticketData: Partial<Ticket>) => {
    const created = await createTicket(ticketData);
    await reloadData();
    setSelectedTicketId(created.id);
    setSelectedTicket(created);
    setCurrentView('ticket-detail');
  };

  const handleTicketUpdatedInDetail = (updated: Ticket) => {
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    fetchStats().then((s) => setStats(s));
  };

  const handleAddUser = async (userData: Partial<User>) => {
    const { createUser } = await import('./api');
    await createUser(userData);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    const { updateUser } = await import('./api');
    await updateUser(id, userData);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
  };

  const handleDeleteUser = async (id: string) => {
    const { deleteUser } = await import('./api');
    await deleteUser(id);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
  };

  // If user is on Login View
  if (currentView === 'login') {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex font-sans antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-[260px] bg-white h-full z-10 flex flex-col">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                setIsMobileSidebarOpen(false);
              }}
              onOpenNewTicketModal={() => {
                setIsNewTicketModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && currentView !== 'tickets') {
              setCurrentView('tickets');
            }
          }}
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentTickets={tickets}
              onSelectTicket={handleSelectTicket}
              onNavigateTickets={() => setCurrentView('tickets')}
            />
          )}

          {currentView === 'tickets' && (
            <TicketsListView
              tickets={tickets}
              onSelectTicket={handleSelectTicket}
              onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
            />
          )}

          {currentView === 'ticket-detail' && (
            selectedTicket ? (
              <TicketDetailView
                ticket={selectedTicket}
                users={users}
                onBack={() => setCurrentView('tickets')}
                onTicketUpdated={handleTicketUpdatedInDetail}
                currentUser={currentUser}
              />
            ) : (
              <div className="p-8 text-center text-[#434655]">
                Carregando detalhes do chamado...
              </div>
            )
          )}

          {currentView === 'users' && (
            <UsersView
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {currentView === 'settings' && <SettingsView onResetData={reloadData} />}
        </main>
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
        users={users}
      />
    </div>
  );
}
