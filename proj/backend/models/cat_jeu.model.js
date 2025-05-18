module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cat_jeu', {
    id_jeu: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    id_categorie: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    tableName: 'cat_jeu',
    timestamps: false,
  });
};
