<template>
  <el-container style="margin-top: 10px">
    <el-input disabled v-model="inputPackage"></el-input>
    <el-button :disabled="isSee" size="small" type="primary" @click="fileSelect">上传{{buttonName}}</el-button>
    <input ref="files" type="file" style="display:none;">
  </el-container>
</template>
<script>
import {uploadImg} from '../http/request'
export default {
  name: "uploadImg",
  props: ["buttonName","parentName","moduleCode","idx","isSee"],
  computed: {

  },
  watch:{
    parentName(){
      this.inputPackage = this.parentName;
    }
  },
  mounted(){
    this.inputPackage = this.parentName;
  },
  data() {
    return {
      inputPackage: "",
      packageId:"",
      loading:null,
    };
  },
  created() {

  },
  methods: {
    fileSelect() {
      let fileNode = this.$refs.files;
      fileNode.value = '';//清空原有文件
      fileNode.click();
      fileNode.onchange = () => {
        //判断是否为jpg或png类型的图片，不是就提示不允许上传
        if(fileNode.files[0].name.split('.').slice(-1)!='jpg'&&fileNode.files[0].name.split('.').slice(-1)!='png'){
          this.$message.error('只允许上传jpg/png类型的图片，请重新上传');
          return;
        }

        const form = new FormData();
        // 将选中文件追加到虚拟表单中
        form.append("file", fileNode.files[0]);
        form.append("type", "image");
        form.append("moduleCode", this.moduleCode);
        this.loading =this.$loading({
          lock: true,
          text: `上传图片中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        uploadImg(form).then(res=>{
          this.loading.close();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.packageId = res.data.fileId;
            this.inputPackage = res.data.originFileName.split('.').slice(0,-1).join('.');
            this.$emit('getImgId',res.data.fileId,this.inputPackage,this.idx);
          }
        }).catch(err=>{
          this.loading.close();
        })
      };
    }
  }
};
</script>
<style scoped>
</style>

