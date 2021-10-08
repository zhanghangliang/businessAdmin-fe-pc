<template>
    <div class="bottom-div">
        <div class="col-3" v-for="(item,index) in data" @click="toPage(item.path)" :key='index'>
            <img :src="type==index?item.active:item.icon" alt="">
            <span :style="{color:type==index?'#00B340':'#000000'}">{{item.name}}</span>
        </div>
    </div>
</template>
<script>
import { number } from 'echarts/lib/export'
export default {
  name: 'bottomMenu',
  components: {
      
  },
  props: {
      type:{
          type:String,
          default:'0'
      }
  },
  data () {
    return {
        // type:1,
        data:[
            {name:'首页',path:'/index',icon:require('../../assets/images/icon_homeOFF.png'),active:require('../../assets/images/icon_homeON.png')},
            {name:'服务清单',path:'/serverList',icon:require('../../assets/images/icon_checklistOFF.png'),active:require('../../assets/images/icon_checklistON.png')},
            {name:'我的',path:'/my',icon:require('../../assets/images/icon_myOFF.png'),active:require('../../assets/images/icon_myON.png')},
        ]
    }
  },
  created () {
      
  },
  methods: {
      toPage(path){
        this.$router.push({
            path: path,
            // query: this.nowRowData
          })
      }

  }
}
</script>
