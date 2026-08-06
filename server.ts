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
  
  // Calculate real-time counts from tickets.json
  const totalTickets = tickets.length + 1240; // baseline offsetting for demo realism
  const openCount = tickets.filter((t) => t.status === 'Aberto').length + 338;
  const inProgressCount = tickets.filter((t) => t.status === 'Em Andamento').length + 180;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolvido').length + 718;

  res.json({
    ...stats,
    total: totalTickets,
    open: openCount,
    inProgress: inProgressCount,
    resolved: resolvedCount,
    dbSource: 'data/stats.json & data/tickets.json'
  });
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
