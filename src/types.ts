export interface Assignee {
  name: string;
  initials: string;
  email: string;
  avatar?: string;
}

export interface Reporter {
  name: string;
  email: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  icon: string;
}

export interface TicketLog {
  text: string;
  user: string;
  time: string;
}

export interface SLA {
  responseTime: string;
  resolutionDeadline: string;
  progressPercent: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  status: 'Aberto' | 'Em Andamento' | 'Pendente' | 'Resolvido';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítico';
  category: string;
  assignee: Assignee;
  reporter: Reporter;
  createdAt: string;
  timeAgo: string;
  attachments?: Attachment[];
  sla?: SLA;
  logs?: TicketLog[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  time: string;
  initials?: string;
  avatar?: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  initials: string;
  avatar?: string;
}

export interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  weeklyTotalTrend: string;
  weeklyOpenTrend: string;
  weeklyInProgressTrend: string;
  weeklyResolvedTrend: string;
  dbSource?: string;
}

export interface Settings {
  systemName: string;
  portalSubtitle: string;
  adminEmail: string;
  notificationsEnabled: boolean;
  autoAssign: boolean;
  defaultPriority: string;
  slaResponseHours: number;
  slaResolutionHours: number;
  dbStorageType: string;
  language: string;
}

export type ViewMode = 'dashboard' | 'tickets' | 'ticket-detail' | 'users' | 'settings' | 'login';
