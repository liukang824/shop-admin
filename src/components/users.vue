<template>
<div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getsearch"></el-button>
        </el-input>
        <el-button type="success" plain  @click="addusershow">用户添加</el-button>
     
    </div>
    <el-table :data="userList" style="width: 100%">
         <el-table-column
            prop="username"
            label="姓名"
            width="180">
         </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话"
            width="180">
        </el-table-column>
          <el-table-column
            label="状态"
            width="180">
             <template slot-scope="scope">
                <!-- {{scope.row}} -->
                 <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="status(scope.row)">
                </el-switch>
             </template>
        </el-table-column>
         <el-table-column
            label="操作">
             <template slot-scope="scope">
                <el-button size="small" plain type="primary" icon="el-icon-edit" @click="editusershow(scope.row)">编辑</el-button>
                <el-button size="small" plain type="danger" icon="el-icon-delete"  @click="del(scope.row.id)">删除</el-button>
                <el-button size="small" plain type="success" icon="el-icon-check" >分配角色</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page=" pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
   <!-- 添加用户 -->
    <el-dialog title="添加用户 " :visible.sync="adduser" >
         <el-form :model="ruleForm2" :rules="rules2" status-icon ref="ruleForm2" label-width="100px" class="form">
        <el-form-item label="用户名" prop="username" >
            <el-input  v-model="ruleForm2.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="ruleForm2.password" ></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email" >
            <el-input  v-model="ruleForm2.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile" >
            <el-input  v-model="ruleForm2.mobile"></el-input>
        </el-form-item>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduser = false">取 消</el-button>
        <el-button type="primary" @click="user">确 定</el-button>
    </div>
   </el-dialog>
   <!-- 修改用户 -->
   <el-dialog title="编辑用户" :visible.sync="edituser" >
         <el-form :model="editform" :rules="rules2" status-icon ref="editform" label-width="100px" class="form">
        <el-form-item label="用户名" prop="username" >
           <el-tag type="info">{{editform.username}}</el-tag>
        </el-form-item>
         <el-form-item label="邮箱" prop="email" >
            <el-input  v-model="editform.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile" >
            <el-input  v-model="editform.mobile"></el-input>
        </el-form-item>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edituser = false">取 消</el-button>
        <el-button type="primary" @click="edituserT">确定</el-button>
    </div>
   </el-dialog>
</div>
   
  
</template>

<script>
export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      adduser: false,
      edituser: false,
      total: 0,
      formLabelWidt: '',
      ruleForm2: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //  表单验证
      rules2: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3,4,5,7,8][0-9]{9}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ]
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getuserList()
  },
  methods: {
    getuserList() {
      this.$http
        .get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          console.log(res.data)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.userList = data.users
            this.total = data.total
          }
        })
    },
    // 每一页显示多少条
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagenum = 1
      this.pagesize = val
      this.getuserList()
    },
    //   渲染当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val
      this.getuserList()
    },
    // 搜索功能
    getsearch() {
      this.pagenum = 1
      this.getuserList()
      this.query = ''
    },
    addusershow() {
      this.adduser = true
    },
    // 点击添加
    user() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.$http({
            method: 'post',
            url: '/users',
            data: this.ruleForm2
          }).then(res => {
            const { data, meta } = res.data
            if (meta.status === 201) {
              this.$refs.ruleForm2.resetFields()
              this.adduser = false
              this.getuserList()
            }
          })
        }
      })
    },
    // 删除功能
    del(id) {
      this.$confirm('您确定删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            console.log(111, res.data)
            const { status } = res.data.meta
            if (status === 200) {
              if (this.userList.length === 1 && this.pagenum > 1) {
                this.pagenum--
              }
              this.getuserList()
              this.$message.success('删除成功了')
            }
          })
        })
        .catch(() => {
          this.$message.error('你取消了删除操作')
        })
    },
    // 修改状态
    status({ id, mg_state: mgState }) {
      this.$http.put(`users/${id}/state/${mgState}`).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.$message({
            message: '修改状态成功',
            type: 'success'
          })
        }
      })
    },
    // 编辑
    editusershow(user) {
      this.edituser = true
      this.editform.id = user.id
      this.editform.username = user.username
      this.editform.email = user.email
      this.editform.mobile = user.mobile
    },
    edituserT() {
      this.$refs.editform.validate(valid => {
        // console.log(valid)
        if (!valid) return false
        this.$http.put(`users/${this.editform.id}`, this.editform).then(res => {
          console.log(res.data)
          if (res.data.meta.status === 200) {
            this.edituser = false
            this.$refs.editform.resetFields()
            this.getuserList()
            this.$message({
              message: '修改状态成功',
              type: 'success'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scped>
.search {
  margin: 15px 0;
  .input-with-select {
    width: 400px;
  }
}
</style>
