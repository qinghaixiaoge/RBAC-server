var express = require("express");
const {
  addMenuService,
  deleteMenuService,
  updateMenuService,
  getTreeService,
  getMenuService,
  getRoutesService,
  getRouteService,
} = require("../services/menuService");
const decryptToken = require("../middlewares/tokenMiddleware");
const authorizeRoles = require("../middlewares/roleMiddlerware");
const checkPermission = require("../middlewares/permissionMiddleware");
var router = express.Router();

router.post(
  "/addMenu",
  decryptToken,
  checkPermission("sys:menu:add"),
  async function (req, res, next) {
    res.send(await addMenuService(req.body));
  }
);

router.get(
  "/delMenu/:id",
  decryptToken,
  checkPermission("sys:menu:delete"),
  async function (req, res, next) {
    res.send(await deleteMenuService(req.params.id));
  }
);
// 用于树形节点懒加载
router.get(
  "/getMenu",
  decryptToken,
  checkPermission("sys:menu:list"),
  async function (req, res, next) {
    res.send(await getMenuService(req.query.id));
  }
);

router.post(
  "/updateMenu",
  decryptToken,
  checkPermission("sys:menu:edit"),
  async function (req, res, next) {
    res.send(await updateMenuService(req.body));
  }
);

router.get(
  "/getTree",
  decryptToken,
  checkPermission("sys:menu:list"),
  async function (req, res, next) {
    res.send(await getTreeService(req.user.id));
  }
);

router.get(
  "/getRoutes",
  decryptToken,
  checkPermission("sys:menu:list"),
  async function (req, res, next) {
    res.send(await getRoutesService(req.user.id));
  }
);

router.get(
  "/getRoutes",
  decryptToken,
  checkPermission("sys:menu:list"),
  async function (req, res, next) {
    res.send(await getRoutesService(req.user.id));
  }
);

router.get("/getRoute", async function (req, res, next) {
  res.send(await getRouteService());
});

module.exports = router;
