<template>
    <div>
         <div class="all">
            <div class="con-item-div answer" style="padding-top: 10px;">
                <ul class="serve-list last-span-none">
                    <li class="firstNone">
                        <img src="../../assets/images/icon_arrowL.png" alt="" @click="backPage">
                        <span>{{liData.matterName}}</span>
                        <span style="display: none;"></span>
                    </li>
                    <template v-if='refresh'>
                        <li v-for="(item,index) in serverList" :key='index' @click.stop="selectItem(item)" :class="{isSelected:isSelected(item.id)}">
                            <!-- <span class="isSelect-style">
                                <img v-if='isSelected(item.id)' src="../../assets/images/icon_hook.png" alt="">
                            </span> -->
                            <span>{{index+1+'、'}}{{item.matterName}}</span>
                            <span></span>
                            <!-- <span @click.stop="toNextLevel(item)"></span> -->
                        </li>
                    </template>
                    
                </ul>
                <p v-if="serverList.length==0" class="noData">暂无下一级数据</p>
            </div>
        </div>
        <div class="bottom-div">
            <div class="btn-div" style="text-align: center;">
                <button class="left" style="width: calc(50% - 8px);" @click="prevLevel" :disabled="stepArr.length==1">上一步</button>
                <button class="middle" style="width: calc(50% - 8px);" @click="toNextLevel">下一步</button>
                <!-- <button class="right" @click="getMaterial">材料清单</button> -->
            </div>
        </div>
    </div>
</template>
<script>
import {httpAction} from '@/api/manage'
import bottomMenu from '@/components/menu'
export default {
  name: 'index',
  components: {
      bottomMenu
  },
  
  props: {
      
  },
  data () {
    return {
        serverList:[],
        stepArr:[],
        stepIndex:0,
        refresh:true,
        selectdDataArr:[],
        moreSelect:true,
        currentData:'',
        wxOperationRecord:[],
        recordId:{},
        operationType:1,//0上一步 1 下一步
        subjectId:'',
        currentData:{
            situation:'',
            sonSituation:[]
        },
        selectedList:[
            {id:'',situation:[]}
        ],
        upoeration:''
    }
  },
  created () {
    //   this.getServerList()
    
    this.liData = this.$route.query
    if(this.liData.isHistory){ //记录进
        this.stepArr = this.liData.idsArr
        this.stepIndex = this.liData.idsArr.length-1
        this.selectdDataArr = this.stepArr[this.stepIndex]
        this.recordId.id = this.liData.lastId
        this.prevF = this.liData.prevId

        this.subjectId = this.liData.subjectIds
        this.getLevelData(this.stepArr[this.stepIndex])
    }else{ //列表进
        this.getLevelData([this.liData.id])
    }
    
  },
  methods: {
      getLevelData(data,liItem){
        let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...',
        })  
        this.refresh = false
        let temp = {
            matterIds:data,
            upoeration:this.recordId.id,
            operationType:this.operationType,
            subjecte:this.subjecteId,
        }
        if(liItem == 2){
            delete temp.matterIds
            temp.upoeration = this.prevF||this.recordId.upoeration
            this.prevF = ''
        }
        httpAction('/Wxoperation/findmatter',{body:temp}).then(response => {
            if (response.code == 0) {
                this.currentData = ''
                if(liItem == 1){ //下一步
                    if(response.data.matterDepositoryMains.length>0){
                        this.serverList = response.data.matterDepositoryMains
                        
                        this.stepIndex ++
                        
                        if(this.stepArr[this.stepIndex+1]){
                            this.selectdDataArr = this.stepArr[this.stepIndex+1]
                        }else{
                            this.stepArr[this.stepIndex] = this.selectdDataArr
                            
                          this.selectdDataArr = []
                        }
                        this.recordId = response.data.wxOperationRecord
                    }else{
                        // this.Toast('暂无下一级数据了')
                        this.Dialog.confirm({
                            title: '系统提示',
                            message: '暂无下一级数据了，是否获取材料清单？',
                        })
                        .then(() => {
                            this.getMaterial()
                        })
                        .catch(() => {
                            // on cancel
                        });
                    }
                      
                }else if(liItem == 2){ //上一步
                    this.serverList = []
                    this.selectdDataArr = this.stepArr[this.stepIndex]
                    // this.stepArr.splice(this.stepIndex,1)
                    this.stepIndex --
                    console.log(this.stepIndex)
                    this.serverList = response.data.matterDepositoryMains
                    this.recordId = response.data.wxOperationRecord
                }else{ //初始时
                    if(response.data.matterDepositoryMains.length>0){
                        this.serverList = response.data.matterDepositoryMains
                        this.selectdDataArr = []
                        this.recordId = response.data.wxOperationRecord
                    }else{
                        this.Dialog.confirm({
                            title: '系统提示',
                            message: '暂无下一级数据了，是否获取材料清单？',
                        })
                        .then(() => {
                            this.getMaterial()
                        })
                        .catch(() => {
                            this.$router.push({
                                path: '/needDo',
                            })
                        });
                    }
                    
                }
                
               console.log(this.stepArr)
                this.refresh = true
                this.wxOperationRecord = response.data.wxOperationRecord
            }
            console.log(this.stepIndex)
            toastItem.clear()
          }).catch(error => {
            console.log(error)
            toastItem.clear()
            this.refresh = true
          })
      },
       //下一步
      toNextLevel(){
          if(this.selectdDataArr.length>0){
              this.operationType = 1
              this.getLevelData(this.selectdDataArr,1)
          }else{
              this.Toast('请选择数据')
          }
        
      },
      //上一步
      prevLevel(){
          if(this.stepIndex>0){
              this.operationType = 0
              this.getLevelData(this.stepArr[this.stepIndex-1],2)
          }
        
      },
      toPage(path){
        // this.$router.push({
        //     path: path,
        //     // query: this.nowRowData
        //   })
      },
      toSearch(){
        this.$router.push({
            path: '/search',
            // query: this.nowRowData
        })
      },
      backPage(){
        this.$router.go(-1)
      },
      getMaterial(){
          let ids = ''
          if(this.selectdDataArr.length==0){
            ids = [this.liData.id]
          }else{
            ids = this.selectdDataArr
          }
          
        this.$router.push({
            path: '/serverTable',
            query: {ids:ids,name:this.liData.matterName,recordId:this.liData.recordId}
        })
        //   let temp = {
        //       body: {
        //             matterId: "string",
        //             memberId: "string"
        //         }
        //   }
        //   httpAction('Wxoperation/findmaterial',temp).then(response => {
        //     if (response.code == 0) {
                
        //     }
        //   }).catch(error => {
        //     console.log(error)
        //     this.refresh = true
        //   })
      },
      //选择
      selectItem(data){
          if(this.moreSelect){
            let delIndex = null
            this.selectdDataArr.forEach((item,index)=>{
                if(item == data.id){
                    delIndex = index
                }
            })
            
            if(delIndex!=null){
                this.selectdDataArr.splice(delIndex,1)
                delIndex = null
            }else{
                this.selectdDataArr.push(data.id)
                this.currentData = data.id
            }
          }else{
              this.selectdDataArr = [data.id]
          }
            
        //   console.log(this.selectdDataArr)
          
      },
      isSelected(id){
          return this.selectdDataArr.includes(id)
      }



  }
}
</script>
<style scoped>
    
    .top-con{
        overflow: hidden;
        padding: 15px 15px 0;
    }
    .top-banner-div{
        width: 100%;
        height: 123px;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 15px;
    }
    .top-banner-div img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .top-search-div{
        width: 100%;
        height: 45px;
        background-color: #FFFFFF;
        border-radius: 5px;
        line-height: 45px;
        font-size: 14px;
    }
    .top-search-div img{
        vertical-align: middle;
        width: 20px;
        height: 20px;
        margin: 0 12px;
    }
    .con-item-div{
        padding-top: 30px;
    }
    .con-item-div p.title{
        font-size: 15px;
        font-weight: bold;
        color: #333333;
        border-left: 4px solid #00B240;
        padding-left: 15px;
        margin: 0px 15px 0;
    }
    
    .serve-item-div ul{
        padding: 15px 15px 0;
        margin-top: 10px;
        background-color: #ffffff;
    }
    .serve-item-div ul li{
        list-style-type: none;
        display: inline-block;
        width: calc(50% - 38px);
        height: 100px;
        margin-bottom: 10px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        padding: 15px 15px 0;
    }
    .serve-item-div ul li:nth-child(2n+1){
        margin-right: 10px;
    }
    .serve-item-div ul li img{
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .serve-item-div ul li > div.info{
        position: absolute;
        z-index: 2;
        color: #ffffff;
        width: calc(100% - 30px);
    }
    .serve-item-div ul li > div.info p{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .serve-item-div ul li > div.info span{
        font-size: 13px;
        line-height: 18px;
        display: inline-block;
    }

    .serve-list{
        margin: 10px 15px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0px 2px 15px 1px #D9D9D9;
    }
    .serve-list li{
        list-style-type: none;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #EEEEEE;
        margin: 0 15px;
        
    }
    .serve-list li.isSelected{
        background: url(../../assets/images/icon_hook.png) no-repeat right;
        background-size: 12px;
    }
    .serve-list li img{
        width: 18px;
        height: 18px;
        object-fit: cover;
        vertical-align: middle;
        margin-right: 3px;
    }
    .serve-list li > span{
        font-size: 12px;
        font-weight: bold;
        vertical-align: middle;
    }
    .serve-list li > span:last-child{
        font-size: 12px;
        color:#9D9D9D;
        background-color: #E4E4E4;
        float: right;
        min-width: 30px;
        height: 18px;
        line-height: 18px;
        margin-top: 15px;
        text-align: center;
        border-radius: 10px;
        margin-right: -10px;
        padding: 0px 3px;
    }
    .serve-list li > span.first{
        background-color: #FE0000;
        color: #FFC5C5;
    }
    .serve-list li > span.second{
        background-color: #FFB900;
        color: #FEEDC6;
    }
    .serve-list li > span.third{
        background-color: #00B80A;
        color: #ffffff;
    }
    .serve-list li:last-child{
        border-bottom: none;

    }
    .serve-list li.lastNone{
        background: none;
        text-align: center;
        font-size: 12px;
        color: #A1A1A1;
        font-weight: bold;
    }
    .serve-list li.firstNone{
        background: #EFF3FF;
        font-size: 12px;
        color: #2855E4;
        font-weight: bold;
        margin: 0;
        padding: 0 15px;
    }
    .serve-list li.firstNone img{
        margin-right: 10px;
        width: 12px;
        height: 12px;
    }
    .serve-list.last-span-none li > span:last-child,
    .serve-list li.firstNone > span:last-child{
        background: none;
    }
    /* .answer .serve-list li{
        background: none;

    } */
    .answer .serve-list li > span{
        font-weight: 500;
    }
    .answer .serve-list li.firstNone{
        background: #EFF3FF;
        text-align: left;
    }
    .answer .serve-list li.firstNone > span {
        background: #EFF3FF;
        font-size: 15px;
        color: #2855E4;
        margin: 0;
        /* padding: 0 15px; */
        text-align: center;
        font-weight: bold;
    }
    .answer .serve-list li img{
        width: 12px;
        height: 12px;
    }
    .noData{
        margin: 10px 15px;
        font-size: 14px;
        color: #666;
        text-align: center;
        height: 50px;
        line-height: 50px;
    }
    .isSelect-style{
        display: inline-block;
        width: 12px;
    }
</style>