<template>
  <div>
    <!-- 按钮 -->
    <el-button @click="showDialog" type="primary" icon="el-icon-plus" style="margin:10px 0px">添加</el-button>
    <!-- 表格组件 
    data是表格组件将来需要展示的数据    数组类型
    border 是是否带边框 

    column的属性
    label  设置每一列的标题
    width  对应列的宽度
    align  标题对齐方式
    prop   显示对应内容的字段名
    作用域插槽  
    -->
    <el-table style="width: 100%" border :data="list">
      <!-- 一列 -->
      <el-table-column prop="prop" type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <!-- row是这一行的品牌信息 -->
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updataTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 
      当前第几页  数据总条数 每一页展示的条数 连续页码数
      pager-count  连续页码数
     -->
    <el-pagination style="margin-top:20px;text-align:center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
    <!-- 对话框
    :visible.sync:控制对话框显示与隐藏用的
     -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单   :model是把表单的数据收集 到那个对象的身上，将来表单验证也需要这个属性-->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!-- 收集图片 不能使用v-model因为不是表单元素
        action：设置图片上传的地址
        on-success 可以检测图片上传成功，当图片上传成功会执行一次
        before-upload  可以在上传图片之前会执行一次
        -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      //第几页当前
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //总共的条数
      total: 0,
      //列表展示的数据
      list: [],
      //dialog标题名称
      dialogTitle: '添加品牌',
      dialogFormVisible: false,
      //上传图片的属性
      imageUrl: '',
      //收集品牌信息:对象身上的属性不能瞎写，需要看文档
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      //表单验证规则
      rules: {
        //require:必须要校验的   message提示信息  trigger用户行为设置  事件触发的行为
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请上传品牌图片', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // console.log(this.$API)
    this.getPageList()
  },
  methods: {
    //获取品牌列表
    async getPageList() {
      let result = await this.$API.tradeMark.reqTradeMark(this.page, this.limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(page) {
      //修改参数
      this.page = page
      this.getPageList()
    },
    //分切器某一项需要展示数据的条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    //添加按钮
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true
      //清空下表单
      this.tmForm.tmName = ''
      this.tmForm.logoUrl = ''
    },
    updataTradeMark() {
      this.dialogTitle = '修改品牌'
      this.dialogFormVisible = true
    },
    //上传图片的回调  图片上传成功  res是成功后返回的数据 file也是上传成功后服务器返回前端的数据
    handleAvatarSuccess(res, file) {
      //console.log(res)   获取服务器真实的地址
      this.imageUrl = res.data
      //收集图片，将来需要带给服务器
      this.tmForm.logoUrl = res.data
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //点击确定  添加获取修改品牌
    addOrUpdateTradeMark() {
      //当全部字段通过再去书写业务逻辑
      this.$refs.ruleForm.validate(async success => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false
          //发请求  添加
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)

          if (result.code == 200) {
            //弹出一个信息框提示上传结果
            this.$message({
              message: this.tmForm.id ? '修改品牌成功' : '新增品牌成功',
              type: 'success'
            })
            //成功后再次获取数据、
            this.getPageList(this.tmForm.id ? this.page : 1)
            //如果添加品牌就是留在第一页，如果是修改品牌应该停留在当前页码
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updataTradeMark(row) {
      //row是服务器返回的对象，如果直接赋值是深拷贝，会影响服务器的数据
      //所以这是使用浅拷贝，用展开运算符
      this.tmForm = { ...row }
      this.dialogFormVisible = true
    },
    //删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) //点击确定按钮的时候会触发
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageList(this.list.length >= 1 ? this.page : this.page - 1)
          }
        })
        //用户点击取消按钮的时候会触发
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
