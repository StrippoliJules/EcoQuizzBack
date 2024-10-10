// Import des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Définition du port
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB sans les options dépréciées
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connexion à MongoDB réussie !');
    })
    .catch((error) => {
        console.error('Erreur de connexion à MongoDB :', error);
    });

// Définition d'une route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API Node.js avec MongoDB !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
