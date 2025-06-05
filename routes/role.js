var express = require("express");
const {
  getTreeService,
  getRoleService,
  getMenuIdService,
  addRoleMenuService,
  deleteRoleMenuService,
  updateRoleMenuService,
  addRoleService,
  updateRoleStatusService,
  deleteRoleService,
} = require("../services/roleService");
const decryptToken = require("../middlewares/tokenMiddleware");
const authorizeRoles = require("../middlewares/roleMiddlerware");
const checkPermission = require("../middlewares/permissionMiddleware");
var router = express.Router();

// 查询所有角色的菜单
router.get(
  "/getRole",
  decryptToken,
  checkPermission("sys:role:list"),
  async function (req, res, next) {
    res.send(await getRoleService());
  }
);

// 查询所有菜单【免登录】
router.get("/getTree", async function (req, res, next) {
  res.send(await getTreeService());
});
// 查询用户的菜单，只查询id字段
router.get(
  "/getMenuId",
  decryptToken,
  checkPermission("sys:role:list"),
  async function (req, res, next) {
    res.send(await getMenuIdService(req.user.id));
  }
);
// 角色添加菜单
router.post(
  "/addRoleMenu",
  decryptToken,
  checkPermission("sys:role:add"),
  async function (req, res, next) {
    res.send(await addRoleMenuService(req.body));
  }
);
// 角色删除菜单
router.post(
  "/deleteRoleMenu",
  decryptToken,
  checkPermission("sys:role:delete"),
  async function (req, res, next) {
    res.send(await deleteRoleMenuService(req.body));
  }
);
// 角色批量删除/添加菜单
router.post(
  "/updateRoleMenu",
  decryptToken,
  checkPermission("sys:role:edit"),
  async function (req, res, next) {
    res.send(await updateRoleMenuService(req.body));
  }
);
// 添加角色
router.post(
  "/addRole",
  decryptToken,
  checkPermission("sys:role:add"),
  async function (req, res, next) {
    res.send(await addRoleService(req.body));
  }
);
// 删除角色
router.get(
  "/deleteRole/:id",
  decryptToken,
  checkPermission("sys:role:delete"),
  async function (req, res, next) {
    res.send(await deleteRoleService(req.params.id));
  }
);
// 解封/禁用角色
router.post(
  "/updateRole",
  decryptToken,
  checkPermission("sys:role:edit"),
  async function (req, res, next) {
    res.send(await updateRoleStatusService(req.body));
  }
);

module.exports = router;
