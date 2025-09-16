const express = require('express');
const router = express.Router();
const { readUsers, writeUsers } = require('../utils/fileStorage');

// GET users
router.get('/', (req, res) => {
  res.json(readUsers());
});

// POST user
router.post('/', (req, res) => {
  const { lastname, firstname } = req.body || {};
  if (!lastname || !firstname) {
    return res.status(400).json({ error: 'Name and firstname are required' });
  }
  const users = readUsers();
  const newUser = { id: Date.now().toString(), lastname, firstname };
  users.push(newUser);
  writeUsers(users);
  res.json({ success: true, user: newUser });
});

// PUT user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { lastname, firstname } = req.body || {};
  if (!lastname || !firstname) {
    return res.status(400).json({ error: 'Name and firstname are required' });
  }
  let users = readUsers();
  users = users.map(user =>
    user.id === id ? { ...user, lastname, firstname } : user
  );
  writeUsers(users);
  res.json({ success: true });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let users = readUsers();
  users = users.filter(user => user.id !== id);
  writeUsers(users);
  res.json({ success: true });
});

module.exports = router;