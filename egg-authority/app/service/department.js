const Service = require("egg").Service;

class DepartmentService extends Service {
  // 新建部门
  async create(body) {
    const { ctx } = this;
    const { id, departmentName } = body;
    // 先查询输入的父部门id是否有对应的部门
    const isHasParent = await ctx.model.Departments.findAll({ where: { id } });
    if (isHasParent.length !== 0) {
      try {
        // 由于是新增操作所以
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
        return { __code_wrong: 400 };
      }
    } else {
      return { __code_wrong: 40000 };
    }
  }
  // 删除部门
  async delete(body) {
    const { ctx } = this;
    const { id } = body;
    try {
      return await ctx.model.transaction(async (t) => {
        const delCount = await ctx.model.Departments.destroy(
          {
            where: {
              id,
            },
          },
          { transaction: t }
        );

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
          throw "部门记录不存在!";
        } else {
          return delCount;
        }
      });
    } catch (error) {
      return { __code_wrong: 400, error };
    }
  }

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
  // 查询子部门
  async queryChild(root) {
    const { ctx } = this;
    let expendPromise = [];
    root.forEach((item) => {
      expendPromise.push(
        ctx.model.Departments.findAll({
          where: {
            parentId: item.id,
          },
        })
      );
    });
    let child = await Promise.all(expendPromise);

    child.forEach(async (item, index) => {
      if (item.length > 0) {
        item = await this.queryChild(item);
      }
      root[index].children = item;
    });

    return root;
  }
}
module.exports = DepartmentService;
