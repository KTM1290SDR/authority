"use strict";
module.exports = (app) => {
  const Sequelize = app.Sequelize;

  const members = app.model.define(
    "members",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
          return `${this.getDataValue("id")}`;
        },
      },
      departmentsId: { type: Sequelize.INTEGER },
      name: Sequelize.STRING(60),
      email: Sequelize.STRING(60),
      state: {
        type: Sequelize.BOOLEAN,
        get() {
          return this.getDataValue("state") ? true : false;
        },
      },
      phone: Sequelize.STRING(15),
    },
    {
      timestamps: true,
    }
  );
  members.associate = (models) => {
    // associations can be defined here
    members.hasOne(app.model.Departments, {
      foreignKey: "id",
      sourceKey: "departmentsId",
      as: "department",
    });
  };
  return members;
};
