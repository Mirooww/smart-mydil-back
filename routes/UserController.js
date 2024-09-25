const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authenticateToken = require("../config/authenticateToken");
const logMessage = require("../config/logMessage");

dotenv.config();

const UserController = express.Router();

const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Article = require("../models/Article");

UserController.get("/", async (req, res) => {
   try {
      const users = await User.findAll({
         attributes: ["id", "role", "username", "createdAt"],
      });
      res.status(200).json({ success: true, message: "Voici la liste des utilisateurs.", users: users });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

UserController.get("/:id", authenticateToken, async (req, res) => {
   const loggedInUserId = req.user.id; // ID de l'utilisateur connecté
   const userRole = req.user.role; // Rôle de l'utilisateur connecté

   const userId = req.params.userId;
   if (userRole !== "admin" && parseInt(userId) !== loggedInUserId) {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à réserver un article depuis un autre compte !" });
   }
   try {
      const users = await User.findOne({
         attributes: ["id", "role", "username", "createdAt"],
         where: { id: req.params["id"] },
         include: [
            {
               model: Reservation,
               as: "reservations",
               attributes: ["id", "reservationDate", "articleId"],
               include: [
                  {
                     model: Article,
                     as: "article",
                     attributes: ["name"], // Assuming 'name' is the field name in your Article model
                  },
               ],
            },
         ],
      });

      res.status(200).json({ success: true, message: "Voici l'utilisateurs.", users: users });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

UserController.patch("/:id/admin", authenticateToken, async (req, res) => {
   const userRole = req.user.role; // Rôle de l'utilisateur connecté
   const username = req.user.username;

   if (userRole !== "admin") {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à faore cette action !" });
   }
   try {
      const user = await User.findOne({
         where: { id: req.params["id"] },
      });

      user.role = "admin";
      await user.save();

      logMessage(`${username} a passé ${user.username} en admin`);

      res.status(200).json({ success: true, message: "User passé en admin!", user: user });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

module.exports = UserController;
