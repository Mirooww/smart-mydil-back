//test d'insertion dans la BDD

const sequelize = require("./sequelize");
const User = require("../models/User");

(async () => {
   try {
      // vérification que la connexion est établi
      await sequelize.authenticate();
      console.log("Connexion à la base de données réussie.");

      // Se connecter à la base de donnée User
      await User.sync();

      // Créer un nouvel utilisateur et insertion direct
      const newUser = await User.create({
         username: "admin",
         password: "nexumnexum",
      });

      console.log("Utilisateur ajouté:", newUser.toJSON());
   } catch (error) {
      console.error("Erreur lors de l'insertion de l'utilisateur:", error);
   } finally {
      // Fermer la connexion à la base de données
      await sequelize.close();
   }
})();
