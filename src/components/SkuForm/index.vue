<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in  attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrOption.valueName" :value="`${attr.id}:${attrOption.id}`" v-for="attrOption in attr.attrValueList" :key="attrOption.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleOption.saleAttrValueName" :value="`${saleAttr.id}:${saleOption.id}`" v-for="saleOption in saleAttr.spuSaleAttrValueList" :key="saleOption.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template v-slot="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row,spuImageList)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      //存储图片
      spuImageList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据
      skuInfo: {
        //父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //需要通过数据的双向绑定收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        //自己写代码收集
        skuAttrValueList: [
          //销售属性0
          {
            attrId: 0,

            valueId: 0
          }
        ],
        skuDefaultImg: '', //默认图片

        skuImageList: [
          //缺少isdefault
          //收集图片
          /*   {
            
            imgName: 'string',
            imgUrl: 'string',
            isDefault: 'string',
           
            spuImgId: 0
          } */
        ],

        skuSaleAttrValueList: [
          //销售属性列表
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: 'string',
            saleAttrValueId: 0,
            saleAttrValueName: 'string',
            skuId: 0,
            spuId: 0
          }
        ]
      },
      spu: {}
    }
  },
  methods: {
    //获取sku数据
    async getData(category1Id, category2Id, spu) {
      //收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取图片的数据
      let result = await this.$API.sku.reqSpuImageList(spu.id)
      if (result.code == 200) {
        let list = result.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      //获取销售属性的数据
      let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      if (result1.code == 200) {
        //console.log(result1)
        this.spuSaleAttrList = result1.data
      }
      //获取平台属性的接口
      let result2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code == 200) {
        // console.log(result2)
        this.attrInfoList = result2.data
      }
    },
    handleSelectionChange() {},
    changeDefault(row, spuImageList) {
      //排他操作
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      //收集默认图片
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {
      this.$emit('changeScene', 0)
      //清除数据
      Object.assign(this._data, this.$options.data())
    },
    //保存数据
    async save() {
      //整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, spuImageList } = this
      /*  let arr=[]
      attrInfoList.forEach(item=>{
        //有这个属性说明被选择了
        if(item.attrIdAndValueId){
          const [attrId,valueId]=item.attrIdAndValueId.split(':')
          let obj={attrId,valueId}
          arr.push(obj)
        }
      })
      //把整理好的数据给要传的对象
      skuInfo.skuAttrValueList=arr */
      //优化写法  整理平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')

          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      //console.log(arr)

      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')

          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      //整理图片相关的
      skuInfo.skuImageList = spuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      //发请求
      let result = await this.$API.sku.reqAddSku(skuInfo)
      if (result.code == 200) {
        // console.log(result)

        this.$message.success('保存成功！')
        this.$emit('changeScene', 0)
        Object.assign(this._data, this.$options.data())
      }
    }
  }
}
</script>

<style>
</style>