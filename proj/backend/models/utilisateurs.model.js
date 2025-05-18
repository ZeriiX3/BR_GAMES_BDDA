module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Utilisateurs', {
    id_utilisateur: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pseudo: DataTypes.STRING,
    email: DataTypes.STRING,
    date_inscription: DataTypes.DATE,
    password: DataTypes.STRING,
  }, {
    tableName: 'utilisateurs',
    timestamps: false,
  });
};
