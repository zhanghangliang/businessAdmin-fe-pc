(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9da65040"],{"1a7b":function(e,t,a){},"1c73":function(e,t,a){"use strict";a("a066")},"1e4f":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAqCAYAAABYzsDTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI0QTVCMUUxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI0QTVCMUYxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjRBNUIxQzE2MEExMUU4OUZDOUNENTNBODhENzFDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjRBNUIxRDE2MEExMUU4OUZDOUNENTNBODhENzFDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqBcZigAAAD0SURBVHjaYrzw8j8DEMgAcRcQOwCxJANh8ByIDwBxmb4YwxNcihiBhoMMvgjEQgykg3dArI/LAiaoi8kxmAGqrwuXJBM0KCgBDvgMl6TQcEl8htMMjBo+RA2/+IpBi5YuPw20IIFWhnMB8XygBQuAmItWYR4P9YUWrOD6T4O4/AbEabRKLaCg6aaV4SCXF7LQwOBrQBwKLOOvUdvlC4DYFGQwiMNCxWDIAhq6EFmQWobDXUv1TITN4NFScdTwUcNHDR81fHgZ/pxCM57jM/wAhYYfwGd4GbTLRw54B9WP03BQH1IfiJeTEETPoer18XVyAQIMACbMN3JUxFKPAAAAAElFTkSuQmCC"},"20a0":function(e,t,a){"use strict";a("53ca");a("0fea");var i=a("a78e"),s=a.n(i);t["a"]={data:function(){return{member:""}},created:function(){this.member=JSON.parse(s.a.get("member"+this.systemType)),this.checkMobile()},methods:{checkMobile:function(){var e=this;this.member.mobile||this.Dialog.alert({title:"系统提示",message:"请完善基础信息里的手机号码"}).then((function(){e.$router.push({path:"/baseInfo",query:{checkMobile:!0}})}))}}}},2899:function(e,t,a){"use strict";a("1a7b")},"78bb":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAqCAYAAABYzsDTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI0QTVCMjIxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI0QTVCMjMxNjBBMTFFODlGQzlDRDUzQTg4RDcxQzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjRBNUIyMDE2MEExMUU4OUZDOUNENTNBODhENzFDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjRBNUIyMTE2MEExMUU4OUZDOUNENTNBODhENzFDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsDqUnkAAADjSURBVHjaYvz8+TMDHiADxF1A7ADEkgyEwXMgPgDEZTw8PE8Y8RgOMvgiEAsxkA7eAbE+Ex4FXWQazADV14XP5c+IDAqcQYTP5ZQYDNbPxEBDMGr44DFci1aGJwDxaWoYzoLE5gLiaUAcT61gYUEKhtXUCg7kYImGBoMWtSMUVLY8o0JWx+nyQiD+RivDVwKxKRBfo1U6vwa1YAGtMhEoaBKh6fwbtSIUVw69Sqvsf42WZctokTtq+Kjho4aPGj58DH9Oodl4uy0HKDT8wIB1FZ+AFADxchKC6DlUvT6okwsQYAC/AjSzkv2m0gAAAABJRU5ErkJggg=="},a066:function(e,t,a){},ae20:function(e,t){e.exports="data:image/png;base64,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"},daff:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{overflow:"hidden","max-height":"100vh"}},[e.isView?e._e():i("van-sticky",{staticClass:"closeBtn",attrs:{"offset-top":6}},[i("van-button",{attrs:{icon:"cross",size:"small",color:"#b2b2b3"},on:{click:e.closeChart}})],1),e._v(" "),i("div",{staticClass:"all"},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.chartInfo.msg_loading,expression:"chartInfo.msg_loading"}],ref:"chatCon",staticClass:"chat-con"},[i("ul",[e._l(e.msgList,(function(t,s){return[t.type<=1?i("li",{key:s,class:{"self-msg":1==t.type,isFile:t.isFile},on:{click:function(a){return e.openFile(t)}}},[i("p",[e._v(e._s(t.name))]),e._v(" "),0==t.type?[i("div",{staticClass:"left"},[i("img",{staticClass:"userImg",attrs:{src:e.serviceImg,alt:""}})]),e._v(" "),i("div",{staticClass:"right"},[i("img",{attrs:{src:a("78bb"),alt:""}}),e._v(" "),t.isFile?[i("div",[i("img",{staticClass:"msg-img",attrs:{src:t.info.url,width:t.info.width,height:t.info.height,alt:t.info.name,"object-fit":"cover"},on:{click:function(a){return a.stopPropagation(),e.showImage(t)},load:function(t){return e.imgOnLoad(s)}}})])]:4===t.messageType?[i("div",{on:{click:function(e){e.stopPropagation()}}},[i("a",{staticClass:"link-url",attrs:{href:t.messageUrl}},[e._v(e._s(t.message))])])]:[i("div",[e._v(e._s(t.message))])]],2)]:1==t.type?[i("div",{staticClass:"right"},[i("img",{attrs:{src:a("1e4f"),alt:""}}),e._v(" "),t.isFile?[i("div",{on:{click:function(a){return a.stopPropagation(),e.showImage(t)}}},[i("img",{staticClass:"msg-img",attrs:{src:t.info.url,width:t.info.width,height:t.info.height,alt:t.info.name,"object-fit":"cover"},on:{load:function(t){return e.imgOnLoad(s)}}})])]:[i("div",[e._v(e._s(t.message))])]],2),e._v(" "),i("div",{staticClass:"left"},[i("img",{staticClass:"userImg",attrs:{src:e.imgUrl,alt:""}})])]:e._e()],2):21===t.type?i("li",{key:s,staticClass:"timer"},[e._v("\n            "+e._s(t.message)+"\n          ")]):20===t.type?i("li",{key:s,staticClass:"tips"},[e._v("\n            "+e._s(t.message)+"\n          ")]):22===t.type?i("li",{key:s,staticClass:"evaluate"},[i("p",[e._v(e._s(t.name))]),e._v(" "),e._m(0,!0),e._v(" "),i("div",{staticClass:"right"},[i("img",{attrs:{src:a("78bb"),alt:""}}),e._v(" "),i("div",{staticStyle:{width:"100%"}},[i("div",{staticClass:"evaluate-wrapper",on:{click:function(e){e.stopPropagation()}}},[i("p",[e._v("请您对本次服务进行评价")]),e._v(" "),i("div",{staticClass:"rate"},[i("span",[e._v("评分：")]),e._v(" "),i("van-rate",{attrs:{size:20,color:"#ffd21e","void-icon":"star","void-color":"#a1a6af"},model:{value:e.evaluate.score,callback:function(t){e.$set(e.evaluate,"score",t)},expression:"evaluate.score"}})],1),e._v(" "),i("div",{staticClass:"content"},[i("van-field",{attrs:{label:"内容","label-width":"35px",rows:"2",autosize:"",type:"textarea",placeholder:"请对此次服务进行评价"},model:{value:e.evaluate.content,callback:function(t){e.$set(e.evaluate,"content",t)},expression:"evaluate.content"}})],1),e._v(" "),i("van-row",{staticStyle:{width:"100%","margin-top":"10px"},attrs:{gutter:"20"}},[i("van-col",{attrs:{span:"12"}},[i("van-button",{attrs:{size:"small",block:""},on:{click:e.toGroupList}},[e._v("取消")])],1),e._v(" "),i("van-col",{attrs:{span:"12"}},[i("van-button",{attrs:{size:"small",block:"",type:"info"},on:{click:e.submitForm}},[e._v("确定")])],1)],1)],1)])])]):e._e()]}))],2)])]),e._v(" "),i("div",{staticClass:"bottom-div"},[i("van-field",{ref:"inputBox",staticClass:"message-box",attrs:{placeholder:"请输入...",disabled:e.isView},model:{value:e.message,callback:function(t){e.message=t},expression:"message"}}),e._v(" "),i("van-uploader",{attrs:{disabled:e.isView,"after-read":e.uploadFile,"result-type":"file",multiple:""}},[i("span",{staticClass:"spanBtn",on:{click:e.selectFile}},[i("van-icon",{attrs:{name:"photo-o",size:"30px"}})],1)]),e._v(" "),i("span",{staticClass:"spanBtn",staticStyle:{margin:"0 10px"},on:{click:e.sendBtn}},[i("van-icon",{attrs:{name:"share",size:"30px"}})],1)],1),e._v(" "),i("van-overlay",{attrs:{show:e.isShow},on:{click:function(t){e.isShow=!1}}},[i("div",{staticClass:"wrapper",on:{click:function(e){e.stopPropagation()}}},[i("div",{staticClass:"evaluate"},[i("p",{staticClass:"title"},[e._v("评价")]),e._v(" "),i("div",{staticClass:"grade-wrapper"},e._l(e.grade,(function(t){return i("div",{key:t.value,staticClass:"grade-item",class:{active:t.value===e.evaluate.score},on:{click:function(a){e.evaluate.score=t.value}}},[i("div",[e._v(e._s(t.label))])])})),0),e._v(" "),i("van-field",{attrs:{label:"内容","label-width":"35px",rows:"2",autosize:"",type:"textarea",placeholder:"请对此次服务进行评价"},model:{value:e.evaluate.content,callback:function(t){e.$set(e.evaluate,"content",t)},expression:"evaluate.content"}}),e._v(" "),i("van-row",{staticStyle:{width:"100%","margin-top":"10px"},attrs:{gutter:"20"}},[i("van-col",{attrs:{span:"12"}},[i("van-button",{attrs:{block:""},on:{click:e.toGroupList}},[e._v("取消")])],1),e._v(" "),i("van-col",{attrs:{span:"12"}},[i("van-button",{attrs:{block:"",type:"info"},on:{click:e.submitForm}},[e._v("确定")])],1)],1)],1)])])],1)},s=[function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"left"},[i("img",{staticClass:"userImg",attrs:{src:a("ae20"),alt:""}})])}],n=(a("6762"),a("2fdb"),a("5df3"),a("ac6a"),a("3846"),a("b85c")),r=(a("28a5"),a("96cf"),a("1da1")),o=a("0fea"),c=a("a78e"),l=a.n(c),m=a("5f87"),u=(a("a481"),a("3b2b"),a("c5f6"),a("6b54"),a("f576"),{created:function(){String.prototype.padStart||(String.prototype.padStart=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:" ";if("[object String]"!==Object.prototype.toString.call(t))throw new TypeError("fillString must be String");var a=this;if(a.length>=e)return String(a);var i=e-a.length,s=Math.ceil(i/t.length);while(s>>=1)t+=t,1===s&&(t+=t);return t.slice(0,i)+a})},methods:{getTimestamp:function(e){return new Date(e).getTime()},timeFormat:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"yyyy-mm-dd";e=parseInt(e),e||(e=Number(new Date)),10==e.toString().length&&(e*=1e3);var a,i=new Date(e),s={"y+":i.getFullYear().toString(),"m+":(i.getMonth()+1).toString(),"d+":i.getDate().toString(),"h+":i.getHours().toString(),"M+":i.getMinutes().toString(),"s+":i.getSeconds().toString()};for(var n in s)a=new RegExp("("+n+")").exec(t),a&&(t=t.replace(a[1],1==a[1].length?s[n]:s[n].padStart(a[1].length,"0")));return t},timeFrom:function(e,t){var a=this.getTimestamp(this.timeFormat(void 0,"yyyy-mm-dd")+" 00:00:00"),i=[];i[0]=a+864e5,i[1]=a,i[2]=a-864e5,i[3]=a-1728e5,i[4]=a-5184e5,i[5]=a-31536e6;var s,n=new Date;if(n.setTime(e),"undefined"!=typeof t&&"boolean"!=typeof t&&null!=t){var r=n.getTime(),o=r-t;if(o=parseInt(o/1e3),o<=300)return""}return s=e>=i[1]&&e<i[0]?this.timeFormat(n.getTime(),"hh:MM:ss"):e>=i[2]&&e<i[1]?"昨天 "+this.timeFormat(n.getTime(),"hh:MM:ss"):e>=i[3]&&e<i[2]?"前天 "+this.timeFormat(n.getTime(),"hh:MM:ss"):e>=i[4]&&e<i[3]?"周"+this.getWeek(n.getDay())+this.timeFormat(n.getTime(),"hh:MM:ss"):e>=i[5]&&e<i[4]?this.timeFormat(n.getTime(),"mm-dd hh:MM:ss"):this.timeFormat(n.getTime(),"yyyy-mm-dd hh:MM:ss"),s},getWeek:function(e){return["日","一","二","三","四","五","六"][e]}}}),h=a("20a0"),g={name:"Message",components:{},mixins:[u,h["a"]],props:{},data:function(){return{formData:{id:"",name:"",sex:"",mobile:"",password:""},createTime:"",sexSelectShow:!1,setMobile:"",setCode:"",setPassword:"",sendText:"发送验证码",sendStatus:!0,clearTime:null,popupShow:!1,mobileAdd_edit:!1,password_popupShow:!1,toastItem:null,message:"",msgList:[],chartInfo:{myId:"",groupId:"",msg_loading:"",selected:{id:"",name:"",timer:5e3}},timer:{getMsg:void 0},pageData:{id:""},isView:!1,isShow:!1,evaluate:{score:0,content:""},grade:[{value:3,label:"差评"},{value:2,label:"中评"},{value:1,label:"好评"}],member:{},imgUrl:"",serviceImg:""}},created:function(){this.pageData=this.$route.query||{},this.chartInfo.myId=this.user.member&&this.user.member.id,this.pageData.id?this.getGroupInfo():this.createGroup(),this.member=JSON.parse(l.a.get("member"+this.systemType)),this.imgUrl=this.member.headimgurl?this.member.headimgurl:a("ae20"),this.serviceImg=a("f143")},destroyed:function(){this.enableQueryMsg(!0)},methods:{getGroupInfo:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.showToast("加载会话中"),this.chartInfo.groupId=this.pageData.id,e.next=4,this.queryAllMsg();case 4:3===this.pageData.status?(this.isView=!0,this.Notify({type:"warning",message:"当前对话已经关闭",duration:1500})):(this.checkDate(),1===this.pageData.status&&this.queryList().then((function(e){0!==e.length?t.setMsg([{content:"前方等候人数 "+(e.length-1)+" 人，请耐心等候客服接入",createTime:Date.now(),isTips:!0}]):t.setMsg([{content:"前方等候人数 0 人，请耐心等候客服接入",createTime:Date.now(),isTips:!0}])})).catch((function(e){})),this.enableQueryMsg()),this.clearToast();case 6:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),checkDate:function(){var e=this,t=new Date,a="".concat(t.getFullYear()+"-"+(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"-"+t.getDate());Object(o["a"])("/workTime/queryList",{body:{queryDay:a}}).then((function(i){if(0===i.code&&i.data.length>0){var s=i.data[0];if(1===s.status){var r=s.period.split(","),o=t.getTime();console.log("现在的时间戳",o);var c,l={flags:!0,msg:r.join("\n")},m=Object(n["a"])(r||[]);try{for(m.s();!(c=m.n()).done;){var u=c.value,h=u.split("-"),g=new Date(a+" "+h[0]+":00:00").getTime(),f=new Date(a+" "+h[1]+":00:00").getTime();if(console.log("开始时间戳",g,"结束时间戳",f),o>g&&o<f){l.flags=!1;break}}}catch(d){m.e(d)}finally{m.f()}l.flags&&e.showMsgBox("当前客服不在线，您可以先留言，等待客服上线后会及时回复您。")}else e.showMsgBox("当前客服不在线，您可以先留言，等待客服上线后会及时回复您。")}})).catch((function(){}))},showMsgBox:function(e){this.Dialog.alert({title:"温馨提示",message:e,confirmButtonText:"我知道了",beforeClose:this.beforeClose}).then((function(){}))},beforeClose:function(e,t){t()},enableQueryMsg:function(e){var t=this;e?this.timer.getMsg&&clearInterval(this.timer.getMsg):this.timer.getMsg=setInterval((function(){Object(o["a"])("/message/read",{body:{groupId:t.chartInfo.groupId,queryAll:!1}}).then(function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(a){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:0===a.code&&a.data&&a.data.length>0&&(t.chartInfo.selected.id||(t.chartInfo.selected.name=a.data[0].createName,t.chartInfo.selected.id=a.data[0].createBy),i=[],a.data.forEach((function(e){i.push(t.setMsgBefore(e))})),Promise.all(i).then((function(e){var a=[];a=e.reduce((function(e,t,a){return e.concat(t)})),t.setMsg(a)})).catch((function(e){})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){clearInterval(t.timer.getMsg)}))}),4e3)},createGroup:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.showToast("创建会话中"),e.next=3,this.queryAllMsg();case 3:Object(o["a"])("/message/linkcustomer",{body:""}).then((function(e){0===e.code&&(t.chartInfo.groupId=e.data.id,t.queryList().then((function(e){t.checkDate(),1!==e.length?t.setMsg([{content:"前方等候人数 "+e.length+" 人，请耐心等候客服接入",createTime:Date.now(),isTips:!0}]):t.setMsg([{content:"前方等候人数 0 人，请耐心等候客服接入",createTime:Date.now(),isTips:!0}])})).catch((function(e){})),t.enableQueryMsg()),t.clearToast()})).catch((function(e){t.isView=!0,t.clearToast()}));case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),onSearch:function(){this.Toast("搜索"+this.message)},autoScorll:function(){var e=this;this.$nextTick((function(){var t=e.$refs.chatCon.scrollHeight;e.$refs.chatCon.scrollTop=t}))},setMsg:function(e){var t=this;e&&(e.forEach((function(e){"string"===typeof e.createTime&&(e.createTime=t.getTimestamp(e.createTime));var a=t.msgList[t.msgList.length-1],i=t.timeFrom(e.createTime,a&&a.createTime);if(i&&t.msgList.push({name:"sys",message:i,type:21,createTime:e.createTime}),e.isTips)t.msgList.push({name:"sys",message:e.content,type:20,createTime:e.createTime});else if(e.isFile)t.msgList.push({name:e.createBy===t.chartInfo.myId?"".concat(t.member.realName||"我"):"客服(".concat(e.createName,")"),message:e.content,type:e.createBy===t.chartInfo.myId?1:0,createTime:e.createTime,isFile:!0,info:e.info});else{var s=e.createBy===t.chartInfo.myId?1:0;[5,6,7,8].includes(e.messageType)&&(s=20),t.msgList.push({name:e.createBy===t.chartInfo.myId?"".concat(t.member.realName||"我"):"客服(".concat(e.createName,")"),message:e.content,type:s,createTime:e.createTime,isFile:!1,isTips:!1,messageType:e.messageType,messageUrl:e.messageUrl}),6===e.messageType&&t.msgList.push({name:"客服",message:"",type:22,createTime:e.createTime+1,isFile:!1,isTips:!1})}})),this.$nextTick((function(){t.autoScorll()})))},setMsgAll:function(e){var t=this;if(e){for(var a=[],i=0,s=e.length;i<s;i++){var n=e[i];"string"===typeof n.createTime&&(n.createTime=this.getTimestamp(n.createTime));var r=a[a.length-1],o=this.timeFrom(n.createTime,r&&r.createTime);if(o&&a.push({name:"",message:o,type:21,createTime:n.createTime}),n.isTips)a.push({name:"sys",message:n.content,type:20,createTime:n.createTime});else if(n.isFile)a.push({name:n.createBy===this.chartInfo.myId?"".concat(this.member.realName||"我"):"客服(".concat(n.createName,")"),message:n.content,type:n.createBy===this.chartInfo.myId?1:0,createTime:n.createTime,isFile:!0,info:n.info});else{var c=n.createBy===this.chartInfo.myId?1:0;[5,6,7,8].includes(n.messageType)&&(c=20),a.push({name:n.createBy===this.chartInfo.myId?"".concat(this.member.realName||"我"):"客服(".concat(n.createName,")"),message:n.content,type:c,createTime:n.createTime,isFile:!1,messageType:n.messageType,messageUrl:n.messageUrl})}}this.msgList=a,this.$nextTick((function(){t.autoScorll()}))}},sendBtn:function(){var e=this;if(!this.chartInfo.msg_loading)return""===this.chartInfo.groupId?(this.Toast("请稍后，正在连接至服务器"),void this.createGroup()):void(""!=this.message?Object(o["a"])("/message/sendMessage",{body:{content:this.message,groupId:this.chartInfo.groupId}}).then((function(t){0===t.code&&(e.setMsg([{createBy:e.chartInfo.myId,content:e.message,createTime:Date.now()}]),e.message="",e.$refs.inputBox.focus())})).catch((function(e){console.log(e)})):this.Toast("请输入内容"));this.Toast("请稍后，正在加载消息列表")},showToast:function(e){this.toastItem=this.Toast.loading({duration:0,forbidClick:!0,message:e||"加载中..."})},clearToast:function(){this.toastItem&&this.toastItem.clear()},backPage:function(){this.$router.push("/my")},queryAllMsg:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t,a,i=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!this.chartInfo.msg_loading){e.next=2;break}return e.abrupt("return");case 2:return this.chartInfo.msg_loading=!0,e.prev=3,e.next=6,Object(o["a"])("/message/queryHistory",{body:{id:this.chartInfo.myId},header:{pageNumber:1,pageSize:5e3}});case 6:t=e.sent,0===t.code&&(t.data.length>0&&!this.chartInfo.selected.id&&(this.chartInfo.selected.name=t.data[0].createName,this.chartInfo.selected.id=t.data[0].createBy),a=[],t.data.forEach((function(e){a.push(i.setMsgBefore(e))})),Promise.all(a).then((function(e){var t=[];t=e.reduce((function(e,t,a){return e.concat(t)})),i.setMsgAll(t)})).catch((function(e){}))),e.next=12;break;case 10:e.prev=10,e.t0=e["catch"](3);case 12:this.chartInfo.msg_loading=!1;case 13:case"end":return e.stop()}}),e,this,[[3,10]])})));function t(){return e.apply(this,arguments)}return t}(),selectFile:function(){this.$refs.file.click()},openFile:function(e){e.isFile&&window.open(window._CONFIG["imgView"]+e.info.id+"&token="+Object(m["a"])())},uploadFile:function(e){var t=this;console.log(e),e instanceof Array||(e=[e]),e=e.map((function(e){return e.file}));for(var a=e,i=[],s=0;s<a.length;s++){var r=a[s],c=new FormData;c.append("files",r),i.push(Object(o["a"])("/file/upload",c))}Promise.all(i).then((function(e){var a=[];e.forEach((function(e){var i=e.data;a.push(new Promise((function(e,a){Object(o["a"])("/message/sendMessage",{body:{content:"",groupId:t.chartInfo.groupId,folderId:i.referenceId}}).then((function(t){e(i)})).catch((function(e){a()}))})))})),Promise.all(a).then((function(e){var a,i=[],s=Object(n["a"])(e);try{for(s.s();!(a=s.n()).done;){var r=a.value;i.push({createBy:t.chartInfo.myId,content:r.fileName,createTime:r.createTime,isFile:!0,info:{url:window._CONFIG["apiUrl"]+r.fileUrl,height:"auto",width:"auto",name:r.fileName,id:r.id,folderId:r.referenceId}})}}catch(o){s.e(o)}finally{s.f()}t.setMsg(i)})).catch((function(e){}))})).catch((function(e){}))},setMsgBefore:function(e){return new Promise((function(t,a){e.folderId?Object(o["a"])("/file/findByReferenceId",{body:e.folderId}).then((function(a){var i=[];if(0===a.code){var s,r=Object(n["a"])(a.data);try{for(r.s();!(s=r.n()).done;){var o=s.value;i.push({createBy:e.createBy,content:o.fileName,createTime:e.createTime,isFile:!0,info:{url:window._CONFIG["apiUrl"]+o.fileUrl,height:"auto",width:"auto",name:o.fileName,id:o.id,folderId:o.referenceId}})}}catch(c){r.e(c)}finally{r.f()}}t(i)})).catch((function(e){a(e)})):t([e])}))},asyncForEach:function(e,t){return new Promise((function(a){var i=0;e.forEach(function(){var s=Object(r["a"])(regeneratorRuntime.mark((function s(n){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,t(n);case 2:i++,i===e.length&&a();case 4:case"end":return s.stop()}}),s)})));return function(e){return s.apply(this,arguments)}}())}))},getImageInfo:function(e){return new Promise((function(t){var a=new Image;a.src=window._CONFIG["apiUrl"]+e.fileUrl,a.name=e.fileName,a.id=e.id,a.folderId=e.referenceId,a.onload=function(){t(a)}}))},showImage:function(e){this.ImagePreview({images:[e.info.url],showIndex:!1,loop:!1,startPosition:0})},imgOnLoad:function(e){var t=this;this.msgList.length===e+1&&this.$nextTick((function(){t.autoScorll()}))},closeChart:function(){var e=this;this.Dialog.confirm({title:"提示",message:"是否确认关闭当前会话？关闭后无法恢复"}).then(function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(a){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.showToast("关闭会话中"),Object(o["a"])("/message/closeGroup",{body:e.chartInfo.groupId}).then((function(t){e.setMsg([{content:"当前会话已结束",createTime:Date.now(),isTips:!0}]),e.isView=!0,e.clearToast()})).catch((function(t){e.clearToast()}));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()).catch((function(e){}))},toGroupList:function(){this.$router.go(-1)},queryList:function(){return new Promise((function(e,t){Object(o["a"])("/message/queryGroup",{body:{queryCanJoin:!0},header:{pageNumber:1,pageSize:6e3,sortList:[{orderField:"createTime",orderType:"desc"}]}}).then((function(t){if(0===t.code)return e(t.data.dataList);e([])})).catch((function(e){t()}))}))},submitForm:function(){var e=this;this.showToast(),Object(o["a"])("/message/comment",{body:{id:this.chartInfo.groupId,comment:this.evaluate.content,star:this.evaluate.score}}).then((function(t){e.Notify({type:"success",message:"评价成功",duration:1500}),e.clearToast(),e.isShow=!1,e.toGroupList()})).catch((function(t){e.clearToast()}))},toPage:function(e){window.open(e)}}},f=g,d=(a("1c73"),a("2899"),a("2877")),p=Object(d["a"])(f,i,s,!1,null,"76f40d90",null);t["default"]=p.exports},f143:function(e,t,a){e.exports=a.p+"static/img/serveice.3ed5bfb4.png"}}]);