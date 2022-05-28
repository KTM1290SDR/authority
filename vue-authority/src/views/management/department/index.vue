<template>
  <div class="department content-box">
    <div class="main-card">
      <div class="table-data">
        <div class="screen-box">
          <el-form :inline="true" :model="screenForm" size="medium ">
            <el-form-item label="姓名：">
              <el-input
                v-model="screenForm.memberName"
                maxlength="20"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <transition-group name="el-fade-in-linear">
              <template v-if="isExtendScreen">
                <el-form-item key="inductionDate" label="入职日期：">
                  <el-date-picker
                    v-model="screenForm.inductionDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item key="phoneNumber" label="手机：">
                  <el-input
                    v-model="screenForm.phoneNumber"
                    maxlength="20"
                    placeholder="请输入手机号"
                  />
                </el-form-item>
                <el-form-item key="email" label="邮箱：">
                  <el-input
                    v-model="screenForm.email"
                    maxlength="30"
                    placeholder="请输入邮箱"
                  />
                </el-form-item>
              </template>
            </transition-group>
            <el-form-item>
              <el-button type="primary" @click="onScreen">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain @click="onReset">重置</el-button>
            </el-form-item>

            <el-form-item><el-button
              type="primary"
              :icon="
                isExtendScreen ? 'el-icon-remove' : 'el-icon-circle-plus'
              "
              @click="isExtendScreen = !isExtendScreen"
            /></el-form-item>
          </el-form>
        </div>
        <div class="btn-group">
          <div class="btn-box">
            <el-button
              size="small"
              type="primary"
              @click="addMemberOpen"
            >新增成员</el-button>
          </div>
          <div class="count-box">
            <el-tag effect="dark" type="success">
              {{ curMemberGroup }}：{{ total }} 人
            </el-tag>
            <el-dropdown @command="handleCommand">
              <el-button
                size="small"
                type="primary"
                :disabled="selectionMember.length === 0"
              >
                批量操作<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item
                  command="changeState"
                >更改状态</el-dropdown-item>
                <el-dropdown-item
                  command="changeDepart"
                >更改组织架构</el-dropdown-item>
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
                <span @click="updateMemberState(scope.row)">
                  <el-switch
                    :value="scope.row.enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleMemberEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleMemberDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-box">
          <el-pagination
            background
            :current-page.sync="page.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="page.pageSize"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div class="member-group group-box">
        <h4>成员分组</h4>
        <ul>
          <li
            v-for="item in memberGroup"
            :key="item.value"
            :class="{ selected: group.memberGroup === item.value }"
            @click="selectMemberGroupHander(item)"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </li>
          <li
            v-if="group.memberGroup !== ''"
            class="cursor"
            :style="{ top: `${40 * memberGroupIndex}px` }"
          />
        </ul>
      </div>
      <div class="organization-tree group-box">
        <h4>组织架构</h4>
        <div class="tree-box">
          <el-tree
            ref="departmentTree"
            :highlight-current="true"
            :data="organizationTree"
            node-key="id"
            default-expand-all
            :props="{
              label: 'departmentName',
              value: 'id',
            }"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ node, data }"
              :class="[
                'custom-tree-node',
                { 'cur-department': data.id === group.department },
              ]"
              @click="selectCurDepartment(data.id)"
            >
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
      :before-close="enableDialogCloseHander"
    >
      <el-form ref="enableBatchForm" :model="enableBatchForm" size="small">
        <el-form-item label="启用状态：" prop="enable">
          <el-switch
            v-model="enableBatchForm.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="batchUpdateMemberState"
        >保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="480px"
      custom-class="common-dialog"
      title="更改组织架构"
      :visible.sync="changeOrganDialogVisible"
      :before-close="changeOrganDialogClosehander"
    >
      <el-form
        ref="changeOrganForm"
        :rules="rules"
        :model="changeOrganForm"
        size="small"
      >
        <el-form-item label="组织架构：" prop="department">
          <el-cascader
            v-model="changeOrganForm.department"
            :options="organizationTree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              label: 'departmentName',
              value: 'id',
            }"
            clearable
            placeholder="请选择部门"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="updateMemberDepartment"
        >保存</el-button>
      </div></el-dialog>
    <el-dialog
      width="660px"
      custom-class="common-dialog add-member-dialog"
      title="新增成员"
      :before-close="addMemberCloseHander"
      :visible.sync="addMemberDialogVisible"
    >
      <!-- <el-radio-group
        class="add-member-mode-radio"
        v-model="addMemberMode"
        size="small"
      >
        <el-radio-button :label="1">录入</el-radio-button>
        <el-radio-button :label="2">批量导入</el-radio-button>
      </el-radio-group> -->
      <el-form
        ref="addMemberForm"
        label-position="right"
        label-width="120px"
        :model="addMemberForm"
        size="small"
        :rules="rules"
      >
        <template v-if="addMemberMode === 1">
          <el-form-item label="姓名：" prop="memberName">
            <el-input
              v-model="addMemberForm.memberName"
              maxlength="20"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="手机：" prop="phoneNumber">
            <el-input
              v-model="addMemberForm.phoneNumber"
              maxlength="20"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input
              v-model="addMemberForm.email"
              maxlength="30"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item label="部门：" prop="department">
            <el-cascader
              v-model="addMemberForm.department"
              :options="organizationTree"
              :props="{
                checkStrictly: true,
                emitPath: false,
                label: 'departmentName',
                value: 'id',
              }"
              clearable
              placeholder="请选择部门"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="成员表格：" prop="memberExcel">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
            >
              <el-input
                slot="trigger"
                v-model="screenForm.memberExcelNmae"
                disabled
                placeholder="请选取文件"
              >
                <el-button
                  slot="append"
                  size="small"
                  type="primary"
                >选取文件</el-button></el-input>

              <div slot="tip" class="el-upload__tip">
                只能上传xlsx/xls文件，且不超过3mb
              </div>
            </el-upload>
            <el-button type="text">下载成员表格模板</el-button>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="addMember"
        >提交</el-button>
      </div>
    </el-dialog>
    <add-department ref="addDepartment" />
  </div>
</template>
<script>
import {
  getMemberList,
  delMember,
  updateMemberState,
  updateMemberDepartment,
  addMember
} from '@/api/member'
import { getDepartmentList, delDepartment } from '@/api/management'
import lodash from 'lodash'
import AddDepartment from '@/views/management/department/components/AddDepartment'

export default {
  name: 'Department',
  components: {
    AddDepartment
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
      tableData: [],
      // 批量启用状态表单
      enableBatchForm: {
        enable: true
      },
      // 批量变更部门表单
      changeOrganForm: {
        department: ''
      },
      // 新增成员表单
      addMemberForm: {
        // 姓名
        memberName: '',
        // 手机号
        phoneNumber: '',
        // 邮箱
        email: '',
        // 部门
        department: '',
        memberExcelNmae: ''
      },
      isExtendScreen: false,
      // 已选组
      group: {
        memberGroup: 1,
        department: ''
      },
      // 成员录入模式
      addMemberMode: 1,
      memberGroup: [
        { label: '所有成员', value: 1, icon: 'el-icon-success' },
        { label: '新加入成员', value: 2, icon: 'el-icon-circle-plus' },
        { label: '未分配部门成员', value: 3, icon: 'el-icon-warning' },
        { label: '停用成员', value: 4, icon: 'el-icon-error' }
      ],
      // 已选成员
      selectionMember: [],
      // 部门树
      organizationTree: [],
      // 筛选输入的
      screenForm: {
        memberName: '',
        phoneNumber: '',
        inductionDate: '',
        email: ''
      },
      // 筛选提交的的
      screenFormPost: {},
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      // 校验规则
      rules: {
        memberName: [{ required: true, message: '请输入姓名' }],
        phoneNumber: [{ required: true, message: '请输入手机号' }],
        email: [{ required: true, message: '请输入邮箱' }],
        department: [{ required: true, message: '请选择部门' }]
      }
    }
  },
  computed: {
    // 当前选择的部门或者分组
    curMemberGroup() {
      let memberGroup, department
      if (!this.group.department) {
        memberGroup = this.memberGroup.find(
          (item) => item.value === this.group.memberGroup
        ).label
      }
      if (!memberGroup) {
        department = this.$refs.departmentTree.getNode(this.group.department)
          .data.departmentName
      }
      return memberGroup || department
    },
    memberGroupIndex() {
      return this.memberGroup.findIndex(
        (item) => item.value === this.group.memberGroup
      )
    }
  },
  mounted() {
    this.getDepartmentList().then(this.getMemberList)
  },
  methods: {
    // 查询成员列表
    getMemberList() {
      getMemberList({
        ...this.screenFormPost,
        ...this.page,
        ...this.group
      }).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    // 获取部门树
    getDepartmentList() {
      return getDepartmentList().then((res) => {
        this.organizationTree = res.data
      })
    },
    // 计算index
    indexMethod(index) {
      const { currentPage, pageSize } = this.page
      return (currentPage - 1) * pageSize + index + 1
    },
    // 改变最大条数触发
    handleSizeChange() {
      this.getMemberList()
    },
    // 改变当前页触发
    handleCurrentChange() {
      this.getMemberList()
    },
    // 变更成员状态
    updateMemberState(item) {
      console.log(item)
      updateMemberState({ state: !item.enable, ids: [item.memberId] }).then(
        (res) => {
          this.$message({
            type: 'success',
            message: `状态变更成功！`
          })
          this.getMemberList()
        }
      )
    },

    // 批量更改状态
    batchUpdateMemberState() {
      updateMemberState({
        state: this.enableBatchForm.enable,
        ids: this.selectionMember.map((item) => item.memberId)
      }).then((res) => {
        this.$message({
          type: 'success',
          message: `状态变更成功！`
        })
        this.getMemberList()
        this.enableDialogCloseHander()
      })
    },
    // 关闭批量设置状态
    enableDialogCloseHander() {
      this.enableBatchForm = this.$options.data().enableBatchForm
      this.$refs.enableBatchForm.resetFields()
      this.enableDialogVisible = false
    },
    // 关闭新增
    addMemberCloseHander() {
      this.addMemberForm = this.$options.data().addMemberForm
      this.$refs.addMemberForm.resetFields()
      this.addMemberDialogVisible = false
    },
    // 关闭批量更改部门弹窗
    changeOrganDialogClosehander() {
      this.changeOrganForm = this.$options.data().changeOrganForm
      this.$refs.changeOrganForm.resetFields()
      this.changeOrganDialogVisible = false
    },
    // 新增成员
    addMember() {
      this.$refs.addMemberForm.validate((valid) => {
        if (valid) {
          addMember({ ...this.addMemberForm }).then((res) => {
            this.$message({
              type: 'success',
              message: `新增成员成功！`
            })
            this.addMemberCloseHander()
            this.getMemberList()
          })
        }
      })
    },
    // 批量更改部门
    updateMemberDepartment() {
      this.$refs.changeOrganForm.validate((valid) => {
        if (valid) {
          updateMemberDepartment({
            membeIds: this.selectionMember.map((item) => item.memberId),
            departId: this.changeOrganForm.department
          }).then((res) => {
            this.$message({
              type: 'success',
              message: `批量变更部门成功！`
            })
            this.changeOrganDialogClosehander()
            this.getMemberList()
          })
        }
      })
    },
    // 查询
    onScreen() {
      this.screenFormPost = lodash.cloneDeep(this.screenForm)
      this.getMemberList()
    },
    // 重置
    onReset() {
      this.screenForm = this.$options.data().screenForm
      this.screenFormPost = this.$options.data().screenFormPost
      this.getMemberList()
    },
    // 增加组织架构
    appendOrganizationHander(node, data) {
      this.$refs.addDepartment.init({ targetId: data.id })
    },
    // 删除组织架构
    removeOrganizationHander(node, data) {
      this.$confirm(
        '是否删除该部门，删除该部门后其子部门也会被删除！',
        '删除部门'
      )
        .then((action) => {
          delDepartment({ id: data.id }).then((res) => {
            this.$message({
              type: 'success',
              message: `删除成功！`
            })
          })
        })
        .catch(() => {})
    },

    // 表格多选触发
    handleSelectionChange(selection) {
      this.selectionMember = selection
    },
    // 新增成员
    addMemberOpen() {
      this.addMemberDialogVisible = true
    },
    // 编辑成员
    handleMemberEdit() {},
    // 删除成员
    handleMemberDelete(item) {
      this.$confirm('是否删除该成员！', '删除成员')
        .then((action) => {
          delMember({ ids: [item.memberId] }).then((res) => {
            this.$message({
              type: 'success',
              message: `删除成功！`
            })
          })
        })
        .catch(() => {})
    },
    // 选择成员分组
    selectMemberGroupHander(item) {
      this.group = {
        memberGroup: item.value,
        department: ''
      }
      this.getMemberList()
    },
    // 选择当前部门
    selectCurDepartment(id) {
      this.group = {
        memberGroup: '',
        department: id
      }
      this.getMemberList()
    },
    // 批量操作菜单
    handleCommand(command) {
      switch (command) {
        case 'del':
          this.$confirm('是否删除已选成员！', '批量删除成员')
            .then((action) => {
              delMember({
                ids: this.selectionMember.map((item) => item.memberId)
              }).then((res) => {
                this.$message({
                  type: 'success',
                  message: `删除成功！`
                })
                this.getMemberList()
              })
            })
            .catch(() => {})
          break
        case 'changeState':
          this.enableDialogVisible = true
          break
        case 'changeDepart':
          this.changeOrganDialogVisible = true
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss">
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
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: auto;

      .tree-box {
        margin: 10px 0;
        flex: 1;
        height: 0;
        overflow: auto;
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
            transition: all 0.3s;
            border-radius: 50px 0 0 50px;
            &.cur-department {
              background-color: #409eff;
              color: #fff;
              > span:nth-child(2) {
                > .el-button {
                  color: #fff;
                }
                > .el-button.del {
                  color: #f56c6c;
                }
              }
            }
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
