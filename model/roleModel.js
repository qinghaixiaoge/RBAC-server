const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

module.exports = sequelize.define(
  "role",
  {
    // 这张表拥有哪些字段，不能扩展用户，抛弃
    // roleName: {
    //     type: DataTypes.ENUM("admin", "manager", "user"),
    //     allowNull: false
    // }
    // 角色名称
    roleName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "角色名称不能为空",
        },
      },
      comment: "角色名称",
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
