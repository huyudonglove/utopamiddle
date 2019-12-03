<template>
  <div v-if="mapListPower.length">
    <headNav></headNav>
    <div class="pa_body">
      <div class="body-menu" :style="{'overflow':'auto','height':treeHeight+'px'}">
        <el-row class="tac">
          <el-col :span="24" >
            <div style="padding:15px 5px 10px 5px;">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-tree
                :data="treeData"
                :props="props"
                accordion
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                ref="tree"
              >
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="body-content" style="overflow: hidden">
      <el-main>
        <div style="width: 100%">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="待审核" name="second"></el-tab-pane>
            <el-tab-pane label="通过" name="third"></el-tab-pane>
            <el-tab-pane label="不通过" name="fourth"></el-tab-pane>
          </el-tabs>
          <div style="float: right;margin-top:-60px;display: flex">
            <el-input v-model="searchName"></el-input>
            <el-button type="primary">搜索</el-button>
          </div>
        </div>

        <div>
          <div style="display: flex;justify-content: space-between">
            <div class="ten" style="text-align: center;line-height: 300px;cursor: pointer;" @click="mapListPower[0].isCheck?dialogVisible=true:dialogVisible=false;" v-if="positionId">
              <img src="@/assets/addI.png" alt="" width="200px" height="200px" style="margin-top: 40px">
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[0]">
              <div>ID
                {{items[0].id}}
              </div>
              <div class="title">标题
                {{items[0].name}}
              </div>
              <div class="time" >创建时间
                {{items[0].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[0].webUrl}`" alt="" width="250px" height="150px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[0].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[0].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[0].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[0].id;imageName=items[0].name;" :disabled="!mapListPower[1].isCheck">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[0].id)" :disabled="!mapListPower[3].isCheck">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[1]">
              <div>ID
                {{items[1].id}}
              </div>
              <div class="title">标题
                {{items[1].name}}
              </div>
              <div class="time">创建时间
                {{items[1].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[1].webUrl}`" alt="" width="250px" height="150px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[1].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[1].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[1].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[1].id;imageName=items[1].name;" :disabled="!mapListPower[1].isCheck">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[1].id)" :disabled="!mapListPower[3].isCheck">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
          </div>
          <div style="display: flex;justify-content: space-between;margin-top: 10px">
            <div class="ten" v-if="items[2]">
              <div>ID
                {{items[2].id}}
              </div>
              <div class="title">标题
                {{items[2].name}}
              </div>
              <div class="time">创建时间
                {{items[2].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[2].webUrl}`" alt="" width="250px" height="150px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[2].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[2].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[2].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[2].id;imageName=items[2].name;" :disabled="!mapListPower[1].isCheck">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[2].id)" :disabled="!mapListPower[3].isCheck">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[3]">
              <div>ID
                {{items[3].id}}
              </div>
              <div class="title">标题
                {{items[3].name}}
              </div>
              <div class="time">创建时间
                {{items[3].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[3].webUrl}`" alt="" width="250px" height="150px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between">
                <div>
                  <span v-if="items[3].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[3].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[3].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[3].id;imageName=items[3].name;" :disabled="!mapListPower[1].isCheck">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[3].id)" :disabled="!mapListPower[3].isCheck">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
            <div class="ten" v-if="items[4]">
              <div>ID
                {{items[4].id}}
              </div>
              <div class="title">标题
                {{items[4].name}}
              </div>
              <div class="time">创建时间
                {{items[4].createTime}}
              </div>
              <div style="text-align: center">
                <img :src="`/static/${items[4].webUrl}`" alt="" width="250px" height="150px">
              </div>
              <div class="foot" style="display: flex;justify-content: space-between;">
                <div>
                  <span v-if="items[4].checkState==1"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#FFFF00;">● </span>待审核</span>
                  <span v-if="items[4].checkState==2"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:#7EC856;">● </span>通过</span>
                  <span v-if="items[4].checkState==3"><span style="font-family:'Helvetica Regular', 'Helvetica';font-size:14px;color:red;">● </span>不通过</span>
                </div>
                <div>
                  <el-button type="text" size="small" @click="editName = true;editId=items[4].id;imageName=items[4].name;" :disabled="!mapListPower[1].isCheck">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteImg(items[4].id)" :disabled="!mapListPower[3].isCheck">删除</el-button>
                </div>
              </div>
            </div>
            <div class="ten" v-else></div>
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-pagination v-if="showPagination"  @current-change="pageChange" :current-page="currentPage"  :page-size="5" layout="total, prev, pager, next, jumper" :total="total" background>
          </el-pagination>
        </div>
      </el-main>

    </div>
    <div>
      <el-dialog title="新建识别图" :visible.sync="dialogVisible" width="40%" @close="cancle()">
        <div><span style="color: #f56c6c;margin-right: 2px;">*</span>识别图名称：
        <el-input v-model="imageName" maxlength="50"></el-input>
        </div>
        <div>
          <span style="color: #f56c6c;margin-right: 2px;">*</span>上传识别图：
          <el-upload
            class="avatar-uploader"
            :action="`/api/utopa/ar/material/upload/image`"
            :show-file-list="false"
            :headers="header"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
          </el-upload>
        </div>
        <div>
          宽度：
          <el-input v-model="imageWidth" oninput="value=value.replace(/[^\d]/g,'')" maxlength="50"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;cancle();">取 消</el-button>
          <el-button type="primary" @click="createImage()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改识别图名称" :visible.sync="editName" width="40%"  @close="cancle()">
        <div>识别图名称：
          <el-input v-model="imageName" maxlength="50"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editName = false;cancle();">取 消</el-button>
          <el-button type="primary" @click="editImgName()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getImage,putInTree,createImage,editImgName,deleteImg} from "../../http/request";
  import navMenu from "@/share/navMenu.vue";
  import headNav from "@/share/headNav.vue";
  import { Base64 } from 'js-base64';
  import {mapState,mapActions} from 'vuex'
  export default {
        name: "imageUtopa",
        data(){
          return{
              activeName:'first',
              currentPage:1,
              total:0,
              page:1,
              showPagination:false,
              items:[],
              dialogVisible:false,
              imageName:'',
              imageUrl:'',
              header:{
                Authorization:this.$cookies.get('middlegroundToken')
              },
            treeData:[],
            filterText:'',
            props: {
              label: "name",
              children: 'children',
              value:'id',
            },
            positionId:'',
            imageWidth:'',
            imageId:'',
            editName:false,
            editId:'',
            searchName:'',
            treeHeight:''
          }
        },
        components: {
          navMenu,
          headNav
        },
       computed:{
          ...mapState('currentUserPower',['mapListPower'])
       },
       inject:['replace','reload'],
       methods:{
         ...mapActions('currentUserPower',['getUserPower']),
         handleClick(tab, event) {
           console.log(tab, event);
           this.page=1;
           this.getImage();
         },
         getImage(){
           let checkState='';
           this.activeName=="first"?(()=>{
              checkState='';
           })():'';
           this.activeName=="second"?(()=>{
             checkState=1;
           })():'';
           this.activeName=="third"?(()=>{
             checkState=2;
           })():'';
           this.activeName=="fourth"?(()=>{
             checkState=3;
           })():'';

           let msg={
             name:this.searchName,
             'checkState':checkState,
             pageNum:this.page,
             pageSize:5,
             source:'Middleground',
             middleGroundAssertId:this.positionId
           }
          getImage(msg).then(res=>{
            //console.log(res,999)
            res.code?this.$message.error(res.msg):(()=>{
              res.data.items.map(v=>v.webUrl=Base64.decode(v.pic))
              console.log(res.data.items,88888)
              this.items=res.data.items;
              this.total=res.data.total;
            })();
          })
         },
         pageChange(val){
          console.log(val)
           this.page=val;
         } ,
         handleAvatarSuccess(res, file) {
           console.log(res,file,777777);
           this.imageId=res.data.fileId;
           this.imageUrl = URL.createObjectURL(file.raw);
         },
         beforeAvatarUpload(file) {
           console.log(file,999999)
           const isJPG = file.type === 'image/jpeg'||file.type==='image/png';
           //const isPng=file.type==='image/png';
           const isLt2M = file.size / 1024 / 1024 < 2;
           if (!isJPG) {
             this.$message.error('上传图片只能是 JPG/PNG 格式!');
           }
           if (!isLt2M) {
             this.$message.error('上传图片大小不能超过 2MB!');
           }
           return isJPG && isLt2M;
         },
         handleNodeClick(data) {
           console.log(data);
           data.type==6?(()=>{
             this.page=1;
             this.searchName='';
             this.positionId=data.id;
             this.getImage();
           })():'';
         },
         filterNode(value, data) {
           if (!value) return true;
           return data.name.indexOf(value) !== -1;
         },
         createImage(){
           let msg={
             name:this.imageName,
             pic:this.imageId,
             type:2,
             middleGroundAssertId:this.positionId,
             width:this.imageWidth,
             height:''
           }
           msg.name?(()=>{
             msg.pic?(()=>{
               msg.middleGroundAssertId?(()=>{
                  createImage(msg).then(res=>{res.code?this.$message.error(res.msg):(()=>{
                    this.$message.success(res.msg)
                    this.cancle();
                    this.getImage();
                    this.dialogVisible=false;
                  })();})
               })():this.$message.error('地理位置不能为空');
             })():this.$message.error('识别图不能为空');
           })():this.$message.error('识别图名称不能为空');
         },
         cancle(){
           this.imageId='';
           this.imageName='';
           this.imageWidth='';
           this.editId='';
           this.imageUrl='';
         },
         editImgName(){
           let msg={
             name:this.imageName,
             id:this.editId
           };
           msg.id&&msg.name?(()=>{
             editImgName(msg).then(res=>{
               res.code?this.$message.error(res.msg):this.$message.success(res.msg);
               this.getImage();
               this.cancle();
               this.editName=false;
             })
           })():this.$message.error('名称不能为空')
         },
         deleteImg(id){
           deleteImg(id).then(res=>{
             this.getImage();
           })
         }
       },
       watch:{
         filterText(val) {
           this.$refs.tree.filter(val);
         },
         searchName(){
             this.page=1;
             this.showPagination=false;
             this.getImage();
             this.showPagination=true;
         },
         page(){
           this.getImage();
         }
       },
      created() {
          this.page=1;
          this.$nextTick(()=>{
            this.currentPage=this.page*1;
          //分页显示隐藏
            this.getImage();
            putInTree({source:'Middleground'}).then(res=>{
              this.treeData=res.data
            })
          this.showPagination=true;
        })
        this.getUserPower();
      },
    updated(){
      this.$nextTick(()=>{
        this.treeHeight = window.innerHeight - this.$refs.tree.$el.offsetTop -10;
      })
    }
  }
</script>

<style scoped>
.ten{
  width: 360px;
  height: 250px;
  /*background: #614a4d;*/
  padding: 10px 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-main{
  padding-top: 10px;
}
.pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:212px;
  /*background-color:#545c64;*/
}
 .body-content{
  position:absolute;
  top:66px;
  left:210px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
}
.cur{ cursor: pointer;}
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.time{
  color: #999;
  font-family: "PingFang SC","Microsoft YaHei",arial,"Hiragino Sans GB","Hiragino Sans GB W3";
  font-size: 12px;
  margin-top: 2px;
  margin-bottom: 2px;
}
  .title{
    height: 29px;
    line-height: 29px;
    color: #333;
    font-size: 14px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width:280px;
  }
.foot{
  height: 29px;
  line-height: 29px;
  color: #333;
  font-size: 14px;
}
</style>
