<template>
  <div class="navbar">
    <hamburger id="hamburger-container"
               :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" />

    <div class="sys-letf-div">
      <p class="sys-title">{{ sysInfo.cnName }}</p>
      <span>{{ sysInfo.enName }}</span>
    </div>
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <div class="right-moreEdit"> -->
        <!-- <el-dropdown trigger="click" @command="moreDoFun">
          <span class="write-icon" title="快捷入口">
            <i class="el-icon-edit-outline" />
          </span>
          <el-dropdown-menu slot="dropdown" class="moreEdit-dropdown">
            <el-dropdown-item v-for="(item,index) in tab" :key="index" :command="index">
              <div class="moreEdit-icon" :style="{'backgroundColor':item.color}">
                <img :src="item.img" alt="">
              </div>
              <span class="moreEdit-text">写{{ item.label }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- </div> -->
        <screenfull id="screenfull"
                    title="全屏"
                    class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <div class="realName-style">欢迎，{{ user.member.unitName }}</div>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect"
                   trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar"
               class="user-avatar">
          <div class="realName-style">{{ user.member.realName }}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item>
            <span style="display:block;"
                  @click="editPsd_show">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;"
                  @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <template>
      <el-dialog title="修改密码"
                 width="600px"
                 :visible.sync="dialogFormVisible"
                 :show-close="false"
                 :center="true"
                 append-to-body
                 :close-on-click-modal="false"
                 class="customerDialog is-dialog-default-min">
        <el-form ref="form"
                 :rules="rules"
                 :model="formData"
                 label-position="right"
                 label-width="90px">
          <el-form-item class="allWidth"
                        label="旧密码"
                        prop="oldPwd">
            <el-input v-model="formData.oldPwd"
                      type="password"
                      placeholder="请输入旧密码"
                      max-length="200" />
          </el-form-item>
          <el-form-item class="allWidth"
                        label="新密码"
                        prop="newPwd">
            <el-input v-model="formData.newPwd"
                      type="password"
                      placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item class="allWidth"
                        label="确认密码"
                        prop="againPwd">
            <el-input v-model="formData.againPwd"
                      type="password"
                      placeholder="请确认密码" />
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="primary"
                     :disabled="loading"
                     @click="editPsd_submit"> 保存 </el-button>
          <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data () {
    return {
      sysInfo: {
        cnName: '销售进程管理系统',
        enName: 'Sales Process Management System'
      },
      tab: [
        { label: '待办', img: require('../../assets/images/index1.png'), color: '#F0B36E', name: 'affair', link: '', dataUrl: '/affair/pageList', delete: '/affair/delById' },
        { label: '销售活动', img: require('../../assets/images/index2.png'), color: '#228AF6', name: 'schedule', link: '', dataUrl: '/schedule/pageList', delete: '/schedule/delById' },
        { label: '日报', img: require('../../assets/images/index5.png'), color: '#A359B6', name: 'day', link: '/add-day-dialy', dataUrl: '/daily-report/pageList', delete: '/daily-report/delById' },
        { label: '周报', img: require('../../assets/images/index6.png'), color: '#F38D1A', name: 'week', link: '/add-week-dialy', dataUrl: '/weekly-report/pageList', delete: '/weekly-report/delById' },
        { label: '月报', img: require('../../assets/images/index7.png'), color: '#71C6F7', name: 'month', link: '/add-month-dialy', dataUrl: '/mothly-report/pageList', delete: '/mothly-report/delById' }
      ],
      dialogFormVisible: false,
      formData: {
        oldPwd: '',
        newPwd: '',
        againPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'change' }
        ],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'change' },
        {          validator: (rule, value, callback) => {
            if (/[\u4E00-\u9FA5]/i.test(value)) {
              return callback(new Error('不能输入汉字'))
            } else {
              callback()
            }
          }, trigger: 'blur'        }
        ],
        againPwd: [
          { required: true, message: '请确认新密码', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value != this.formData.newPwd) {
                return callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
    this.$store.dispatch('settings/sysInfo', '/sys-config/querySysConfigInfo').then((data) => { this.sysInfo = data })
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    },
    moreDoFun (index) {
      if (index == 0) {
        this.$refs.operateTask.show(1, '')
      } else if (index == 1) {
        this.$refs.operateTask.show(0, '')
      } else {
        if (this.user.btnJump.includes(this.tab[index].link)) {
          this.$router.push({
            path: this.tab[index].link
          })
        } else {
          this.$message({
            message: '没有权限跳转',
            type: 'error',
            duration: 2000
          })
        }
      }
    },
    editPsd_show () {
      this.dialogFormVisible = true
    },
    editPsd_submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const temp = {
            oldPwd: this.formData.oldPwd,
            newPwd: this.formData.newPwd
          }
          httpAction('/member/changePwd', { body: temp }).then(response => {
            if (response.code == 0) {
              this.$message({
                message: '修改' + (response.msg == 'success' ? '成功' : '失败'),
                type: response.msg == 'success' ? 'success' : 'error',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.loading = false
            }
          }).catch(error => {
            console.log(error)
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  // background: linear-gradient(to left, #009fce 35%, #009eaa 100%);
  background: #00A0CE;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .sys-letf-div {
    display: inline-block;
    vertical-align: middle;
  }
  .sys-title {
    margin: 15px 0 4px;
  }
  .hamburger-container {
    line-height: 65px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;
    .write-icon {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 26px;
      color: #fff;
      vertical-align: middle;
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .realName-style {
      font-size: 12px;
      display: inline-block;
      padding: 1px 8px;
      height: 100%;
      color: #fff;
      vertical-align: middle;
      cursor: default;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 30px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
