<template>
    <div>
        <div class="all" style="height:100vh">
        <ul class="form-list">
            <li>
                <img src="../../assets/images/icon_arrowL.png" alt="" @click="backPage">
                <span>历史操作记录</span>
            </li>
            <template v-if="historyData.length!=0">
                <li @click="toDetail(item)" v-for="(item,index) in historyData" :key='index' >
                    <img src="../../assets/images/icon_passport.png" alt="">
                    <span>{{item.subjectName}}  </span>
                    <!-- <span class="mini">材料清单</span> -->
                     <span class="mini" @click.stop="clearFun(item.id)">
                         材料清单
                        <img src="../../assets/images/btn_clear.png" alt="">
                    </span>
                    <span class="time-style">{{item.createTime}}</span>
                </li>
            </template>
            <template v-else>
                <li style="text-align: center;background: none;">
                    <span style="color: #c8c8cd;">暂无数据</span>
                </li>
                
            </template>
           
        </ul>
    </div>
    </div>
</template>
<script>
import {httpAction} from '@/api/manage'
import Cookies from 'js-cookie'
export default {
  name: 'index',
  components: {
      
  },
  
  props: {
      
  },
  data () {
    return {
        historyData:[]
    }
  },
  created () {
    this.getList()
//     window.addEventListener("popstate", (e)=> {  //回调函数中实现需要的功能
//         this.$router.push({
//             path: '/my',
//         })
//         return
//     }, false);
  },
  methods: {
      getList(){
        let data = JSON.parse(Cookies.get('member'+this.systemType))
        let temp = {
                body:{
                    memberId:data.id,
                    // operationType:1//  0未完成 1完成
                },
                header: {
                    pageNumber: 1,
                    pageSize: 10,
                    sortList: [
                        {
                            orderField: "updateTime",
                            orderType: "desc"
                        }
                    ]
                }
            }
        let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...',
        })
        httpAction('/Wx/operationhistory', temp).then(response => {
            if (response.code == 0) {
                this.historyData = response.data.content
            }
            toastItem.clear()
        }).catch(error => {
            toastItem.clear()
            console.log(error)
        })
      },
      //删除
      clearFun(id){
        let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '删除中...',
        })
          httpAction('/Wxoperation/deletebyid', {body:[id]}).then(response => {
            if (response.code == 0) {
                this.Toast('删除成功')
                this.getList()
            }
            toastItem.clear()
        }).catch(error => {
            console.log(error)
            toastItem.clear()
        })
      },
      backPage(){
        // this.$router.go(-1)
         this.$router.push({
            path: '/my'
        })
      },
      toDetail(data){

        let ids = data.matterId?data.matterId.split(','):[]
        this.$router.push({
            path: '/historyDetail',
            query: {
                finishId:data.id,
                ids:ids,
                name:data.subjectName,
                subjectId:data.subjectId
            }
        })
      }

  }
}
</script>
<style scoped>
   .form-list{
    margin: 15px 15px;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 2px 15px 1px #D9D9D9;
}
.form-list li{
    list-style-type: none;
    height: 60px;
    line-height: 55px;
    border-bottom: 1px solid #EEEEEE;
    padding: 0 15px;
    position: relative;
    /* background: url(../../assets/images/-s-icon_checklist.png) no-repeat 96%;
    background-size: 12px; */
}
.form-list li img{
    width: 18px;
    height: 18px;
    object-fit: cover;
    vertical-align: middle;
    margin-right: 3px;
}
.form-list li > span{
    font-size: 14px;
    font-weight: bold;
    vertical-align: middle;
    color: #121212;
    display: inline-block;
    /* margin-right: 20px; */
    min-width: 30px;
    width: calc(100% - 100px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.form-list li > span.mini{
    color: #ACADB1;
    font-size: 12px;
    float: right;
    font-weight: 100;
    width: 73px;
}
.form-list li > span.time-style{
    color: #ACADB1;
    font-size: 12px;
    display: block;
    height: 20px;
    line-height: 20px;
    position: absolute;
    bottom: 1px;
    left: 40px;
}
.form-list li:first-child{
   
    height: 50px;
    line-height: 50px;
    background:none;
     background-color: #EFF3FF;
}
.form-list li:first-child span{
    color: #3D65E6;
}
.form-list li:first-child > img{
    width: 12px;
    height: 12px;
    margin-right: 10px;
}
.inp-style{
    width: calc(100% - 91px);
    height: 40px;
    padding-left: 10px;
    font-size: 16px;
    outline: none;
    border-style: none;
}
.form-list li > p{
    width: calc(100% - 83px);
    display: inline-block;
    vertical-align: middle;
    color: #E2E2E2;
}

</style>