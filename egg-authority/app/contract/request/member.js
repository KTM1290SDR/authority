"use strict";
const body = {
  member: {
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
    departmentId: {
      type: "number",
      required: false,
      description: "部门id",
    },
  },
};

module.exports = {
  // 查询成员
  queryMembeRequest: {
    memberName: {
      type: "string",
      required: false,
      min: 2,
      max: 5,
      description: "成员姓名",
      trim: true,
    },
    phoneNumber: {
      type: "string",
      format: /^1[34578]\d{9}$/,
      required: false,
      description: "手机号",
      trim: true,
    },
    email: {
      type: "string",
      required: false,
      format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      description: "邮箱",
      trim: true,
    },
    departmentId: {
      type: "number",
      required: false,
      description: "部门id",
    },
    createdDateStart: {
      type: "string",
      description: "入职开始时间",
      trim: true,
      required: false,
    },
    createdDateEnd: {
      type: "string",
      description: "入职结束时间",
      trim: true,
      required: false,
    },
    memberGroup: {
      type: "number",
      description: "成员分组",
      required: false,
    },
    currentPage: {
      type: "number",
      required: true,
      description: "当前页",
    },
    pageSize: {
      type: "number",
      required: true,
      description: "当前页条数",
    },
  },
  // 查询单个成员
  queryMemberItemRequest: {
    id: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "成员id",
    },
  },
  // 新增成员
  createMemberRequest: {
    ...body.member,
  },
  // 编辑成员
  updateMemberRequest: {
    id: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "成员id",
    },
    ...body.member,
  },
  // 删除成员
  deleteMemberRequest: {
    ids: {
      type: "array",
      itemType: "string",
      required: true,
      description: "成员id数组",
    },
  },
  // 更新成员状态
  updateMemberStateRequest: {
    ids: {
      type: "array",
      itemType: "string",
      required: true,
      description: "成员id数组",
    },
    state: {
      type: "boolean",
      required: true,
      description: "需要设置的状态",
    },
  },
  // 更新成员部门
  updateDepartmentRequest: {
    membeIds: {
      type: "array",
      itemType: "string",
      required: true,
      description: "成员id数组",
    },
    departmentId: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "成员更换到的部门",
    },
  },
};
