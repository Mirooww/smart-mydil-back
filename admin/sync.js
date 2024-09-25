//met à jour la base de donnée de façon brutal, en supprimant le contenu

//table a inséré
const { Article } = require("../models/Article");
const { User } = require("../models/User");
const { Reservation } = require("../models/Reservation");
const { index } = require("../models/index");

const sequelize = require("./sequelize");

sequelize
   .sync({ force: true })
   .then(() => {
      console.log("Table inséré dans la bdd ! ");
   })
   .catch((err) => {
      console.log("Une erreur : ", err);
   });
