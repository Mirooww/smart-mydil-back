const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ReservationController = express.Router();

const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Article = require("../models/Article");

ReservationController.get("/", async (req, res) => {
   try {
      const reservations = await Reservation.findAll({
         attributes: ["id", "reservationDate", "userId", "articleId"],
         include: [
            {
               model: User,
               as: "user",
               attributes: ["username"], // Assuming 'username' is the field name in your User model
            },
            {
               model: Article,
               as: "article",
               attributes: ["name"],
            },
         ],
      });

      const formattedReservations = reservations.map((reservation) => ({
         reservationDate: reservation.reservationDate,
         idUser: reservation.userId,
         username: reservation.user.username,
         idArticle: reservation.articleId,
         article: reservation.article.name,
      }));

      res.status(200).json({ success: true, message: "Voici la liste des réservations.", reservations: formattedReservations });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

ReservationController.get("/:userId", async (req, res) => {
   try {
      const reservations = await Reservation.findAll({
         attributes: ["id", "reservationDate", "userId", "articleId"],
         where: {
            userId: req.params.userId,
         },
         include: [
            {
               model: User,
               as: "user",
               attributes: ["username"], // Assuming 'username' is the field name in your User model
            },
            {
               model: Article,
               as: "article",
               attributes: ["name"],
            },
         ],
      });

      const formattedReservations = reservations.map((reservation) => ({
         reservationDate: reservation.reservationDate,
         idUser: reservation.userId,
         username: reservation.user.username,
         idArticle: reservation.articleId,
         article: reservation.article.name,
      }));

      res.status(200).json({ success: true, message: "Voici la liste des réservations.", reservations: formattedReservations });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});
module.exports = ReservationController;
