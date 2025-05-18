const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

// Voir les offres disponibles
router.get('/', async (req, res) => {
  try {
    const [results] = await db.sequelize.query('SELECT * FROM Offres_disponibles');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter une offre
router.post('/ajouter', async (req, res) => {
  const { id_offre, prix, id_utilisateur, id_jeu } = req.body;
  try {
    await db.sequelize.query('SELECT AjouterOffre(:id, :prix, :userId, :jeuId)', {
      replacements: {
        id: id_offre,
        prix,
        userId: id_utilisateur,
        jeuId: id_jeu
      }
    });
    res.status(201).json({ message: "Offre ajoutée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une offre (seulement si c’est l’utilisateur qui l’a créée)
router.delete('/:id_offre', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_utilisateur = decoded.id || decoded.id_utilisateur;
    const id_offre = req.params.id_offre;

    const offre = await db.offres.findOne({ where: { id_offre } });

    if (!offre) {
      return res.status(404).json({ error: "Offre introuvable" });
    }

    if (offre.id_utilisateur !== id_utilisateur) {
      return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer cette offre" });
    }

    await db.offres.destroy({ where: { id_offre } });
    res.status(200).json({ message: "Offre supprimée." });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur ou token invalide" });
  }
});

module.exports = router;
