"use strict";
module.exports = (app) => {
  const Sequelize = app.Sequelize;

  const department = app.model.define(
    "members",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      departmentsId: { type: Sequelize.INTEGER },
      name: Sequelize.STRING(60),
      email: Sequelize.STRING(60),
      state: Sequelize.BOOLEAN,
      phone: Sequelize.STRING(15),
    },
    {
      timestamps: true,
    }
  );
  department.associate = function (models) {
    // associations can be defined here
  };
  return department;
};
