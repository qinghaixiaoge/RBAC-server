const sequelize = require("./connect");
const userModel = require("../model/userModel");
const user_roleModel = require("../model/user_roleModel");
const roleModel = require("../model/roleModel");
const role_menuModel = require("../model/role_menuModel");
const menuModel = require("../model/menuModel");
const bcrypt = require("bcryptjs");
(async function (params) {
  // 用户-角色 多对多关系
  userModel.belongsToMany(roleModel, {
    through: user_roleModel,
    foreignKey: "userId",
  });
  roleModel.belongsToMany(userModel, {
    through: user_roleModel,
    foreignKey: "roleId",
  });

  // 角色-菜单 多对多关系
  roleModel.belongsToMany(menuModel, {
    through: role_menuModel,
    foreignKey: "roleId",
  });
  menuModel.belongsToMany(roleModel, {
    through: role_menuModel,
    foreignKey: "menuId",
  });

  await sequelize.sync({
    // force: true, // 强制同步数据库，删除原有表格
    force: false,
  });

  // 初始化，插入用户
  const userCount = await userModel.count();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const usersToInsert = [
      { username: "admin1", password: hashedPassword },
      { username: "admin2", password: hashedPassword },
      { username: "admin3", password: hashedPassword },
      { username: "admin4", password: hashedPassword },
      { username: "admin5", password: hashedPassword },
    ];
    try {
      await userModel.bulkCreate(usersToInsert);
      console.log("5 个用户插入成功！");
    } catch (err) {
      console.error("用户插入失败:", error);
    }
  }
  // 初始化，插入角色
  const roleCount = await roleModel.count();
  if (roleCount === 0) {
    const rolesToInsert = [
      { roleName: "admin" },
      { roleName: "manager" },
      { roleName: "user" },
    ];
    try {
      await roleModel.bulkCreate(rolesToInsert);
      console.log("3条角色插入成功");
    } catch (err) {
      console.error("角色插入失败:", error);
    }
  }
  // 初始化，插入菜单
  const menuCount = await menuModel.count();
  if (menuCount === 0) {
    const menu = [
      // 目录
      {
        type: 0,
        orderNum: 0,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/",
        name: "首页",
        component: "/views/LayoutView.vue",
        parentId: null,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/",
        name: "八股文章",
        component: "/views/HomeView.vue",
        parentId: 1,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/about",
        name: "视频教学",
        component: "/views/AboutView.vue",
        parentId: 1,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/message",
        name: "备忘录",
        component: "/views/MessageView.vue",
        parentId: 1,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/music",
        name: "音乐",
        component: "/views/MusicView.vue",
        parentId: 1,
        perms: "",
        keepAlive: true,
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/blog/:id",
        name: "文章详情",
        component: "/views/BlogDetailView.vue",
        parentId: 1,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/login",
        name: "登录",
        component: "/views/LoginView.vue",
        parentId: 1,
        perms: "",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/wait",
        name: "鉴权",
        component: "/views/WaitView.vue",
        parentId: 1,
        perms: "",
      },
      // 9，目录-权限字段perms和组件路径component为空
      {
        type: 0,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/",
        name: "管理员",
        component: null,
        auth: true,
        parentId: 1,
        perms: null,
      },
      // 仪表盘
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/dashboard",
        name: "仪表盘",
        component: "/views/DashboardView.vue",
        auth: true,
        keepAlive: true,
        parentId: 9,
        perms: "sys",
      },
      // 菜单
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/menu",
        name: "菜单管理",
        component: "/views/TreeView.vue",
        auth: true,
        keepAlive: true,
        parentId: 9,
        perms: "sys:menu:list",
      },
      // 按钮-路由path和组件路径component为空
      {
        type: 2,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "添加",
        component: null,
        parentId: 10,
        perms: "sys:menu:add",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "删除",
        component: null,
        parentId: 10,
        perms: "sys:menu:delete",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "编辑",
        component: null,
        parentId: 10,
        perms: "sys:menu:edit",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "查询",
        component: null,
        parentId: 10,
        perms: "sys:menu:list",
      },
      // 菜单
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/blogTypeManager",
        name: "文章分类管理",
        component: "/views/blogTypeManagerView.vue",
        auth: true,
        parentId: 9,
        perms: "sys:blogtype:list",
      },
      // 按钮-路由path和组件路径component为空
      {
        type: 2,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "添加",
        component: null,
        parentId: 15,
        perms: "sys:blogtype:add",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "删除",
        component: null,
        parentId: 15,
        perms: "sys:blogtype:delete",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "编辑",
        component: null,
        parentId: 15,
        perms: "sys:blogtype:edit",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "查询",
        component: null,
        parentId: 15,
        perms: "sys:blogtype:list",
      },
      // 菜单
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/blogManager",
        name: "文章管理",
        component: "/views/blogManagerView.vue",
        auth: true,
        parentId: 9,
        perms: "sys:blog:list",
      },
      // 按钮-路由path和组件路径component为空
      {
        type: 2,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "添加",
        component: null,
        parentId: 20,
        perms: "sys:blog:add",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "删除",
        component: null,
        parentId: 20,
        perms: "sys:blog:delete",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "编辑",
        component: null,
        parentId: 20,
        perms: "sys:blog:edit",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "查询",
        component: null,
        parentId: 20,
        perms: "sys:blog:list",
      },
      // 菜单
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/personManager",
        name: "用户管理",
        component: "/views/personManagerView.vue",
        auth: true,
        parentId: 9,
        perms: "sys:user:list",
      },
      // 按钮-路由path和组件路径component为空
      {
        type: 2,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "添加",
        component: null,
        parentId: 25,
        perms: "sys:user:add",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "删除",
        component: null,
        parentId: 25,
        perms: "sys:user:delete",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "编辑",
        component: null,
        parentId: 25,
        perms: "sys:user:edit",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "查询",
        component: null,
        parentId: 25,
        perms: "sys:user:list",
      },
      // 菜单
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/roleManager",
        name: "角色管理",
        component: "/views/roleManagerView.vue",
        auth: true,
        parentId: 9,
        perms: "sys:role:list",
      },
      // 按钮-路由path和组件路径component为空
      {
        type: 2,
        orderNum: 2,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "添加",
        component: null,
        parentId: 30,
        perms: "sys:role:add",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "删除",
        component: null,
        parentId: 30,
        perms: "sys:role:delete",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "编辑",
        component: null,
        parentId: 30,
        perms: "sys:role:edit",
      },
      {
        type: 2,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: null,
        name: "查询",
        component: null,
        parentId: 30,
        perms: "sys:role:list",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/editBlog/:id?",
        name: "文章编辑",
        component: "/views/editBlogView.vue",
        auth: true,
        parentId: 1,
        perms: "sys:blog:edit",
      },
      {
        type: 1,
        orderNum: 1,
        visible: true,
        icon: "el-icon-Avatar",
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: "/views/NotFoundView.vue",
        parentId: null,
        perms: "",
      },
    ];
    try {
      await menuModel.bulkCreate(menu);
      console.log("菜单插入成功");
    } catch (err) {
      console.error("插菜单入失败:", err);
    }
  }
  // 初始化，插入用户关联角色
  const user_roleCount = await user_roleModel.count();
  if (user_roleCount === 0) {
    // 要插入的数据
    const userRoles = [
      { userId: 1, roleId: 1 },
      { userId: 2, roleId: 2 },
      { userId: 3, roleId: 3 },
      { userId: 4, roleId: 2 },
      { userId: 5, roleId: 3 },
    ];
    // 批量插入
    try {
      user_roleModel.bulkCreate(userRoles);
      console.log("用户关联角色插入成功");
    } catch (err) {
      console.error("用户关联角色插入失败:", err);
    }
  }
  const role_menuCount = await role_menuModel.count();
  if (role_menuCount === 0) {
    // 要插入的数据 - 一个角色可以对应多个菜单
    const roleMenus = [
      { roleId: 1, menuId: 1 }, // 角色1有菜单1
      { roleId: 1, menuId: 2 }, // 角色1有菜单2
      { roleId: 1, menuId: 3 }, // 角色1有菜单3
      { roleId: 1, menuId: 4 }, // 角色1有菜单4
      { roleId: 1, menuId: 5 }, // 角色1有菜单5
      { roleId: 1, menuId: 6 },
      { roleId: 1, menuId: 7 },
      { roleId: 1, menuId: 8 },
      { roleId: 1, menuId: 9 },
      { roleId: 1, menuId: 10 },
      { roleId: 1, menuId: 11 },
      { roleId: 1, menuId: 12 },
      { roleId: 1, menuId: 13 },
      { roleId: 1, menuId: 14 },
      { roleId: 1, menuId: 15 },
      { roleId: 1, menuId: 16 },
      { roleId: 1, menuId: 17 },
      { roleId: 1, menuId: 18 },
      { roleId: 1, menuId: 19 },
      { roleId: 1, menuId: 20 },
      { roleId: 1, menuId: 21 },
      { roleId: 1, menuId: 22 },
      { roleId: 1, menuId: 23 },
      { roleId: 1, menuId: 24 },
      { roleId: 1, menuId: 25 },
      { roleId: 1, menuId: 26 },
      { roleId: 1, menuId: 27 },
      { roleId: 1, menuId: 28 },
      { roleId: 1, menuId: 29 },
      { roleId: 1, menuId: 30 },
      { roleId: 1, menuId: 31 },
      { roleId: 1, menuId: 32 },
      { roleId: 1, menuId: 33 },
      { roleId: 1, menuId: 34 },
      { roleId: 1, menuId: 35 },
      { roleId: 1, menuId: 36 },
      { roleId: 2, menuId: 1 }, // 角色2有菜单1
      { roleId: 2, menuId: 2 },
      { roleId: 2, menuId: 3 },
      { roleId: 3, menuId: 1 },
      { roleId: 3, menuId: 2 },
    ];
    // 批量插入
    try {
      role_menuModel.bulkCreate(roleMenus);
      console.log("角色关联菜单插入成功");
    } catch (err) {
      console.error("角色关联菜单插入失败:", err);
    }
  }
})();
