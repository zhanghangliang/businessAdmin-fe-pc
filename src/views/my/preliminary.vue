<template>
    <div>
       <div class="all">
            <!-- <div class="top-con">
                <div class="top-search-div" @click="toSearch">
                    <img src="../../assets/images/icon_search.png" alt="">
                    <span style="color: #B3B5BE;">我要开学校 | 开餐饮店</span>
                </div>
            </div> -->
            <div class="con-item-div" v-for='(item,index) in serverList' :key='index'>
                <p class="title">{{item.name}}</p>
                
                <ul class="serve-list">
                    <li v-if='item.loading' style="background:none;text-align: center;">
                        <van-loading/>
                    </li>
                    <li v-for='(itemChild,itemChildIndex) in item.depositoryMains' :key='itemChildIndex' @click="toSelectPage(itemChild)">
                        <img :src="imgData[getRandom()]" alt="">
                        <span class="left">{{itemChild.name}}</span>
                        <span style="background-color: #fff;"></span>
                    </li>
                </ul>
                
            </div>
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
        serverList:[],
        pageData:{
            id:''
        },
        imgData:[
            require("../../assets/images/icon_school.png"),
            require("../../assets/images/icon_restaurant.png"),
            require("../../assets/images/icon_Internet_cafe.png"),
            require("../../assets/images/icon_Agent_bookkeeping.png"),
            require("../../assets/images/icon_liquor.png"),
            require("../../assets/images/icon_Grain_Oil.png"),
            require("../../assets/images/icon_passport.png"),
            require("../../assets/images/icon_pass.png"),
            require("../../assets/images/icon_passport.png"),
            require("../../assets/images/icon_transaction.png")
            
        ],
    }
  },
  created () {
    this.member = JSON.parse(Cookies.get('member'+this.systemType))
    this.checkMobile()
    this.pageData = this.$route.query
    if(this.pageData.id){
        this.getMatterTypeList()
    }else{
        // this.getServerList()
        // this.getDict()
    }
    this.init()
  },
  methods: {
    init(){
        this.Dialog.confirm({
            closeOnClickOverlay:false,
            title: '系统提示',
            message: '请先选择办事类型？',
            cancelButtonText:'单一事项',
            cancelButtonColor:'#1989fa',
            confirmButtonText:'一事一次办'
        })
        .then(() => {
            // on confirm
            this.getDict()
        })
        .catch(() => {
            // on cancel
        });
    },  
    checkMobile(){
        if(!this.member.mobile){
            this.Dialog.alert({
                title: '系统提示',
                message: '请完善基础信息里的手机号码',
            }).then(() => {
                
                this.$router.push({ path: '/baseInfo', query: {checkMobile:true} })
            });
        }
    }, 
      getRandom(){
          return Math.floor(Math.random()*10)
      },
      getMatterTypeList(){
           httpAction('/Matter/pageDepositoryMetter', {
               body:{
                    attribute:[1],
                    subjectType:this.pageData.id
                },
                header: {
                    pageNumber: 1,
                    pageSize: 1000,
                    sortList: [
                        {
                            orderField: "updateTime",
                            orderType: "desc"
                        }
                    ]
                }
           }).then(response => {
            if (response.code == 0) {
                this.serverList = []
                let data = {
                    name:this.pageData.itemText,
                    depositoryMains:response.data.dataList
                }
                this.serverList = [data]
            }
          }).catch(error => {
            console.log(error)
          })
      },
      getServerList(type,pageNumber){
        let queryData = {
            body: "",
            header: {
                pageNumber: 1,
                pageSize: 5,
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
        httpAction('/Wxdetailedlist/detailedlist', {}).then(response => {
            if (response.code == 0) {
                this.serverList = []
                this.serverList = response.data
            }
            toastItem.clear();
          }).catch(error => {
            console.log(error)
            toastItem.clear();
          })
      },
      toSearch(){
        this.$router.push({
            path: '/search',
            // query: this.nowRowData
        })
      },
      toSelectPage(data){
        data.isHistory = false  
        this.$router.push({
            path: '/serverDetail',
            query: data
        })
      },
      //获取类型数据字典
      getDict(){
          let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...',
        })
           httpAction('/dict/findDictByCode', {body:'ZTLX'}).then(res => {
            if (res.code == 0) {
                let arr = res.data.items
                this.serverList = []
                if(arr.length>0){
                    arr.forEach((item,index)=>{
                        let obj = {
                            name:item.itemText,
                            depositoryMains:[],
                            loading:true
                        }
                        httpAction('/Subject/wxPage', {
                            body:{
                                // attribute:[1],
                                recyclingMark: false,
                                subjectType:item.id
                            },
                            header: {
                                pageNumber: 1,
                                pageSize: 1000,
                                sortList: [
                                    {
                                        orderField: "updateTime",
                                        orderType: "desc"
                                    }
                                ]
                            }
                        }).then(resData => {
                            if (res.code == 0) {
                                obj.depositoryMains = resData.data.dataList
                              
                            }
                             setTimeout(()=>{
                                toastItem.clear();
                            },500)
                            obj.loading = false
                        })
                        this.serverList.push(obj)
                    })
                }
            }
          }).catch(error => {
            console.log(error)
          })
      }

  }
}
</script>
<style scoped>
    .all{
        height: 100vh;
    }
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
        box-shadow: 0px 2px 15px 1px #D9D9D9;
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
        background: url(../../assets/images/-s-icon_arrowR.png) no-repeat right;
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
        font-size: 14px;
        font-weight: bold;
        vertical-align: middle;
    }
     .serve-list li > span.left{
        display: inline-block;
        width: calc(100% - 55px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .serve-list li > span:last-child{
        font-size: 12px;
        color:#9D9D9D;
        background-color: #E4E4E4;
        float: right;
        min-width: 5px;
        height: 18px;
        line-height: 18px;
        margin-top: 15px;
        text-align: center;
        border-radius: 10px;
        margin-right: 18px;
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
        margin-right: 15px;
        width: 12px;
        height: 12px;
    }
    .serve-list.last-span-none li > span:last-child,
    .serve-list li.firstNone > span:last-child{
        background: none;
    }
    .answer .serve-list li{
        background: none;

    }
    .answer .serve-list li > span{
        font-weight: 500;
    }
    .answer .serve-list li.firstNone{
        background: #EFF3FF;
        text-align: center;
    }
    .answer .serve-list li.firstNone > span {
        background: #EFF3FF;
        font-size: 15px;
        color: #2855E4;
        margin: 0;
        padding: 0 15px;
        text-align: center;
        font-weight: bold;
    }
    .answer .serve-list li img{
        width: 12px;
        height: 12px;
    }
</style>