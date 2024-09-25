const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const LoginController = express.Router();

LoginController.post("/", async (req, res) => {
   try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username: username } });

      if (!user) {
         return res.status(403).json({ success: false, message: "Mauvais mot de passe ou username !" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res.status(403).json({ success: false, message: "Mauvais mot de passe ou username !" });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "2h" });
      res.json({ success: true, message: "Vous vous êtes bien connectés ! ", token });
   } catch (err) {
      console.error("Error sasduring login:", err);

      res.status(500).json({ success: false, message: "Internal server error" });
   }
});

module.exports = LoginController;
