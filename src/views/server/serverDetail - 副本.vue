<template>
  <div>
    <div class="all">
      <div class="con-item-div answer" style="padding-top: 10px;">
        <ul class="serve-list last-span-none">
          <li class="firstNone">
            <span>{{ currentData.situation.upmatterName }}</span>
            <span style="display: none;" />
          </li>
          <template v-if="refresh">
            <li v-for="(item,index) in currentData.sonSituation" :key="index" :class="{isSelected:isSelected(item.id)}" @click.stop="selectItem(item)">
              <span>{{ index+1+'、' }}{{ item.matterName }}</span>
              <span />
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="bottom-div">
      <div class="btn-div" style="text-align: center;">
        <button class="left" style="width: calc(50% - 8px);" :disabled="stepArr.length==1" @click="prevLevel">上一步</button>
        <button class="middle" style="width: calc(50% - 8px);" @click="toNextLevel">下一步</button>
        <!-- <button class="right" @click="getMaterial">材料清单</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { httpAction } from '@/api/manage'
import bottomMenu from '@/components/menu'
export default {
  name: 'Index',
  components: {
    bottomMenu
  },

  props: {

  },
  data () {
    return {
      serverList: [],
      stepArr: [],
      stepIndex: 0,
      refresh: true,
      selectdDataArr: [],
      moreSelect: false,
      currentData: '',
      wxOperationRecord: [],
      recordId: {},
      operationType: 1, // 0上一步 1 下一步
      listIds: [],
      allData: [],
      subjectId: '',
      currentData: {
        situation: '',
        sonSituation: []
      },
      selectedList: [
        { id: '', situation: [] }
      ],
      upoeration: '',
      flag: true
    }
  },
  created () {
    this.liData = this.$route.query
    // this.subjectId = this.liData.id
    // this.getLevelData(this.liData.id)

    if (this.liData.isHistory) { // 记录进
      if (!this.liData.subjectId) return
      this.subjectId = this.liData.subjectId

      this.selectedList = []
      this.stepIndex = 0
      const firstIds = this.liData.matterId.split(',')
      this.selectedList.push({
        id: this.liData.fatherId,
        situation: firstIds
      })
      this.upoeration = this.liData.id

      if (this.liData && this.liData.operationRecord.length > 0) {
        this.setDataList(this.liData.operationRecord)
      }

      this.selectdDataArr = this.selectedList[this.selectedList.length - 1].situation
      this.getLevelData(this.subjectId)
      this.flag = false
    } else { // 列表进
      this.subjectId = this.liData.id
      this.getLevelData(this.liData.id)
    }
  },
  methods: {
    setDataList(data) {
      data.forEach((item, index) => {
        const ids = item.matterId.split(',')
        this.selectedList.push({
          id: item.fatherId,
          situation: ids
        })
        this.stepIndex++
        this.upoeration = item.id
        if (item.operationRecord.length > 0) {
          this.setDataList(item.operationRecord)
        }
      })
    },
    getLevelData(data, liItem) {
      const toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      this.refresh = false

      httpAction('/Wxoperation/findsubject', { body: this.subjectId }).then(res => {
        if (res.code == 0) {
          this.allData = res.data
          this.currentData = this.allData[this.stepIndex]
        }
        toastItem.clear()
        this.refresh = true
      }).catch(error => {
        console.log(error)
        toastItem.clear()
        this.refresh = true
      })
    },
    // 下一步 1
    toNextLevel() {
      const data = this.selectedList[this.stepIndex]
      if (data && data.situation.length > 0) {
        this.operationType = 1
        this.stepIndex++
        if (this.stepIndex == this.allData.length) {
          //
          // this.Toast('没数据了')
          this.Dialog.confirm({
            title: '系统提示',
            message: '没有更多数据了，生成材料清单？'
          }).then(() => {
            this.getMaterial()
          }).catch(() => {
            this.stepIndex--
            this.flag = false
          })
        } else {
          if (this.selectedList[this.stepIndex] && this.selectedList[this.stepIndex].situation.length > 0) {
            this.selectdDataArr = this.selectedList[this.stepIndex].situation
          } else {
            this.selectdDataArr = []
          }

          this.currentData = this.allData[this.stepIndex]
        }
        if (this.liData.isHistory) {
          if (this.allData.length == this.selectedList.length) {
            this.flag = false
          }
        }
        if (this.flag) {
          this.setUnfinish()
        }
      } else {
        this.Toast('请选择数据')
      }

      this.flag = true
      // this.hasSelected = true
    },
    // 上一步 0
    prevLevel() {
      if (this.stepIndex > 0) {
        this.operationType = 0
        this.stepIndex--
        this.currentData = this.allData[this.stepIndex]
        this.selectdDataArr = this.selectedList[this.stepIndex].situation
        //   this.setUnfinish()

        this.flag = false
      }
    },
    toPage(path) {
      // this.$router.push({
      //     path: path,
      //     // query: this.nowRowData
      //   })
    },
    toSearch() {
      this.$router.push({
        path: '/search'
        // query: this.nowRowData
      })
    },
    backPage() {
      this.$router.go(-1)
    },
    getMaterial() {
      this.$router.push({
        path: '/serverTable',
        query: {
          ids: this.getIds(),
          subjectId: this.liData.id,
          name: this.liData.matterName,
          recordId: this.recordId,
          operationId: this.upoeration
        }
      })
    },
    getIds() {
      let ids = []
      this.selectedList.forEach((item) => {
        ids = [...ids, ...item.situation]
      })
      return ids
    },
    // 选择
    selectItem(data) {
      if (this.moreSelect) {
        let delIndex = null
        this.selectdDataArr.forEach((item, index) => {
          if (item == data.id) {
            delIndex = index
          }
        })

        if (delIndex != null) {
          this.selectdDataArr.splice(delIndex, 1)
          delIndex = null
        } else {
          this.selectdDataArr.push(data.id)
          // this.currentData = data.id
          this.selectedList[this.stepIndex] = {
            id: this.currentData.situation.id,
            situation: this.selectdDataArr
          }
          console.log(this.selectedList)
        }
      } else {
        // if(data.id == this.selectdDataArr[0]){
        //     this.selectdDataArr = []
        // }else{
        //     this.selectdDataArr = [data.id]
        //     this.selectedList[this.stepIndex] = {
        //         id:this.currentData.situation.id,
        //         situation:this.selectdDataArr
        //     }
        // }
        this.selectdDataArr = [data.id]
        this.selectedList[this.stepIndex] = {
          id: this.currentData.situation.id,
          situation: this.selectdDataArr
        }
      }
    },
    isSelected(id) {
      return this.selectdDataArr.includes(id)
    },
    // 添加未完成记录
    setUnfinish() {
      const temp = {
        matterIds: this.getIds(),
        operationType: this.operationType, // 0,1
        situation: this.selectedList[this.stepIndex - 1].id,
        subject: this.liData.id,
        upoeration: this.upoeration
      }

      // if(this.operationType == 0){ //上一步
      //     temp = {
      //         matterIds:this.selectedList[this.stepIndex].situation,
      //         operationType:0, //0,1
      //         situation:this.selectedList[this.stepIndex].id,
      //         subject:this.liData.id,
      //         upoeration:this.upoeration
      //     }

      // }else if(this.operationType == 1){ //下一步
      //     temp = {
      //         matterIds:this.getIds(),
      //         operationType:1, //0,1
      //         situation:this.selectedList[this.stepIndex-1].id,
      //         subject:this.liData.id,
      //         upoeration:this.upoeration
      //     }
      // }
      httpAction('/Wxoperation/unfinish', { body: temp }).then(res => {
        if (res.code == 0) {
          this.upoeration = res.data.id
        }
      }).catch(error => {
        console.log(error)
      })
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
