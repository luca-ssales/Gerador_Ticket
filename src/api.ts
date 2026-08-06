import { Ticket, Comment, User, Stats, Settings } from './types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Falha ao carregar estatísticas');
  return res.json();
}

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE}/tickets`);
  if (!res.ok) throw new Error('Falha ao carregar chamados');
  return res.json();
}

export async function fetchTicketById(id: string): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`);
  if (!res.ok) throw new Error('Chamado não encontrado');
  return res.json();
}

export async function createTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  if (!res.ok) throw new Error('Erro ao criar chamado');
  return res.json();
}

export async function updateTicket(id: string, updateData: Partial<Ticket> & { updatedBy?: string }): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Erro ao atualizar chamado');
  return res.json();
}

export async function deleteTicket(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao remover chamado');
  return res.json();
}

export async function fetchComments(ticketId: string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/comments/${ticketId}`);
  if (!res.ok) throw new Error('Erro ao carregar comentários');
  return res.json();
}

export async function createComment(ticketId: string, commentData: Partial<Comment>): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/${ticketId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  if (!res.ok) throw new Error('Erro ao publicar comentário');
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Erro ao carregar usuários');
  return res.json();
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw new Error('Erro ao criar usuário');
  return res.json();
}

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Erro ao carregar configurações');
  return res.json();
}

export async function updateSettings(settingsData: Partial<Settings>): Promise<Settings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData)
  });
  if (!res.ok) throw new Error('Erro ao atualizar configurações');
  return res.json();
}

export async function loginUser(email: string, password?: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Erro na autenticação');
  return res.json();
}
