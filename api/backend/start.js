console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

try {
  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const https = require('https');
  const cors = require('cors');

  console.log('Dependencies loaded successfully');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const DATA_DIR = path.join(__dirname, 'data');
  const USERS_FILE = path.join(DATA_DIR, 'users.json');

  if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if(!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

  function readUsers() {
      try {
          const raw = fs.readFileSync(USERS_FILE, 'utf8');
          return JSON.parse(raw || '[]');
      } catch (error) {
          return [];
      }
  }

  function writeUsers(users) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  app.get('/api/users', (req, res) => {
      console.log('GET /api/users called');
      res.json(readUsers());
  });

  app.post('/api/users', (req, res) => {
      const { lastname, firstname } = req.body || {};
      if (!lastname || !firstname) {
          return res.status(400).json({ error: 'Name and firstname are required' });
      }
      const users = readUsers();
      const newUser = {id: Date.now().toString(), lastname, firstname}
      users.push(newUser);
      writeUsers(users)
      res.json({success: true, user: newUser})
  });

  app.put('/api/users/:id', (req, res) => {
      const { id } = req.params;
      const { lastname, firstname } = req.body || {};
      if (!lastname || !firstname) {
          return res.status(400).json({ error: 'Name and firstname are required' });
      }
      let users = readUsers();
      users = users.map(user => (user.id === id ? {...user, lastname, firstname} : user))
      writeUsers(users);
      res.json({success: true})
  })

  app.delete('/api/users/:id', (req, res) => {
      const { id } = req.params;
      let users = readUsers();
      users = users.filter(user => user.id !== id);
      writeUsers(users);
      res.json({success: true})
  })

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
  });

} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
