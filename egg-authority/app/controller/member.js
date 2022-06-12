"use strict";
const Controller = require("egg").Controller;
/**
 * @controller 成员 member
 */

class MemberController extends Controller {
  /**
   * @summary 查询成员
   * @router get /api/member/query
   * @request query string memberName 成员姓名
   * @request query string phoneNumber 手机号
   * @request query string departmentId 部门id
   * @request query string memberGroup 成员分组
   * @request query string createdDateStart 入职开始时间
   * @request query string createdDateEnd 入职结束时间
   * @request query string email 邮箱
   * @request query number *currentPage 当前页
   * @request query number *pageSize 当前页条数
   * @response 200 queryMemberResponse 查询成功
   */
  async query() {
    const { ctx } = this;
    ctx.validate(
      ctx.rule.queryMembeRequest,
      ctx.helper.filterParam(ctx.query, ctx.rule.queryMembeRequest)
    );
    const res = await ctx.service.member.query(ctx.query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }
  /**
   * @summary 查询单个成员
   * @router get /api/member/queryItem
   * @request query number *id 成员id
   * @response 200 queryMemberItemResponse 查询成功
   */
  async queryItem() {
    const { ctx } = this;
    ctx.validate(ctx.rule.queryMemberItemRequest, ctx.query);
    const res = await ctx.service.member.queryItem(ctx.query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }
  /**
   * @summary 新增成员
   * @router post /api/member/add
   * @request body createMemberRequest *body
   * @response 200 baseResponse 查询成功
   */
  async create() {
    const { ctx } = this;
    ctx.validate(ctx.rule.createMemberRequest, ctx.request.body);
    await ctx.service.member
      .create(ctx.request.body)
      .then((res) => {
        ctx.helper.body.CREATED_UPDATE({ ctx, res: res.id });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
  /**
   * @summary 更新成员
   * @router put /api/member/update
   * @request body updateMemberRequest *body
   * @response 200 baseResponse 查询成功
   */
  async update() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateMemberRequest, ctx.request.body);
    await ctx.service.member
      .update(ctx.request.body)
      .then((res) => {
        ctx.helper.body.CREATED_UPDATE({ ctx, res });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
  /**
   * @summary 删除成员
   * @router delete /api/member/delete
   * @request body deleteMemberRequest *body
   * @response 200 baseResponse 查询成功
   */
  async delete() {
    const { ctx } = this;
    ctx.validate(ctx.rule.deleteMemberRequest, ctx.request.body);
    await ctx.service.member
      .delete(ctx.request.body)
      .then((res) => {
        ctx.helper.body.NO_CONTENT({ ctx, res });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
  /**
   * @summary 更新成员启用状态
   * @router put /api/member/updateState
   * @request body updateMemberStateRequest *body
   * @response 200 baseResponse 查询成功
   */
  async updateState() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateMemberStateRequest, ctx.request.body);
    const res = await ctx.service.member
      .updateState(ctx.request.body)
      .then((res) => {
        ctx.helper.body.CREATED_UPDATE({ ctx, res });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
  /**
   * @summary 更新成员部门
   * @router put /api/member/updateDepartment
   * @request body updateDepartmentRequest *body
   * @response 200 baseResponse 查询成功
   */
  async updateDepartment() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateDepartmentRequest, ctx.request.body);
    await ctx.service.member
      .updateDepartment(ctx.request.body)
      .then((res) => {
        ctx.helper.body.CREATED_UPDATE({ ctx, res });
      })
      .catch((err) => {
        ctx.helper.body.INVALID_REQUEST({ ctx, res: err.message });
      });
  }
}
module.exports = MemberController;
