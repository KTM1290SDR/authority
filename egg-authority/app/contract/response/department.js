"use strict";
const { baseResponse } = require("./base");

module.exports = {
  // 查询部门列表
  queryDepartmentResponse: {
    ...baseResponse,
    data: {
      type: "array",
      itemType: "departmentItem",
    },
  },
  // 部门
  departmentItem: {
    id: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "id 唯一键",
    },
    departmentName: {
      type: "string",
      description: "部门名字",
    },
    children: {
      type: "array",
      itemType: "departmentItem",
      description: "子部门",
    },
  },
};
