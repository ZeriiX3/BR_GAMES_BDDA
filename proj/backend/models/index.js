const Sequelize = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./user.model')(sequelize, Sequelize);
db.products = require('./product.model')(sequelize, Sequelize);
db.cartItems = require('./cart.model')(sequelize, Sequelize);


db.cartItems.belongsTo(db.products, { foreignKey: 'productId', as: 'product' });


db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  });

module.exports = db;