const { DataTypes } = require("sequelize");
const sequelize = require("../admin/sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
   "User",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      role: {
         type: DataTypes.STRING(50),
         allowNull: false,
         defaultValue: "user",
      },
      username: {
         type: DataTypes.STRING(30),
         allowNull: false,
      },
      password: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
   },
   {
      tableName: "User",
      timestamps: true,
      hooks: {
         //permet de saler et hacher le mot de passee
         beforeCreate: async (user) => {
            if (user.password) {
               const salt = await bcrypt.genSalt(10);
               user.password = await bcrypt.hash(user.password, salt);
            }
         },
         //permet de saler et hasher le mot de passe, lors et uniquement lors de la modification du mot de passe
         //empéchant un rehashage et resallage sur le mot de passe, modifiant l'intégrité du mdp
         beforeUpdate: async (user) => {
            if (user.changed("password")) {
               const salt = await bcrypt.genSalt(10);
               user.password = await bcrypt.hash(user.password, salt);
            }
         },
      },
   }
);

module.exports = User;
