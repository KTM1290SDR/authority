"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  /**
   * 接口文档
   */
  router.redirect("/", "/swagger-ui.html", 302);
  // /**
  //  * 成员
  //  */
  router.get("/api/member/query", controller.member.query);
  router.get("/api/member/queryItem", controller.member.queryItem);
  router.post("/api/member/add", controller.member.create);
  // router.post("/api/member/addImport", controller.member.import);
  router.put("/api/member/update", controller.member.update);
  router.put("/api/member/updateState", controller.member.updateState);
  router.put(
    "/api/member/updateDepartment",
    controller.member.updateDepartment
  );
  router.delete("/api/member/delete", controller.member.delete);
  // router.get(
  //   "/api/member/downloadTemplate",
  //   controller.member.downloadTemplate
  // );
  /**
   * 部门
   */
  router.get("/api/department/query", controller.department.query);
  router.post("/api/department/add", controller.department.add);
  router.delete("/api/department/delete", controller.department.delete);
};
