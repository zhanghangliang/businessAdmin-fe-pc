<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      :action="uploadUrl"
      :before-upload="beforeUpload"
      name="files"
      v-if="!isView"
    >
      <i class="el-icon-plus" style="color:#40b5d6;" />
      <!-- <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>-->
    </el-upload>
    <div class="image-preview">
      <div v-for="(v, i) of fileList" :key="i" class="image-preview-wrapper">
        <span @click="preImage(v)">{{ v.name }}</span>
        <i
          class="el-icon-error"
          @click="rmImage(i, v.id)"
          style="color:#a5a5a5;"
          v-if="!isView"
        />
        <span v-else-if="i != fileList.length - 1">，</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/api/qiniu";
import { httpAction } from "@/api/manage";

export default {
  name: "SingleImageUpload",
  props: {
    value: {
      default: ""
    },
    isView: {
      default: false
    }
  },
  data() {
    return {
      tempUrl: "",
      dataObj: {
        token: "",
        key: ""
      },
      fileList: [],
      uploadUrl: ""
    };
  },
  created() {
    this.uploadUrl = window._CONFIG["upload"];
    if (this.value) {
      httpAction(window._CONFIG["fileList"], { body: this.value })
        .then(res => {
          this.fileListInit(res.data || []);
        })
        .catch(_ => {});
    }
  },
  methods: {
    fileListInit(data) {
      let ret = [];
      for (const v of data) {
        ret.push({
          id: v.id,
          name: (v.fileName || "") + (v.fileSuffix || ""),
          url: v.fileUrl,
          type: v.mimeType
        });
      }
      this.fileList = ret;
    },
    rmImage(i, id) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          httpAction(window._CONFIG["fileDelete"], { body: id }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "操作删除" + (res.msg == "success" ? "成功" : "失败"),
                type: res.msg == "success" ? "success" : "error",
                duration: 2000
              });
              this.fileList.splice(i, 1);
              if (this.fileList.length == 0) {
                this.emitInput("");
              }
            } else {
              this.$message.warning(res.msg);
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleImageSuccess(res, file) {
      this.fileList.push({
        id: res.data.id,
        name: (res.data.fileName || "") + (res.data.fileSuffix || ""),
        url: res.data.fileUrl,
        type: res.data.mimeType
      });
      this.emitInput(res.data.referenceId);
    },
    beforeUpload() {
      // const _self = this
      // return new Promise((resolve, reject) => {
      //   getToken().then(response => {
      //     const key = response.data.qiniu_key
      //     const token = response.data.qiniu_token
      //     _self._data.dataObj.token = token
      //     _self._data.dataObj.key = key
      //     this.tempUrl = response.data.qiniu_url
      //     resolve(true)
      //   }).catch(err => {
      //     console.log(err)
      //     reject(false)
      //   })
      // })
      this.dataObj.token = this.user.token;
      if (this.value) {
        this.dataObj.referenceId = this.value;
      }
    },
    preImage(v) {
      let baseUrl = window._CONFIG["imgView"];
      window.open(baseUrl + v.id);
    }
  }
};
</script>
<style>
.upload-container .el-upload .el-upload-dragger {
  height: 30px;
  border: none;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;

  .image-uploader {
    // width: 60%;
    width: 30px;
    float: left;
  }

  & .image-preview {
    // width: 200px;
    // height: 200px;
    position: relative;
    // border: 1px dashed #d9d9d9;
    float: left;
    // margin-left: 50px;

    .image-preview-wrapper {
      margin-right: 10px;
      // position: relative;
      // width: 100%;
      // height: 100%;
      display: inline-block;
      cursor: pointer;
      color: #40b5d6;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;

      .el-icon-delete {
        font-size: 36px;
      }
    }

    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
