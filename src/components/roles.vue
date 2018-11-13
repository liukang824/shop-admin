<template>
    <div class="roles">
        <el-breadcrumb style="margin-bottom:10px ;" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="success" plain>添加角色</el-button>
        
        <el-table :data="RolesList" style="width: 100%" type="expand">
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <!-- 一级权限 -->
                  <el-row v-for="level1 in scope.row.children" :key="level1.id">
                    <el-col :span="4">
                        <el-tag  closable @close="delRights(scope.row,level1.id)" >{{level1.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <!-- 二级权限 -->
                        <el-row v-for="level2 in level1.children" :key="level2.id"  class="level2">
                            <el-col :span="4">
                                <el-tag type="success" closable @close="delRights(scope.row,level2.id)">{{level2.authName}}</el-tag>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="20" >
                                <el-tag type="danger" class="level3" closable v-for="level3 in level2.children" :key="level3.id" @close="delRights(scope.row,level3.id)">{{level3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                  </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作">
               <template slot-scope="scope">
                   <el-button size="small" plain type="primary" icon="el-icon-edit" >编辑  </el-button>
                   <el-button size="small" plain type="danger" icon="el-icon-delete">删除    </el-button>
                   <el-button size="small" plain type="success" icon="el-icon-check" 
                   @click="Rightassign(scope.row)">分配权限 </el-button>
                   <!-- {{scope.row}} -->
               </template>
            </el-table-column>
        </el-table>


        <el-dialog title="权限分配" :visible.sync="assign" width="40%">
            <el-tree
            :data="RightsList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
          
            :props="defaultProps">

            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assign = false">取 消</el-button>
                <el-button type="primary" @click="assignRight" >确定</el-button>
            </div>
     </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      RightsList: [],
      assign: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleid: ''
    }
  },
  created() {
    this.gitRolesList()
  },
  methods: {
    //  权限列表
    async gitRolesList() {
      let res = await this.$http.get(`roles`)
      console.log(res.data)

      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.RolesList = data
      }
    },
    // 显示分配权限
    Rightassign(role) {
      this.roleid = role.id
      this.getRightsList()
      this.assign = true
      //   console.log(role)
      this.$nextTick(() => {
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        //   设置选中的状态
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight() {
      // 先得到所有选中的id值
      let checked = this.$refs.tree.getCheckedKeys()
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      let add = [...checked, ...halfChecked]
      //    发送请求
      let res = await this.$http.post(`roles/${this.roleid}/rights`, {
        rids: add.join()
      })
      const {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.assign = false
        this.$message({
          message: '分配权限成功',
          type: 'success'
        })
        this.gitRolesList()
      }
    },
    // 删除权限
    async delRights(role, roleid) {
      //   console.log(roles)
      let res = await this.$http.delete(`roles/${role.id}/rights/${roleid}`)
      //   console.log(res.data)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        role.children = data
        this.$message.success('恭喜你，删除成功')
      }
    },
    async getRightsList() {
      let res = await this.$http.get(`rights/tree `)
      //   console.log(res.data, 111)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.RightsList = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
  .level3 {
    margin-left: 10px;
    margin-bottom: 5px;
  }
}
</style>

