const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

module.exports = sequelize.define(
  "user",
  {
    // 这张表拥有哪些字段
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户名称",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "密码",
    },
    // 是否显示 (true:显示 false:隐藏)
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "显示",
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
