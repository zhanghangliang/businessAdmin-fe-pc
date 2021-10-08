<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
     (function () {
      if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
      } else {
        document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
      }
      function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
          WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
        });
      }
    })();
  }
}
</script>
<style scoped>
   .splitter-pane-resizer.vertical{
      width: 20px !important;
  }
  .splitter-pane-resizer[data-v-212fa2a4] {
      background: #e8ebec !important;
      opacity: 1 !important;
  }
</style>
