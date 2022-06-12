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
      code: 200,
      data: res,
      msg,
    };
  },
  /*
   * @description [DELETE]：用户删除数据成功。
   */
  NO_CONTENT({ ctx, res = null, msg = "删除数据成功" }) {
    ctx.body = {
      code: 200,
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
/**
 * filterParam请求根据rule处理query值
 * @param param 原请求参数
 * @param rule 规则
 * @return Object
 */
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
  console.log(filterParam);
  return filterParam;
};
/**
 * filterWhere整理where条件
 * @param param 参数
 * @param where 条件
 * @param whereMapParam 条件和参数映射
 * @return Object
 */
module.exports.filterWhere = (param, where, whereMapParam) => {
  console.log(where);
  for (const key in whereMapParam) {
    if (Object.hasOwnProperty.call(whereMapParam, key)) {
      // 获取where需要的参数
      const paramItem = param[whereMapParam[key]];
      if (
        Object.prototype.toString.call(whereMapParam[key]) === "[object Array]"
      ) {
        if (whereMapParam[key].some((item) => !param[item])) {
          delete where[key];
        }
      } else if (paramItem !== 0 && !paramItem) {
        delete where[key];
      }
    }
  }
  console.log("where", where);
  return where;
};
