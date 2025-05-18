// backend/routes/offres.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

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

// Donner un avis
router.post('/avis', async (req, res) => {
  const { id_avis, contenue_avis, note_jeu, id_jeu, id_utilisateur } = req.body;
  try {
    await db.avis_jeux.create({
      id_avis,
      contenue_avis,
      note_jeu,
      date_avis: new Date(),
      id_jeu,
      id_utilisateur
    });
    res.status(201).json({ message: "Avis enregistré." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une offre
router.delete('/:id_offre', async (req, res) => {
  try {
    const id = req.params.id_offre;
    await db.offres.destroy({ where: { id_offre: id } });
    res.status(200).json({ message: "Offre supprimée." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
