# 1.Egg.js 介绍

- 1.1 介绍

Egg 是阿里出品的一款 node.js 后端 web 框架，基于 koa 封装，并做了一些约定。

- 1.2 优点

Egg 奉行『约定优于配置』，按照一套统一的约定进行应用开发，团队内部采用这种方式可以减少开发人员的学习成本，开发人员不再是『钉子』，可以流动起来。没有约定的团队，沟通成本是非常高的，比如有人会按目录分栈而其他人按目录分功能，开发者认知不一致很容易犯错。但约定不等于扩展性差，相反 Egg 有很高的扩展性，可以按照团队的约定定制框架。

- 1.3 官网

[Egg.js](https://www.eggjs.org/zh-CN)

# 2.脚手架搭建

## 1.创建 simple 模板的脚手架

在一个空文件夹内初始化简单 egg 应用程序骨架。

```
npm init egg --type=simple
npm i
npm run dev
```

## 2.目录结构

```
egg-project
├── package.json
├── app
|   ├── router.js
│   ├── controller
│   │   ├── department.js
│   |   └── user.js
│   ├── service (可选)
│   │   ├── department.js
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── errorHandler.js
│   ├── contract (可选)
│   |   ├── request (可选)
│   |   │   ├──department.js
│   |   |   └── user.js
│   |   └── response (可选)

│   ├── model (可选)
│   │   ├── department.js
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
├── database
|   └── base.sql (可选)
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

- **database**

  数据库迁移文件。

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
  router.delete("/api/department/delete", controller.department.delete);  // 删除部门
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

所有的 Controller 文件都必须放在 app/controller 目录下，可以支持多级目录，访问的时候可以通过目录名级联访问。Controller 支持多种形式进行编写，可以根据不同的项目场景和开发习惯来选择。官方更推荐使用通过定义 Controller 类的方式来编写代码：

下面以 UserController 为例

```
// app/controller/user.js
const Controller = require("egg").Controller;
class UserController extends Controller {
  async query() {
    const { ctx } = this;
    ctx.validate(ctx.rule.queryUserRequest, ctx.query); // 校验请求参数
    const res = await ctx.service.user.query(ctx.query); // 执行Service查询数据
    ctx.helper.body.SUCCESS({ ctx, res });  // 整理数据格式返回
  }
}
module.exports = UserController;
```

## 3.3 定义约束

### 3.3.1 egg-validate 参数校验插件

egg-validate 用于对参数进行校验

```
npm i egg-validate --save
```

- 开启插件

```
// config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
```

- 配置插件

```
// config/config.default.js
config.validate = {
  // 配置参数校验器，基于parameter
  convert: true, // 对参数可以使用convertType规则进行类型转换
  validateRoot: true, // 限制被验证值必须是一个对象。
};
```

## 3.3.2 配置 [egg-swagger-doc](https://github.com/beansmile/egg-swagger-doc)

egg-swagger-doc 可以根据代码中的固定格式的注解自动生成接口文档。

安装

```
npm i egg-swagger-doc-feat --save
```

- 开启插件

```
// config/plugin.js
exports.swaggerdoc = {
  enable: true,
  package: 'egg-swagger-doc-feat',
};
```

- [配置插件](https://github.com/beansmile/egg-swagger-doc/blob/master/config/config.default.js)

```
// config/config.default.js
config.swaggerdoc = {
  dirScanner: './app/controller', // 插件扫描的文档路径
  apiInfo: {
    title: 'egg-swagger',
    description: 'swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'], // 访问地址协议http或者https
  consumes: ['application/json'],
  produces: ['application/json'],
  routerMap: false,
  enable: true,
};

```

在路由中定义重定向默认定向到 [swagger 文档页](http://127.0.0.1:7001)

```
// app/router.js
router.redirect('/', '/swagger-ui.html', 302);
```

在 controller 文件中增加注解使 egg-swagger-doc-feat 可以扫描产生接口文档。注解详情查考[文档](https://www.npmjs.com/package/egg-swagger-doc)。

- 定义接口参数

```
// app/controller/user.js
const Controller = require("egg").Controller;
/**
 * @controller 用户 user
 */
class UserController extends Controller {
  /**
   * @summary 查询用户
   * @router get /api/user/query
   * @request query string userName 用户姓名
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
module.exports = UserController;
```

## 3.3.3 定义约束规则

在 controller 写好注解后，需要在 contract 目录下创建对应的同名 js 文件。框架会把 contract 目录下的文件解析并挂载到 ctx.rule 下。约束规则详见[文档](https://www.npmjs.com/package/egg-swagger-doc)

- 定义请求规则

```
// app/contract/request/user.js

'use strict';
module.exports = {
  // 查询用户
  queryUserRequest: {
    userName: {
      type: 'string',
      description: '用户姓名',
      trim: true,
      required: false,
    },
    phone: {
      type: 'string',
      description: '手机号',
      trim: true,
      required: false,
    },
    email: {
      type: 'string',
      description: '邮箱',
      trim: true,
      required: false,
    },
    departmentId: {
      type: 'string',
      description: '部门id',
      trim: true,
      required: false,
    },
    createStartTime: {
      type: 'string',
      description: '创建开始时间',
      trim: true,
      required: false,
    },
    createEndTime: {
      type: 'string',
      description: '创建结束时间',
      trim: true,
      required: false,
    },
    currentPage: {
      type: 'number',
      description: '当前页',
    },
    pageSize: {
      type: 'number',
      description: '每页条数',
    },
  },
};

```

- 定义响应规则

```
// app/contract/response/user.js

'use strict';
const { baseResponse } = require('./base');

module.exports = {
  // 查询用户
  queryUserResponse: {
    ...baseResponse('userPageList'),
  },
  // 用户分页
  userPageList: {
    total: {
      type: 'number',
      description: '总数',
    },
    list: {
      type: 'array',
      itemType: 'user',
      description: '记录',
    },
  },
  // 用户数据模型
  user: {
    id: {
      type: 'string',
      description: '用户id',
    },
    userName: {
      type: 'string',
      description: '用户姓名',
    },
    phone: {
      type: 'string',
      description: '手机号',
    },
    email: {
      type: 'string',
      description: '邮箱',
    },
    departmentName: {
      type: 'string',
      description: '部门名称',
    },
  },
};


```

```
// app/contract/response/base.js

'use strict';
module.exports = {
  baseResponse: (dataType) => {
    return {
      code: {
        type: 'number',
        example: 200,
      },
      msg: {
        type: 'string',
        example: "成功",
      },
      data: {
        type: dataType,
      },
    };
  },
};

```

## 3.4 接口调试工具 [Apifox](https://www.apifox.cn/)

在以上的教程中，接口的定义已经告一段落了。可以使用接口调试工具 Apifox 生成 mock 数据供前端使用。接下来只需要专注实现接口即可。具体配置流程详见[文档](https://www.apifox.cn/help/app/import/swagger/#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)

Apifox 除了可以生成 mock 数据外也可以发送请求调试接口。以/api/user/query 为例。可以验证刚刚配置的约束是否生效。

# 4.处理全局请求

## 4.1 统一返回结构

- [框架扩展](https://www.eggjs.org/zh-CN/basics/extend)

框架提供了多种扩展点扩展自身的功能：

- Application
- Context
- Request
- Response
- Helper

### Helper

Helper 函数用来提供一些实用的 utility 函数。

它的作用在于我们可以将一些常用的动作抽离在 helper.js 里面成为一个独立的函数，这样可以用 JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有一个好处是 Helper 这样一个简单的函数，可以让我们更容易编写测试用例。

框架内置了一些常用的 Helper 函数。我们也可以编写自定义的 Helper 函数。

### 扩展方式

框架会把 app/extend/helper.js 中定义的对象与内置 helper 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 helper 对象。

例如，增加一系列整理格式方法方法：

```
// app/extend/helper.js

"use strict";
module.exports.body = {
  // [GET]：服务器成功返回用户请求的数据
  SUCCESS({ ctx, res = null, msg = "请求成功", code = 200 }) {
    ctx.body = {
      code,
      data: res,
      msg,
    };
  },
  // [POST/PUT/PATCH]：用户新建或修改数据成功。
  CREATED_UPDATE({ ctx, res = null, msg = "新建或修改数据成功" }) {
    ctx.body = {
      code: 201,
      data: res,
      msg,
    };
  },
  /*
   * @description [DELETE]：用户删除数据成功。
   */
  NO_CONTENT({ ctx, res = null, msg = "删除数据成功" }) {
    ctx.body = {
      code: 204,
      data: res,
      msg,
    };
  },
  // [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作
  INVALID_REQUEST({
    ctx,
    res = null,
    msg = "请求有错误，服务器没有进行新建、修改、删除数据的操作",
    code = 400,
    status = 400,
  }) {
    ctx.body = {
      code,
      data: res,
      msg,
    };
    ctx.status = status;
  },
  // [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作
  NOT_FOUND({ ctx, res = null, msg = "资源未找到", status = 200 }) {
    ctx.body = {
      code: 404,
      data: res,
      msg,
    };
    ctx.status = status;
  },
  // [*] 参数发生验证错误。
  VALIDATION_FAILED({ ctx, res = null, msg = "参数发生验证错误" }) {
    ctx.body = {
      code: 422,
      data: res,
      msg,
    };
  },
};

```

- 扩展使用

通过 ctx.helper 访问到 helper 对象，例如需要在 app/controller/user.js 中使用 SUCCESS 整理格式：

```
// app/controller/user.js

// 使用 helper 中的SUCCESS处理返回数据
ctx.helper.body.SUCCESS({ ctx, res });
```

## 4.2 处理异常

得益于框架支持的异步编程模型，错误完全可以用 try catch 来捕获。在编写应用代码时，所有地方都可以直接用 try catch 来捕获异常。框架也会在最外层通过 try catch 统一捕获错误。为了保证异常可追踪，必须保证所有抛出的异常都是 Error 类型，因为只有 Error 类型才会带上堆栈信息，定位到问题。

### 4.2.1 配置 onerror 插件

框架通过 onerror 插件提供了统一的错误处理机制。对一个请求的所有处理方法（Middleware、Controller、Service）中抛出的任何异常都会被它捕获，并自动根据请求想要获取的类型返回不同类型的错误（基于 Content Negotiation）。我们希望得到的是 RESTful API 风格，也就是说我们希望得到的是 JSON 格式的返回。需要在 config 文件中配置 onerror 插件。

```
// config/config.default.js
config.exports = {
  onerror: {
    accepts: () => 'json',
  },
};
```

框架并不会将服务端返回的 404 状态当做异常来处理，但是框架提供了当响应为 404 且没有返回 body 时的默认响应。

- 当请求被框架判定为需要 JSON 格式的响应时，会返回一段 JSON：

```
{ "message": "Not Found" }
```

- 当请求被框架判定为需要 HTML 格式的响应时，会返回一段 HTML：

```
<h1>404 Not Found</h1>
```

### 4.2.2 配置处理异常中间件

- 中间件

匹配路由前、匹配路由完成做的一系列的操作。 Egg 是基于 Koa 实现的，所以 Egg 的中间件形式和 Koa 的中间件形式是一样的，都是基于洋葱圈模型。所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势。

- 编写异常处理中间件

正常的业务逻辑已经正常完成了，但是异常我们还没有进行处理。在前面编写的代码中，Controller 和 Service 都有可能抛出异常，这也是我们推荐的编码方式，当发现客户端参数传递错误或者调用后端服务异常时，通过抛出异常的方式来进行中断。

- Controller 中 this.ctx.validate() 进行参数校验，失败抛出异常。
- Service 中调用 this.ctx.curl() 方法访问 CNode 服务，可能由于网络问题等原因抛出服务端异常。
- Service 中拿到 CNode 服务端返回的结果后，可能会收到请求调用失败的返回结果，此时也会抛出异常。

框架虽然提供了默认的异常处理，但是可能和我们在前面的接口约定不一致，因此我们需要自己实现一个统一错误处理的中间件来对错误进行处理。

在 app/middleware 目录下新建一个 errorHandler.js 的文件来新建一个 middleware

```
// app/middleware/errorHandler.js

'use strict';

module.exports = (option, app) => {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.helper.body.NOT_FOUND({ ctx });
      }
    } catch (err) {
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        // code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        error,
      };
      ctx.status = status;
      /**
       * 参数错误，mysql返回的错误处理
       */
      if (err.parent && err.parent.errno) {
        const res = {
          error,
          detail: err.errors,
        };
        ctx.helper.body.INVALID_REQUEST({ ctx, res, code: err.parent.errno });
      }
      if (status === 422) {
        const res = {
          error,
          detail: err.errors,
          code: 422,
        };
        ctx.helper.body.VALIDATION_FAILED({ ctx, res });
      }
    }
  };
};

```

- 添加中间件

```
// config/config.default.js
config.middleware = ["errorHandler"];

// 指定路由接口开启中间件
config.errorHandler = {
  match: "/api",
};
```

# 5.操作数据库

## 5.1 创建数据库表

```
-- database/base.sql

-- 新建部门表
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
    `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '部门名称',
    `createdDate` datetime(0) NOT NULL COMMENT '创建时间',
    `updatedDate` datetime(0) NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1000001 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `departments` VALUES (1000000, '总公司', now(), now());

-- 新建用户表
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
    `departmentId` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '所在部门id',
    `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '成员名称',
    `email` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
    `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
    `createdDate` datetime(0) NOT NULL COMMENT '创建时间',
    `updatedDate` datetime(0) NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1000001 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;
```

## 5.2 [sequelize](https://www.sequelize.com.cn/)

Sequelize 是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。

Sequelize 遵从 语义版本控制。 支持 Node v10 及更高版本以便使用 ES6 功能。

### 5.2.1 安装并配置 sequelize

- 安装

```
npm install --save egg-sequelize mysql2
```

- 开启插件

```
// config/plugin.js
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

```

- 配置插件

```
// config/config.default

exports.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  password: '123456',
  database: 'my_egg',
  timezone: '+08:00',
  define: {
    raw: true,
    underscored: false,
    charset: 'utf8',
    timestamp: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
    deletedAt: 'deletedDate',
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
};
```

### 5.2.2 定义 Model

模型是 Sequelize 的本质. 模型是代表数据库中表的抽象. 在 Sequelize 中,它是一个 Model 的扩展类.

该模型告诉 Sequelize 有关它代表的实体的几件事,例如数据库中表的名称以及它具有的列(及其数据类型).

Sequelize 中的模型有一个名称. 此名称不必与它在数据库中表示的表的名称相同. 通常,模型具有单数名称(例如,User),而表具有复数名称(例如, Users),当然这是完全可配置的.

定义模型时主要参考建表的 sql，是一个把 sql 对象化的过程。

- 定义用户模型

```
// app/model/users.js

'use strict';
module.exports = (app) => {
  const Sequelize = app.Sequelize;

  const users = app.model.define('users', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    departmentId: { type: Sequelize.INTEGER },
    name: Sequelize.STRING(60),
    email: Sequelize.STRING(60),
    phone: Sequelize.STRING(15),
  });
  users.associate = (models) => {
    // 定义与部门模型的关联
    users.hasOne(app.model.Departments, {
      foreignKey: 'id',
      sourceKey: 'departmentId',
      as: 'department',
    });
  };
  return users;
};

```

- 定义部门模型

```
// app/model/departments.js
'use strict';
module.exports = (app) => {
  const Sequelize = app.Sequelize;

  const departments = app.model.define('departments', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING(60),
  });

  return departments;
};

```

## 5.3 编写 Service 实现基本查询

### 5.3.1 Service

简单来说，Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层，提供这个象有以下几个好处：

- 保持 Controller 中的逻辑更加简洁。
- 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
- 将逻辑和展现分离，更容易编写测试用例。

使用场景

- 复杂数据的处理，比如要展现的信息需要从数据库获取，还要经过一定的规则计算，才能返回用户显示。或者计算完成后，更新到数据库。
- 第三方服务的调用，比如 GitHub 信息获取等。

Service ctx 详解

为了可以获取用户请求的链路，我们在 Service 初始化中，注入了请求上下文, 用户在方法中可以直接通过 this.ctx 来获取上下文相关信息。关于上下文的具体详解可以参看 Context, 有了 ctx 我们可以拿到框架给我们封装的各种便捷属性和方法。比如我们可以用：

- this.ctx.curl 发起网络调用。
- this.ctx.service.otherService 调用其他 Service。
- this.ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。

### 5.3.2 编写业务逻辑

- 新增部门

```
// app/service/department.js

const Service = require("egg").Service;
class DepartmentService extends Service {
  async create(body) {
    const { ctx } = this;
    const { departmentName } = body;
    const newDepartments = await ctx.model.Departments.create({
      name: departmentName,
    });
    return newDepartments.id;
  }
}
module.exports = DepartmentService;
```

- 查询用户

```
// app/service/user.js

const Service = require("egg").Service;
const { Op } = require("sequelize");
class UserService extends Service {
  async query(query) {
    const { ctx } = this;
    const {
      userName,
      phone,
      departmentId,
      email,
      createStartTime,
      createEndTime,
      currentPage,
      pageSize,
    } = query;
    const where = {
      departmentId,
      name: { [Op.substring]: userName },
      phone: { [Op.substring]: phone },
      email: { [Op.substring]: email },
      createdDate: { [Op.between]: [createStartTime, createEndTime] },
    };
    const list = await ctx.model.Members.findAll({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      where,
      include: {
        model: ctx.model.Departments.name,
        as: "departmentName",
      },
      attributes: [
        "id",
        ["name", "userName"],
        "phone",
        "email",
        ["departmentsId", "department"],
      ],
    });
    const total = await ctx.model.Users.count({ where });
    return {
      list,
      total,
    };
  }
}
module.exports = UserService;
```

## 5.4 [事务](https://www.sequelize.com.cn/other-topics/transactions)

事务是恢复和并发控制的基本单位。

事务应该具有 4 个属性：原子性、一致性、隔离性、持久性。这四个属性通常称为 ACID 特性。

> 原子性（atomicity）。一个事务是一个不可分割的工作单位，事务中包括的操作要么都做，要么都不做。

> 一致性（consistency）。事务必须是使数据库从一个一致性状态变到另一个一致性状态。一致性与原子性是密切相关的。

> 隔离性（isolation）。一个事务的执行不能被其他事务干扰。即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰。

> 持久性（durability）。持久性也称永久性（permanence），指一个事务一旦提交，它对数据库中数据的改变就应该是永久性的。接下来的其他操作或故障不应该对其有任何影响。

- 删除部门

```
// app/service/department.js

const Service = require("egg").Service;

class DepartmentService extends Service {
  async delete(body) {
    const { ctx } = this;
    const { id } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        const delCount = await ctx.model.Departments.destroy(
          {
            where: {
              id,
            },
          },
          { transaction: t }
        );
        await ctx.model.Members.update(
          { departmentsId: 0 },
          {
            where: {
              departmentsId: id,
            },
          },
          { transaction: t }
        );
        if (!delCount) {
          throw new Error("部门记录不存在!");
        }
        // 如果执行到此行,则表示事务已成功提交
      });
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      return error;
    }
  }
}
module.exports = DepartmentService;
```

# 6.[Demo](https://github.com/KTM1290SDR/authority/tree/master#readme)

一般后台管理系统表格业务 demo

# 7.开源项目 beehive

- 介绍

Beehive 是一个项目管理系统。参考于 Teambetion、PearProject，实现部分功能。

这是一个 Vue+Node.js 的 js 全栈项目。基于 RBAC 模型做权限控制，动态配置菜单，前端实现页面元素级别的权限控制。通过 WebSocket 实现站内信功能，任务看板中，实现更新同步推送。一旦其他项目成员有对我们当前查看的项目任务做任何的操作，页面都将立即同步更新，并向此任务的所有参与者（除了操作者）发送消息通知。注册和找回密码需要通过邮箱验证码验证，可以通过 github 授权登陆（不是很稳定）。

Node.js 框架选用的是 Egg.js，配合 sequelize，自己写了一个小工具。可以通过填写表字段的配置，执行 npm run generator-entity 自动生成一整套文件，包括 Swagger、数据校验 validate、Sequelize 需要的 model、controller、service、router。并自动创建数据库表，包括每个字段的类型、长度、是否能为空、默认值、注释、索引、甚至是外键都能搞定。因为加了权限控制，所以还要到前端的资源管理中添加一下新增的资源，并在角色中点选分配一下，就完成了一张表的 CRUD 了，包括新增、修改、详情、批量删除、分页列表。当然这还是有很多可以优化的空间的，但也基本够用了。为了优化鉴权消耗，以及满足 WebSocket 的可靠性设计需要，系统引入 Redis 做缓存。

密码是加盐存储的，且在传输过程中使用了 RSA 做了非对称加密。Jwt 认证使用 Access Token + Refresh Token，配合黑名单。

- [前端地址](https://github.com/Imfdj/vue-beehive)

- [后端地址](https://github.com/Imfdj/egg-beehive)
