<template>
  <el-dialog
    title="新增部门"
    :visible.sync="dialogVisible"
    width="480px"
    custom-class="common-dialog add-department"
    :before-close="closeHander"
  >
    <el-form
      label-position="right"
      label-width="100px"
      ref="addFrom"
      :model="addFrom"
      size="small"
      :rules="rules"
    >
      <el-form-item label="部门名称：" prop="departmentName">
        <el-input
          v-model="addFrom.departmentName"
          placeholder="请输入部门名称"
          maxlength="20"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeHander">取 消</el-button>
      <el-button size="mini" type="primary" @click="addDepartment"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { addDepartment } from "@/api/management";

export default {
  name: "addDepartment",
  data() {
    return {
      // 父部门id
      targetId: "",
      dialogVisible: false,
      addFrom: {
        departmentName: "",
      },
      rules: {
        departmentName: [{ required: true, message: "请输入部门名称" }],
      },
    };
  },
  methods: {
    init({ targetId }) {
      this.targetId = targetId;
      this.dialogVisible = true;
    },
    addDepartment() {
      this.$refs.addFrom.validate((valid) => {
        if (valid) {
          addDepartment({ ...this.addFrom, id: this.targetId }).then((res) => {
            this.$message({
              type: "success",
              message: `新增成功！`,
            });
            this.closeHander();
          });
        }
      });
    },
    closeHander() {
      this.targetId = this.$options.data().targetId;
      this.addFrom = this.$options.data().addFrom;
      this.$refs.addFrom.resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>
