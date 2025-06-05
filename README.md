# 初始化项目

- 执行`npm init -y`

# 安装依赖

- 执行`npm i`
- `express`：专门写接口的一个第三方工具库
- `express-jwt`：是设置 token 校验的第三方中间件，用于设置 token 校验
- `jsonwebtoken`：是设置 token 加密和解密的第三方工具库
- `cors`：是设置接口跨域问题的第三方中间件
- `dotenv`：是存储常量的第三方工具库
- `validate.js`：处理字段验证第三方工具库，项目中未使用，统一错误中间件进行了处理
- `express-async-errors`：处理异步错误的第三方中间件
- `multer`：处理图片上传的第三方库
- `cross-env`：不同环境启动，读取生产/开发/测试的 env 配置参数

# 运行项目

- 前提：确保数据库存在 `MYRBAC`
- `npm run dev` 开发环境
- `npm run prod` 生产环境
- `npm run test` 测试环境

# 数据库依赖

- `sequelize(ORM 框架)`：连接数据库以及同步数据到数据库，依赖`mysql2`第三方库，主要提供操作数据库的功能

- 1.连接数据库，得到数据库实例，向外暴露主要用来同步各个模型，最后同步到数据库
- 2.model 目录：定义各大模型
- 3.dao 目录：接收参数，调用系统功能进行操作数据库
- 4.services 目录：业务逻辑层，调用 dao 目录接口并对返回结果进行逻辑处理
- 5.routes 目录：路由层，调用 services 业务逻辑层的函数
- 客户端请求处理流程：routes---->services---->dao

# token 鉴权流畅

- 1. 通过客户端传递过来的 token，进入 getToken 获取 token
- 2. 若是 getToken 处理成功，在通过 decryptToken 中间件处理，反之返回 401
- 2. 若是 decryptToken 处理成功，进入 checkPermission 中间件进行鉴权处理，反之返回 401[`token 无效`]
- 3. 若是 checkPermission 处理成功，那么客户端成功拿到服务端的数据，反之返回 403[`token 有效，但权限不够`]

# 关于数据库

- 1. 客户端传递的内容必须符合 model 模型定义的；否则会被错误中间件捕获
- 2. 有些特殊情况，例如菜单表的 parentId，必须手动去判断是否存在，再去进行下一步处理

# 错误中间件

- token 解析失败、数据库操作失败，默认都会进入错误中间件处理，不需要在业务逻辑层去处理，除了上述说的一些特殊情况，需要修改状态码这些等等
