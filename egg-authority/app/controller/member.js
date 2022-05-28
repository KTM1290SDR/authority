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
   * @request query string department 部门id
   * @request query string memberGroup 成员分组
   * @request query string email 邮箱
   * @request query number *currentPage 当前页
   * @request query number *pageSize 当前页条数
   * @response 200 queryMemberResponse 查询成功
   */
  query() {
    const { ctx } = this;
    ctx.validate(ctx.rule.queryMembeRequest, ctx.query);
  }
  /**
   * @summary 查询单个成员
   * @router get /api/member/queryItem
   * @request query number *id 成员id
   * @response 200 queryMemberItemResponse 查询成功
   */
  queryItem() {
    const { ctx } = this;
    ctx.validate(ctx.rule.queryMembeRequest, ctx.query);
  }
  /**
   * @summary 新增成员
   * @router post /api/member/add
   * @request body createMembeRequest *body
   * @response 200 baseRequest 查询成功
   */
  create() {
    const { ctx } = this;
    ctx.validate(ctx.rule.createMembeRequest, ctx.request.body);
  }
  /**
   * @summary 更新成员
   * @router put /api/member/update
   * @request body updateMembeRequest *body
   * @response 200 baseRequest 查询成功
   */
  update() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateMembeRequest, ctx.request.body);
  }
  /**
   * @summary 删除成员
   * @router delete /api/member/delete
   * @request body deleteMembeRequest *body
   * @response 200 baseRequest 查询成功
   */
  delete() {
    const { ctx } = this;
    ctx.validate(ctx.rule.deleteMembeRequest, ctx.request.body);
  }
  /**
   * @summary 更新成员启用状态
   * @router put /api/member/updateState
   * @request body updateMembeStateRequest *body
   * @response 200 baseRequest 查询成功
   */
  updateState() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateMembeRequest, ctx.request.body);
  }
  /**
   * @summary 更新成员部门
   * @router put /api/member/updateDepartment
   * @request body updateDepartmentRequest *body
   * @response 200 baseRequest 查询成功
   */
  updateDepartment() {
    const { ctx } = this;
    ctx.validate(ctx.rule.updateDepartmentRequest, ctx.request.body);
  }

}
module.exports = MemberController;
