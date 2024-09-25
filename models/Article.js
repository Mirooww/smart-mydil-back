const { DataTypes } = require("sequelize");
const sequelize = require("../admin/sequelize");

const Article = sequelize.define("Article", {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "autres",
   },
   name: {
      type: DataTypes.STRING(50),
      allowNull: false,
   },
   description: {
      type: DataTypes.STRING(255),
      allowNull: false,
   },
   quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
   },
   urlImage: {
      type: DataTypes.STRING(255),
      allowNull: false,
   },
});

module.exports = Article;
