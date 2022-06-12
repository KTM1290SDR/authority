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
    const res = await ctx.service.department.query();
    ctx.helper.body.SUCCESS({ ctx, res });
  }
  /**
   * @summary 新增部门
   * @router post /api/department/add
   * @request body createDepartmentRequest *body
   * @response 200 baseResponse 查询成功
   *
   */
  async add() {
    const { ctx } = this;
    ctx.validate(
      ctx.rule.createDepartmentRequest,
      ctx.helper.filterParam(ctx.request.body, ctx.rule.createDepartmentRequest)
    );
    await ctx.service.department
      .create(ctx.request.body)
      .then((res) => {
        ctx.helper.body.CREATED_UPDATE({ ctx, res: res.id });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
  /**
   * @summary 删除部门
   * @router delete /api/department/delete
   * @request body deleteDepartmentRequest *body
   * @response 200 baseResponse 查询成功
   *
   */
  async delete() {
    const { ctx } = this;
    ctx.validate(ctx.rule.deleteDepartmentRequest, ctx.query);
    await ctx.service.department
      .delete(ctx.query)
      .then((res) => {
        ctx.helper.body.NO_CONTENT({ ctx, res });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({
          ctx,
          res: err.message,
        });
      });
  }
}
module.exports = DepartmentController;
