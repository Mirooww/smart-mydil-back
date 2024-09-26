const sequelize = require("./sequelize");
const Article = require("../models/Article");

const articles = [
   {
      type: "ordinateur",
      name: "Ordinateur double écran",
      description: "Ordinateur avec deux écrans pour une meilleure productivité.",
      quantity: 1,
      urlImage: "/uploads/ordinateur_double_ecran.jpg",
   },
   {
      type: "drone",
      name: "Drone",
      description: "Drone pour prises de vue aériennes et exploration.",
      quantity: 1,
      urlImage: "/uploads/drone.jpg",
   },
   {
      type: "tablette",
      name: "Tablette",
      description: "Tablette tactile pour navigation et applications diverses.",
      quantity: 3,
      urlImage: "/uploads/tablette.jpg",
   },
   {
      type: "telephone",
      name: "Téléphone Xiaomi",
      description: "Téléphone Xiaomi avec fonctionnalités avancées.",
      quantity: 2,
      urlImage: "/uploads/telephone_xiaomi.jpg",
   },
   {
      type: "assistant",
      name: "Google Home",
      description: "Assistant vocal Google Home pour la maison connectée.",
      quantity: 1,
      urlImage: "/uploads/google_home.jpg",
   },
   {
      type: "imprimante",
      name: "Imprimante 3D",
      description: "Imprimante 3D pour création d'objets en trois dimensions.",
      quantity: 3,
      urlImage: "/uploads/imprimante_3d.jpg",
   },
   {
      type: "composants",
      name: "Boîte de composants Arduino",
      description: "Boîte contenant divers composants pour projets Arduino.",
      quantity: 6,
      urlImage: "/uploads/composants_arduino.jpg",
   },
   {
      type: "robot",
      name: "Main Robot Ned",
      description: "Main robotique Robot Ned pour applications robotiques.",
      quantity: 1,
      urlImage: "/uploads/main_roboy_ned.png",
   },
   {
      type: "arduino",
      name: "Arduino",
      description: "Carte de développement Arduino pour projets électroniques.",
      quantity: 24,
      urlImage: "/uploads/arduino.jpg",
   },
   {
      type: "raspberry",
      name: "Raspberry Pi",
      description: "Le Raspberry Pi est un nano-ordinateur monocarte à processeur ARM.",
      quantity: 24,
      urlImage: "/uploads/raspberry_pi.jpg",
   },
];

(async () => {
   try {
      // Vérification que la connexion est établie
      await sequelize.authenticate();
      console.log("Connexion à la base de données réussie.");

      // Synchroniser le modèle Article avec la base de données
      await Article.sync();

      // Insérer tous les articles du JSON
      for (const article of articles) {
         const newArticle = await Article.create(article);
         console.log("Article ajouté:", newArticle.toJSON());
      }
   } catch (error) {
      console.error("Erreur lors de l'insertion des articles:", error);
   } finally {
      // Fermer la connexion à la base de données
      await sequelize.close();
   }
})();
