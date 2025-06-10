const express = require("express");
const { expressjwt, UnauthorizedError } = require("express-jwt");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });
//引入数据库
require("./db/init");
require("express-async-errors");

const app = express();
const userRouter = require("./routes/user");
const menuRouter = require("./routes/menu");
const roleRouter = require("./routes/role");
const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require("sequelize");
const { JsonWebTokenError } = require("jsonwebtoken");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/static", express.static("static"));
app.use((req, res, next) => {
  if (req.method === "options") {
    next();
    return;
  }
  next();
});
app.use(
  expressjwt({
    secret: process.env.JWT_PASSWORD,
    algorithms: ["HS256"],
    credentialsRequired: true,
    getToken: (req) => {
      let authHeader = req.headers.Authorization || req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer")) {
        return authHeader.split(" ")[1];
      }
      return null;
    },
  }).unless({
    path: [
      { url: /\/static\/.*/, methods: ["GET"] },
      { url: "/api/login", methods: ["POST"] },
      { url: "/api/register", methods: ["POST"] },
      { url: "/api/refresh_token", methods: ["GET"] },
      { url: "/role/getTree", methods: ["GET"] },
      { url: "/menu/getRoute", methods: ["GET"] },
    ],
  })
);

app.use("/api", userRouter);
app.use("/menu", menuRouter);
app.use("/role", roleRouter);
app.use((req, res, next) => {
  // 处理404
  res.status(404).send({ code: false, msg: "请求地址不存在", data: null });
});
// 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    console.log("字段已存在");
    // 字段已存在（唯一性约束失败）
    return res.status(400).send({ code: false, msg: "字段已存在", data: null });
  }
  if (err instanceof ValidationError) {
    // 空字符串校验、格式不符合
    const msg = err.errors.map((e) => e.message).join("; ");
    console.log("空字符串校验、格式不符合", msg);
    return res.status(400).send({ code: false, msg: msg, data: null });
  }
  if (err instanceof ForeignKeyConstraintError) {
    console.log("外键约束失败，可能依赖的数据不存在'");
    // 外键约束失败，可能依赖的数据不存在'
    return res
      .status(400)
      .send({ code: false, msg: "关联数据不存在", data: null });
  }

  if (err.message === "父级菜单不存在") {
    return res.status(400).send({ code: false, msg: err.message, data: null });
  }
  // UnauthorizedError 不携带token/token解密失败/token过期
  // JsonWebTokenError token解密密钥不对
  if (err instanceof UnauthorizedError || err instanceof JsonWebTokenError) {
    return res
      .status(401)
      .send({ code: false, msg: "无效token,请重新登录", data: null });
  }

  return res
    .status(500)
    .send({ code: false, msg: "服务器错误，请联系管理员", data: null });
});

app.listen(process.env.PORT, () => {
  console.log("服务启动，端口：", process.env.PORT);
});
