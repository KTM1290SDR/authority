import request from '@/utils/request'
const serviceApi = process.env.VUE_APP_APIFOX_MOCK_API

// 获取成员
export const getMemberList = (params) => {
  return request({
    url: `${serviceApi}/api/member/query`,
    method: 'get',
    params
  })
}

// 删除成员
export const delMember = (params) => {
  return request({
    url: `${serviceApi}/api/member/delete`,
    method: 'delete',
    params
  })
}

// 变更成员状态
export const updateMemberState = (data) => {
  return request({
    url: `${serviceApi}/api/member/updateState`,
    method: 'put',
    data
  })
}

// 变更成员部门
export const updateMemberDepartment = (data) => {
  return request({
    url: `${serviceApi}/api/member/updateDepartment`,
    method: 'put',
    data
  })
}

// 变更成员部门
export const addMember = (data) => {
  return request({
    url: `${serviceApi}/api/member/add`,
    method: 'post',
    data
  })
}
