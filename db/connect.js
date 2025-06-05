//负责连接数据库
const { Sequelize } = require("sequelize");

//生成sequelize实例
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 👈 指定自定义端口
    dialect: "mysql",
    logging: false,
  }
);
//向外暴露
module.exports = sequelize;
