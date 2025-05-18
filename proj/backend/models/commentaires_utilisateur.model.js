module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Commentaires_utilisateur', {
    id_commentaire: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    contenue_commentaire: DataTypes.TEXT,
    note_utilisateur: DataTypes.SMALLINT,
    date_commentaire: DataTypes.DATE,
    id_utilisateur: DataTypes.STRING,
  }, {
    tableName: 'commentaires_utilisateur',
    timestamps: false,
  });
};
