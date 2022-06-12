const Service = require("egg").Service;

class DepartmentService extends Service {
  // 查询部门
  async query() {
    const { ctx } = this;
    // 查找根部门
    let root = await ctx.model.Departments.findAll({
      where: { parentId: 0 },
      attributes: ["id", ["name", "departmentName"]],
      include: {
        model: ctx.model.Departments,
        as: "children",
        attributes: ["id", ["name", "departmentName"]],
        required: false,
        include: {
          all: true,
          nested: true,
          attributes: ["id", ["name", "departmentName"]],
        },
      },
    });
    return root;
    // return await this.queryChild(root);
  }
  // 新建部门
  async create(body) {
    const { ctx } = this;
    const { id, departmentName } = body;
    // 先查询输入的父部门id是否有对应的部门
    if (await ctx.model.Departments.findByPk(id)) {
      try {
        // 由于是新增操作所以执行事务
        return await ctx.model.transaction(async (t) => {
          return await ctx.model.Departments.create(
            {
              parentId: id,
              name: departmentName,
            },
            { transaction: t }
          );
        });
      } catch (error) {
        // 如果执行到此,则发生错误.
        throw error;
      }
    } else {
      throw new Error("父部门不存在！");
    }
  }
  // 删除部门
  async delete(body) {
    const { ctx } = this;
    const { id } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        // 删除部门
        const delCount = await ctx.model.Departments.destroy(
          {
            where: {
              id,
            },
          },
          { transaction: t }
        );
        // 初始化本部门下成员的部门
        await ctx.model.Members.update(
          { departmentsId: 0 },
          {
            where: {
              departmentsId: id,
            },
          },
          { transaction: t }
        );
        if (!delCount) {
          throw new Error("父部门不存在!");
        } else {
          return delCount;
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // // 查询子部门
  // async queryChild(root) {
  //   const { ctx } = this;
  //   let expendPromise = [];
  //   root.forEach((item) => {
  //     expendPromise.push(
  //       ctx.model.Departments.findAll({
  //         where: {
  //           parentId: item.id,
  //         },
  //       })
  //     );
  //   });
  //   let child = await Promise.all(expendPromise);

  //   child.forEach(async (item, index) => {
  //     if (item.length > 0) {
  //       item = await this.queryChild(item);
  //     }
  //     root[index].children = item;
  //   });

  //   return root;
  // }
}
module.exports = DepartmentService;
