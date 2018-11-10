<template>
    <div class="login">
    <el-form :model="ruleForm2" :rules="rules2" status-icon ref="ruleForm2" label-width="100px" class="form">
        <img src="../assets/avatar.jpg" alt="">
        <el-form-item label="用户名" prop="username" >
            <el-input  v-model="ruleForm2.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="ruleForm2.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="logins">提交</el-button>
            <el-button @click="rest">重置</el-button>
        </el-form-item>
</el-form>
    </div>

</template>

<script>
export default {
data(){
    return{
        ruleForm2:{
            username:'',
            password:''
        },
        rules2:{
            username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '密码', trigger: 'blur' },
            ]
        }
    }
    
    
},
methods:{
    // 重置表单
    rest(){
        this.$refs.ruleForm2.resetFields()
    },
    logins(){
        this.$refs.ruleForm2.validate((valid)=>{
        //  console.log(valid);
        if(valid){
            this.$http.post('login',this.ruleForm2).then(res=>{
                // console.log(res);
                const{data,meta}= res.data
                const{status,msg}=meta
                if(status===200){
                    localStorage.setItem('token',data.token);
                    this.$router.push('/home')
                    this.$message({
                        type: 'success',
                        message:msg
                    }) 
                }else{
                      this.$message.error(msg);
                }
            })
        }else{
            return false
        }
            
        })
    }
}

}
</script>

<style lang="less" scoped >
    .login{
        height: 100%;
        background-color: #2d434c;
        overflow: hidden;
        .form{
            width: 400px;
            padding: 80px 40px 15px;
            background-color: #fff;
            margin: 200px   auto ;
            position: relative;
            img{
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: -60px;
                border-radius: 50%;
                border: 10px solid #fff;

            }
        }
        .el-button + .el-button{
            margin-left: 70px
        }

    }    

</style>
