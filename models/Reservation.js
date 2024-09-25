const { DataTypes } = require("sequelize");
const sequelize = require("../admin/sequelize");

const Reservation = sequelize.define("Reservation", {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   reservationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
   },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
});

module.exports = Reservation;
