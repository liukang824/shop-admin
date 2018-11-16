<template>
 <div class="categories">
    <el-button type="success" @click="showaddcategories">添加分类</el-button>
    <el-table :data="RolesList" style="width: 100%" type="expand">
           <!-- childKey: 指定子元素集合的属性名，默认值是children -->
      <!-- tree-key: 每个节点的唯一标识 默认值  id   cat_id -->
      <!-- parent-key： 指定当前节点的父节点， 如果不指定，没法收起来 -->
      <!-- level-key: 指定节点的层级 -->
        <el-table-tree-column 
       label="分类名称"
       prop="cat_name"
       tree-key="cat_id"
       parent-key="cat_pid"
       level-key="cat_level"
       :indentSize="20"

       >
        </el-table-tree-column>
        <el-table-column prop="cat_name" label="分类名称">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否删除">
              <template slot-scope="scope">
                   {{scope.row.cat_deleted?'是':'否'}}
               </template>
        </el-table-column>
          <el-table-column prop="cat_level" label="排序">
             
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="small" plain type="primary" icon="el-icon-edit" >编辑  </el-button>
                <el-button size="small" plain type="danger" icon="el-icon-delete" >删除    </el-button>
                <!-- {{scope.row}} -->
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="Pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
        </el-pagination>
    </div>
    <el-dialog title="添加分类" :visible.sync="addroles" width="40%" >
          <el-form :model="rolesForm" :rules="rules2" status-icon ref="rolesForm" label-width="100px" class="form">
          <el-form-item label="用户名" prop="cat_name" >
              <el-input  v-model="rolesForm.cat_name" ></el-input>
          </el-form-item>
       <el-form-item label="父级名称" prop="cat_pid">
         <el-cascader
            :options="options"
            :props="props"
            change-on-select
            v-model="rolesForm.cat_pid"
            clearable
            ></el-cascader>
        </el-form-item>
         </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addroles = false">取 消</el-button>
            <el-button type="primary" @click="addcategories">确定</el-button>
         </div>
   </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      currentPage: 1,
      Pagesize: 10,
      total: 0,
      addroles: false,
      rolesForm: {
        cat_name: '',
        cat_pid: []
      },
      rules2: {
        roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOptions: []
    }
  },
  created() {
    this.getcategories()
  },
  methods: {
    async getcategories() {
      let res = await this.$http.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.Pagesize
        }
      })
      console.log(res.data)
      const {
        meta: { status },
        data: { result, total }
      } = res.data

      if (status === 200) {
        this.RolesList = result
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.Pagesize = val
      this.currentPage = 1
      this.getcategories()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getcategories()
    },
    // 显示添加
    async showaddcategories() {
      this.addroles = true
      let res = await this.$http.get(`categories`, {
        params: {
          type: 2
        }
      })
      //   console.log(res.data)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    addcategories() {
      console.log(111)

      this.$refs.rolesForm.validate(async valid => {
        if (!valid) return false
        let { cat_name: catName, cat_pid: catPid } = this.rolesForm
        let res = await this.$http.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        console.log(res.data)
        let {
          meta: { status }
        } = res.data
        if (status === 201) {
          this.getcategories()
          this.addroles = false
          this.$refs.addForm.resetFields()
          this.$message.success('恭喜你操作成功')
        }
      })
    }
  }
}
</script>

<style>
</style>
