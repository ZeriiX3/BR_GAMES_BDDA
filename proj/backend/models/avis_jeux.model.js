module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Avis_jeux', {
    id_avis: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    contenue_avis: DataTypes.TEXT,
    note_jeu: DataTypes.SMALLINT,
    date_avis: DataTypes.DATE,
    id_jeu: DataTypes.STRING,
    id_utilisateur: DataTypes.STRING,
  }, {
    tableName: 'avis_jeux',
    timestamps: false,
  });
};
