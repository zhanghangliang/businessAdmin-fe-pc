<template>
  <div :ref="id" class="myChart"  />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import dark from './dark.json'
export default {
  mixins: [resize],
  props: {
    id: {
        type: String,
        default: 'chart'
    },
    chartObj: {
      type: Object,
      default() {
        return {
            id: 'chart',
            showLegend: false,
            background: '#344b58',
            title: '漏斗图',
            data: [
                {value: 60, name:'访问'},
                {value: 30, name:'咨询'},
                {value: 10, name:'订单'},
                {value: 80, name:'点击'},
                {value: 100, name:'展现'}
            ]
        };
      }
    },
    titleColor:{
      type:String,
      default:'#333'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    'chartObj.data': {
        handler(val, old) {
         // alert(1);
           this.initChart();
        }
    }
  },
  methods: {
    initChart() {
      if(this.chart == null) {
      	  echarts.registerTheme('dark', dark)
          this.chart = echarts.init(this.$refs[this.id], 'dark')
      }
      let _this = this;
    
      let legend = this.chartObj.data.map((item) =>{
            return item.name
      })
      this.chart.setOption({
        backgroundColor: _this.chartObj.background,
        color: ['#5DC2FB', '#00D077', '#F8B53D', '#F64741', '#A359B6'],
        title: {
            text:'', 
            color:'#333',
            subtext: _this.chartObj.title,
            subtextStyle: {//副标题文本样式{"color": "#aaa"}
                color:this.titleColor,
                fontSize: 14,
                fontWeight:600
            },
            left: 'center',
            top: '30px'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            top: 'center',
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            show: _this.chartObj.showLegend,
            orient: 'vertical',
            left: 'left',
            data: legend
        },
        calculable: true,
        series: [
            {
                name: _this.chartObj.title,
                width: '50%',
                height: '70%',
                type: 'funnel',
                left: 'center',
                top: '20%',
                data:_this.chartObj.data,
                label: {
                    show: true,
                    position: 'left'
                }
            }
        ]
      }, true)
    }
  }
}
</script>
<style scoped >
.myChart{
    width: 100%;
    height: 100%
}
</style>
