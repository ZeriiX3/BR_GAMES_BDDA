const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importation des vrais modèles Supabase
db.jeux = require('./jeux.model')(sequelize, Sequelize);
db.utilisateurs = require('./utilisateurs.model')(sequelize, Sequelize);
db.offres = require('./offres.model')(sequelize, Sequelize);
db.avis_jeux = require('./avis_jeux.model')(sequelize, Sequelize);
db.commentaires_utilisateur = require('./commentaires_utilisateur.model')(sequelize, Sequelize);
db.categories = require('./categories.model')(sequelize, Sequelize);
db.cat_jeu = require('./cat_jeu.model')(sequelize, Sequelize);

module.exports = db;
