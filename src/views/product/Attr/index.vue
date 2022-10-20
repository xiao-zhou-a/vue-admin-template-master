<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :isShow="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格-->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column prop="prop" type="index" label="序列" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{row,$index}">
              <el-tag style="margin:5px 5px" type="success" v-for="attr in row.attrValueList" :key="attr.id">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <!--data中有几条数据tabel就有几行 -->
        <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称" width="">
            <template v-slot="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" @blur="toLook(row)" @keyup.native.enter="toLook(row)" v-model="row.valueName" placeholder="请输入属性名称" size="mini"></el-input>
              <span v-else @click="toUpdata(row,$index)" style="display:block; ">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗`" @onConfirm="deleteAttrValue">
                <el-button @onConfirm="deleteAttrValue($index)" slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align:center">
          <el-button type="primary" @click="addOrSaveAttr" :disabled=" attrInfo.attrValueList.length<=0">保存</el-button>
          <el-button @click="isShowTable=true">取消</el-button>
        </div>
      </div>
    </el-card>

  </div>

</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //接收平台属性的字段
      attrList: [],
      //控制table的显示与隐藏
      isShowTable: true,
      //手机新增属性|修改属性使用
      attrInfo: {
        attrName: '', //属性名
        attrValueList: [
          //属性值 每一个都是一个对象x需要id和名字
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 0 //因为服务器也需要区分几级id
      }
    }
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分是第几级id
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
        this.getAttrList()
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqGetAttrList(category1Id, category2Id, category3Id)
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    //添加属性按钮回调
    addAttr() {
      //显示添加属性页面
      this.isShowTable = false
      //清空数据
      this.attrInfo = {
        attrName: '', //属性名
        attrValueList: [
          //属性值 每一个都是一个对象x需要id和名字
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3 //因为服务器也需要区分几级id
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //修改某一个属性的时候，可以在已有的属性值基础之上新增属性（带上属性值）
        valueName: '',
        //用于标记用户切换查看模式与编辑模式,每一个属性值可以控制自己的模式切换而且是响应式数据
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //修改属性

    updateAttr(row) {
      this.isShowTable = false
      /* this.attrInfo.attrName = row.attrName.
      this.attrInfo.attrValueList = row.attrValueList */
      this.attrInfo = cloneDeep(row)
      //在修改某一个属性的时候，将相应的属性值元素加上flag属性以便于切换查看和修改模式
      this.attrInfo.attrValueList.forEach(item => {
        //设置响应式数据
        this.$set(item, 'flag', false)
      })
    }, //切换flag
    toLook(row) {
      //防止用户输入的值为空，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == '') {
        this.$message({
          message: '请输入正确的属性值',
          type: 'error'
        })
        return
      }
      //新增的属性值不能喝已有的属性值重复，否则就提示用户重复了
      let isReat = this.attrInfo.attrValueList.some(item => {
        //row是最新新增的属性值,数组的最后一项，需要把自己这一项去除判断
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isReat) {
        this.$message({
          message: '重复的属性值！',
          type: 'error'
        })
        return
      }
      row.flag = false
    },
    toUpdata(row, index) {
      row.flag = true
      //获取input节点，自动获取焦点
      //需要注意：点击span的时候。切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘需要耗时间
      //不可能一点击就获取到input
      //$nextTick 当节点渲染完毕执行一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //注意气泡中的删除按钮的版本号，低版本用onConfirm
    deleteAttrValue(index) {
      //删除选中的那一行  不需要发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //保存数据发请求 添加属性或者修改属性
    async addOrSaveAttr() {
      //整理参数：如果用户添加很多属性值，且属性值为空不应该提交给服务器
      //flag是自己加上去的，传参时需要去掉
      //重新赋值一下
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        //如果不是为空
        if (item.valueName.trim() !== '') {
          //删除flag
          delete item.flag
          return true
        }
      })
      let { attrInfo } = this
      let result = await this.$API.attr.reqAddOrUpdataAttr(attrInfo)
      if (result.code == 200) {
        //  console.log(result)  测试成功
        //显示回table
        this.isShowTable = true
        //提示信息
        this.$message.success('保存成功')
        this.getAttrList()
      }
    }
  }
}
</script>

<style>
</style>