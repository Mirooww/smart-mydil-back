// middleware/logger.js
const fs = require("fs");
const path = require("path");

const logMessage = (message) => {
   const logFilePath = path.join(__dirname, "log.txt");
   const timestamp = new Date().toLocaleString();

   fs.appendFile(logFilePath, `${timestamp} - ${message}\n`, (err) => {
      if (err) {
         console.error("Erreur lors de l'écriture dans le fichier:", err);
      }
   });
};

module.exports = logMessage;
