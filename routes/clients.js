// routes/clients.js
const express = require('express');
const router = express.Router();
const Client = require('../models/client');

router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getClient, (req, res) => {
  res.json(res.client);
});

router.put('/:id', getClient, async (req, res) => {
  Object.assign(res.client, req.body);
  try {
    const updatedClient = await res.client.save();
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getClient, async (req, res) => {
  try {
    await res.client.remove();
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.client = client;
  next();
}

module.exports = router;
