(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-20208d43"],{6702:function(e,n,t){},a236:function(e,n,t){"use strict";t.r(n);var o=function(){var e=this,n=e.$createElement;e._self._c;return e._m(0)},i=[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("div",{staticClass:"all",staticStyle:{height:"100vh",overflow:"hidden"}},[t("div",{staticClass:"down-btn"},[t("span",[e._v("请在微信中打开")])])])])}],s=(t("4917"),t("28a5"),t("386d"),t("0fea"),t("a78e"),t("5f87")),r={name:"downPage",components:{},props:{},data:function(){return{imgView:window._CONFIG["uploadUrl"],imgPath:window._CONFIG["download"],is_weixin:!0,downUrl:"",curToken:""}},created:function(){},methods:{downFile:function(){},GetRequest:function(){var e=location.search,n=new Object;if(-1!=e.indexOf("?")){var t=e.substr(1);strs=t.split("&");for(var o=0;o<strs.length;o++)n[strs[o].split("=")[0]]=strs[o].split("=")[1]}return n},isWeixin:function(){var e=window.navigator.userAgent.toLowerCase();return"micromessenger"==e.match(/MicroMessenger/i)?(console.log("微信浏览器"),console.log(this.downUrl),!0):(console.log("不是微信浏览器"),!1)},downPage:function(){var e=document.createElement("input");e.value=this.downUrl,document.body.appendChild(e),e.select(),document.execCommand("Copy"),document.body.removeChild(e),this.Toast("复制成功")},getUrlCode:function(){var e=location.hash;console.log(location);var n=new Object;if(-1!=e.indexOf("?"))for(var t=e.substr(1),o=t.split("&"),i=0;i<o.length;i++)n[o[i].split("=")[0]]=o[i].split("=")[1];return n}},beforeDestroy:function(){this.is_weixin||Object(s["b"])()}},a=r,c=(t("b6bc"),t("2877")),l=Object(c["a"])(a,o,i,!1,null,"1229410a",null);n["default"]=l.exports},b6bc:function(e,n,t){"use strict";t("6702")}}]);