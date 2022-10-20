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
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          //线平滑
          smooth: true,
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          //拐点的设置
          itemStyle: {
            opacity: 0
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'blue' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          }
        }
      ]
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