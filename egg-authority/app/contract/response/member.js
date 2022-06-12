"use strict";

const { baseResponse } = require("./base");

module.exports = {
  // 查询成员列表
  queryMemberResponse: {
    ...baseResponse,
    data: {
      type: "pageList",
    },
  },
  // 查询单个成员
  queryMemberItemResponse: {
    ...baseResponse,
    data: { type: "member", required: true },
  },
  // 分页
  pageList: {
    list: {
      type: "array",
      itemType: "member",
    },
    total: {
      type: "number",
      required: true,
    },
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
    inductionDate: {
      type: "string",
      required: true,
      description: "入职时间",
      trim: true,
    },
    email: {
      type: "string",
      required: true,
      format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      description: "邮箱",
      trim: true,
    },
    departmentId: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "部门id",
    },
    departmentName: {
      type: "string",
      description: "部门名字",
    },
    state: {
      type: "boolean",
      required: true,
      description: "启用状态",
    },
  },
};
