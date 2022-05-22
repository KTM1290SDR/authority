<template>
  <div class="dashboard-container content-box">
    <div class="main-card">
      <div class="dashboard-text">
        <svg-icon icon-class="egg" />
        <h1>egg.js</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss">
.dashboard {
  &-container {
    // margin: 30px;
    .dashboard-text {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      h1 {
        margin: 0;
        line-height: 1.5;
      }
      .svg-icon {
        width: 220px;
        height: auto;
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
