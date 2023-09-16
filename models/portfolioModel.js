import db from "../config/Database.js";
import { DataTypes } from "sequelize";
import User from "./UserModel.js";

const Portfolio = db.define(
  "portfolio",
  {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

User.hasMany(Portfolio);
Portfolio.belongsTo(User);

export default Portfolio;
