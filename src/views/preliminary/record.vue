<template>
    <div>
        <div class="all" style="height:100vh">
        <ul class="form-list">
            <li>
                <img src="../../assets/images/icon_arrowL.png" alt="" @click="backPage">
                <span>预审记录</span>
            </li>
            <template v-if="historyData.length!=0">
                <!-- <li @click="toDetail(item)" v-for="(item,index) in historyData" :key='index' >
                    <img src="../../assets/images/icon_passport.png" alt="">
                    <span>{{item.subjectName}}  </span>
                     <span class="mini" @click.stop="clearFun(item.id)">
                         材料清单
                        <img src="../../assets/images/btn_clear.png" alt="">
                    </span>
                    <span class="time-style">{{item.createTime}}</span>

                </li> -->
                <van-collapse v-model="activeNames"  class="record-div">
                    <van-collapse-item :name="index" v-for="(item,index) in historyData" :key='index'>
                        <template #title>
                            <div class="record-list">
                                <div class="left">
                                    <span>{{item.subject?item.subject.name:''}} </span>
                                    <p class="record-list-time">{{item.createTime}}</p>
                                </div>
                                <span class="right" :style="{color: colorArr[item.status]}">{{ tipsArr[item.status] }}</span>
                            </div>

                        </template>
                        <div class="steps-div">
                            <p> <span @click.stop="toDetail(item)">详情</span> </p>
                            <van-steps direction="vertical" :active="item.wxOperationRecordAuditList ? item.wxOperationRecordAuditList.length -1 : 0"  :active-color="colorArr[item.status]">
                            <template v-for="(child, childIndex) in item.wxOperationRecordAuditList || []">
                              <van-step :key="childIndex">
                                  <h4 :style="{color: colorArr[child.status]}">{{ tipsArr[child.status] }}</h4>
                                  <p :style="{color: colorArr[child.status]}">{{child.createTime}}</p>
                                  <div v-if="child.status === 4" class="noPass-style">原因：{{item.reason}}</div>
                                  <div v-else-if="child.status === 3" class="noPass-style" style="color: #00b23f;">办理通知：{{item.reason}}</div>
                              </van-step>
                            </template>

                                <!-- <van-step v-if="item.auditStatus==3">
                                    <h4>审核通过</h4>
                                    <p>{{item.updateTime}}</p>
                                </van-step>
                                <van-step v-if="item.auditStatus==4">
                                    <h4>审核未通过</h4>
                                    <p>{{item.updateTime}}</p>
                                    <div class="noPass-style">原因：{{item.reason}}</div>
                                </van-step> -->
                            </van-steps>
                            <div class="bottom-btn" v-if="item.auditStatus==3">
                                <van-button size="small" type="info" @click="getQRcode()">优先二维码</van-button>
                                <div class="QRcode-div" v-if='QRcode_loading'>
                                    <van-loading type="spinner" color="#1989fa" v-if='!QRcode_show' />
                                    <van-image
                                    v-if="QRcode_show"
                                    width="180"
                                    height="180"
                                    fit="cover"
                                    src="https://img.yzcdn.cn/vant/cat.jpeg">
                                        <template v-slot:loading>
                                            <van-loading type="spinner" size="20" />
                                        </template>
                                    </van-image>
                                </div>

                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
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
import { httpAction } from "@/api/manage";
import Cookies from "js-cookie";
import infoMixin from "@/mixins/infoMixin.js";
export default {
  name: "index",
  components: {},
  mixins: [infoMixin],
  props: {},
  data() {
    return {
      historyData: [],
      activeNames: [],
      active: 0,
      QRcode_loading: false,
      QRcode_show: false,
      tipsArr: ["待提交", "待审核", "审核中", "审核通过", "审核未通过"],
      colorArr: ["#b2b3b7", "#3d65e6", "#edbe76", "#07c160", "#ff4949"],
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    if (window.history && window.history.pushState) {
      window.addEventListener("popstate", this.backPage, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.backPage, false);
  },
  methods: {
    getList() {
      let data = JSON.parse(Cookies.get("member" + this.systemType));
      let temp = {
        body: {
          memberId: data.id,
          recordType: 2,
          // statusList:[]//  0为待审,1为拒绝,2为通过
        },
        header: {
          pageNumber: 1,
          pageSize: 100,
          sortList: [
            {
              orderField: "updateTime",
              orderType: "desc",
            },
          ],
        },
      };
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      httpAction("/Wxoperation/pageList", temp)
        .then((response) => {
          if (response.code == 0) {
            this.historyData = response.data.content;
          }
          toastItem.clear();
        })
        .catch((error) => {
          toastItem.clear();
          console.log(error);
        });
    },
    //删除
    //   clearFun(id){
    //     let toastItem = this.Toast.loading({
    //         duration: 0, // 持续展示 toast
    //         forbidClick: true,
    //         message: '删除中...',
    //     })
    //       httpAction('/Wxoperation/deletebyid', {body:[id]}).then(response => {
    //         if (response.code == 0) {
    //             this.Toast('删除成功')
    //             this.getList()
    //         }
    //         toastItem.clear()
    //     }).catch(error => {
    //         console.log(error)
    //         toastItem.clear()
    //     })
    //   },
    backPage() {
      console.log("1");
      // this.$router.go(-1)
      this.$router.push({
        path: "/my",
      });
    },
    toDetail(data) {
      let ids = data.matterId ? data.matterId.split(",") : [];
      this.$router.push({
        path: "/recordDetail",
        query: {
          id: data.id,
          isView: data.status == 0 || data.status == 4 ? 1 : 0,
          routeName: "/record", //是否能编辑
        },
      });
    },
    getQRcode() {
      let toastItem = this.Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "该功能暂未上线，正在加急开发中~",
      });
      // this.QRcode_loading = true
      // this.QRcode_show = false
      setTimeout(() => {
        toastItem.clear();
      }, 2000);
    },
  },
};
</script>
<style scoped>
.form-list {
  margin: 15px 15px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 15px 1px #d9d9d9;
}
.form-list li {
  list-style-type: none;
  height: 60px;
  line-height: 55px;
  border-bottom: 1px solid #eeeeee;
  padding: 0 15px;
  position: relative;
  /* background: url(../../assets/images/-s-icon_checklist.png) no-repeat 96%;
    background-size: 12px; */
}
.form-list li img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 3px;
}
.form-list li > span {
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
.form-list li > span.mini {
  color: #acadb1;
  font-size: 12px;
  float: right;
  font-weight: 100;
  width: 73px;
}
.form-list li > span.time-style {
  color: #acadb1;
  font-size: 12px;
  display: block;
  height: 20px;
  line-height: 20px;
  position: absolute;
  bottom: 1px;
  left: 40px;
}
.form-list li:first-child {
  height: 50px;
  line-height: 50px;
  background: none;
  background-color: #eff3ff;
}
.form-list li:first-child span {
  color: #3d65e6;
}
.form-list li:first-child > img {
  width: 12px;
  height: 12px;
  margin-right: 10px;
}
.inp-style {
  width: calc(100% - 91px);
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  outline: none;
  border-style: none;
}
.form-list li > p {
  width: calc(100% - 83px);
  display: inline-block;
  vertical-align: middle;
  color: #e2e2e2;
}
.noPass-style {
  font-size: 12px;
  padding: 4px 0;
  color: #f40;
}
</style>
<style lang="less" scoped>
.record-list {
  width: 100%;
  .left {
    display: inline-block;
    width: calc(100vw - 165px);
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    img {
      width: 18px;
      height: 18px;
      object-fit: cover;
      vertical-align: middle;
      margin-right: 3px;
    }
    span {
      width: 100%;
      font-size: 14px;
      font-weight: bold;
      vertical-align: middle;
      color: #121212;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .record-list-time {
      color: #acadb1;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      // padding-left: 26px;
      font-weight: bold;
    }
  }
  .right {
    display: inline-block;
    vertical-align: middle;
    color: #acadb1;
    font-size: 12px;
    width: 60px;
    text-align: right;
    font-weight: 600;
  }
}
.steps-div {
  > p {
    // font-weight: 600;
    text-align: right;
    span {
      color: #3d65e6;
      font-size: 14px;
    }
  }
  .bottom-btn {
    text-align: left;
    padding-left: 30px;
    .QRcode-div {
      padding: 5px 0;
      text-align: center;
      border: 1px solid #eff3ff;
      width: 190px;
      height: 180px;
      margin-top: 10px;
      margin-top: 10px;
      border-radius: 5px;
      > div {
        display: inline-block;
        line-height: 180px;
      }
    }
  }
}
</style>
