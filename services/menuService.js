const userModel = require("../model/userModel");
const menuModel = require("../model/menuModel");
const roleModel = require("../model/roleModel");
const role_menuModel = require("../model/role_menuModel");
const { transformToTreeStructure, toTree } = require("../utils/toTree");
const { Op } = require("sequelize");

module.exports.addMenuService = async function (menuObj) {
  const { parentId } = menuObj;
  if (!parentId) {
    // 添加表单
    const result = await menuModel.create(menuObj);
    // 添加表单成功后，还要添加到角色_表单表中，替换为手动添加
    // await role_menuModel.create({ roleId: 1, menuId: result.id })
    return { code: true, msg: null, data: result.toJSON() };
  }
  // 判断parentId是否存在
  const parentMenu = await menuModel.findByPk(parentId);
  if (parentMenu) {
    // 添加表单
    const result = await menuModel.create(menuObj);
    // 添加表单成功后，还要添加到角色_表单表中
    await role_menuModel.create({ roleId: 1, menuId: result.id });
    return { code: true, msg: null, data: result };
  } else {
    throw new Error("父级菜单不存在");
  }
};

// 删除表单
async function deleteChildren(id) {
  const childrens = await menuModel.findAll({ where: { parentId: id } });
  for (const children of childrens) {
    deleteChildren(children.id);
    await role_menuModel.destroy({ where: { menuId: children.id } });
    await children.destroy();
  }
}
// 删除表单信息
module.exports.deleteMenuService = async (id) => {
  // 删除表单
  await menuModel.destroy({ where: { id } });
  // 在删除表单下的所有子表单，parentId === id的表单
  deleteChildren(id);
  return { code: true, msg: null, data: "删除成功" };
};

// 更新表单信息
module.exports.updateMenuService = async (menuObj) => {
  let { id, parentId } = menuObj;
  if (parentId) {
    // 判断parentId对应id是否存在
    const menu = await menuModel.findByPk(parentId);
    if (!menu) {
      return { code: false, msg: "表单不存在", data: null };
    }
  }
  await menuModel.update(menuObj, { where: { id } });
  return { code: true, msg: null, data: "更新成功" };
};

// 获取表单信息
module.exports.getMenuService = async (id) => {
  if (!id) id = null;
  const result = await menuModel.findAll({ where: { parentId: id } });
  return { code: true, msg: null, data: result };
};

// 获取所有表单数据
module.exports.getTreeService = async (userId) => {
  const result = await userModel.findByPk(userId, {
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表属性
        include: [
          {
            model: menuModel,
            where: {
              type: {
                [Op.in]: [0, 1, 2], // 只查询目录和菜单和按钮
              },
              // visible: true, // 只查询可见的
            },
            through: { attributes: [] }, // 不返回中间表属性
            // 关联查询中排序无效，手动处理
            // order: [
            //     ['orderNum', 'ASC']
            // ]
          },
        ],
      },
    ],
  });
  // 对结果中的菜单手动排序
  if (result && result.roles) {
    result.roles.forEach((role) => {
      if (role.menus) {
        role.menus.sort((a, b) => a.orderNum - b.orderNum);
      }
    });
  }
  if (!result) {
    return { code: false, msg: "用户不存在", data: null };
  }
  return {
    code: true,
    msg: null,
    data: transformToTreeStructure(result.toJSON()),
  };
};

// 获取用户所有表单数据，排除按钮部分
module.exports.getRoutesService = async (userId) => {
  const result = await userModel.findByPk(userId, {
    include: [
      {
        model: roleModel,
        through: { attributes: [] }, // 不返回中间表属性
        include: [
          {
            model: menuModel,
            where: {
              type: {
                [Op.in]: [0, 1], // 只查询目录和菜单和按钮
              },
              // visible: true, // 只查询可见的
            },
            through: { attributes: [] }, // 不返回中间表属性
            // 关联查询中排序无效，手动处理
            // order: [
            //     ['orderNum', 'ASC']
            // ]
          },
        ],
      },
    ],
  });
  // 对结果中的菜单手动排序
  if (result && result.roles) {
    result.roles.forEach((role) => {
      if (role.menus) {
        role.menus.sort((a, b) => a.orderNum - b.orderNum);
      }
    });
  }
  if (!result) {
    return { code: false, msg: "用户不存在", data: null };
  }
  return {
    code: true,
    msg: null,
    data: transformToTreeStructure(result.toJSON()),
  };
};

// 获取所有表单数据
module.exports.getRouteService = async (userId) => {
  // id不存在找到所有表单信息进行返回
  const allMenus = await menuModel.findAll({
    where: {
      visible: true,
      type: {
        [Op.in]: [0, 1], // 只获取目录和菜单
      },
    },
    order: [["orderNum", "ASC"]],
  });
  // 转换为纯JSON格式
  const menusJson = allMenus.map((menu) => menu.toJSON());
  return {
    code: true,
    msg: null,
    data: toTree(menusJson),
  };
};
