// app/middleware/errorHandler.js

"use strict";

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
        status === 500 && app.config.env === "prod"
          ? "Internal Server Error"
          : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        msg: error,
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
        ctx.helper.body.INVALID_REQUEST({
          ctx,
          res,
          code: err.parent.errno,
          msg: "mysql执行出错！",
        });
      }
      if (status === 422) {
        ctx.helper.body.VALIDATION_FAILED({ ctx, res: err.errors });
      }
    }
  };
};
