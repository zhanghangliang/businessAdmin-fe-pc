<template>
  <div class="sidebar-logo-container"
       :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse"
                   key="collapse"
                   class="sidebar-logo-link"
                   to="/">
        <template v-if="data.logo">
          <img v-if="logo"
               :src="url.imgView + data.smallLogo"
               class="sidebar-logo">
        </template>

        <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
        <h1 v-else
            class="sidebar-title">
          <img v-if="data.logo"
               :src="url.imgView + data.logo">
        </h1>
      </router-link>
      <router-link v-else
                   key="expand"
                   class="sidebar-logo-link"
                   to="/">
        <!-- <img v-if="logo" :src="url.imgView + data.smallLogo" class="sidebar-logo"> -->
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
        <h1 class="sidebar-title">
          <img v-if="data.logo"
               :src="url.imgView + data.logo">
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: 'INSOLU',
      logo: '../../../assets/images/loginLogo.png',
      url: {
        imgView: window._CONFIG['imgView']
      },
      data: {}
    }
  },
  created () {
    this.$store.dispatch('settings/sysInfo', '/sys-config/querySysConfigInfo').then((data) => {
      this.data = data
    })
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 50px;
  // background: #242c47;
  background: #00A0CE;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 9px;
      margin-top: 16px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #00a0e9;
      font-weight: 600;
      line-height: 70px;
      font-size: 30px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      width: 150px;
      height: 50px;
      overflow: hidden;
      margin-top: 11px;
      img {
        width: 100%;
        height: 40px;
        object-fit: cover;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
      margin-top: 20px;
    }
  }
}
</style>
