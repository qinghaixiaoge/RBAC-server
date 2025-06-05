const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

// 必须确保id存在，否则会被错误中间件捕获，外键不存在
module.exports = sequelize.define(
  "role_menu",
  {
    // 这张表拥有哪些字段
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "角色id",
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "菜单id",
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
