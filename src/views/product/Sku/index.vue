<template>
  <div>
    <el-table style="width: 100%;margin-bottom:30px" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="150" align="center">
        <template v-slot="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="300" align="center">
        <template v-slot="{row}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
     @size-change="handleSizeChange" @current-change="handleCurrentChange"
    -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="text-align:center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout=" prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
    <!-- 抽屉效果  :direction="direction" :before-close="handleClose"-->
    <el-drawer :visible.sync="drawer" show-close size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag style="margin-right:10px" type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">{{attr.attrId}}--{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>

</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      //当前第几页
      page: 1,
      //代表一页几条数据
      limit: 10,
      //存储sku表格的数据
      records: [],
      //存储分页器一共展示的数据
      total: 0,
      //sku信息
      skuInfo: {},
      //控制抽屉的显示与隐藏
      drawer: false
    }
  },
  mounted() {
    this.getSkuTable()
  },
  methods: {
    //获取sku列表数据的方法
    async getSkuTable() {
      let result = await this.$API.sku.reqSkuTable(this.page, this.limit)
      if (result.code == 200) {
        console.log(result)
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    //页码改变时的回调
    handleCurrentChange(page) {
      this.page = page
      this.getSkuTable()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuTable()
    },
    //上架的回调
    async sale(row) {
      let result = await this.$API.sku.reqOnSale(row.id)
      if (result.code == 200) {
        // console.log(result)
        row.isSale = 1
        this.$message.success('上架成功')
      }
    },
    //下架的回调
    async cancel(row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        // console.log(result)
        row.isSale = 0
        this.$message.success('下架成功')
      }
    },
    //正在开发中
    edit() {
      this.$message('正在开发中~')
    },
    //获取sku详情的方法
    async getSkuInfo(row) {
      //显示抽屉
      this.drawer = true
      let result = await this.$API.sku.reqSkuById(row.id)
      if (result.code == 200) {
        console.log(result)
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>