const db = require('../models');

exports.getAllJeux = async (req, res) => {
  try {
    const jeux = await db.jeux.findAll(); 
    res.status(200).json(jeux);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error: error.message });
  }
};
