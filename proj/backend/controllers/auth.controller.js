// backend/controllers/auth.controller.js
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await db.utilisateurs.findOne({ where: { pseudo: username } });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.utilisateurs.create({
      id_utilisateur: `U${Math.floor(Math.random() * 100000)}`,
      pseudo: username,
      password: hashedPassword,
      role: role || 'user', // Ajout du rôle ici
      date_inscription: new Date(),
    });

    res.status(201).json({ message: "Utilisateur enregistré", utilisateur: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.utilisateurs.findOne({ where: { pseudo: username } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id_utilisateur, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Connexion réussie",
      token,
      role: user.role, // ← Renvoi du rôle au frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
