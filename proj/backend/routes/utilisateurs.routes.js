const express = require('express');
const router = express.Router();
const db = require('../models');

// Route : moyenne des notes données par un utilisateur
router.get('/:id/moyenne', async (req, res) => {
  const utilisateurID = req.params.id;
  try {
    const [result] = await db.sequelize.query(
      'SELECT MoyenneNotesUtilisateur(:utilisateurID) AS moyenne', {
        replacements: { utilisateurID }
      }
    );
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
