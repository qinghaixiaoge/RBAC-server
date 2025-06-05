var express = require("express");
const {
  loginService,
  registerService,
  changePermissionsService,
  findAllUserService,
  refreshTokenService,
  whoamiService,
  permissionService,
  deleteUserService,
  updateUserStatusService,
} = require("../services/userService");
const decryptToken = require("../middlewares/tokenMiddleware");
const decryptRefreshToken = require("../middlewares/refreshTokenMiddleware");
const authorizeRoles = require("../middlewares/roleMiddlerware");
const checkPermission = require("../middlewares/permissionMiddleware");
// checkPermission("sys")
var router = express.Router();

router.post("/login", async function (req, res, next) {
  res.send(await loginService(req.body));
});

router.get(
  "/refresh_token",
  decryptRefreshToken,
  async function (req, res, next) {
    res.send(await refreshTokenService(req.user));
  }
);

router.post(
  "/register",
  decryptToken,
  checkPermission("sys:user:add"),
  async function (req, res, next) {
    res.send(await registerService(req.body));
  }
);

router.get("/whoami", decryptToken, async function (req, res, next) {
  res.send(await whoamiService(req.user));
});

router.get("/permission", decryptToken, async function (req, res, next) {
  res.send(await permissionService(req.user));
});

// 修改用户权限
router.post(
  "/changePermissions",
  decryptToken,
  checkPermission("sys:user:edit"),
  async function (req, res, next) {
    res.send(await changePermissionsService(req.body));
  }
);
// 模糊查询所有用户
router.get(
  "/findAllUser",
  decryptToken,
  checkPermission("sys:user:list"),
  async function (req, res, next) {
    res.send(await findAllUserService(req.query.username));
  }
);
// 删除用户
router.get(
  "/deleteUser/:id",
  decryptToken,
  checkPermission("sys:user:delete"),
  async function (req, res, next) {
    res.send(await deleteUserService(req.params.id, req.user.id));
  }
);
// 解封/禁用用户
router.post(
  "/updateUser",
  decryptToken,
  checkPermission("sys:user:edit"),
  async function (req, res, next) {
    res.send(await updateUserStatusService(req.body, req.user.id));
  }
);

module.exports = router;
