const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const LoginController = require("./routes/LoginController");
const ArticleController = require("./routes/ArticleController");
const RegisterController = require("./routes/RegisterController");
const ReservationController = require("./routes/ReservationController");
const LogController = require("./routes/LogController");
const UserController = require("./routes/UserController");

const PORT = process.env.TOKEN_SERVER_PORT || 4000;
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Configuration de CORS
app.use(
   cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

app.use(bodyParser.json());

app.use("/api/login", LoginController);
app.use("/api/register", RegisterController);

app.use("/api/article", ArticleController);
app.use("/api/reservation", ReservationController);
app.use("/api/user", UserController);
app.use("/api/log", LogController);

// Route d'accueil
app.get("/", (req, res) => {
   res.json({ message: "Serveur opérationel" });
});

// Lancement du serveur
app.listen(PORT, () => {
   console.log("Serveur lancé au port :", PORT);
});
