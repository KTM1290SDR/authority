const Service = require("egg").Service;

class DepartmentService extends Service {
  // 新建部门
  async create(body) {
    const { ctx } = this;
    const { id, departmentName } = body;
    // 先查询输入的id是否有对应的部门
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
  // 查询部门
  async query() {
    const { ctx } = this;
    const root = await ctx.model.Departments.findAll({
      where: { parentId: 0 },
    });
    return await this.queryChild(root);
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
    for (let [idx, item] of child.entries()) {
      if (item.length > 0) {
        item = await this.queryChild(item);
      }
      root[idx].child = item;
    }
    return root;
  }
}
module.exports = DepartmentService;
