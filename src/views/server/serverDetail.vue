<template>
  <div>
    <div ref="scrollDiv" class="all" id="all">
      <div
        ref="scrollItem"
        class="con-item-div answer"
        style="padding-top: 10px"
      >
        <!-- <ul class="serve-list last-span-none">
                    <li class="firstNone">
                        <span>{{currentData.situation.upmatterName}}</span>
                        <span style="display: none;"></span>
                    </li>
                    <template v-if='refresh'>
                        <li v-for="(item,index) in currentData.sonSituation" :key='index' @click.stop="selectItem(item)" :class="{isSelected:isSelected(item.id)}">
                            <span>{{index+1+'、'}}{{item.matterName}}</span>
                            <span></span>
                        </li>
                    </template>
                </ul> -->
        <ul
          v-for="(allItem, allItemIndex) in allData"
          :key="allItemIndex"
          class="serve-list last-span-none"
        >
          <li class="firstNone">
            <span>{{ allItem.situation.matterName }}</span>
            <span style="display: none" />

            <template
              v-if="allItem.sonSituation && allItem.sonSituation.length > 0"
            >
              <template v-if="allItem.situation.strategy == 1">
                <van-radio-group v-model="allDataId[allItemIndex]">
                  <van-radio
                    v-for="(item, index) in allItem.sonSituation"
                    :key="index"
                    :name="item.id"
                    checked-color="#07c160"
                    :class="{ isCkecked: allDataId[allItemIndex] == item.id }"
                    @click="radioClick(item, allItemIndex, 1)"
                  >
                    <template #default>
                      {{ item.name }}
                      <span
                        class="warning-info"
                        v-if="
                          allDataId[allItemIndex] == item.id && item.forceRemind
                        "
                        >{{ item.remindContent }}</span
                      >
                      <span
                        class="detail-info"
                        @click.stop="showDetail(item.description)"
                        >详情</span
                      >
                    </template>
                  </van-radio>
                </van-radio-group>
              </template>
              <template v-else-if="allItem.situation.strategy == 2">
                <van-checkbox-group v-model="allDataId[allItemIndex]">
                  <van-checkbox
                    v-for="(item, index) in allItem.sonSituation"
                    :key="index"
                    :name="item.id"
                    checked-color="#07c160"
                    :class="{ isCkecked: allDataId[allItemIndex] == item.id }"
                    shape="square"
                    @click="
                      checkboxClick(
                        item,
                        allItemIndex,
                        0,
                        allItem.situation.lev
                      )
                    "
                  >
                    <template #default>
                      {{ item.name }}
                      <span
                        class="warning-info"
                        v-if="
                          allDataId[allItemIndex] == item.id && item.forceRemind
                        "
                        >{{ item.remindContent }}</span
                      >
                      <span
                        class="detail-info"
                        @click.stop="showDetail(item.description)"
                        >详情</span
                      >
                    </template>
                  </van-checkbox>
                </van-checkbox-group>
              </template>
            </template>
            <template v-else>
              <p class="no-data-p">暂无数据</p>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom-div">
      <div class="btn-div" style="text-align: center">
        <button
          class="left"
          style="width: calc(100% - 20px)"
          @click="getMaterial"
        >
          材料清单
        </button>
      </div>
    </div>
    <!-- 查看详细 -->
    <div class="password-popup">
      <div v-if="popupShow" class="popup-bg" @click="popupShow = !popupShow" />
      <div v-if="popupShow" class="mobile-popup-con">
        <p class="popup-title">详情</p>

        <div class="description">
          {{ description }}
        </div>
        <div class="popup-div-btn">
          <span @click="popupShow = !popupShow">关闭</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { httpAction } from "@/api/manage";
import bottomMenu from "@/components/menu";
import infoMixin from "@/mixins/infoMixin.js";
export default {
  name: "Index",
  components: {
    bottomMenu,
  },
  mixins: [infoMixin],

  props: {},
  data() {
    return {
      serverList: [],
      stepArr: [],
      stepIndex: 0,
      selectdDataArr: [],
      moreSelect: false,
      currentData: "",
      wxOperationRecord: [],
      recordId: {},
      operationType: 1, // 0上一步 1 下一步
      listIds: [],
      allData: [],
      subjectId: "",
      currentData: {
        situation: "",
        sonSituation: [],
      },
      selectedList: [{ id: "", situation: [] }],
      upoeration: "",
      flag: true,
      allDataId: [],
      popupShow: false,
      description: "",
    };
  },
  created() {
    this.liData = this.$route.query;
    console.log(this.liData.id);
    this.subjectId = this.liData.id;
    this.getLevelData(this.liData.id);
  },

  methods: {
    setDataList(data) {
      data.forEach((item, index) => {
        const ids = item.matterId.split(",");
        this.selectedList.push({
          id: item.fatherId,
          situation: ids,
        });
        this.stepIndex++;
        this.upoeration = item.id;
        if (item.operationRecord.length > 0) {
          this.setDataList(item.operationRecord);
        }
      });
    },
    getLevelData(data, liItem) {
      const toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });

      httpAction("/Wxoperation/findNextQuestion", {
        body: { subjectId: this.liData.id },
      })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.ships.length > 0) {
              this.allData = [];
              res.data.ships.forEach((item) => {
                let temp = {
                  situation: {
                    lastQaRelationShipId: item.id,
                    subjectId: item.subjectId,
                    matterName: item.question.name,
                    strategy: item.question.strategy, //this.liData.strategy || this.liData.subject.strategy || 1,
                    lev: 1,
                    topId: [item.id],
                  },
                  sonSituation: item.question.opinionList,
                };
                this.allData.push(temp);
              });

              // this.allData = [temp]
              console.log(this.allData);
              this.currentData = this.allData[this.stepIndex];
              this.allData.forEach((item) => {
                if (item.situation.strategy == 1) {
                  this.allDataId.push("");
                } else {
                  this.allDataId.push([]);
                }
              });
            } else {
              this.$router.push({
                path: "/serverTable",
                query: {
                  ids: [],
                  subjectId: this.liData.id,
                  name: this.liData.name,
                  recordId: this.recordId,
                  operationId: this.upoeration,
                },
              });
            }
          }
          toastItem.clear();
        })
        .catch((error) => {
          console.log(error);
          toastItem.clear();
        });
    },
    toPage(path) {
      // this.$router.push({
      //     path: path,
      //     // query: this.nowRowData
      //   })
    },
    toSearch() {
      this.$router.push({
        path: "/search",
        // query: this.nowRowData
      });
    },
    backPage() {
      this.$router.go(-1);
    },
    getMaterial() {
      let flag = true;
      console.log(this.allData);
      console.log(this.allDataId);
      if (this.allData.length == this.allDataId.length) {
        this.allDataId.forEach((item) => {
          if (Object.prototype.toString.call(item) == "[object Array]") {
            if (item.length == 0) {
              flag = false;
            }
          } else {
            if (!item) {
              flag = false;
            }
          }
        });
      } else {
        flag = false;
      }

      if (flag) {
        console.log(this.allDataId);
        let ids = [];
        this.allDataId.forEach((item) => {
          if (Object.prototype.toString.call(item) == "[object Array]") {
            ids = [...ids, ...item];
          } else {
            ids.push(item);
          }
        });
        console.log(ids);
        let toastItem = this.Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "加载中...",
        });
        let temp = {
          opinionIds: ids,
          subjectId: this.liData.id,
        };
        // if(this.selectData.finishId){
        //     temp.finishId = this.selectData.finishId
        // }
        httpAction("/Wxoperation/addRecord", { body: temp })
          .then((response) => {
            if (response.code == 0) {
              this.$router.push({
                path: "/serverTable",
                query: {
                  id: response.data.id,
                },
              });
            }
            toastItem.clear();
          })
          .catch((error) => {
            toastItem.clear();
            console.log(error);
          });
      } else {
        this.Toast("请完善所有数据");
      }
    },
    getIds() {
      let ids = [];
      this.selectedList.forEach((item) => {
        ids = [...ids, ...item.situation];
      });
      return ids;
    },
    // 选择
    selectItem(data) {
      if (this.moreSelect) {
        let delIndex = null;
        this.selectdDataArr.forEach((item, index) => {
          if (item == data.id) {
            delIndex = index;
          }
        });

        if (delIndex != null) {
          this.selectdDataArr.splice(delIndex, 1);
          delIndex = null;
        } else {
          this.selectdDataArr.push(data.id);
          // this.currentData = data.id
          this.selectedList[this.stepIndex] = {
            id: this.currentData.situation.id,
            situation: this.selectdDataArr,
          };
          console.log(this.selectedList);
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
        this.selectdDataArr = [data.id];
        this.selectedList[this.stepIndex] = {
          id: this.currentData.situation.id,
          situation: this.selectdDataArr,
        };
      }
    },
    isSelected(id) {
      return this.selectdDataArr.includes(id);
    },
    showDetail(data) {
      console.log(123);
      this.description = data;
      this.popupShow = true;
    },
    radioClick(item, index, type) {
      let temp = {
        lastQaRelationShipId: this.allData[index].situation
          .lastQaRelationShipId,
        opinionId: item.id,
      };

      let topId = this.allData[index].situation.topId;
      let curLev = this.allData[index].situation.lev;
      // if(item.forceRemind){
      //   this.Notify({type: 'warning', message: item.remindContent });
      // }
      this.getNextData(temp, (res) => {
        for (let i = this.allData.length - 1; i >= 0; i--) {
          // console.log((topId == this.allData[i].situation.topId)&&(this.allData[i].situation.lev>curLev))
          if (
            this.allData[i].situation.topId.includes(
              temp.lastQaRelationShipId
            ) &&
            this.allData[i].situation.lev > curLev
          ) {
            this.allData.splice(i, 1);
            this.allDataId.splice(i, 1);
          }
        }

        //  for (let i = this.allData.length - 1; i >= 0; i--) {
        //   if ((this.allData[i].situation.topId == this.allData[index].situation.topId)&&(this.allData[i].situation.lev > this.allData[index].situation.lev)) {
        //     this.allData.splice(i, 1)
        //     this.allDataId.splice(i, 1)
        //   }
        // }
        //  this.allData.forEach((obj,objIndex)=>{
        //       if(obj.situation.lev>this.allData[index].situation.lev){
        //           this.allData.splice(objIndex,1)
        //           this.allDataId.splice(objIndex,1)
        //       }
        //   })

        if (res.ships.length > 0) {
          let arr = [];
          res.ships.forEach((item, itemIndex) => {
            const temp = {
              situation: {
                // topId:topId,
                topId: [...topId, ...[item.id]],
                lastQaRelationShipId: item.id,
                subjectId: item.subjectId || item.question.id,
                matterName: item.question.name,
                strategy: item.question.strategy,
                lev: this.allData[index].situation.lev + 1,
                type: "radio",
              },
              sonSituation: item.question.opinionList,
            };
            let curIndex = index + (1 + itemIndex);
            this.allData.splice(curIndex, 0, temp);
            if (item.question.strategy == 1) {
              this.allDataId.splice(curIndex, 0, "");
            } else {
              this.allDataId.splice(curIndex, 0, []);
            }
          });
        } else {
          if (this.allData.length != index + 1) {
            // if (this.allData[index+1].situation.strategy == 1) {
            //   this.allDataId.splice(index + 1, 1, '')
            // } else {
            //   this.allDataId.splice(index + 1, 1, [])
            // }
          }
        }

        this.setScroll(index, 0);

        // this.$refs.scrollDiv.addEventListener('scroll', e => {
        // //     // console.log('父滚动条到页面顶部距离', e.target.offsetTop)
        //     console.log('相对距离', this.$refs.scrollDiv.scrollTop)
        // //     // console.log('绝对距离', e.target.offsetTop + this.$refs.scrollDiv.scrollTop)
        // }, false)
      });
    },
    setScroll(index, type) {
      this.$nextTick(() => {
        let listItem = document.getElementsByClassName("serve-list");
        let viewH = this.$refs.scrollDiv.offsetHeight;
        if (this.$refs.scrollItem.offsetHeight > viewH) {
          let curH = 0;
          for (let i = 0; i < index; i++) {
            if (listItem[i]) {
              curH += listItem[i].offsetHeight;
            }
          }
          let curItem = listItem[index - type].offsetHeight;

          if (curH + curItem > viewH) {
            this.$refs.scrollDiv.scrollBy(0, curItem);
          }
        }
      });
    },
    checkboxClick(item, index, type, lev) {
      for (let i = this.allData.length - 1; i >= 0; i--) {
        if (
          this.allData[i].situation.topId ==
            this.allData[index].situation.topId &&
          this.allData[i].situation.lev > lev
        ) {
          this.allData[i].sonSituation.forEach((obj) => {
            if (!this.allDataId[index].includes(obj.upmatterId)) {
              const num = this.allDataId.indexOf(obj.id);
              if (num != -1) {
                this.allDataId.splice(num, 1);
              }
            }
          });
          this.allData.splice(i, 1);
        }
      }

      // this.allDataId[index] = this.allDataId[index]!=''?[...this.allDataId[index]]:[]
      this.allDataId[index].forEach((obj, objIndex) => {
        let temp = {
          lastQaRelationShipId: this.allData[index].situation
            .lastQaRelationShipId,
          opinionId: obj,
        };
        let topId = this.allData[index].situation.topId;
        this.getNextData(temp, (res) => {
          if (res.ships.length > 0) {
            res.ships.forEach((item, itemIndex) => {
              let curObj = {};
              this.allData[index].sonSituation.forEach((more, moreIndex) => {
                if (obj == more.id) {
                  curObj = more;
                }
              });

              const temp = {
                situation: {
                  // topId:topId,
                  topId: [...topId, ...[item.id]],
                  lastQaRelationShipId: item.id,
                  subjectId: curObj.subjectId,
                  matterName: item.question.name,
                  strategy: item.question.strategy,
                  lev: this.allData[index].situation.lev + 1,
                  type: "checkbox",
                },
                sonSituation: item.question.opinionList,
              };
              let curIndex = index + (1 + itemIndex);
              this.allData.splice(curIndex, type, temp);
            });
          } else {
            // if (this.allData[index+1].situation.strategy == 1) {
            //   this.allDataId.splice(index + 1, 1, '')
            // } else {
            //   this.allDataId.splice(index + 1, 1, [])
            // }
          }
          //    this.allDataId[objIndex] = this.allDataId[objIndex]
          this.$set(this.allDataId, objIndex, this.allDataId[objIndex]);
        });
      });
      // console.log(this.allData)
      // console.log(this.allDataId)
      this.setScroll(index, 1);
    },
    getNextData(temp, successBack) {
      //  /Matter/queryDepositoryByParent
      // temp = {
      //   lastQaRelationShipId:'',
      //   opinionId:""
      // }
      const toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      temp.subjectId = this.liData.id;
      httpAction("/Wxoperation/findNextQuestion", { body: temp })
        .then((res) => {
          if (res.code == 0) {
            successBack && successBack(res.data);
          }
          toastItem.clear();
        })
        .catch((error) => {
          console.log(error);
          toastItem.clear();
        });
    },
  },
};
</script>
<style scoped>
.all {
  background-color: #fff;
}
.top-con {
  overflow: hidden;
  padding: 15px 15px 0;
}
.top-banner-div {
  width: 100%;
  height: 123px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
}
.top-banner-div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.top-search-div {
  width: 100%;
  height: 45px;
  background-color: #ffffff;
  border-radius: 5px;
  line-height: 45px;
  font-size: 14px;
}
.top-search-div img {
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin: 0 12px;
}
.con-item-div {
  padding-top: 30px;
}
.con-item-div p.title {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  border-left: 4px solid #00b240;
  padding-left: 15px;
  margin: 0px 15px 0;
}

.serve-item-div ul {
  padding: 15px 15px 0;
  margin-top: 10px;
  background-color: #ffffff;
}
.serve-item-div ul li {
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
.serve-item-div ul li:nth-child(2n + 1) {
  margin-right: 10px;
}
.serve-item-div ul li img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.serve-item-div ul li > div.info {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  width: calc(100% - 30px);
}
.serve-item-div ul li > div.info p {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.serve-item-div ul li > div.info span {
  font-size: 13px;
  line-height: 18px;
  display: inline-block;
}

.serve-list {
  /* margin: 10px 15px 20px;
        background-color: #ffffff;
        border-radius: 5px; */

  margin: 0 15px;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 10px 0 0;
}
.serve-list li {
  list-style-type: none;
  min-height: 2.2rem;
  line-height: 1.8rem;
  /* border-bottom: 1px solid #EEEEEE; */
  margin: 0 15px;
}
.serve-list li.isSelected {
  background: url(../../assets/images/icon_hook.png) no-repeat right;
  background-size: 12px;
}
.serve-list li img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 3px;
}
.serve-list li > span {
  font-size: 12px;
  font-weight: bold;
  vertical-align: middle;
}
.serve-list li > span:last-child {
  font-size: 12px;
  color: #9d9d9d;
  background-color: #e4e4e4;
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
.serve-list li > span.first {
  background-color: #fe0000;
  color: #ffc5c5;
}
.serve-list li > span.second {
  background-color: #ffb900;
  color: #feedc6;
}
.serve-list li > span.third {
  background-color: #00b80a;
  color: #ffffff;
}
.serve-list li:last-child {
  border-bottom: none;
}
.serve-list li.lastNone {
  background: none;
  text-align: center;
  font-size: 12px;
  color: #a1a1a1;
  font-weight: bold;
}
.serve-list li.firstNone {
  background: #fff;
  font-size: 12px;
  color: #2855e4;
  font-weight: bold;
  margin: 0;
  /* padding: 0 15px; */
}
.serve-list li.firstNone img {
  margin-right: 10px;
  width: 12px;
  height: 12px;
}
.serve-list.last-span-none li > span:last-child,
.serve-list li.firstNone > span:last-child {
  background: none;
}
/* .answer .serve-list li{
        background: none;

    } */
.answer .serve-list li > span {
  font-weight: 500;
}
.answer .serve-list li.firstNone {
  background: #fff;
  text-align: left;
}
.answer .serve-list li.firstNone > span {
  /* background: #EFF3FF; */
  font-size: 1rem;
  color: #484848;
  margin: 0;
  /* padding: 0 15px; */
  text-align: center;
  font-weight: bold;
}
.answer .serve-list li img {
  width: 12px;
  height: 12px;
}
.noData {
  margin: 10px 15px;
  font-size: 14px;
  color: #666;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.isSelect-style {
  display: inline-block;
  width: 12px;
}
.detail-info {
  padding-left: 10px;
  color: #2672ff;
  font-size: 12px;
  float: right;
}
.warning-info {
  color: #ff976a;
  padding-left: 10px;
}
.description {
  font-size: 0.9rem;
  color: #323233;
  min-height: 120px;
  max-height: 300px;
  overflow: auto;
  /* padding: 0 10px; */
  padding-right: 10px;
}
.no-data-p {
  color: #999;
  font-size: 12px;
  text-align: center;
  line-height: 100px;
}
</style>
