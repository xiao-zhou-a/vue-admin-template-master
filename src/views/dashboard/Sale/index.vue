<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>

      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker value-format="yyyy-MM-dd" v-model="date" class="date" size="mini" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="18">
        <!-- 柱状图容器 -->
        <div class="charts" ref="charts"></div>
      </el-col>
      <el-col :span="6">
        <h3>门店销售额排名</h3>
        <ul>
          <li>
            <span class="index">1</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span class="index">2</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span class="index">3</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span>4</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span>5</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span>6</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
          <li>
            <span>7</span>
            <span>肯德基</span>
            <span class="index-value">123456</span>
          </li>
        </ul>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      //收集日历数据
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    //初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: this.title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 135, 210, 56, 190, 90],
          color: 'orange'
        }
      ]
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0px 10px;
}
.date {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.index {
  float: left;
  width: 17px;
  height: 17px;
  background: black;
  color: white;
  text-align: center;
  border-radius: 50%;
  margin-right: 20px;
}
.index-value {
  float: right;
}
</style>