<template>
  <div style="overflow: hidden; max-height: 100vh">
    <van-sticky :offset-top="6" class="closeBtn" v-if="!isView"
      ><van-button
        icon="cross"
        size="small"
        color="#b2b2b3"
        @click="closeChart"
    /></van-sticky>
    <div class="all">
      <div ref="chatCon" class="chat-con" v-loading="chartInfo.msg_loading">
        <ul>
          <template v-for="(item, index) in msgList">
            <li
              :key="index"
              :class="{
                'self-msg': item.type == 1,
                isFile: item.isFile,
              }"
              v-if="item.type <= 1"
              @click="openFile(item)"
            >
              <p>{{ item.name }}</p>
              <template v-if="item.type == 0">
                <div class="left">
                  <img class="userImg" :src="serviceImg" alt="" />
                </div>
                <div class="right">
                  <img src="@/assets/images/leftArrow.png" alt="" />

                  <template v-if="item.isFile">
                    <div>
                      <img
                        :src="item.info.url"
                        :width="item.info.width"
                        :height="item.info.height"
                        :alt="item.info.name"
                        class="msg-img"
                        @click.stop="showImage(item)"
                        object-fit="cover"
                        @load="imgOnLoad(index)"
                      />
                    </div>
                  </template>
                  <template v-else-if="item.messageType === 4">
                    <div @click.stop>
                      <a class="link-url" :href="item.messageUrl">{{
                        item.message
                      }}</a>
                    </div>
                  </template>
                  <template v-else>
                    <div>{{ item.message }}</div>
                  </template>
                </div>
              </template>
              <template v-else-if="item.type == 1">
                <div class="right">
                  <img src="@/assets/images/rightArrow.png" alt="" />
                  <template v-if="item.isFile">
                    <div @click.stop="showImage(item)">
                      <img
                        :src="item.info.url"
                        :width="item.info.width"
                        :height="item.info.height"
                        :alt="item.info.name"
                        class="msg-img"
                        object-fit="cover"
                        @load="imgOnLoad(index)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div>{{ item.message }}</div>
                  </template>
                </div>
                <div class="left">
                  <img class="userImg" :src="imgUrl" alt="" />
                </div>
              </template>
            </li>

            <li :key="index" class="timer" v-else-if="item.type === 21">
              {{ item.message }}
            </li>

            <li :key="index" class="tips" v-else-if="item.type === 20">
              {{ item.message }}
            </li>

            <li :key="index" v-else-if="item.type === 22" class="evaluate">
              <p>{{ item.name }}</p>
              <div class="left">
                <img
                  class="userImg"
                  src="@/assets/images/icon_avatar.png"
                  alt=""
                />
              </div>
              <div class="right">
                <img src="@/assets/images/leftArrow.png" alt="" />

                <div style="width: 100%">
                  <div class="evaluate-wrapper" @click.stop>
                    <p>请您对本次服务进行评价</p>
                    <div class="rate">
                      <span>评分：</span>
                      <van-rate
                        v-model="evaluate.score"
                        :size="20"
                        color="#ffd21e"
                        void-icon="star"
                        void-color="#a1a6af"
                      />
                    </div>
                    <div class="content">
                      <van-field
                        label="内容"
                        label-width="35px"
                        v-model="evaluate.content"
                        rows="2"
                        autosize
                        type="textarea"
                        placeholder="请对此次服务进行评价"
                      />
                    </div>
                    <van-row style="width: 100%; margin-top: 10px" gutter="20">
                      <van-col span="12"
                        ><van-button size="small" block @click="toGroupList"
                          >取消</van-button
                        ></van-col
                      >
                      <van-col span="12"
                        ><van-button
                          size="small"
                          block
                          type="info"
                          @click="submitForm"
                          >确定</van-button
                        ></van-col
                      >
                    </van-row>
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="bottom-div">
      <van-field
        class="message-box"
        v-model="message"
        placeholder="请输入..."
        :disabled="isView"
        ref="inputBox"
      />
      <van-uploader
        :disabled="isView"
        :after-read="uploadFile"
        result-type="file"
        multiple
      >
        <span class="spanBtn" @click="selectFile"
          ><van-icon name="photo-o" size="30px"
        /></span>
      </van-uploader>
      <span class="spanBtn" style="margin: 0 10px" @click="sendBtn"
        ><van-icon name="share" size="30px"
      /></span>
      <!-- <van-search v-model="message" placeholder="请输入..." show-action :use-action-slot="true" left-icon="" @search="sendBtn" :disabled="isView" ref="inputBox">
        <div slot="action" class="action-style">
          <van-uploader :disabled="isView" :after-read="uploadFile" result-type="file" multiple>
            <span class="spanBtn" @click="selectFile"><van-icon name="photo-o" size="30px" /></span>
          </van-uploader>
          <span class="spanBtn" @click="sendBtn"><van-icon name="share" size="30px" /></span>
        </div>
      </van-search> -->
    </div>

    <van-overlay :show="isShow" @click="isShow = false">
      <div class="wrapper" @click.stop>
        <div class="evaluate">
          <p class="title">评价</p>
          <div class="grade-wrapper">
            <div
              class="grade-item"
              :class="{ active: item.value === evaluate.score }"
              v-for="item in grade"
              :key="item.value"
              @click="evaluate.score = item.value"
            >
              <div>{{ item.label }}</div>
            </div>
          </div>
          <van-field
            label="内容"
            label-width="35px"
            v-model="evaluate.content"
            rows="2"
            autosize
            type="textarea"
            placeholder="请对此次服务进行评价"
          />
          <van-row style="width: 100%; margin-top: 10px" gutter="20">
            <van-col span="12"
              ><van-button block @click="toGroupList">取消</van-button></van-col
            >
            <van-col span="12"
              ><van-button block type="info" @click="submitForm"
                >确定</van-button
              ></van-col
            >
          </van-row>
        </div>
      </div>
    </van-overlay>
    <!-- <input type="file" ref="file" @change="uploadFile"
                  multiple style="visibility: hidden;height: 0;width: 0;" /> -->
  </div>
</template>
<script>
import { httpAction } from "@/api/manage";
import Cookies from "js-cookie";
import { getToken } from "@/utils/auth";
import timerMixin from "@/mixins/timer.js";
import infoMixin from "@/mixins/infoMixin.js";

let dialogTimer = null;
let timerNum = 0;
export default {
  name: "Message",
  components: {},
  mixins: [timerMixin, infoMixin],
  props: {},
  data() {
    return {
      formData: {
        id: "",
        name: "",
        sex: "",
        mobile: "",
        password: "",
      },
      createTime: "",
      sexSelectShow: false,
      setMobile: "",
      setCode: "",
      setPassword: "",
      sendText: "发送验证码",
      sendStatus: true,
      clearTime: null,
      popupShow: false,
      mobileAdd_edit: false, // false 编辑 true 新增
      password_popupShow: false,
      toastItem: null,
      message: "",
      msgList: [
        // {name:'客服1',message:'您还可以享受以下优',type:0},
        // {name:'1390000000',message:'有什么活动吗',type:1},
        // {name:'客服1',message:'话建议及时下单锁定库存哦，现在的价格都是超值优惠哒~不定时涨价',type:0},
        // {name:'1390000000',message:'锁定库存哦，现在的价格都',type:1},
        // {name:'客服1',message:'什么',type:1},
      ],
      chartInfo: {
        myId: "", // 自己的 id
        groupId: "", //组消息 id
        msg_loading: "", //是否正在加载信息
        selected: {
          id: "",
          name: "",
          timer: 5000,
        }, // 当前的客服
      },
      timer: {
        getMsg: undefined, // 获取聊天信息定时器
      },
      pageData: {
        id: "",
      },
      isView: false,
      isShow: false,
      evaluate: {
        score: 0,
        content: "",
      },
      grade: [
        {
          value: 3,
          label: "差评",
        },
        {
          value: 2,
          label: "中评",
        },
        {
          value: 1,
          label: "好评",
        },
      ],
      member: {},
      imgUrl: "",
      serviceImg: "",
    };
  },
  created() {
    this.pageData = this.$route.query || {};
    this.chartInfo.myId = this.user.member && this.user.member.id;
    if (this.pageData.id) {
      this.getGroupInfo();
    } else {
      this.createGroup();
    }
    this.member = JSON.parse(Cookies.get("member" + this.systemType));
    this.imgUrl = this.member.headimgurl
      ? this.member.headimgurl
      : require("../../assets/images/icon_avatar.png");
    this.serviceImg = require("../../assets/images/serveice.png");
  },
  destroyed() {
    this.enableQueryMsg(true);
  },
  methods: {
    // 获取组信息
    async getGroupInfo() {
      // this.Dialog.confirm({
      //     title: '标题',
      //     message: '是否继续上一次的聊天',
      //   })
      //   .then(async () => {
      this.showToast("加载会话中");

      this.chartInfo.groupId = this.pageData.id;
      await this.queryAllMsg();

      if (this.pageData.status === 3) {
        this.isView = true;
        this.Notify({
          type: "warning",
          message: "当前对话已经关闭",
          duration: 1500,
        });
      } else {
        this.checkDate();

        if (this.pageData.status === 1) {
          this.queryList()
            .then((data) => {
              if (data.length === 0) {
                this.setMsg([
                  {
                    content: "前方等候人数 " + 0 + " 人，请耐心等候客服接入",
                    createTime: Date.now(),
                    isTips: true,
                  },
                ]);
                return;
              }
              this.setMsg([
                {
                  content:
                    "前方等候人数 " +
                    (data.length - 1) +
                    " 人，请耐心等候客服接入",
                  createTime: Date.now(),
                  isTips: true,
                },
              ]);
            })
            .catch((_) => {});
        }
        this.enableQueryMsg();
      }

      this.clearToast();
      // })
      // .catch(async () => {
      //   await this.$store.dispatch('user/resetGroupId');
      //   this.createGroup();
      // });
    },
    // 检查是否在工作时间段
    checkDate() {
      const nowDate = new Date();
      const queryDay = `${
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1 < 10
          ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1) +
        "-" +
        nowDate.getDate()
      }`;
      httpAction("/workTime/queryList", {
        body: {
          queryDay,
        },
      })
        .then((res) => {
          if (res.code === 0 && res.data.length > 0) {
            const data = res.data[0];
            if (data.status === 1) {
              const period = data.period.split(",");
              const time = nowDate.getTime();
              console.log("现在的时间戳", time);
              const tips = {
                flags: true,
                msg: period.join("\n"),
              };
              for (const item of period || []) {
                const arr = item.split("-");
                const start = new Date(
                  queryDay + " " + arr[0] + ":00:00"
                ).getTime();
                const end = new Date(
                  queryDay + " " + arr[1] + ":00:00"
                ).getTime();
                console.log("开始时间戳", start, "结束时间戳", end);
                if (time > start && time < end) {
                  tips.flags = false;
                  break;
                }
              }
              if (tips.flags) {
                this.showMsgBox(
                  "当前客服不在线，您可以先留言，等待客服上线后会及时回复您。"
                );
              }
            } else {
              this.showMsgBox(
                "当前客服不在线，您可以先留言，等待客服上线后会及时回复您。"
              );
            }
          }
        })
        .catch(() => {});
    },
    showMsgBox(msg) {
      // timerNum = 0;
      // dialogTimer && clearInterval(dialogTimer);

      // dialogTimer = setInterval(() => {
      //   timerNum += 1;

      //   if(timerNum === 5){
      //     this.Dialog.setDefaultOptions({
      //       confirmButtonColor: '#ee0a24'
      //     });
      //     clearInterval(dialogTimer);
      //   }
      // }, 1000);

      // this.Dialog.setDefaultOptions({
      //   confirmButtonColor: '#ccc'
      // });

      // this.$nextTick(() => {
      this.Dialog.alert({
        title: "温馨提示",
        message: msg,
        confirmButtonText: "我知道了",
        beforeClose: this.beforeClose,
      }).then(() => {
        // on close
      });
      // });
    },
    beforeClose(action, done) {
      // if(timerNum >= 5){
      //   timerNum = 0;
      done();
      // }else{
      //   done(false);
      // }
    },
    // 实时获取聊天信息
    enableQueryMsg(valid) {
      if (valid) {
        this.timer.getMsg && clearInterval(this.timer.getMsg);
        return;
      }

      this.timer.getMsg = setInterval(() => {
        httpAction("/message/read", {
          body: {
            groupId: this.chartInfo.groupId,
            queryAll: false,
          },
        })
          .then(async (res) => {
            if (res.code === 0 && res.data && res.data.length > 0) {
              if (!this.chartInfo.selected.id) {
                this.chartInfo.selected.name = res.data[0].createName;
                this.chartInfo.selected.id = res.data[0].createBy;
              }

              let promises = [];
              res.data.forEach((item) => {
                promises.push(this.setMsgBefore(item));
              });
              Promise.all(promises)
                .then((values) => {
                  let msgList = [];
                  msgList = values.reduce((pre, curr, arr) => {
                    return pre.concat(curr);
                  });
                  this.setMsg(msgList);
                })
                .catch((_) => {});
            }
          })
          .catch((_) => {
            clearInterval(this.timer.getMsg);
          });
      }, 4000);
    },
    // 创建一个 组消息
    async createGroup() {
      this.showToast("创建会话中");
      await this.queryAllMsg();
      httpAction("/message/linkcustomer", {
        body: "",
      })
        .then((res) => {
          if (res.code === 0) {
            this.chartInfo.groupId = res.data.id;
            this.queryList()
              .then((data) => {
                this.checkDate();
                if (data.length === 1) {
                  this.setMsg([
                    {
                      content: "前方等候人数 " + 0 + " 人，请耐心等候客服接入",
                      createTime: Date.now(),
                      isTips: true,
                    },
                  ]);
                  return;
                }
                this.setMsg([
                  {
                    content:
                      "前方等候人数 " + data.length + " 人，请耐心等候客服接入",
                    createTime: Date.now(),
                    isTips: true,
                  },
                ]);
              })
              .catch((_) => {});
            this.enableQueryMsg();
          }
          this.clearToast();
        })
        .catch((err) => {
          // this.$router.go(-1);
          this.isView = true;
          this.clearToast();
        });
    },
    onSearch() {
      this.Toast("搜索" + this.message);
    },
    // 设置滚动条位置
    autoScorll() {
      this.$nextTick(() => {
        const sh = this.$refs.chatCon.scrollHeight;
        this.$refs.chatCon.scrollTop = sh;
      });
    },
    // 添加一条信息
    setMsg(msgList) {
      if (!msgList) {
        return;
      }

      msgList.forEach((item) => {
        if (typeof item.createTime === "string") {
          item.createTime = this.getTimestamp(item.createTime);
        }

        const lastMsg = this.msgList[this.msgList.length - 1];
        const res = this.timeFrom(
          item.createTime,
          lastMsg && lastMsg.createTime
        );
        res &&
          this.msgList.push({
            name: "sys",
            message: res,
            type: 21,
            createTime: item.createTime,
          });

        if (item.isTips) {
          this.msgList.push({
            name: "sys",
            message: item.content,
            type: 20,
            createTime: item.createTime,
          });
        } else if (item.isFile) {
          this.msgList.push({
            name:
              item.createBy === this.chartInfo.myId
                ? `${this.member.realName || "我"}`
                : `客服(${item.createName})`,
            message: item.content,
            type: item.createBy === this.chartInfo.myId ? 1 : 0,
            createTime: item.createTime,
            isFile: true,
            info: item.info,
          });
        } else {
          let type = item.createBy === this.chartInfo.myId ? 1 : 0;

          if ([5, 6, 7, 8].includes(item.messageType)) {
            type = 20;
          }

          this.msgList.push({
            name:
              item.createBy === this.chartInfo.myId
                ? `${this.member.realName || "我"}`
                : `客服(${item.createName})`,
            message: item.content,
            type,
            createTime: item.createTime,
            isFile: false,
            isTips: false,
            messageType: item.messageType,
            messageUrl: item.messageUrl,
          });

          if (item.messageType === 6) {
            this.msgList.push({
              name: "客服",
              message: "",
              type: 22,
              createTime: item.createTime + 1,
              isFile: false,
              isTips: false,
            });
          }
        }
      });

      this.$nextTick(() => {
        this.autoScorll();
      });
    },
    // 覆盖信息
    setMsgAll(data) {
      if (!data) {
        return;
      }

      let msgList = [];
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        if (typeof item.createTime === "string") {
          item.createTime = this.getTimestamp(item.createTime);
        }

        const lastMsg = msgList[msgList.length - 1];
        const res = this.timeFrom(
          item.createTime,
          lastMsg && lastMsg.createTime
        );
        res &&
          msgList.push({
            name: "",
            message: res,
            type: 21,
            createTime: item.createTime,
          });

        if (item.isTips) {
          msgList.push({
            name: "sys",
            message: item.content,
            type: 20,
            createTime: item.createTime,
          });
        } else if (item.isFile) {
          msgList.push({
            name:
              item.createBy === this.chartInfo.myId
                ? `${this.member.realName || "我"}`
                : `客服(${item.createName})`,
            message: item.content,
            type: item.createBy === this.chartInfo.myId ? 1 : 0,
            createTime: item.createTime,
            isFile: true,
            info: item.info,
          });
        } else {
          let type = item.createBy === this.chartInfo.myId ? 1 : 0;

          if ([5, 6, 7, 8].includes(item.messageType)) {
            type = 20;
          }

          msgList.push({
            name:
              item.createBy === this.chartInfo.myId
                ? `${this.member.realName || "我"}`
                : `客服(${item.createName})`,
            message: item.content,
            type,
            createTime: item.createTime,
            isFile: false,
            messageType: item.messageType,
            messageUrl: item.messageUrl,
          });
        }
      }
      this.msgList = msgList;

      this.$nextTick(() => {
        this.autoScorll();
      });
    },
    sendBtn() {
      if (this.chartInfo.msg_loading) {
        this.Toast("请稍后，正在加载消息列表");
        return;
      }

      if (this.chartInfo.groupId === "") {
        this.Toast("请稍后，正在连接至服务器");
        this.createGroup();
        return;
      }

      if (this.message == "") {
        this.Toast("请输入内容");
        return;
      }

      // this.showToast()
      httpAction("/message/sendMessage", {
        body: {
          content: this.message,
          groupId: this.chartInfo.groupId,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.setMsg([
              {
                createBy: this.chartInfo.myId,
                content: this.message,
                createTime: Date.now(),
              },
            ]);

            this.message = "";
            this.$refs.inputBox.focus();
          }
          // this.clearToast()
        })
        .catch((error) => {
          // this.clearToast()
          console.log(error);
        });
    },
    showToast(text) {
      this.toastItem = this.Toast.loading({
        duration: 0,
        forbidClick: true,
        message: text || "加载中...",
      });
    },
    clearToast() {
      if (this.toastItem) {
        this.toastItem.clear();
      }
    },

    backPage() {
      // this.$router.go(-1)
      this.$router.push("/my");
    },

    // 查询当前组的全部消息
    async queryAllMsg() {
      if (this.chartInfo.msg_loading) {
        return;
      }

      this.chartInfo.msg_loading = true;
      try {
        const res = await httpAction("/message/queryHistory", {
          body: {
            // groupId: this.chartInfo.groupId,
            // queryAll: true
            id: this.chartInfo.myId,
          },
          header: {
            pageNumber: 1,
            pageSize: 5000,
          },
        });

        if (res.code === 0) {
          if (res.data.length > 0 && !this.chartInfo.selected.id) {
            this.chartInfo.selected.name = res.data[0].createName;
            this.chartInfo.selected.id = res.data[0].createBy;
          }
          let promises = [];
          res.data.forEach((item) => {
            promises.push(this.setMsgBefore(item));
          });
          Promise.all(promises)
            .then((values) => {
              let msgList = [];
              msgList = values.reduce((pre, curr, arr) => {
                return pre.concat(curr);
              });
              this.setMsgAll(msgList);
            })
            .catch((_) => {});
        }
      } catch (err) {}

      this.chartInfo.msg_loading = false;
    },
    selectFile() {
      this.$refs.file.click();
    },
    openFile(item) {
      if (item.isFile) {
        window.open(
          window._CONFIG["imgView"] + item.info.id + "&token=" + getToken()
        );
      }
    },
    uploadFile(e) {
      // this.send_loading = true;
      console.log(e);
      if (!(e instanceof Array)) {
        e = [e];
      }

      e = e.map((item) => item.file);
      const files = e;
      let request = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("files", file);
        request.push(httpAction("/file/upload", formData));
      }

      Promise.all(request)
        .then((values) => {
          let promises = [];
          values.forEach((res) => {
            const file = res.data; // file
            promises.push(
              new Promise((resolve, reject) => {
                httpAction("/message/sendMessage", {
                  body: {
                    content: "",
                    groupId: this.chartInfo.groupId,
                    folderId: file.referenceId,
                  },
                })
                  .then((result) => {
                    resolve(file);
                  })
                  .catch((_) => {
                    reject();
                  });
              })
            );
          });
          Promise.all(promises)
            .then((files) => {
              let msg = [];
              for (const file of files) {
                msg.push({
                  createBy: this.chartInfo.myId,
                  content: file.fileName,
                  createTime: file.createTime,
                  isFile: true,
                  info: {
                    url: window._CONFIG["apiUrl"] + file.fileUrl,
                    height: "auto",
                    width: "auto",
                    name: file.fileName,
                    id: file.id,
                    folderId: file.referenceId,
                  },
                });
              }
              this.setMsg(msg);
            })
            .catch((_) => {});
        })
        .catch((_) => {});
    },
    setMsgBefore(item) {
      return new Promise((resolve, reject) => {
        if (item.folderId) {
          httpAction("/file/findByReferenceId", {
            body: item.folderId,
          })
            .then((res) => {
              let msg = [];
              if (res.code === 0) {
                for (const file of res.data) {
                  msg.push({
                    createBy: item.createBy,
                    content: file.fileName,
                    createTime: item.createTime,
                    isFile: true,
                    info: {
                      url: window._CONFIG["apiUrl"] + file.fileUrl,
                      height: "auto",
                      width: "auto",
                      name: file.fileName,
                      id: file.id,
                      folderId: file.referenceId,
                    },
                  });
                }
              }
              resolve(msg);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve([item]);
        }
      });
    },
    asyncForEach(values, cb) {
      return new Promise((resolve) => {
        let count = 0;
        values.forEach(async (item) => {
          await cb(item);
          count++;
          if (count === values.length) {
            resolve();
          }
        });
      });
    },
    getImageInfo(data) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = window._CONFIG["apiUrl"] + data.fileUrl;
        img.name = data.fileName;
        img.id = data.id;
        img.folderId = data.referenceId;
        img.onload = function () {
          resolve(img);
        };
      });
    },
    showImage(item) {
      this.ImagePreview({
        images: [item.info.url],
        showIndex: false,
        loop: false,
        startPosition: 0,
      });
    },
    imgOnLoad(index) {
      if (this.msgList.length === index + 1) {
        this.$nextTick(() => {
          this.autoScorll();
        });
      }
    },
    closeChart() {
      this.Dialog.confirm({
        title: "提示",
        message: "是否确认关闭当前会话？关闭后无法恢复",
      })
        .then(async (res) => {
          this.showToast("关闭会话中");
          httpAction("/message/closeGroup", {
            body: this.chartInfo.groupId,
          })
            .then((res) => {
              this.setMsg([
                {
                  content: "当前会话已结束",
                  createTime: Date.now(),
                  isTips: true,
                },
              ]);
              this.isView = true;
              this.clearToast();
              // this.isShow = true;
            })
            .catch((_) => {
              this.clearToast();
            });
        })
        .catch((_) => {});
    },
    toGroupList() {
      this.$router.go(-1);
      // this.$router.push('/groupList');
    },
    // 查询待接列表
    queryList() {
      return new Promise((resolve, reject) => {
        httpAction("/message/queryGroup", {
          body: {
            queryCanJoin: true,
          },
          header: {
            pageNumber: 1,
            pageSize: 6000,
            sortList: [
              {
                orderField: "createTime",
                orderType: "desc",
              },
            ],
          },
        })
          .then((res) => {
            if (res.code === 0) {
              return resolve(res.data.dataList);
            }
            resolve([]);
          })
          .catch((_) => {
            reject();
          });
      });
    },
    submitForm() {
      this.showToast();
      httpAction("/message/comment", {
        body: {
          id: this.chartInfo.groupId,
          comment: this.evaluate.content,
          star: this.evaluate.score,
        },
      })
        .then((res) => {
          this.Notify({
            type: "success",
            message: "评价成功",
            duration: 1500,
          });
          this.clearToast();
          this.isShow = false;
          this.toGroupList();
        })
        .catch((_) => {
          this.clearToast();
        });
    },
    toPage(url) {
      window.open(url);
    },
  },
};
</script>
<style scoped>
.submit-div button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border-style: none;
  outline: none;
  background-color: #378cff;
  color: #ffffff;
}

.div-style {
  width: calc(100% - 83px);
  display: inline-block;
  vertical-align: middle;
  height: 45px;
  line-height: 45px;
  font-weight: 600;
  position: relative;
}
</style>
<style lang="scss" scoped>
.chat-con {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;

  ul {
    li .msg-img {
      max-width: 175px;
      max-height: 150px;
    }

    li {
      margin-bottom: 5px;
      margin-top: 15px;

      p {
        box-sizing: border-box;
        font-size: 12px;
        color: #a1a6af;
        padding: 0 65px;
        margin-bottom: 5px;
        width: 100%;
      }

      .left {
        width: 32px;
        height: 32px;
        border-radius: 3px;
        overflow: hidden;
        margin-left: 15px;
        vertical-align: top;
        display: inline-block;

        & > img {
          overflow: hidden;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .right {
        display: inline-block;
        width: calc(100% - 68px);
        max-width: calc(100% - 120px);
        vertical-align: middle;
        position: relative;
        box-sizing: border-box;
        min-height: 42px;
        line-height: 1.4;
        font-size: 13px;
        color: #252525;
        letter-spacing: 0;
        margin-left: 10px;

        & > img {
          position: absolute;
          width: 23px;
          height: 42px;
          top: 0;
          left: -6px;
        }

        & > div {
          position: relative;
          display: inline-block;
          min-height: 18px;
          line-height: 1.4;
          background-color: #f3f3f3;
          border-radius: 4px;
          padding: 12px 9px;
        }
      }

      &.isFile {
        cursor: pointer;

        & div {
          color: #409eff;
        }
      }
    }

    li.self-msg {
      text-align: right;

      .left {
        margin-right: 15px;
        margin-left: 0;
      }

      .right {
        margin-right: 10px;
        margin-left: 0;

        & > div {
          text-align: left;
          background-color: #d0e9ff;
        }

        & > img {
          left: auto;
          right: -6px;
        }
      }
    }

    li.timer,
    li.tips {
      text-align: center;
      padding: 4px 0;
      font-size: 14px;
      color: #a1a6af;
    }

    li.timer {
      margin-bottom: 0px;
    }

    li.tips {
      width: max-content;
      max-width: 90%;
      padding: 5px 10px;
      background-color: #f3f3f3;
      border-radius: 5px;
      word-break: break-all;
      position: relative;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}

.bottom-div {
  border-top: 1px solid #f7f8fa;
  height: 54px;
  display: flex;
  align-items: center;

  .action-style {
    height: 30px;

    .spanBtn {
      display: inline-block;
      padding: 0 5px;
    }
  }

  & ::v-deep {
    .message-box {
      padding: 0 16px;
    }

    input {
      padding: 7px 10px;
      background-color: #f7f8fa;
    }
  }
}

.all {
  background-color: #ededed;
  height: calc(100vh - 55px);
}

.closeBtn {
  text-align: right;
  position: absolute;
  top: 0;

  & >>> .van-sticky {
    padding-right: 6px;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  & .evaluate {
    background-color: #fff;
    padding: 10px 15px;
    width: 290px;
  }

  & .title {
    text-align: center;
    font-size: 15px;
    margin-bottom: 15px;
  }

  & >>> .van-cell {
    padding: 0;
    padding-top: 5px;
  }

  & >>> .van-rate {
    padding-top: 6px;
  }

  // & >>> .van-field__control {
    // background-color:#ccc !important;
  // }

  & .grade-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  & .grade-item {
    width: 28%;
    min-width: 81px;
    height: 90px;
    color: #fff;
    box-sizing: border-box;
    border-radius: 5px;

    & div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      writing-mode: vertical-rl;
    }

    &.active {
      border: 1px solid #ccc;
      padding: 3px;

      & div {
        border-radius: 5px;
      }
    }

    &:nth-child(1) div {
      background-color: #f56447;
    }

    &:nth-child(2) div {
      background-color: #e6a23c;
    }

    &:nth-child(3) div {
      background-color: #409eff;
    }
  }
}

.link-url {
  color: #3ca6ff !important;
  text-decoration: underline !important;
}

.evaluate-wrapper {
  color: #a1a6af;
  padding: 0 5px;

  p {
    text-align: left !important;
    padding: 0 !important;
  }

  .rate {
    display: flex;
    align-items: center;
  }

  .rate span {
    height: 20px;
    line-height: 22px;
  }

  .content {
    margin-top: 3px;
  }

  .content ::v-deep {
    .van-cell {
      padding: 0;
      background-color: transparent;
    }

    .van-cell__title {
      color: #a1a6af;
      margin-right: 5px;
    }
  }
}
.userImg {
  border-radius: 50%;
}
</style>
