<template>
  <div>
    {{unSelectSaleAttr}}
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademark" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述" :rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action是图片上传的地址 file-list-->
        <el-upload :on-success="handlerSuccess" :file-list="spuImageList" action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!--v-model到时候是收集 value里的值 -->
        <el-select :placeholder="`还有${this.unSelectSaleAttr.length}未选择`" v-model="unSelectInfo">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left:20px" :disabled="!unSelectInfo" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- @close="handleClose(tag)" 
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
            @click="showInput" -->
            <template v-slot="{row}">
              <el-tag @close="handleClose(row,index)" :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input @blur="handleInputConfirm(row)" class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="160">
            <template v-slot="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button type="primary" @click="addOrUpdate">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  computed: {
    unSelectSaleAttr() {
      //平台的销售属性一共三个  颜色 尺寸 版本 saleAttrList
      //当前spu拥有的属于自己的销售属性   spu.spuSaleAttrList
      return this.saleAttrList.filter(item => {
        //every数组的方法会返回一个布尔值 而filter正好需要一个布尔值来判断这个值是否接受
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
    }
  },
  data() {
    return {
      //收集未选择的id
      unSelectInfo: '',
      dialogImageUrl: '',
      dialogVisible: false,
      //用于存储spu信息属性
      //spu属性初始化的时候是一个空对象，会向服务器发请求获取数据，在修改的时候可以利用服务器返回这个对象收集最新的数据在提交
      //添加spu，如果添加spu的时候并没有向服务器发请求，数据收集到哪儿，有哪些字段，这些信息需要看文档，并初始化
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: '',
        //收集图片信息
        spuImageList: [
          /*  {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            spuId: 0
          } */
        ],
        //spu名称
        spuName: '',
        //品牌的id
        tmId: '',
        //平台属性与属性值
        spuSaleAttrList: [
          /*  {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: 'string',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: 'string',
                saleAttrName: 'string',
                saleAttrValueName: 'string',
                spuId: 0
              }
            ]
          } */
        ]
      },
      //用户存储品牌信息
      trademark: [],
      //存储spu图片的数据
      spuImageList: [],
      //存储销售属性的数据，项目的全部销售属性
      saleAttrList: []
    }
  },
  methods: {
    //上传照片成功
    handlerSuccess(response, file, fileList) {
      //收集图片
      this.spuImageList = fileList
    },
    //移除图片
    handleRemove(file, fileList) {
      //file代表的是删除的那个图片
      //filelist代表的是照片墙删除某一张图片以后剩余的图片
      //console.log(file, fileList)
      //渲染的时候必须要有name和URl属性，但是返回给服务器的时候不需要，得处理一下
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //初始化spuForm数据
    async initSpuData(spu) {
      let spuResult = await this.$API.spu.reqGetSpu(spu.id)
      if (spuResult.code == 200) {
        //console.log(spuResult.data)
        this.spu = spuResult.data
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        // console.log(tradeMarkResult.data)
        this.trademark = tradeMarkResult.data
      }
      //获取图片的信息
      let imgResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imgResult.code == 200) {
        //console.log(imgResult.data)
        let arr = imgResult.data
        arr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = arr
      }
      //获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      //把需要收集的属性进行分割
      let baseSaleAttrId = this.unSelectInfo.split(':')[0]
      let saleAttrName = this.unSelectInfo.split(':')[1]

      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      })
      //删除掉未添加的数据
      this.unSelectInfo = ''
    },
    //添加按钮的回调
    addSaleAttrValue(row) {
      //添加响应式属性控制  显示控制器和input输入框
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm(row) {
      //解构出销售属性当众收集数据
      const { baseSaleAttrId, inputValue } = row
      //新增的销售属性不能是重复的且不能为空
      if (inputValue.trim() == '') {
        this.$message.warning('属性值不能为空！')
        return
      }
      let result = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName != inputValue
      })
      if (!result) {
        this.$message.warning('属性值不能重复！')
        return
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    //删除属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    //保存按钮
    async addOrUpdate() {
      //需要整理数据  照片墙的数据还未整理  需要携带imgName imgUrl
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl ? item.url : item.response.data
        }
      })
      //console.log(this.spu, this.spuImageList)
      let result = await this.$API.spu.reqSaveSaleAttr(this.spu)
      if (result.code == 200) {
        //onsole.log(result)
        this.$message.success('保存成功')
        //回到原来表格
        this.$emit('changeScene', 0)
      }
    },
    //添加属性发请求 点击添加按钮后发请求
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        // console.log(tradeMarkResult.data)
        this.trademark = tradeMarkResult.data
      }
      //获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
      Object.assign(this._data, this.$options.data())
    },
    cancel() {
      this.$emit('changeScene', 0)
      //object.assign 可以合并对象  this._data是所有的响应式数据 $options.data是data函数中的初始值
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
