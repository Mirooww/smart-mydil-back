const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
   //extrait le token de l'en-tête de la requête
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];

   if (!token) {
      return res.status(401).json({ error: "Accès refusé : Vous n'êtes pas connectés !" });
   }

   //vérifie si le token reçu est en accord avec le token stocké dans le .env
   // clé privé, clé public
   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
         return res.status(401).json({ error: "Accès refusé : Token invalide !" });
      }
      req.user = user;
      next();
   });
}

module.exports = authenticateToken;
