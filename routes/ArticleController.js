const express = require("express");
const { Reservation, User, Article } = require("../models"); // Import des modèles
const ArticleController = express.Router();
const authenticateToken = require("../config/authenticateToken");
const logMessage = require("../config/logMessage");

//COMMUN
ArticleController.get("/", async (req, res) => {
   try {
      const articles = await Article.findAll({
         attributes: ["id", "type", "name", "description", "quantity", "urlImage"], // Ajout de l'attribut urlImage
      });
      res.status(200).json({ success: true, message: "Voici la liste d'articles.", articles: articles });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

ArticleController.get("/:id", async (req, res) => {
   try {
      const articleSelected = await Article.findOne({ where: { id: req.params["id"] } });

      if (!articleSelected) {
         return res.status(404).json({ success: false, error: "Article non trouvé." });
      }

      res.status(200).json({ success: true, message: "Voici l'article .", articles: articleSelected });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const resizeAndSaveImage = async (req, res, next) => {
   if (!req.file) return next();

   const filename = Date.now() + path.extname(req.file.originalname);
   const filepath = path.join("uploads", filename);

   try {
      await sharp(req.file.buffer)
         .resize({
            width: 180,
            height: 130,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy,
         })
         .toFile(filepath);

      req.file.filename = filename;
      req.file.path = filepath;
   } catch (error) {
      return res.status(500).json({ success: false, error: `Erreur lors du traitement de l'image : ${error.message}` });
   }

   next();
};

// Middleware pour parser les données JSON dans un champ spécifique
const parseData = (req, res, next) => {
   if (req.body.data) {
      try {
         req.body = JSON.parse(req.body.data);
      } catch (error) {
         return res.status(400).json({ success: false, error: "Invalid JSON format in 'data' field" });
      }
   }
   next();
};

// Côté ADMIN
ArticleController.post("/", authenticateToken, upload.single("image"), resizeAndSaveImage, parseData, async (req, res) => {
   const userRole = req.user.role; // Rôle de l'utilisateur connecté
   const username = req.user.username;

   if (userRole !== "admin") {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à créer un article !." });
   }

   try {
      let { type, name, description, quantity } = req.body;
      console.log("Received data:", req.body);
      const urlImage = req.file ? `/uploads/${req.file.filename}` : null;

      const newArticle = await Article.create({ type, name, description, quantity, urlImage });
      logMessage(`${username} a crée un article : ${newArticle.name}`);
      res.json({ success: true, message: "Article ajouté avec succès", newArticle });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

ArticleController.patch("/:id", authenticateToken, async (req, res) => {
   const userRole = req.user.role; // Rôle de l'utilisateur connecté
   const username = req.user.username;

   if (userRole !== "admin") {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à créer un article !." });
   }
   try {
      const articleSelected = await Article.findOne({ where: { id: req.params["id"] } });

      if (!articleSelected) {
         return res.status(404).json({ success: false, error: "Article non trouvé." });
      }
      const { type, name, description, quantity } = req.body;
      articleSelected.type = type || articleSelected.type;
      articleSelected.name = name || articleSelected.name;
      articleSelected.description = description || articleSelected.description;
      articleSelected.quantity = quantity || articleSelected.quantity;

      await articleSelected.save();

      logMessage(`${username} a modifié l'article ${articleSelected.name}`);
      res.status(200).json({ success: true, message: "Article modifié avec succés ! ", article: articleSelected });
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

ArticleController.delete("/:id", authenticateToken, async (req, res) => {
   const username = req.user.username;
   const userRole = req.user.role;

   if (userRole !== "admin") {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à créer un article !." });
   }

   try {
      const articleSelected = await Article.findOne({ where: { id: req.params["id"] } });

      if (!articleSelected) {
         return res.status(404).json({ success: false, error: "Article non trouvé." });
      }

      logMessage(`${username} a supprimé l'article ${articleSelected.name}`);
      res.status(200).json({ success: true, message: "Article supprimé avec succés ! " });

      await articleSelected.destroy();
   } catch (error) {
      res.status(500).json({ success: false, error: `Une erreur est survenue : ${error}` });
   }
});

//Côté USER
//Réserver Article
ArticleController.patch("/:id/reserved/:userId", authenticateToken, async (req, res) => {
   const loggedInUserId = req.user.id; // ID de l'utilisateur connecté
   const userRole = req.user.role; // Rôle de l'utilisateur connecté
   const username = req.user.username;

   const userId = req.params.userId;
   if (userRole !== "admin" && parseInt(userId) !== loggedInUserId) {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à réserver un article depuis un autre compte !" });
   }

   try {
      const articleSelected = await Article.findOne({ where: { id: req.params.id } });

      if (!articleSelected) {
         return res.status(404).json({ success: false, error: "Article non trouvé." });
      }

      if (articleSelected.quantity <= 0) {
         return res.status(400).json({ success: false, error: "Quantité insuffisante pour réserver cet article." });
      }

      // Créer une réservation
      await Reservation.create({
         userId: req.params.userId,
         articleId: articleSelected.id,
         reservationDate: new Date(),
      });

      // Réduire la quantité de l'article
      articleSelected.quantity -= 1;
      await articleSelected.save();

      logMessage(`${username} a reservé l'article : ${articleSelected.name}, quantité restantes : ${articleSelected.quantity}`);

      res.status(200).json({ success: true, message: "Article réservé avec succès !" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Erreur lors de la réservation." });
   }
});

//Rendre Article
ArticleController.patch("/:id/return/:userId", authenticateToken, async (req, res) => {
   const loggedInUserId = req.user.id; // ID de l'utilisateur connecté
   const userRole = req.user.role; // Rôle de l'utilisateur connecté
   const username = req.user.username;
   const userId = req.params.userId;
   if (userRole !== "admin" && parseInt(userId) !== loggedInUserId) {
      return res.status(403).json({ success: false, error: "Accès refusé : Vous n'êtes pas autorisé à rendre un article depuis un autre compte !" });
   }

   try {
      const articleSelected = await Article.findOne({ where: { id: req.params.id } });
      if (!articleSelected) {
         return res.status(404).json({ success: false, error: "Article non trouvé." });
      }

      // Trouver la réservation correspondante
      const reservation = await Reservation.findOne({
         where: {
            userId: req.params.userId,
            articleId: articleSelected.id,
         },
      });

      if (!reservation) {
         return res.status(404).json({ success: false, error: "Aucune réservation trouvée pour cet article." });
      }

      // Supprimer la réservation
      await reservation.destroy();

      // Remettre à jour la quantité de l'article
      articleSelected.quantity += 1;
      await articleSelected.save();

      logMessage(`${username} a rendu l'article : ${articleSelected.name}, quantité : ${articleSelected.quantity}`);

      res.status(200).json({ success: true, message: "Article rendu avec succès !" });
   } catch (error) {
      res.status(500).json({ success: false, error: "Erreur lors du retour de l'article." });
   }
});

module.exports = ArticleController;
