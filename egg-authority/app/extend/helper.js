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
// 过滤参数
module.exports.filterParam = (param, rule) => {
  let filterParam = {};
  for (const key in param) {
    if (Object.hasOwnProperty.call(param, key)) {
      const element = param[key];
      const ruleItem = rule[key];
      if (!(element !== 0 && !element && ruleItem.required === false)) {
        filterParam[key] = element;
      }
    }
  }
  console.log(filterParam)
  return filterParam;
};
