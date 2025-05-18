module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Categories', {
    id_categorie: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nom_cat: DataTypes.STRING,
    description_cat: DataTypes.TEXT,
  }, {
    tableName: 'categories',
    timestamps: false,
  });
};
