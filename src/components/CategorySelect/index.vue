<template>
  <div>
    <!-- inline代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">

      <el-form-item label="一级分类">
        <!-- v-model绑定的数据是option的value值 -->
        <el-select :disabled="isShow" placeholder="请选择" v-model="cForm.form1Id" @change="hander1">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="isShow" placeholder="请选择" v-model="cForm.form2Id" @change="hander2">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="isShow" placeholder="请选择" v-model="cForm.form3Id" @change="hander3">

          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['isShow'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      //收集所有及的id
      cForm: {
        form1Id: '',
        form2Id: '',
        form3Id: ''
      }
    }
  },
  mounted() {
    //获取一级路由
    this.getCategory1()
  },
  methods: {
    //获取一级路由
    async getCategory1() {
      let result = await this.$API.attr.reqCategory1()
      // console.log(result)
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    //1级分类选中的值发生变化时把值传给二级分类发送请求获取数据
    async hander1() {
      //清除数据、

      this.cForm.form2Id = ''
      this.cForm.form3Id = ''
      this.list2 = []
      this.list3 = []
      const { form1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: form1Id, level: 1 })
      let result = await this.$API.attr.reqCategory2(form1Id)
      if (result.code == 200) {
        this.list2 = result.data
      }
    },
    //2级分类选中的值发生变化时把值传给三级分类发送请求获取数据
    async hander2() {
      //清除数据
      this.list3 = []
      this.cForm.form3Id = ''
      const { form2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: form2Id, level: 2 })
      let result = await this.$API.attr.reqCategory3(form2Id)
      if (result.code == 200) {
        this.list3 = result.data
      }
    },
    //3级分类的处理回调
    hander3() {
      const { form3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: form3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>