const Service = require("egg").Service;
const { Op } = require("sequelize");
const moment = require("moment");
class DepartmentService extends Service {
  async query(query) {
    const { ctx } = this;
    const {
      memberName,
      phoneNumber,
      email,
      department,
      memberGroup,
      currentPage,
      pageSize,
    } = query;
    // 成员分组
    const memberGroupList = {
      "": {},
      // 全部
      1: {},
      // 新加入成员
      2: {
        createdAt: {
          [Op.gte]: new Date(moment().startOf("day")),
        },
      },
      // 未分配部门成员
      3: { departmentsId: 0 },
      // 停用成员
      4: { state: false },
    };
    const queryMap = {
      memberName: "name",
      email: "email",
      phoneNumber: "phone",
      department: "departmentsId",
    };
    let where = {
      name: {
        [Op.substring]: memberName,
      },
      email: {
        [Op.substring]: email,
      },
      phone: {
        [Op.substring]: phoneNumber,
      },
      departmentsId: department,
      ...memberGroupList[memberGroup],
    };
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        const element = query[key];
        console.log(typeof element === 'undefined')
        if (element === "" || typeof element === 'undefined') {
          delete where[queryMap[key]];
        }
      }
    }
    console.log(where)
    const list = await ctx.model.Members.findAll({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      where,
      attributes: [
        ["id", "memberId"],
        ["name", "memberName"],
        ["phone", "phoneNumber"],
        "email",
        "state",
        ["createdAt", "inductionDate"],
        ["departmentsId", "department"],
      ],
    });
    const total = await ctx.model.Members.count({ where });
    return {
      list,
      total,
    };
  }
  // 新增成员
  async create(body) {
    const { ctx } = this;
    const { memberName, phoneNumber, email, department } = body;
    try {
      if (department && !(await ctx.model.Departments.findByPk(department))) {
        return { __code_wrong: 400, error: "已传的部门不存在！" };
      }
      // 由于是新增操作所以走事务
      return await ctx.model.transaction(async (t) => {
        return await ctx.model.Members.create(
          {
            departmentsId: department,
            name: memberName,
            email: email,
            phone: phoneNumber,
          },
          { transaction: t }
        );
      });
    } catch (error) {
      return { __code_wrong: 400 };
    }
  }
  // 查询单个成员
  async queryItem(query) {
    const { ctx } = this;
    const { id } = query;
    return await ctx.model.Members.findOne({
      where: {
        id,
      },
      // include: {
      //   model: ctx.model.Departments,
      //   as: "department",
      // },
      attributes: [
        ["id", "memberId"],
        ["name", "memberName"],
        ["departmentsId", "department"],
        "departmentsId",
        ["phone", "phoneNumber"],
        "state",
        "email",
        ["createdAt", "inductionDate"],
      ],
    });
  }
  //   删除成员
  async delete(body) {
    const { ctx } = this;
    const { ids } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        return await ctx.model.Members.destroy(
          {
            where: {
              id: {
                [Op.or]: ids,
              },
            },
          },
          { transaction: t }
        );
      });
    } catch (error) {
      console.log(error);
      return { __code_wrong: 400, error };
    }
  }
  // 更新成员
  async update(body) {
    const { ctx } = this;
    const { id, memberName, phoneNumber, email, department } = body;
    if (
      (await ctx.model.Departments.findByPk(department)) &&
      (await ctx.model.Members.findByPk(id))
    ) {
      try {
        return await ctx.model.transaction(async (t) => {
          return await ctx.model.Members.update(
            {
              name: memberName,
              departmentsId: department,
              email,
              phone: phoneNumber,
            },
            {
              where: {
                id,
              },
            },
            { transaction: t }
          );
        });
      } catch (error) {
        return { __code_wrong: 500, error };
      }
    } else {
      return { __code_wrong: 500, error: "部门或成员不存在" };
    }
  }
  // 更新成员启用状态
  async updateState(body) {
    const { ctx } = this;
    const { ids, state } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        return await ctx.model.Members.update(
          { state },
          {
            where: {
              id: {
                [Op.or]: ids,
              },
            },
          },
          { transaction: t }
        );
      });
    } catch (error) {
      console.log(error);
      return { __code_wrong: 400, error };
    }
  }
  // 更新成员的部门
  async updateDepartment(body) {
    const { ctx } = this;
    const { membeIds, departId } = body;
    if (await ctx.model.Departments.findByPk(departId)) {
      try {
        return await ctx.model.transaction(async (t) => {
          return await ctx.model.Members.update(
            { departmentsId: departId },
            {
              where: {
                id: {
                  [Op.or]: membeIds,
                },
              },
            },
            { transaction: t }
          );
        });
      } catch (error) {
        return { __code_wrong: 500, error };
      }
    } else {
      return { __code_wrong: 500, error: "部门不存在" };
    }
  }
}
module.exports = DepartmentService;
