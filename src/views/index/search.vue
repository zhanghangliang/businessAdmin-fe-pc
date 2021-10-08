<template>
    <div>
        <div class="all">
            <div class="top-search-div">
                <input type="text" placeholder="请输入名称" class="top-search" v-model='searchVal' @input="inpChange">
                <span class="top-search-btn" @click="searchBtn">搜索</span>
            </div>
            <div class="list-con-div" v-if='!isSearch'>
                <div class="history-con">
                    <p>
                        <span>历史记录</span>
                        <span v-if='historyRecord&&historyRecord.length>0'><img src="../../assets/images/btn_clear.png" alt="" @click="delRecord"></span>
                    </p>
                    <ul>
                        <li v-for="(item,index) in historyRecord" :key="index" @click="getValSearch(item.searchContent)">{{item.searchContent}}</li>
                    </ul>
                    <p v-if='historyRecord.length == 0' style="text-align: center;">暂无记录</p>
                </div>
                <div class="hot-key-con">
                    <p>
                        <span>热门关键词</span>
                    </p>
                    <ul>
                        <li v-for="(item,index) in hotServer" :key="index" @click="getValSearch(item.searchContent)"><img src="../../assets/images/icon_hot.png" alt="">{{item.searchContent}}</li>
                    </ul>
                </div>
            </div>
            <div v-if='isSearch' class="resultList">
                <template v-if='searchResult&&searchResult.length>0'>
                    <ul class="ul-hasData">
                        <li v-for="(list,index) in searchResult" :key='index' class="hasData" @click="toDetail(list)">
                            {{list.name}}
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <p class="noSearchData">暂无数据</p>
                </template>
                
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
        historyRecord:[],
        hotServer:[],
        searchVal:'',
        searchResult:[],
        isSearch:false,
        queryData:{
            body: '',
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
        },
        member:{}
    }
  },
  created () {
    this.member = JSON.parse(Cookies.get('member'+this.systemType))
    this.getRecord()
  },
  methods: {
      //清除记录
      delRecord(){
          httpAction('/Wxsearch/delrecord', {body:this.member.id}).then(response => {
            if (response.code == 0) {
                this.Notify({ 
                    type: response.msg == 'success' ? 'success' : 'warning',
                    message: '发送'+ (response.msg == 'success' ? '成功' : '失败')
                })
                this.getRecord()
            }
          }).catch(error => {
            console.log(error)
          })
      },
      //获取历史记录和热门
      getRecord(){
          let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...',
          })
          this.queryData.body = this.member.id
          httpAction('/Wxsearch/getAllsearch', this.queryData).then(response => {
            if (response.code == 0) {
                this.historyRecord = response.data.user.content
                this.hotServer = response.data.all.content
            }
            toastItem.clear()
          }).catch(error => {
            console.log(error)
            toastItem.clear()
          })
      },
      //搜索
      searchBtn(){
          if(this.searchVal == ''){
            this.Toast('请输入搜索内容');  
            return
        }
        let temp = {
            body:{
                searchContent:this.searchVal,
                memberId:this.member.id
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
            duration: 0, 
            forbidClick: true,
            message: '加载中...',
        }) 
        this.isSearch = true
        httpAction('/Wxsearch/addsearchhistory', temp).then(response => {
            if (response.code == 0) {
                this.searchResult = response.data.content
            }
            toastItem.clear()
          }).catch(error => {
            toastItem.clear()
            console.log(error)
          })
      },
      
      toDetail(data){
        this.$router.push({
            path: '/serverDetail',
            query: data
        })
      },
      toSearch(){
        this.$router.push({
            path: '/search',
            // query: this.nowRowData
        })
      },
      inpChange(){
          if(this.searchVal == ''){
            this.isSearch=false
            this.getRecord()
          }
      },
      getValSearch(val){
        this.searchVal = val
        this.searchBtn()
      }

  }
}
</script>
<style scoped>
    *{
    margin: 0;
    padding: 0;
}
.all{
    background-color: #EDEDED;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}
.top-search-div {
    background-color: #FAFAFA;
    height: 45px;
    padding: 10px 15px;
}
.top-search{
    width: calc(100% - 80px);
    height: 45px;
    border-radius: 5px;
    line-height: 45px;
    background: url(../../assets/images/icon_search.png) no-repeat 8px 13px;
    background-size: 16px;
    border-style: none;
    background-color: #E6E6E6;
    padding-left: 32px;
    outline: none;
    font-size: 12px;
}
.top-search-btn{
    display: inline-block;
    width: 43px;
    font-size: 15px;
    /*font-weight: 600;*/
    text-align: center;
    cursor: pointer;
}
.list-con-div{
    /*width: 100%;*/
    padding: 10px 15px 0;
    height: calc(100vh - 70px);
    overflow-y: auto;
    overflow-x: hidden;
}
.list-con-div p{
    line-height: 30px;
    height: 30px;
    font-size: 13px;
    width: 100%;
    color: #979797;
    margin-bottom: 8px;
}
.history-con img{
    width: 15px;
    height: 15px;
    vertical-align: middle;
    float: right;
    margin-top: 7px;
}
.list-con-div ul li {
    list-style-type: none;
    font-size: 12px;
    width: calc(50% - 30px);
    border-radius: 10px;
    background-color: #E5E5E5;
    display: inline-block;
    padding: 5px 10px;
    margin-bottom: 12px;
    color: #333333;
}
.list-con-div ul li:nth-child(2n+1){
    margin-right: 15px;
}
.list-con-div .history-con{
    margin-bottom: 20px;
}
.list-con-div ul li img{
    width: 15px;
    height: 15px;
    vertical-align: text-top;
    margin-right: 5px;
}
.ul-hasData{
    background-color: #ffffff;
    margin-top: 5px;
}
.hasData{
    height: 55px;
    line-height: 55px;
    margin: 0 15px;
    background-color: #fff;
    border-bottom: 1px solid #E2E2E2;
    font-weight: 600;
    font-size: 15px;
    color: #090909;
    list-style-type: none;
    background: url(../../assets/images/-s-icon_arrowR.png) no-repeat right;
    background-size: 12px;
}
.noSearchData{
    line-height: 30px;
    height: 30px;
    font-size: 13px;
    width: 100%;
    color: #979797;
    margin: 10px 0;
    text-align: center;
}
.resultList{
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 65px);
}
</style>