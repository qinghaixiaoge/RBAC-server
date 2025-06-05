const jwt = require("jsonwebtoken");

const decryptToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  token = authHeader.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_PASSWORD);
  req.user = decode;
  next();
};

module.exports = decryptToken;
