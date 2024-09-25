//permet de se connecter à la base de donnée

const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
   host: process.env.DB_HOST,
   dialect: "postgres",
});

module.exports = sequelize;
