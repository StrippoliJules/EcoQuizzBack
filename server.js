// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const clientRoutes = require('./routes/clients');
const invoiceRoutes = require('./routes/invoices');

app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);

// (Optionnel) Activer les logs de Mongoose pour le débogage
// mongoose.set('debug', true);

// Connexion à MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
  });
