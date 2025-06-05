const jwt = require("jsonwebtoken");

const decryptToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.refresh_token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      // 没有携带token
      return res
        .status(401)
        .send({
          code: false,
          msg: "无效refresh_token，请重新登录",
          data: null,
        });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_PASSWORD);
      req.user = decode;
      // console.log("The decoded user is：", req.user);
      next();
    } catch (error) {
      // token解析失败
      return res
        .status(401)
        .send({
          code: false,
          msg: "无效refresh_token，请重新登录",
          data: null,
        });
    }
  } else {
    // 没有携带token
    return res
      .status(401)
      .send({ code: false, msg: "无效refresh_token，请重新登录", data: null });
  }
};

module.exports = decryptToken;
