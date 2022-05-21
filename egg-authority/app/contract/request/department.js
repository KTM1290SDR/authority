"use strict";
module.exports = {
  // 删除部门
  deleteDepartmentRequest: {
    ids: {
      type: "array",
      itemType: "string",
      required: true,
      description: "部门id列表",
    },
  },
  // 新增部门
  createDepartmentRequest: {
    id: {
      type: "string",
      required: true,
      format: /^[0-9]{1,9}$/,
      description: "父级部门id",
    },
    departmentName: {
      type: "string",
      min: 1,
      max: 10,
      required: true,
      description: "部门名称",
      trim: true,
    },
  },
};
