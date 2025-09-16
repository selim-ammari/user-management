import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import cors from 'cors';

type User = {
  id: string;
  lastname: string;
  firstname: string;
  role: 'user' | 'admin';
};

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]') as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Ensure superadmin exists
const SUPERADMIN_ID = 'superadmin';
const SUPERADMIN: User = {
  id: SUPERADMIN_ID,
  lastname: 'Admin',
  firstname: 'Super',
  role: 'admin',
};
const existing = readUsers();
if (!existing.some((u) => u.id === SUPERADMIN_ID)) {
  existing.push(SUPERADMIN);
  writeUsers(existing);
}

app.get('/api/users', (_req: Request, res: Response<User[]>) => {
  res.json(readUsers());
});

app.post('/api/users', (req: Request, res: Response) => {
  const { lastname, firstname } = req.body ?? {};
  if (!lastname || !firstname) {
    return res.status(400).json({ error: 'Name and firstname are required' });
  }
  const users = readUsers();
  const newUser: User = { id: Date.now().toString(), lastname, firstname, role: 'user' };
  users.push(newUser);
  writeUsers(users);
  return res.json({ success: true, user: newUser });
});

app.put('/api/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { lastname, firstname } = req.body ?? {};
  if (!lastname || !firstname) {
    return res.status(400).json({ error: 'Name and firstname are required' });
  }
  const users = readUsers().map((user) =>
    user.id === id ? { ...user, lastname, firstname } : user
  );
  writeUsers(users);
  return res.json({ success: true });
});

app.delete('/api/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (id === SUPERADMIN_ID) {
    return res.status(403).json({ error: 'Cannot delete superadmin' });
  }
  const users = readUsers().filter((user) => user.id !== id);
  writeUsers(users);
  return res.json({ success: true });
});

// Update role endpoint (admin only – basic guard via query/header could be added later)
app.put('/api/users/:id/role', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { role } = req.body as { role?: 'user' | 'admin' };
  if (id === SUPERADMIN_ID && role !== 'admin') {
    return res.status(403).json({ error: 'Cannot change superadmin role' });
  }
  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const users = readUsers().map((user) => (user.id === id ? { ...user, role } : user));
  writeUsers(users);
  return res.json({ success: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Serve frontend build if present
const FRONT_BUILD = path.join(process.cwd(), '..', 'frontend', 'build');
if (fs.existsSync(FRONT_BUILD)) {
  app.use(express.static(FRONT_BUILD));
  app.get(/.*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(FRONT_BUILD, 'index.html'));
  });
}

// Prefer HTTPS if certs are present, fallback to HTTP
const keyPath = path.join(process.cwd(), 'certs', 'key.pem');
const certPath = path.join(process.cwd(), 'certs', 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Backend (HTTPS) démarré sur https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`✅ Backend (HTTP) démarré sur http://localhost:${PORT}`);
  });
}


