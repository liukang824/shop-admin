<template>
    <div class="rights">
          <el-breadcrumb style="margin-bottom:10px ;" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table ref="singleTable" :data="Rights" highlight-current-row style="width: 100%">
            <el-table-column  type="index" width="50">
            </el-table-column>
            <el-table-column prop="authName" label="权限名称">
            </el-table-column>
            <el-table-column prop="path" label="路径">
            </el-table-column>
            <el-table-column prop="level"  label="层级">  
              <template slot-scope="scope">
                 <span v-if="scope.row.level==='0'">一级</span>
                 <span v-else-if="scope.row.level==='1'">二级</span>
                 <span v-else>三级</span>
               </template>
            </el-table-column>
       </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      Rights: []
    }
  },
  created() {
    this.gitRightsList()
  },
  methods: {
    async gitRightsList() {
      let res = await this.$http.get(`rights/list `)
      //   console.log(res.data, 111)

      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.Rights = data
        console.log(data)
      }
    }
  }
}
</script>

<style>
</style>
