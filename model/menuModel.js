const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

// 存储路由信息
module.exports = sequelize.define(
  "menu",
  {
    // 路由名称
    //添加/删除字段的路由名称都是一样的，空字符串
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "路由名称不能为空",
        },
      },
      comment: "路由名称",
    },
    // 路由路径
    // 添加/删除字段路由路径都是一样的，空字符串
    path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "路由路径",
    },
    // 组件路径
    // 添加/删除字段组件路径都是一样的，空字符串
    component: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "组件路径",
    },
    // 父级路由
    // 父级路由为null，表示顶级路由
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "父级路由id",
    },
    // 路由缓存
    // 路由缓存默认不开启
    keepAlive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "路由缓存",
    },
    // 路由图标
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "路由图标",
    },
    // 权限标识
    perms: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "权限标识",
    },
    // 路由鉴权
    // 路由鉴权默认不开启
    auth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "路由鉴权",
    },
    // 权限类型 (0:目录 1:菜单 2:按钮)
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1, 2]],
          msg: "类型必须是0(目录)、1(菜单)或2(按钮)",
        },
      },
      comment: "权限类型",
    },
    // 排序字段
    orderNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "显示顺序",
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
