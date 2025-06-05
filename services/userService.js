const { registerDao, loginDao, changePermissionsDao, findAllUserDao, whoamiDao, permissionDao, deleteUserDao, updateUserStatusDao } = require("../dao/userDao")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { transformToTreeStructure } = require("../utils/toTree")

//注册账号
module.exports.registerService = async function (userObj) {
    const { username, password, roleId, visible } = userObj
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, password: hashedPassword, roleId, visible }
    const result = await registerDao(newUser)
    return result
}
//登录账号
module.exports.loginService = async function (userObj) {
    const { username, password } = userObj
    const user = await loginDao(username)
    // 判断用户是否存在    
    if (!user) {
        return { code: false, msg: "用户不存在", data: null }
    }
    if (!user.visible) {
        return { code: false, msg: "用户已禁用，请联系管理员", data: null }
    }
    // 匹配密码
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return { code: false, msg: "密码错误", data: null }
    }
    const result = transformToTreeStructure(user.toJSON())
    const role = result.roles.map(item => item.roleName)
    const userId = result.userId
    // 查看用户权限
    const data = await permissionDao(userId)
    const permissions = new Set();
    data.roles.forEach(role => {
        role.menus.forEach(menu => {
            if (menu.perms) {
                permissions.add(menu.perms);
            }
        });
    });

    const token = jwt.sign({ id: userId, role: role[0], permissions: Array.from(permissions) }, process.env.JWT_PASSWORD, {
        expiresIn: '1d'
    })
    const refresh_token = jwt.sign({ id: userId, role: role[0], permissions: Array.from(permissions) }, process.env.JWT_PASSWORD, {
        expiresIn: '5d'
    })
    return { code: true, msg: null, data: { token, refresh_token, ...result, permissions: Array.from(permissions) } }
}

// 刷新token
module.exports.refreshTokenService = async function (user) {
    const token = jwt.sign({ id: user.id, role: user.role[0], permissions: user.permissions }, process.env.JWT_PASSWORD, {
        expiresIn: '1d'
    })
    return { code: true, msg: null, data: { token } }
}

// 查看用户
module.exports.whoamiService = async function (user) {
    const { id } = user
    const data = await whoamiDao(id)
    if (!data) {
        return { code: false, msg: "用户不存在", data: null }
    }
    const result = transformToTreeStructure(data.toJSON())
    result.permissions = Array.from(data.permissions)
    // 查看用户权限
    return { code: true, msg: null, data: result }
}


// 查看用户权限
module.exports.permissionService = async function (user) {
    const { id } = user
    const data = await permissionDao(id)
    const permissions = new Set();
    data.roles.forEach(role => {
        role.menus.forEach(menu => {
            if (menu.perms) {
                permissions.add(menu.perms);
            }
        });
    });
    return { code: true, msg: null, data: Array.from(permissions) }
}

// 修改用户权限
module.exports.changePermissionsService = async function (userObj) {
    await changePermissionsDao(userObj)
    return { code: true, msg: null, data: "用户角色关联更新成功" }
}


// 模糊查询所有用户
module.exports.findAllUserService = async function (searchName) {
    const data = await findAllUserDao(searchName)
    const result = []
    for (const user of data) {
        result.push(transformToTreeStructure(user.toJSON()))
    }
    return { code: true, msg: null, data: result }
}

// 删除用户
module.exports.deleteUserService = async function (userId, currentUserId) {
    if (userId == currentUserId) {
        return { code: false, msg: "不能删除当前登录的用户", data: null }
    }
    const result = await deleteUserDao(userId)
    if (!result) {
        return { code: false, msg: "用户不存在", data: null }
    }
    return { code: true, msg: null, data: "删除成功" }
}

// 解封/禁用用户
module.exports.updateUserStatusService = async function (obj, currentUserId) {
    const { userId, visible } = obj
    if (userId == currentUserId) {
        return { code: false, msg: "不能操作当前登录的用户", data: null }
    }
    await updateUserStatusDao(obj)
    return { code: true, msg: null, data: "操作成功" }
}

