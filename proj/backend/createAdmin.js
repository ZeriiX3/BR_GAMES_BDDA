// backend/createAdmin.js
const bcrypt = require('bcrypt');
const db = require('./models');

async function createAdmin() {
  const adminId = 'U999'; // ou un UUID généré
  const pseudo = 'seb';
  const email = 'admin@brgames.fr';
  const password = 'admin123'; // à personnaliser
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = 'admin';

  try {
    const existing = await db.utilisateurs.findOne({ where: { email } });
    if (existing) {
      console.log('❌ Admin déjà existant avec cet email.');
      return;
    }

    await db.utilisateurs.create({
      id_utilisateur: adminId,
      pseudo,
      email,
      password: hashedPassword,
      role,
    });

    console.log('✅ Compte administrateur créé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création de l’admin :', error.message);
  } finally {
    await db.sequelize.close();
  }
}

createAdmin();
