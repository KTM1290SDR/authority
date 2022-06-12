"use strict";
module.exports = (app) => {
  const Sequelize = app.Sequelize;

  const department = app.model.define(
    "departments",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
          return `${this.getDataValue("id")}`;
        },
      },
      name: Sequelize.STRING(60),
      parentId: Sequelize.INTEGER(11),
      sort: Sequelize.INTEGER(11),
    },
    {
      timestamps: true,
    }
  );

  department.associate = function (models) {
    // associations can be defined here
    department.hasMany(app.model.Departments, {
      foreignKey: "parentId",
      sourceKey: "id",
      as: "children",
    });
  };
  return department;
};
