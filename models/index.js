const User = require("./User");
const Article = require("./Article");
const Reservation = require("./Reservation");

User.belongsToMany(Article, {
   through: Reservation,
   foreignKey: "userId",
   as: "reservedArticles",
   uniqueKey: false, // Désactiver l'unicité sur la combinaison userId/articleId
});

Article.belongsToMany(User, {
   through: Reservation,
   foreignKey: "articleId",
   as: "reservingUsers",
   uniqueKey: false, // Désactiver l'unicité sur la combinaison articleId/userId
});

User.hasMany(Reservation, { foreignKey: "userId", as: "reservations" });
Reservation.belongsTo(User, { foreignKey: "userId", as: "user" });

Article.hasMany(Reservation, { foreignKey: "articleId", as: "reservations" });
Reservation.belongsTo(Article, { foreignKey: "articleId", as: "article" });

module.exports = { User, Article, Reservation };
