# 1.Egg.js 介绍

> 1.1 介绍

Egg 是阿里出品的一款 node.js 后端 web 框架，基于 koa 封装，并做了一些约定。

> 1.2 优点

Egg 奉行『约定优于配置』，按照一套统一的约定进行应用开发，团队内部采用这种方式可以减少开发人员的学习成本，开发人员不再是『钉子』，可以流动起来。没有约定的团队，沟通成本是非常高的，比如有人会按目录分栈而其他人按目录分功能，开发者认知不一致很容易犯错。但约定不等于扩展性差，相反 Egg 有很高的扩展性，可以按照团队的约定定制框架。

> 1.3 官网

[Egg.js](https://www.eggjs.org/zh-CN)

# 2.脚手架搭建

## 1.创建 simple 模板的脚手架

在一个空文件夹内初始化简单 egg 应用程序骨架。

```
$ npm init egg --type=simple
$ npm i
$ npm run dev
```

## 2.目录结构

```
egg-project
├── package.json
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (可选)
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── public (可选)
│   ├── contract (可选)
│   |   ├── request (可选)
│   |   └── response (可选)
│   ├── model (可选)
│   |   └── user.js
│   └── extend (可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

- **router.js**

  Router 主要用来描述请求 URL 和具体承担执行动作的 Controller 的对应关系， 框架约定了 app/router.js 文件用于统一所有路由规则。

- **controller**

  Controller 负责解析用户的输入，处理后返回相应的结果。

- **service**

  Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层，保持 Controller 中的逻辑更加简洁，保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。

- **middleware**

  Middleware 中间件就是匹配路由前、匹配路由完成做的一系列的操作。

- **contract**

  Contract 定义接口的参数类型，用于参数校验。

- **model**

  Model 模型，sequelize 插件根据数据库表结构定义的数据库表模型。

- **extend**

  Extend 框架扩展，开发者可以对框架内置对象进行任意扩展。

- **config**

  Config 项目和插件的配置。

# 3.定义接口

## 3.1 定义路由

路由定义了 请求路径（URL） 和 控制器（Controller） 之间的映射关系，即用户访问的地址应交由哪个控制器进行处理。

路由文件导出了一个函数，接收 app 对象作为参数，通过下面的语法定义映射关系：

```
  router.verb('path-match', controllerAction)
```

其中 verb 一般是 HTTP 动词的小写，例如：

- HEAD - router.head
- OPTIONS - router.options
- GET - router.get
- PUT - router.put
- POST - router.post
- PATCH - router.patch
- DELETE - router.delete
- router.redirect - 可以对 URL 进行重定向处理，比如我们最经常使用的可以把用户访问的根目录路由到某个主页。

```
// app/router.js
module.exports = (app) => {
  const { router, controller } = app;
  // 用户
  router.get("/api/user/query", controller.user.query); // 查询用户
  router.post("/api/user/create", controller.user.create);  // 新增用户
  router.put("/api/user/update", controller.user.update); // 修改用户
  router.delete("/api/user/delete", controller.user.delete); // 删除用户
  // 部门
  router.get("/api/department/query", controller.department.query); // 查询部门
  router.post("/api/department/create", controller.department.create);  // 新增部门
};
```

## 3.2 定义控制器

我们通过 Router 将用户的请求基于 method 和 URL 分发到了对应的 Controller 上，那 Controller 负责做什么？

简单的说 Controller 负责解析用户的输入，处理后返回相应的结果，例如

- 在 RESTful 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
- 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户
- 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。

框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 service 方法处理业务，得到业务结果后封装并返回：

- 获取用户通过 HTTP 传递过来的请求参数。
- 校验、组装参数。
- 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
- 通过 HTTP 将结果响应给用户。

所有的 Controller 文件都必须放在 app/controller 目录下，可以支持多级目录，访问的时候可以通过目录名级联访问。Controller 支持多种形式进行编写，可以根据不同的项目场景和开发习惯来选择。

Controller 类（推荐）

我们可以通过定义 Controller 类的方式来编写代码：

```
// app/controller/user.js
const Controller = require("egg").Controller;
/**
 * @controller 成员 member
 */
class UserController extends Controller {
  /**
   * @summary 查询用户
   * @router get /api/user/query
   * @request query string userName 成员姓名
   * @request query string phone 手机号
   * @request query string departmentId 部门id
   * @request query string email 邮箱
   * @request query number *currentPage 当前页
   * @request query number *pageSize 当前页条数
   * @response 200 queryUserResponse 查询成功
   */
  async query() {
    const { ctx } = this;
    ctx.validate(ctx.rule.queryUserRequest, ctx.query);
    const res = await ctx.service.user.query(ctx.query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }
}
```

## 3.3 定义约束文件

## 3.配置 egg-swagger-doc

## 4.接口调试工具 Apifox

# 4.处理全局请求

## 1.配置异常中间件

## 2.统一返回结构

# 5.操作数据库

## 1.创建数据库表

## 2.sequelize

### 1.定义 Model

### 2.基本查询

### 3.事务

# 6.开源项目
