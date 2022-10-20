<template>
  <div>
    <!-- 一行24格  一共4部分  一个占6格 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span style="margin-right:15px">周同比 56.67% <svg t="1664611649225" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3947" width="16" height="16">
                  <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="3948" fill="#d81e06"></path>
                </svg>
              </span>&nbsp;
              <span>日同比 19.16% <svg t="1664611889212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5085" width="16" height="16">
                  <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="5086" fill="#1afa29"></path>
                </svg>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineCharts />
            </template>
            <template slot="footer">
              <span>日访问量 1242</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts />
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressCharts />
            </template>
            <template slot="footer">
              <span style="margin-right:15px">周同比 12% <svg t="1664611649225" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3947" width="16" height="16">
                  <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="3948" fill="#d81e06"></path>
                </svg>
              </span>
              <span>日同比 11% <svg t="1664611889212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5085" width="16" height="16">
                  <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="5086" fill="#1afa29"></path>
                </svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index.vue'
import LineCharts from './lineChart'
import BarCharts from './barcharts'
import ProgressCharts from './progressCharts'
export default {
  name: 'Card',
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts
  }
}
</script>

<style>
</style>