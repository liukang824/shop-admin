<template>
<el-container class="home">
    <el-header >
        <div class="login"></div>
        <div class="logout">
            欢迎光临
            <a href="#" @click.prevent="logout">退出</a>
        </div>
        <h1 class="title">电商前端管理系统</h1>
    </el-header>
    <el-container>
        <el-aside width="200px">
            <el-menu
                :default-active="active"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                active-text-color="#ffd04b"
                text-color="#fff"
                unique-opened
                router
                >
                <el-submenu v-for="item in userList" :key="item.id" :index="item.path"  >
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item v-for="item in item.children" :key="item.id" :index="item.path">
                         <i class="el-icon-menu"></i>
                         <span slot="title">{{item.authName}}</span>
                  </el-menu-item>
                </el-submenu>
              
            </el-menu>
        </el-aside>
        <el-main>
           <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
        userList:[],
        active:'home'
    };
  },
  created() {
    this.getuserList();
    this.getactive()
  },
  methods: {
    //   退出功能
    logout() {
      this.$confirm("您确定要退出吗", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    // 获取侧边栏
    async getuserList() {
      const res = await this.$http.get("/menus");
    //   console.log(res);
      const {data,meta} = res.data
      const {status}=meta
      if(status===200){
          this.userList=data
      }
    },
    getactive(){
        this.active = this.$route.path.replace('/', '')
    }
  
  }
};
</script>

<style lang="less" scped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .login {
      width: 180px;
      height: 60px;
      line-height: 60px;
      float: left;
      background-image: url("../assets/logo.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      float: right;
      a {
        color: darkorange;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 30px;
      font-weight: bolder;
    }
  }

  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
