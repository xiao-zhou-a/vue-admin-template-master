<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :isShow="scene!=0" />
    </el-card>
    <el-card>
      <!-- 一共有三个界面 -->
      <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" style="margin-bottom:20px" @click="addSpu">添加SPU</el-button>
      <div v-show="scene==0">
        <el-table style="width: 100%;margin-bottom:20px" :data="records" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row}">
              <el-button @click="addSku(row)" type="success" icon="el-icon-plus" size="mini" title="添加"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改" @click="updateSpu(row)"></el-button>
              <el-button @click="lookSpuList(row)" style="margin-right:12px" type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="text-align:center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene==2" @changeScene="changeScene" ref="sku" />
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
          <el-table-column prop="price" label="价格" width="200"></el-table-column>
          <el-table-column prop="weight" label="重量"></el-table-column>
          <el-table-column label="默认图片">
            <template v-slot="{row}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

    </el-card>
  </div>

</template>

<script>
import SkuForm from '@/components/SkuForm'
import SpuForm from '@/components/SpuForm'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      show: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //控制三级联动的可操作性

      //当前页码
      page: 1,
      //每一页限制
      limit: 3,
      //总共数据数量
      total: 0,
      //spu列表数据
      records: [],
      scene: 0, //用来控制显示那一部分的值 0代表展示spu列表 1代表添加修改spu/ 3添加sku
      //控制显示与隐藏
      dialogTableVisible: false,
      //用于保存每一行的信息 方便dialog展示数据
      spu: {},
      //用于存储sku列表
      skuList: [],
      //加载样式
      loading: true
    }
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应的id传递父组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId
        //清空2 3级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        //代表所有的都选择完毕  需要发请求了
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList() {
      //page limit id
      let { page, limit, category3Id } = this
      let result = await this.$API.spu.reqGetSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    //添加spu回调
    addSpu() {
      this.scene = 1
      this.page = 1
      //点击通知子组件发请求 还差一个3id 当做参数传过去
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //修改spu回调
    updateSpu(row) {
      //在父组件中用ref获取到子组件的方法传数据
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    //改变场景值
    changeScene(scene) {
      this.scene = scene
      //切换场景需要再获取一下数据
      this.getSpuList()
    },
    //删除
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        console.log(result)
        this.$message.success('删除成功')
        //页数判断
        if (this.records.length < 1) {
          this.page = this.page - 1
        }
        this.getSpuList()
      }
    },
    //添加sku
    addSku(row) {
      //切换场景
      this.scene = 2
      //获取子组件的一个方法用来发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    //查看sku列表展示
    async lookSpuList(row) {
      //显示对话框
      this.dialogTableVisible = true

      this.spu = row
      let result = await this.$API.sku.reqSkuList(row.id)
      if (result.code == 200) {
        //console.log(result)
        this.skuList = result.data
        //loading隐藏
        this.loading = false
      }
    }, //关闭对话框的回调
    close(done) {
      //loading属性在此变为真
      this.loading = true
      //清除sku列表的数据
      this.skuList = []
      //关闭对话框
      done()
    }
  }
}
</script>

<style>
</style>