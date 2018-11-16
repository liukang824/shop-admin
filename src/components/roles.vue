<template>
    <div class="roles">
        <el-breadcrumb style="margin-bottom:10px ;" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="success" plain  @click="showaddroles">添加角色</el-button>
        
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
                   <el-button size="small" plain type="primary" icon="el-icon-edit" @click="editroles(scope.row)">编辑  </el-button>
                   <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delRoles(scope.row)">删除    </el-button>
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
        <!-- 添加 -->
        <el-dialog :title="rolesForm.id ?'修改角色':'添加角色'" :visible.sync="addroles" width="40%" >
          <el-form :model="rolesForm" :rules="rules2" status-icon ref="rolesForm" label-width="100px" class="form">
          <el-form-item label="用户名" prop="roleName" >
              <el-input  v-model="rolesForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="rolesdesc" >
              <el-input  v-model="rolesForm.rolesdesc" ></el-input>
          </el-form-item>
       
         </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addroles = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
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
      rolesForm: {
        id: '',
        roleName: '',
        rolesdesc: ''
      },
      roleid: '',

      rules2: {
        roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      addroles: false
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
    },
    // 显示添加框
    showaddroles(roles) {
      // console.log(roles)
      this.addroles = true
      this.rolesForm.id = ''
      this.rolesForm.roleName = ''
      this.rolesForm.rolesdesc = ''
    },
    // 添加用户角色
    addRoles() {
      this.$refs.rolesForm.validate(async valid => {
        if (!valid) return false
        // console.log(this.rolesForm)
        // console.log(role)
        let id = this.rolesForm.id
        // console.log(id)
        let method = id ? `put` : `post`
        let url = id ? `roles/${id}` : `roles`
        console.log(url)
        let res = await this.$http({
          method,
          url,
          data: this.rolesForm
        })
        // console.log(res.data)
        let status = id ? 200 : 201

        // const {
        //   meta: { status }
        // } = res.data
        if (status) {
          this.addroles = false
          this.gitRolesList()
          this.$message.success('恭喜你操作成功')
        }
      })
    },
    editroles(role) {
      this.addroles = true
      this.rolesForm.id = role.id
      this.rolesForm.roleName = role.roleName
      this.rolesForm.rolesdesc = role.roleDesc
    },
    async delRoles(role) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$http.delete(`roles/${role.id}`)
        const {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message.success('删除成功')
          this.gitRolesList()
        }
      } catch (e) {
        this.$message.error('取消删除')
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

