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

  // swaggerdoc文档配置
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
  config.onerror = {
    accepts: () => "json",
  };
  config.validate = {
    // 配置参数校验器，基于parameter
    convert: true, // 对参数可以使用convertType规则进行类型转换
    validateRoot: true, // 限制被验证值必须是一个对象。
  };
  // add your middleware config here
  // 添加中间件
  config.middleware = ["errorHandler"];
  // 只要有/api的接口都走errorHandler中间件
  config.errorHandler = {
    match: "/api",
  };
  // 用sequelize插件配置mysql数据库
  config.sequelize = {
    dialect: "mysql",
    host: "127.0.0.1",
    password: "123456",
    port: 3306,
    timezone: '+08:00',
    database: "authority",
    define: {
      raw: true,
      underscored: false,
      charset: "utf8",
      timestamp: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      // collate: 'utf8_general_ci',
    },
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
