const express = require('express');
const router = express.Router();
const db = require('../models');

// 🔹 Vue 1 : Jeux bien notés (note moyenne > 7.5)
router.get('/bien-notes', async (req, res) => {
  try {
    const [results] = await db.sequelize.query('SELECT * FROM Jeux_bien_notes');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Vue 2 : Jeux récents (après 2018)
router.get('/recents', async (req, res) => {
  try {
    const [results] = await db.sequelize.query('SELECT * FROM Jeux_recents');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Fonction : Jeux par catégorie
router.get('/categorie/:nom', async (req, res) => {
  const nomCat = req.params.nom;
  try {
    const [results] = await db.sequelize.query(
      'SELECT * FROM JeuxParCategorie(:nomCat)', {
        replacements: { nomCat }
      }
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
