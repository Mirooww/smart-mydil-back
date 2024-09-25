const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const logMessage = require("../config/logMessage");

const User = require("../models/User");
const RegisterController = express.Router();

RegisterController.post("/", async (req, res) => {
   try {
      const { username, password } = req.body;
      const newUser = await User.create({ username, password });
      logMessage(`${username} s'est enregistré,`);
      res.status(200).json({ success: true, message: "Vous vous êtes bien enregistrés ! ", newUser });
   } catch (err) {
      console.error("Error during register:", err);

      res.status(500).json({ success: false, message: "Internal server error" });
   }
});

module.exports = RegisterController;
