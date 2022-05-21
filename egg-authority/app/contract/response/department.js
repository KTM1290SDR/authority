"use strict";
module.exports = {
  // 查询部门列表
  queryDepartmentResponse: {
    code: { type: "number", required: true, default: 200 },
    data: { type: "array", itemType: "departmentItem" },
    msg: { type: "string", required: true, default: "请求成功" },
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
  },
};
