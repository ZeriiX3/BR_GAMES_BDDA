module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Offres', {
    id_offre: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    date_offre: DataTypes.DATE,
    prix: DataTypes.DECIMAL(8, 2),
    validation_fin: DataTypes.BOOLEAN,
    id_utilisateur: DataTypes.STRING,
    id_jeu: DataTypes.STRING,
  }, {
    tableName: 'offres',
    timestamps: false,
  });
};
