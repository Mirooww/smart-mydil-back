const express = require("express");
const { Reservation, User, Article } = require("../models"); // Import des modèles
const LogController = express.Router();
const authenticateToken = require("../config/authenticateToken");
const logMessage = require("../config/logMessage");
const path = require("path");
const fs = require("fs");
//COMMUN
LogController.get("/", (req, res) => {
   const filePath = path.join(__dirname, "../config/log.txt");

   fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
         return res.status(500).json({ success: false, error: "Erreur lors de la lecture du fichier" });
      }

      // Renvoyer le contenu du fichier en JSON
      res.status(200).json({ success: true, logContent: data });
   });
});

module.exports = LogController;
