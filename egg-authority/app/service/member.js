const Service = require("egg").Service;
const { Op } = require("sequelize");

const moment = require("moment");
class NemberService extends Service {
  async query(query) {
    const { ctx } = this;
    const {
      memberName,
      phoneNumber,
      email,
      departmentId,
      memberGroup,
      currentPage,
      pageSize,
      createdDateStart,
      createdDateEnd,
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
    let where = {
      ...ctx.helper.filterWhere(
        query,
        {
          name: {
            [Op.substring]: memberName,
          },
          email: {
            [Op.substring]: email,
          },
          phone: {
            [Op.substring]: phoneNumber,
          },
          createdAt: { [Op.between]: [createdDateStart, createdDateEnd] },
          departmentsId: departmentId,
        },
        {
          name: "memberName",
          email: "email",
          phone: "phoneNumber",
          createdAt: ["createdDateStart", "createdDateEnd"],
          departmentsId: "departmentId",
        }
      ),
      ...memberGroupList[memberGroup],
    };

    const list = await ctx.model.Members.findAll({
      limit: +pageSize,
      offset: (+currentPage - 1) * +pageSize,
      where,
      include: {
        attributes: [["name", "departmentName"]],
        model: ctx.model.Departments,
        as: "department",
      },
      order: [["createdAt", "desc"]],
      attributes: [
        ["id", "memberId"],
        ["name", "memberName"],
        ["phone", "phoneNumber"],
        "email",
        "state",
        ["createdAt", "inductionDate"],
        ["departmentsId", "departmentId"],
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
    const { memberName, phoneNumber, email, departmentId } = body;
    try {
      if (!(await ctx.model.Departments.findByPk(departmentId))) {
        throw new Error("部门不存在！");
      }
      // 由于是新增操作所以走事务
      return await ctx.model.transaction(async (t) => {
        return await ctx.model.Members.create(
          {
            departmentsId: departmentId,
            name: memberName,
            email: email,
            phone: phoneNumber,
          },
          { transaction: t }
        );
      });
    } catch (error) {
      throw error;
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
      include: {
        attributes: [["name", "departmentName"]],
        model: ctx.model.Departments,
        as: "department",
      },
      attributes: [
        ["id", "memberId"],
        ["name", "memberName"],
        ["departmentsId", "departmentId"],
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
        const delCount = await ctx.model.Members.destroy({
          where: {
            id: {
              [Op.or]: ids,
            },
          },
          transaction: t,
        });
        if (delCount !== ids.length) {
          throw new Error("部分删除失败！");
        }
      });
    } catch (error) {
      throw error;
    }
  }
  // 更新成员
  async update(body) {
    const { ctx } = this;
    const { id, memberName, phoneNumber, email, departmentId } = body;
    if (await ctx.model.Departments.findByPk(departmentId)) {
      try {
        return await ctx.model.transaction(async (t) => {
          const updateCount = await ctx.model.Members.update(
            {
              name: memberName,
              departmentsId: departmentId,
              email,
              phone: phoneNumber,
            },
            {
              where: {
                id,
              },
              transaction: t,
            }
          );
          if (!updateCount[0]) {
            throw new Error("更新的成员不存在！");
          }
        });
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("部门不存在！");
    }
  }
  // 更新成员启用状态
  async updateState(body) {
    const { ctx } = this;
    const { ids, state } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        const updateCount = await ctx.model.Members.update(
          { state },
          {
            where: {
              id: {
                [Op.or]: ids,
              },
            },
            transaction: t,
          }
        );
        if (updateCount[0] !== ids.length) {
          throw new Error("部分成员更新失败！");
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // 更新成员的部门
  async updateDepartment(body) {
    const { ctx } = this;
    const { membeIds, departmentId } = body;
    if (await ctx.model.Departments.findByPk(departmentId)) {
      try {
        return await ctx.model.transaction(async (t) => {
          const updateCount = await ctx.model.Members.update(
            { departmentsId: departmentId },
            {
              where: {
                id: {
                  [Op.or]: membeIds,
                },
              },
              transaction: t,
            }
          );
          if (updateCount[0] !== membeIds.length) {
            throw new Error("部分成员更新失败！");
          }
        });
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("部门不存在！");
    }
  }
}
module.exports = NemberService;
