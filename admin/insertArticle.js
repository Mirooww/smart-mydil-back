//test d'insertion dans la BDD

const sequelize = require("./sequelize");
const Article = require("../models/Article");

(async () => {
   try {
      // vérification que la connexion est établi
      await sequelize.authenticate();
      console.log("Connexion à la base de données réussie.");

      // Se connecter à la base de donnée User
      await Article.sync();

      // Créer un nouvel article et insertion direct
      const newArticle = await Article.create({
         type: "Cable",
         name: "Casble HDMI",
         description: "bla bla bla",
         quantity: 15,
      });

      console.log("Article ajouté:", newArticle.toJSON());
   } catch (error) {
      console.error("Erreur lors de l'insertion de l'article:", error);
   } finally {
      // Fermer la connexion à la base de données
      await sequelize.close();
   }
})();
