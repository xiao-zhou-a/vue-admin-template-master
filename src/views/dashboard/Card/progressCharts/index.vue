<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
//import echarts from 'echarts'
import * as echarts from 'echarts'
export default {
  name: '',
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,

        //设置最小值和最大值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        //在y轴均分
        type: 'category'
      },
      series: [
        {
          type: 'bar',

          data: [78],
          //柱状图宽度
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            show: true
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>