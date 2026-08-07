import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper functions for reading and writing JSON files
async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    // If file doesn't exist, create it with defaultValue
    await writeJsonFile(filename, defaultValue);
    return defaultValue;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// REST API Endpoints using JSON files database

// 1. Health & Database Info
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    database: 'JSON File System (/data/*.json)',
    timestamp: new Date().toISOString()
  });
});

// 2. Auth Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJsonFile<any[]>('users.json', []);
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

  if (user) {
    res.json({ success: true, user, token: 'json-token-' + Date.now() });
  } else {
    // Default admin fallback if custom user not found
    const defaultUser = {
      id: 'usr-admin',
      name: email ? email.split('@')[0] : 'Usuário Admin',
      email: email || 'admin@supportdesk.com',
      role: 'Administrador',
      department: 'TI / Operações',
      initials: 'UA'
    };
    res.json({ success: true, user: defaultUser, token: 'json-token-' + Date.now() });
  }
});

// 3. Stats / Metrics Endpoint
app.get('/api/stats', async (req, res) => {
  const stats = await readJsonFile<any>('stats.json', {});
  const tickets = await readJsonFile<any[]>('tickets.json', []);
  
  const isClean = stats?.isCleanState ?? (tickets.length === 0);
  const totalTickets = isClean ? tickets.length : tickets.length + 1240;
  const openCount = isClean
    ? tickets.filter((t) => t.status === 'Aberto').length
    : tickets.filter((t) => t.status === 'Aberto').length + 338;
  const inProgressCount = isClean
    ? tickets.filter((t) => t.status === 'Em Andamento').length
    : tickets.filter((t) => t.status === 'Em Andamento').length + 180;
  const resolvedCount = isClean
    ? tickets.filter((t) => t.status === 'Resolvido').length
    : tickets.filter((t) => t.status === 'Resolvido').length + 718;

  res.json({
    ...stats,
    total: totalTickets,
    open: openCount,
    inProgress: inProgressCount,
    resolved: resolvedCount,
    isCleanState: isClean,
    dbSource: 'data/stats.json & data/tickets.json'
  });
});

// Reset / Clear Database (Modo Produção / Zerar Chamados)
app.post('/api/tickets/reset', async (req, res) => {
  const { action } = req.body;

  if (action === 'clear') {
    await writeJsonFile('tickets.json', []);
    await writeJsonFile('comments.json', {});
    await writeJsonFile('stats.json', {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      weeklyTotalTrend: '0 nesta semana',
      weeklyOpenTrend: '0 nesta semana',
      weeklyInProgressTrend: 'Sem chamados',
      weeklyResolvedTrend: '0 nesta semana',
      isCleanState: true
    });
    return res.json({
      success: true,
      message: 'Todos os chamados de teste foram zerados. O sistema está limpo para uso real.'
    });
  }

  if (action === 'seed') {
    const sampleTickets = [
      {
        id: 'TCK-0001',
        title: 'Lentidão no carregamento das consultas SQL no dashboard principal',
        description: 'Usuários relatam timeout de 30s ao filtrar relatórios mensais.',
        status: 'Aberto',
        priority: 'Alta',
        category: 'Infraestrutura / Banco de Dados',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Alex Rivera', email: 'alex.rivera@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        timeAgo: 'há 25 min'
      },
      {
        id: 'TCK-0002',
        title: 'Falha de integração OAuth2 ao autenticar usuários com SSO',
        description: 'Erro 401 Unauthorized após redirecionamento do provedor de identidade.',
        status: 'Em Andamento',
        priority: 'Crítico',
        category: 'Software',
        assignee: { name: 'John Smith', initials: 'JS', email: 'john.smith@supportdesk.com' },
        reporter: { name: 'Mariana Costa', email: 'mariana.costa@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        timeAgo: 'há 1 hora'
      },
      {
        id: 'TCK-0003',
        title: 'Solicitação de novo ramal e permissão de VPN para novo colaborador',
        description: 'Configuração padrão de onboarding para equipe comercial.',
        status: 'Resolvido',
        priority: 'Média',
        category: 'Acesso',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Lucas Mendes', email: 'lucas.mendes@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        timeAgo: 'há 3 horas'
      },
      {
        id: 'TCK-0004',
        title: 'Substituição de monitor queimado no setor de Atendimento',
        description: 'Equipamento não liga após pico de energia na região.',
        status: 'Aberto',
        priority: 'Baixa',
        category: 'Hardware',
        assignee: { name: 'David Barnes', initials: 'DB', email: 'david.barnes@supportdesk.com' },
        reporter: { name: 'Carla Dias', email: 'carla.dias@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        timeAgo: 'há 5 horas'
      },
      {
        id: 'TCK-0005',
        title: 'Queda constante de conexão na rede Wi-Fi do 3º andar',
        description: 'Perda de pacotes afetando reuniões virtuais da equipe de Vendas.',
        status: 'Em Andamento',
        priority: 'Alta',
        category: 'Rede',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Roberto Lima', email: 'roberto.lima@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
        timeAgo: 'há 7 horas'
      },
      {
        id: 'TCK-0006',
        title: 'Erro de sincronização de estoque no módulo de vendas',
        description: 'Itens vendidos no PDV não estão atualizando no banco central.',
        status: 'Pendente',
        priority: 'Crítico',
        category: 'Software',
        assignee: { name: 'Mike Wong', initials: 'MW', email: 'mike.wong@supportdesk.com' },
        reporter: { name: 'Fernanda Oliveira', email: 'fernanda.o@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        timeAgo: 'há 10 horas'
      },
      {
        id: 'TCK-0007',
        title: 'Liberação de acesso à pasta compartilhada de Marketing',
        description: 'Necessidade de leitura e escrita para o novo gestor de campanhas.',
        status: 'Resolvido',
        priority: 'Média',
        category: 'Acesso',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Patricia Souza', email: 'patricia.s@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        timeAgo: 'há 1 dia'
      },
      {
        id: 'TCK-0008',
        title: 'Atualização de versão do firewall de borda da matriz',
        description: 'Manutenção programada de segurança da infraestrutura de rede.',
        status: 'Resolvido',
        priority: 'Alta',
        category: 'Infraestrutura / Banco de Dados',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Usuário Admin', email: 'admin@supportdesk.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
        timeAgo: 'há 2 dias'
      },
      {
        id: 'TCK-0009',
        title: 'Teclado com defeito nas teclas de atalho da recepção',
        description: 'Algumas teclas numéricas estão falhando ao digitar cadastros.',
        status: 'Aberto',
        priority: 'Baixa',
        category: 'Hardware',
        assignee: { name: 'David Barnes', initials: 'DB', email: 'david.barnes@supportdesk.com' },
        reporter: { name: 'Juliana Rocha', email: 'juliana.r@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 4320).toISOString(),
        timeAgo: 'há 3 dias'
      },
      {
        id: 'TCK-0010',
        title: 'Exportação de relatório em PDF gerando arquivo corrompido',
        description: 'Relatórios com mais de 500 páginas travam na geração de PDF.',
        status: 'Em Andamento',
        priority: 'Média',
        category: 'Software',
        assignee: { name: 'Mike Wong', initials: 'MW', email: 'mike.wong@supportdesk.com' },
        reporter: { name: 'Thiago Martins', email: 'thiago.m@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 5760).toISOString(),
        timeAgo: 'há 4 dias'
      },
      {
        id: 'TCK-0011',
        title: 'Configuração de certificado SSL no domínio secundário',
        description: 'Renovação do certificado HTTPS prestes a expirar.',
        status: 'Resolvido',
        priority: 'Alta',
        category: 'Infraestrutura / Banco de Dados',
        assignee: { name: 'John Smith', initials: 'JS', email: 'john.smith@supportdesk.com' },
        reporter: { name: 'Usuário Admin', email: 'admin@supportdesk.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 7200).toISOString(),
        timeAgo: 'há 5 dias'
      },
      {
        id: 'TCK-0012',
        title: 'Bloqueio de conta por tentativas de senha incorretas',
        description: 'Usuário esqueceu a senha e precisa de desbloqueio e reset de acesso.',
        status: 'Resolvido',
        priority: 'Média',
        category: 'Acesso',
        assignee: { name: 'Sarah Jenkins', initials: 'SJ', email: 'sarah.jenkins@supportdesk.com' },
        reporter: { name: 'Bruno Castro', email: 'bruno.c@empresa.com' },
        createdAt: new Date(Date.now() - 1000 * 60 * 8640).toISOString(),
        timeAgo: 'há 6 dias'
      }
    ];

    await writeJsonFile('tickets.json', sampleTickets);
    await writeJsonFile('stats.json', {
      total: 1248,
      open: 342,
      inProgress: 184,
      resolved: 722,
      weeklyTotalTrend: '+12% nesta semana',
      weeklyOpenTrend: '+5% nesta semana',
      weeklyInProgressTrend: 'Estável',
      weeklyResolvedTrend: '+18% nesta semana',
      isCleanState: false
    });

    return res.json({
      success: true,
      message: 'Dados de demonstração restaurados com sucesso.'
    });
  }

  res.status(400).json({ error: 'Ação inválida. Use "clear" ou "seed".' });
});

// 4. Tickets CRUD
app.get('/api/tickets', async (req, res) => {
  const tickets = await readJsonFile<any[]>('tickets.json', []);
  res.json(tickets);
});

app.get('/api/tickets/:id', async (req, res) => {
  const tickets = await readJsonFile<any[]>('tickets.json', []);
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Chamado não encontrado' });
  }
  res.json(ticket);
});

app.post('/api/tickets', async (req, res) => {
  const tickets = await readJsonFile<any[]>('tickets.json', []);
  const newId = `TK-${Math.floor(4000 + Math.random() * 1000)}`;
  const newTicket = {
    id: newId,
    title: req.body.title || 'Sem título',
    description: req.body.description || '',
    codeSnippet: req.body.codeSnippet || '',
    status: req.body.status || 'Aberto',
    priority: req.body.priority || 'Média',
    category: req.body.category || 'Software',
    assignee: req.body.assignee || {
      name: 'Sarah Jenkins',
      initials: 'SJ',
      email: 'sarah.jenkins@supportdesk.com'
    },
    reporter: req.body.reporter || {
      name: 'Usuário Admin',
      email: 'admin@supportdesk.com'
    },
    createdAt: new Date().toISOString(),
    timeAgo: 'há poucos segundos',
    attachments: req.body.attachments || [],
    logs: [
      {
        text: 'Chamado Criado',
        user: req.body.reporter?.name || 'Usuário Admin',
        time: 'há poucos segundos'
      }
    ]
  };

  tickets.unshift(newTicket);
  await writeJsonFile('tickets.json', tickets);

  res.status(201).json(newTicket);
});

app.patch('/api/tickets/:id', async (req, res) => {
  const tickets = await readJsonFile<any[]>('tickets.json', []);
  const index = tickets.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Chamado não encontrado' });
  }

  const existing = tickets[index];
  const updatedLogs = [...(existing.logs || [])];

  if (req.body.status && req.body.status !== existing.status) {
    updatedLogs.unshift({
      text: `Status alterado para ${req.body.status}`,
      user: req.body.updatedBy || 'Usuário Admin',
      time: 'há poucos segundos'
    });
  }

  if (req.body.priority && req.body.priority !== existing.priority) {
    updatedLogs.unshift({
      text: `Prioridade alterada para ${req.body.priority}`,
      user: req.body.updatedBy || 'Usuário Admin',
      time: 'há poucos segundos'
    });
  }

  const updatedTicket = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
    logs: updatedLogs
  };

  tickets[index] = updatedTicket;
  await writeJsonFile('tickets.json', tickets);

  res.json(updatedTicket);
});

app.delete('/api/tickets/:id', async (req, res) => {
  let tickets = await readJsonFile<any[]>('tickets.json', []);
  tickets = tickets.filter((t) => t.id !== req.params.id);
  await writeJsonFile('tickets.json', tickets);
  res.json({ success: true, message: 'Chamado removido com sucesso' });
});

// 5. Comments per Ticket
app.get('/api/comments/:ticketId', async (req, res) => {
  const commentsMap = await readJsonFile<Record<string, any[]>>('comments.json', {});
  const ticketComments = commentsMap[req.params.ticketId] || [];
  res.json(ticketComments);
});

app.post('/api/comments/:ticketId', async (req, res) => {
  const commentsMap = await readJsonFile<Record<string, any[]>>('comments.json', {});
  const ticketId = req.params.ticketId;

  if (!commentsMap[ticketId]) {
    commentsMap[ticketId] = [];
  }

  const newComment = {
    id: 'c-' + Date.now(),
    author: req.body.author || 'Usuário Admin',
    role: req.body.role || 'Administrador',
    time: 'há poucos segundos',
    initials: req.body.initials || 'UA',
    avatar: req.body.avatar,
    content: req.body.content || ''
  };

  commentsMap[ticketId].push(newComment);
  await writeJsonFile('comments.json', commentsMap);

  res.status(201).json(newComment);
});

// 6. Users Management
app.get('/api/users', async (req, res) => {
  const users = await readJsonFile<any[]>('users.json', []);
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const users = await readJsonFile<any[]>('users.json', []);
  const newUser = {
    id: 'usr-' + Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password || '123456',
    role: req.body.role || 'Suporte',
    department: req.body.department || 'Geral',
    initials: req.body.name
      ? req.body.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'US'
  };

  users.push(newUser);
  await writeJsonFile('users.json', users);

  res.status(201).json(newUser);
});

app.patch('/api/users/:id', async (req, res) => {
  const users = await readJsonFile<any[]>('users.json', []);
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const existing = users[index];
  const updatedUser = {
    ...existing,
    ...req.body,
    initials: req.body.name
      ? req.body.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : existing.initials
  };

  users[index] = updatedUser;
  await writeJsonFile('users.json', users);

  res.json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
  let users = await readJsonFile<any[]>('users.json', []);
  users = users.filter((u) => u.id !== req.params.id);
  await writeJsonFile('users.json', users);
  res.json({ success: true, message: 'Usuário removido com sucesso' });
});

// 7. Settings Management
app.get('/api/settings', async (req, res) => {
  const settings = await readJsonFile<any>('settings.json', {});
  res.json(settings);
});

app.post('/api/settings', async (req, res) => {
  const settings = await readJsonFile<any>('settings.json', {});
  const updatedSettings = { ...settings, ...req.body };
  await writeJsonFile('settings.json', updatedSettings);
  res.json(updatedSettings);
});

// Setup Vite or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SupportDesk Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[SupportDesk Server] Database storage: /data/*.json files`);
  });
}

startServer();
