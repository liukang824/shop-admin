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
        <el-button type="success" plain>用户添加</el-button>
     
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
                    inactive-color="#ff4949">
                </el-switch>
             </template>
        </el-table-column>
         <el-table-column
            label="操作">
             <template slot-scope="scope">
                <el-button size="small" plain type="primary" icon="el-icon-edit" >编辑</el-button>
                <el-button size="small" plain type="danger" icon="el-icon-delete" >删除</el-button>
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
    </div>
   
  
</template>

<script>
export default {
    data(){
        return{
            query:'',
            pagenum:1,
            pagesize:2,
            userList:[],
            total:0,
            
        }
    },
    created(){
        this.getuserList()
    },
    methods:{
        getuserList(){
            this.$http.get('users',{
                params:{
                    query:this.query,
                    pagenum:this.pagenum,
                    pagesize:this.pagesize
                }
            }).then(res=>{
                console.log(res.data);
                const {data,meta} =res.data
              if(meta.status === 200){
                  this.userList = data.users
                  this.total= data.total
                  
              }
                
            })
        },
        // 每一页显示多少条
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pagenum=1
        this.pagesize=val;
         this.getuserList()
      },
    //   渲染当前页
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pagenum=val
        this.getuserList()
      },
    // 搜索功能
    getsearch(){
       this.pagenum=1
       this.getuserList()
       this.query=""    
    } 
    }
}
</script>

<style lang="less" scped>
.search{
    margin: 15px 0;
    .input-with-select{
        width: 400px;
    }
    
}



</style>
