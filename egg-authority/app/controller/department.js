"use strict";
const Controller = require("egg").Controller;
/**
 * @controller 部门 department
 */
class DepartmentController extends Controller {
  /**
   * @summary 查询部门
   * @router get /api/department/query
   * @response 200 queryDepartmentResponse 查询成功
   */
  async query() {
    const { ctx } = this;
  }
  /**
   * @summary 新增部门
   * @router post /api/department/add
   * @request body createDepartmentRequest *body
   * @response 200 baseRequest 查询成功
   *
   */
  async add() {
    const { ctx } = this;
    ctx.validate(ctx.rule.createDepartmentRequest, ctx.request.body);
  }
  /**
   * @summary 删除部门
   * @router delete /api/department/delete
   * @request body deleteDepartmentRequest *body
   * @response 200 baseRequest 查询成功
   *
   */
  async delete() {
    const { ctx } = this;
    ctx.validate(ctx.rule.deleteDepartmentRequest, ctx.request.body);
  }
}
module.exports = DepartmentController;
