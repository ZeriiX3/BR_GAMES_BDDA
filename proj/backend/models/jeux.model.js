module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Jeux', {
    id_jeu: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nom_jeu: DataTypes.STRING,
    description_jeu: DataTypes.TEXT,
    editeur: DataTypes.STRING,
    minage: DataTypes.SMALLINT,
    yearpublished: DataTypes.SMALLINT,
  }, {
    tableName: 'jeux',
    timestamps: false,
  });
};
