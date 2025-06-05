const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
// 必须确保id存在，否则会被错误中间件捕获，外键不存在
module.exports = sequelize.define(
  "user_role",
  {
    // 这张表拥有哪些字段
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: "用户id",
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "角色id",
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
