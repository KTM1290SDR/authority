<template>
  <div class="department content-box">
    <div class="main-card">
      <div class="table-data">
        <div class="screen-box">
          <el-form :inline="true" :model="screenForm" size="medium ">
            <el-form-item label="姓名：">
              <el-input
                maxlength="20"
                v-model="screenForm.memberName"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <transition-group name="el-fade-in-linear">
              <template v-if="isExtendScreen">
                <el-form-item label="入职日期：" key="inductionDate">
                  <el-date-picker
                    v-model="screenForm.inductionDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="手机：" key="phoneNumber">
                  <el-input
                    maxlength="20"
                    v-model="screenForm.phoneNumber"
                    placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" key="email">
                  <el-input
                    maxlength="30"
                    v-model="screenForm.email"
                    placeholder="请输入邮箱"
                  ></el-input>
                </el-form-item>
              </template>
            </transition-group>
            <el-form-item>
              <el-button type="primary" @click="onScreen">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain @click="onReset">重置</el-button>
            </el-form-item>

            <el-form-item
              ><el-button
                @click="isExtendScreen = !isExtendScreen"
                type="primary"
                :icon="
                  isExtendScreen ? 'el-icon-remove' : 'el-icon-circle-plus'
                "
              ></el-button
            ></el-form-item>
          </el-form>
        </div>
        <div class="btn-group">
          <div class="btn-box">
            <el-button size="small" type="primary" @click="addMember"
              >新增成员</el-button
            >
          </div>
          <div class="count-box">
            <el-tag effect="dark" type="success">
              事业部：{{ total }} 人
            </el-tag>
            <el-dropdown @command="handleCommand">
              <el-button size="small" type="primary">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="changeState"
                  >更改状态</el-dropdown-item
                >
                <el-dropdown-item command="changeDepart"
                  >更改组织架构</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="table-box">
          <el-table
            :data="tableData"
            border
            height="100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed />
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="55"
              fixed
            />
            <el-table-column prop="memberName" label="姓名" width="120" />
            <el-table-column
              prop="inductionDate"
              label="入职日期"
              width="200"
              sortable
            />
            <el-table-column prop="phoneNumber" label="手机" width="250" />
            <el-table-column prop="email" label="邮箱" width="300" />
            <el-table-column prop="department" label="部门" width="150" />
            <el-table-column prop="enable" label="是否停用">
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleMemberEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleMemberDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="page.currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="page.pageSize"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="member-group group-box">
        <h4>成员分组</h4>
        <ul>
          <li
            :class="{ selected: group.memberGroup === item.value }"
            v-for="item in memberGroup"
            :key="item.value"
            @click="selectMemberGroupHander(item)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </li>
          <li
            class="cursor"
            :style="{ top: `${40 * memberGroupIndex}px` }"
          ></li>
        </ul>
      </div>
      <div class="organization-tree group-box">
        <h4>组织架构</h4>
        <div class="tree-box">
          <el-tree
            :highlight-current="true"
            :data="organizationTree"
            node-key="value"
            default-expand-all
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="node.level <= 3"
                  type="text"
                  size="mini"
                  class="add"
                  @click="() => appendOrganizationHander(node, data)"
                >
                  新增
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="del"
                  @click="() => removeOrganizationHander(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
    <el-dialog
      width="480px"
      title="更改启用状态"
      custom-class="common-dialog"
      :visible.sync="enableDialogVisible"
    >
      <el-form ref="enableBatchForm" :model="enableBatchForm" size="small">
        <el-form-item label="启用状态：" prop="enable">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="enableBatchForm.enable"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="480px"
      custom-class="common-dialog"
      title="更改组织架构"
      :visible.sync="changeOrganDialogVisible"
    >
      <el-form ref="changeOrganForm" :model="changeOrganForm" size="small">
        <el-form-item label="组织架构：" prop="department">
          <el-cascader
            v-model="changeOrganForm.department"
            :options="organizationTree"
            :props="{ checkStrictly: true }"
            clearable
            placeholder="请选择部门"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini">保存</el-button>
      </div></el-dialog
    >
    <el-dialog
      width="660px"
      custom-class="common-dialog add-member-dialog"
      title="新增成员"
      :visible.sync="addMemberDialogVisible"
    >
      <el-radio-group
        class="add-member-mode-radio"
        v-model="addMemberMode"
        size="small"
      >
        <el-radio-button :label="1">录入</el-radio-button>
        <el-radio-button :label="2">批量导入</el-radio-button>
      </el-radio-group>
      <el-form
        ref="addMemberForm"
        label-position="right"
        label-width="120px"
        :model="addMemberForm"
        size="small"
      >
        <template v-if="addMemberMode === 1">
          <el-form-item label="姓名：" prop="memberName">
            <el-input
              maxlength="20"
              v-model="screenForm.memberName"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="phoneNumber">
            <el-input
              maxlength="20"
              v-model="screenForm.phoneNumber"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input
              maxlength="30"
              v-model="screenForm.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="department">
            <el-cascader
              v-model="addMemberForm.department"
              :options="organizationTree"
              :props="{ checkStrictly: true }"
              clearable
              placeholder="请选择部门"
            ></el-cascader>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="成员表格：" prop="memberExcel">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
            >
              <el-input
                disabled
                slot="trigger"
                placeholder="请选取文件"
                v-model="screenForm.memberExcelNmae"
              >
                <el-button slot="append" size="small" type="primary"
                  >选取文件</el-button
                ></el-input
              >

              <div slot="tip" class="el-upload__tip">
                只能上传xlsx/xls文件，且不超过3mb
              </div>
            </el-upload>
            <el-button type="text">下载成员表格模板</el-button>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "department",
  computed: {
    memberGroupIndex() {
      return this.memberGroup.findIndex(
        (item) => item.value === this.group.memberGroup
      );
    },
  },
  data() {
    return {
      // 批量更改启用状态弹窗是否显示
      enableDialogVisible: false,
      // 批量更改组织架构弹窗是否显示
      changeOrganDialogVisible: false,
      // 新增成员弹窗是否显示
      addMemberDialogVisible: false,
      // 表格数据
      tableData: [
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: true,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
        {
          memberName: "memberName",
          inductionDate: "inductionDate",
          phoneNumber: "phoneNumber",
          email: "email",
          department: "department",
          enable: false,
        },
      ],
      // 批量启用状态表单
      enableBatchForm: {
        enable: true,
      },
      // 批量变更部门表单
      changeOrganForm: {
        department: "",
      },
      // 新增成员表单
      addMemberForm: {
        // 姓名
        memberName: "",
        // 手机号
        phoneNumber: "",
        // 邮箱
        email: "",
        // 部门
        department: "",
      },
      isExtendScreen: false,
      // 已选组
      group: {
        memberGroup: 1,
        department: "",
      },
      // 成员录入模式
      addMemberMode: 1,
      memberGroup: [
        { label: "所有成员", value: 1, icon: "el-icon-success" },
        { label: "新加入成员", value: 2, icon: "el-icon-circle-plus" },
        { label: "未分配部门成员", value: 3, icon: "el-icon-warning" },
        { label: "停用成员", value: 4, icon: "el-icon-error" },
      ],
      organizationTree: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                  children: [
                    {
                      value: "biezhi",
                      label: "别致",
                    },
                  ],
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
      ],
      screenForm: {
        memberName: "",
        phoneNumber: "",
        inductionDate: "",
        email: "",
        memberExcelNmae: "",
      },
      page: {
        currentPage: 1,
        pageSize: 100,
      },
      total: 0,
    };
  },
  methods: {
    indexMethod(index) {
      let { currentPage, pageSize } = this.page;
      return (currentPage - 1) * pageSize + index + 1;
    },
    // 改变最大条数触发
    handleSizeChange() {},
    // 改变当前页触发
    handleCurrentChange() {},
    // 查询
    onScreen() {},
    // 重置
    onReset() {},
    // 增加组织架构
    appendOrganizationHander(node, data) {
      console.log(node);
    },
    // 删除组织架构
    removeOrganizationHander(node, data) {},
    // 选择成员分组
    selectMemberGroupHander(item) {
      this.group.memberGroup = item.value;
    },
    // 表格多选触发
    handleSelectionChange() {},
    // 新增成员
    addMember() {
      this.addMemberDialogVisible = true;
    },
    // 编辑成员
    handleMemberEdit() {},
    // 删除成员
    handleMemberDelete() {},
    // 批量操作菜单
    handleCommand(command) {
      switch (command) {
        case "del":
          break;
        case "changeState":
          this.enableDialogVisible = true;
          break;
        case "changeDepart":
          this.changeOrganDialogVisible = true;

          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.content-box {
  padding: 10px;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .main-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    flex: 1;
  }
}

.department {
  .add-member-dialog {
    .el-dialog__body {
      padding: 50px 100px;
      .el-cascader {
        width: 100%;
      }
    }
    .add-member-mode-radio {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
  }
  .common-dialog {
    .el-dialog__header {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      .el-dialog__headerbtn {
        position: unset;
      }
      > span {
        font-size: 14px;
      }
    }
    .el-dialog__footer {
      padding: 10px 10px;
      border-top: 1px solid #e8e8e8;
    }
  }
  .main-card {
    display: grid;
    grid-template-columns: auto 300px;
    grid-template-rows: auto 1fr;
    gap: 10px;
    .table-data {
      grid-column: 1/1 span;
      grid-row: 1/2 span;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e8e8e8;
      padding: 0 20px 0 0;
      .btn-group {
        border-top: 1px solid #e8e8e8;
        padding: 10px 0 10px 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;

        .count-box {
          text-align: right;
          .el-tag {
            margin-right: 10px;
          }
        }
      }
      .table-box {
        flex: 1;
        position: relative;
        .el-table {
          position: absolute;
        }
      }
      .page-box {
        padding-top: 10px;
        .el-pagination {
          display: flex;
          justify-content: flex-end;
        }
      }
    }

    .member-group {
      border-bottom: 1px solid #e8e8e8;
      ul {
        padding: 0;
        margin: 0 0 10px 0;
        position: relative;
        .cursor {
          position: absolute;
          list-style: none;
          height: 40px;
          width: 100%;
          border-radius: 40px;
          background-color: #409eff;
          z-index: 1;
          top: 0;
          transform: translateY();
          transition: all 0.3s;
        }
        li.selected:not(.cursor) {
          > span,
          > i {
            color: #fff;
          }
        }
        li:not(.cursor) {
          transition: all 0.3s;
          z-index: 2;
          position: relative;
          height: 40px;
          cursor: pointer;
          list-style: none;
          padding: 0 10px;
          display: flex;
          align-items: center;
          > span {
            font-size: 12px;
            color: #333;
          }
          > i {
            color: #606266;
            font-size: 20px;
            margin-right: 10px;
          }
        }
      }
    }
    .organization-tree {
      .tree-box {
        margin: 10px 0;
        .el-tree-node:focus > .el-tree-node__content {
          background-color: transparent;
        }
        .el-tree--highlight-current
          .el-tree-node.is-current
          > .el-tree-node__content {
          background-color: transparent;
        }
        .el-tree-node__content:hover {
          background-color: #f5f7fa !important;
        }
        .el-tree-node__content {
          height: auto;
          .custom-tree-node {
            padding: 10px 10px;
            display: flex;
            align-items: center;
            width: 100%;
            > span:nth-child(1) {
              flex: 1;
              width: 0;
            }
            > span:nth-child(2) {
              > .el-button.del {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
    .group-box {
      > h4 {
        margin: 10px 0 10px 0;
        color: #606266;
        font-size: 16px;
      }
    }
  }
}
</style>
