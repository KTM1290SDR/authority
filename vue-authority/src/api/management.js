import request from "@/utils/request";
const serviceApi = process.env.VUE_APP_APIFOX_MOCK_API;

// 获取部门
export const getDepartmentList = () => {
  return request({
    url: `${serviceApi}/api/department/query`,
    method: "get",
  });
};
// 删除部门
export const delDepartment = (params) => {
  return request({
    url: `${serviceApi}/api/department/delete`,
    method: "delete",
    params,
  });
};

// 新增部门
export const addDepartment = (data) => {
  return request({
    url: `${serviceApi}/api/department/add`,
    method: "post",
    data,
  });
};
