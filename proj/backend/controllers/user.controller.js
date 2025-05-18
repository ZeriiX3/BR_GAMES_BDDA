const db = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.utilisateurs.findAll({
      attributes: ['id_utilisateur', 'pseudo', 'email', 'date_inscription'],
    });
    console.log('Utilisateurs récupérés :', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur dans getAllUsers:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.utilisateurs.findByPk(req.params.id, {
      attributes: ['id_utilisateur', 'pseudo', 'email', 'date_inscription'],
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await db.utilisateurs.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Si tu veux ajouter un rôle un jour, remplace ceci par user.role
    // if (user.role === 'admin') {
    //   return res.status(403).json({ message: 'Impossible de supprimer un administrateur' });
    // }

    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
};
