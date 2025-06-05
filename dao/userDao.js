const menuModel = require("../model/menuModel");
const roleModel = require("../model/roleModel");
const user_roleModel = require("../model/user_roleModel");
const userModel = require("../model/userModel");
const { Op } = require("sequelize");
// 注册账号
module.exports.registerDao = async function (newUser) {
  const { username, password, roleId, visible } = newUser;
  const isExist = await userModel.findOne({ where: { username } });
  if (isExist) {
    return { code: false, msg: "用户已存在", data: null };
  } else {
    const user = await userModel.create({
      username,
      password,
      visible,
    });
    // 批量关联角色
    if (roleId && roleId.length > 0) {
      const records = roleId.map((roleId) => ({ userId: user.id, roleId }));
      await user_roleModel.bulkCreate(records);
    }
    return {
      code: true,
      msg: null,
      data: {
        userId: user.id,
        username,
      },
    };
  }
};

// 登录账号
module.exports.loginDao = async function (username) {
  const user = await userModel.findOne({ where: { username } });
  if (!user) {
    return null;
  }
  const result = await userModel.findByPk(user.id, {
    where: {
      visible: true,
    },
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表属性
        where: {
          visible: true,
        },
        required: false,
        include: [
          {
            model: menuModel,
            through: { attributes: [] }, // 不返回中间表属性
            where: {
              visible: true,
            },
            required: false,
          },
        ],
      },
    ],
  });
  return result;
};

// 查看用户
module.exports.whoamiDao = async function (id) {
  const result = await userModel.findByPk(id, {
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表属性
        where: {
          visible: true,
        },
        required: false,
        include: [
          {
            model: menuModel,
            through: { attributes: [] }, // 不返回中间表属性
            where: {
              visible: true,
            },
            required: false, // 关键设置，表示关联不是必须的
          },
        ],
      },
    ],
  });
  const permissions = new Set();
  if (result && result.roles) {
    result.roles.forEach((role) => {
      if (role.menus) {
        role.menus.sort((a, b) => a.orderNum - b.orderNum);
        // 查询用户权限
        role.menus.forEach((menu) => {
          if (menu.perms) {
            permissions.add(menu.perms);
          }
        });
      }
    });
  }
  result.permissions = permissions;
  return result;
};

// 查看用户权限
module.exports.permissionDao = async function (id) {
  const user = await userModel.findByPk(id, {
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表字段
        required: false,
        include: [
          {
            model: menuModel,
            required: false,
            through: { attributes: [] }, // 不返回中间表字段
            attributes: ["perms"], // 只查询perms字段
            where: {
              perms: {
                [Op.not]: null, // 只查询perms不为null的记录
              },
              visible: true,
            },
          },
        ],
      },
    ],
  });
  return user;
};

// 修改用户权限
module.exports.changePermissionsDao = async function (obj) {
  const { userId, roleId } = obj;
  // 删除用户拥有的所有角色
  await user_roleModel.destroy({
    where: {
      userId: userId,
    },
  });
  if (roleId && roleId.length > 0) {
    const records = roleId.map((roleId) => ({ userId, roleId }));
    await user_roleModel.bulkCreate(records);
  }
};

// 模糊查询所有用户
module.exports.findAllUserDao = async function (username) {
  const where = {};
  if (username) {
    where.username = { [Op.like]: `%${username}%` };
  }
  const result = await userModel.findAll({
    // attributes: { exclude: ['password'] },
    where,
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表属性
        include: [
          {
            model: menuModel,
            through: { attributes: [] }, // 不返回中间表属性
          },
        ],
      },
    ],
  });
  return result;
};

// 删除用户
module.exports.deleteUserDao = async function (userId) {
  const user = await userModel.findByPk(userId);

  if (!user) {
    return null;
  }

  // 删除用户角色关联表中的数据
  const result1 = await user_roleModel.destroy({
    where: {
      userId,
    },
  });
  console.log(result1);

  // 删除用户表中的数据
  const result = await userModel.destroy({
    where: {
      id: userId,
    },
  });
  return result;
};
// 解封/禁用用户
module.exports.updateUserStatusDao = async function (obj) {
  const { userId, visible } = obj;
  const user = await userModel.findByPk(userId);
  if (!user) {
    return null;
  }
  // 解封/禁用用户
  user.visible = visible;
  user.save();
};
