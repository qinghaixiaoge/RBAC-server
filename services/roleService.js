const userModel = require("../model/userModel")
const menuModel = require("../model/menuModel")
const roleModel = require("../model/roleModel");
const role_menuModel = require("../model/role_menuModel");
const { Op } = require("sequelize");
const { toTree } = require("../utils/toTree");
const user_roleModel = require("../model/user_roleModel");
// 查询所有角色的权限
module.exports.getRoleService = async function (menuObj) {
    const result = await roleModel.findAll({
        through: { attributes: [] }, // 不返回中间表属性
        include: [
            {
                model: menuModel,
                where: {
                    type: {
                        [Op.in]: [0, 1, 2], // 查询目录和菜单和按钮
                    },
                },
                through: { attributes: [] }, // 不返回中间表属性
                required: false// 关键设置，表示关联不是必须的
            }
        ],
        // ID排序 
        order: [["id", "ASC"]]
    })

    const rolesWithMenuIds = result.map(role => ({
        id: role.id,
        roleName: role.roleName,
        visible: role.visible,
        menus: role.menus.map(menu => menu.id) // 只提取id
    }));

    return { code: true, msg: null, data: rolesWithMenuIds }
}
// 查询所有菜单【免登录】
module.exports.getTreeService = async function (menuObj) {
    const data = await menuModel.findAll({
        // raw: true, // 获取纯JSON数据,使用 raw: true 会直接返回数据库底层的原始数据格式,1转换不了true
        order: [['orderNum', 'ASC']] // 按orderNum排序
    })
    const result = data.map(item => ({
        ...item.dataValues,
    }))
    return { code: true, msg: null, data: toTree(result) }
}
// 查询用户的表单，只查询id字段
module.exports.getMenuIdService = async function (userId) {
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
                    }
                ]
            }
        ],
    });
    const ids = result.toJSON().roles[0].menus.map(item => item.id)
    return { code: true, msg: null, data: ids }
}

module.exports.addRoleMenuService = async function (obj) {
    const { roleId, menuId } = obj
    const result = await role_menuModel.create({
        roleId,
        menuId
    })
    return { code: true, msg: null, data: result }
}
module.exports.deleteRoleMenuService = async function (obj) {
    const { roleId, menuId } = obj
    // result：删除值存在删除返回1，不存在返回0
    const result = await role_menuModel.destroy({
        where: {
            roleId,
            menuId
        }
    })
    return { code: true, msg: null, data: "删除成功" }
}
// 角色批量删除/添加菜单
module.exports.updateRoleMenuService = async function (obj) {
    const { roleId, menuId } = obj
    // 1. 删除现有关联
    await role_menuModel.destroy({
        where: { roleId }
    });
    // 2. 批量创建新关联
    if (menuId && menuId.length > 0) {
        console.log("填充数据");

        const records = menuId.map(menuId => ({ roleId, menuId }));
        await role_menuModel.bulkCreate(records);
    }
    return { code: true, msg: null, data: "角色菜单关联更新成功" }
}
// 添加角色
module.exports.addRoleService = async function (obj) {
    const { roleName, visible, menuId } = obj
    const result = await roleModel.create({
        roleName,
        visible
    })
    const roleId = result.id
    if (menuId && menuId.length > 0) {
        const records = menuId.map(menuId => ({ roleId, menuId }));
        await role_menuModel.bulkCreate(records);
    }
    return {
        code: true, msg: null, data: {
            id: result.id,
            roleName
        }
    }
}
// 删除角色
module.exports.deleteRoleService = async function (roleId) {
    // 先查看是否有用户关联该角色，如果有则不能删除
    // 实际用户拥有该角色也可以删除成功
    const userCount = await user_roleModel.findAll({
        where: {
            roleId
        }
    })
    if (userCount.length > 0) {
        return { code: false, msg: "存在用户关联该角色", data: null }
    }
    // 在删除角色关联的菜单
    await role_menuModel.destroy({
        where: { roleId }
    });
    // 在删除角色本身
    roleModel.destroy({ where: { id: roleId } })
    return { code: true, msg: null, data: "删除成功" }
}
// 解封/禁用角色
module.exports.updateRoleStatusService = async function (obj) {
    const { roleId, visible } = obj
    const role = await roleModel.findByPk(roleId);
    if (!role) {
        return null
    }
    // 解封/禁用用户
    role.visible = visible
    role.save()
    return { code: true, msg: null, data: "操作成功" }
}