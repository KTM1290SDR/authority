"use strict";
module.exports = {
  // 查询部门列表
  queryMembeResponse: {
    code: { type: "number", required: true, default: 200 },
    data: { type: "array", itemType: "member" },
    msg: { type: "string", required: true, default: "请求成功" },
  },
  // 查询单个成员
  queryMembeItemResponse: {
    code: { type: "number", required: true, default: 200 },
    data: { type: "member", required: true },
    msg: { type: "string", required: true, default: "请求成功" },
  },
  importMembeItemResponse: {
    code: { type: "number", required: true, default: 200 },
    data: { type: "file", required: true },
    msg: { type: "string", required: true, default: "请求成功" },
  },
  member: {
    memberId: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "成员id",
    },
    memberName: {
      type: "string",
      required: true,
      min: 2,
      max: 5,
      description: "成员姓名",
      trim: true,
    },
    phoneNumber: {
      type: "string",
      format: /^1[34578]\d{9}$/,
      required: true,
      description: "手机号",
      trim: true,
    },
    email: {
      type: "string",
      required: true,
      format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      description: "邮箱",
      trim: true,
    },
    department: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "部门id",
    },
    enable: {
      type: "boolean",
      required: true,
      description: "启用状态",
    },
  },
};
