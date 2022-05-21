"use strict";
module.exports = {
  baseRequest: {
    code: { type: "number", required: true, default: 200 },
    msg: { type: "string", required: true, default: "请求成功" },
  },
};
