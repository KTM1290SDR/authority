/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1652622070165_6576";
  config.swaggerdoc = {
    dirScanner: "./app/controller",
    apiInfo: {
      title: "egg-swagger",
      description: "swagger-ui for egg",
      version: "1.0.0",
    },
    schemes: ["http"],
    enable: true,
    routerMap: true,
  };
  config.validate = {
    // 配置参数校验器，基于parameter
    convert: true, // 对参数可以使用convertType规则进行类型转换
    validateRoot: true, // 限制被验证值必须是一个对象。
  };
  // add your middleware config here
  config.middleware = ["errorHandler"];
  config.errorHandler = {
    match: "/api",
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
