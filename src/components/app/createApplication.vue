<template>
    <div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <div class="divContent">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>应用名称</span>
              <el-input style="width: 200px" v-model="name"></el-input>
            </div>
            <div>
              <span class="labelSpan">副标题</span>
              <el-input style="width: 200px" v-model="subtitle"></el-input>
            </div>
            <div class="divContent" style="height: 220px;line-height: 220px;margin-top: 20px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>封面图</span>
              <el-upload
                style="display: inline-block"
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
              <div>
                <div style="height: 80px;">
                  <span class="labelSpan" ><span style="color: #f56c6c;margin-right: 2px;">*</span>应用类型</span>
                  <el-select v-model="appId" placeholder="请选择" @change="positionData=[]">
                    <el-option
                      v-for="item in app"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <div style="margin-bottom: 20px;">
                  <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>投放位置</span>
                  <div style="margin-left: 50px;min-height: 80px;margin-top: 10px;margin-bottom:10px;font-size: 14px;color: #606266;" >
                    <div style="height: 30px;line-height: 30px"><span class="positionSpan">ID</span><span class="positionSpan">位置资产</span><span class="positionSpan">操作</span></div>
                    <div>
                      <div v-for="item in positionData" :key="item.id" v-if="item.checked" style="height: 30px;line-height: 30px;margin-left: 60px">
                        <span class="positionSpan">{{item.positionId}}</span>
                        <span class="positionSpan">{{item.positionDesc}}</span>
                        <span class="positionSpan"><el-button @click="item.checked=false;" type="text">删除</el-button></span>
                      </div>
                    </div>
                    <el-button @click="positionShow=true" style="width: 400px;margin-left: 140px" >+</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 100px;">
              <span class="labelSpan" style="line-height: 100px"><span style="color: #f56c6c;margin-right: 2px;">*</span>关联页面</span>
              <div style="display: inline-block">
                <div>
                  <el-radio v-model="relatePageType" label="1">详情页</el-radio>
                </div>
                <div>
                  <el-radio v-model="relatePageType" label="2">自定义页面</el-radio>
                  <el-input v-model="relatePageUrl" style="width: 200px;" v-if="relatePageType==2"></el-input>
                </div>
                <div><el-radio v-model="relatePageType" label="3">启动应用</el-radio></div>
              </div>
            </div>
            <div class="divContent">
              <span class="labelSpan">使用对象</span>
              <span>
                <el-radio v-model="target" label="0">所有用户</el-radio>
                <el-radio v-model="target" label="1">注册用户</el-radio>
              </span>
            </div>
            <div class="divContent">
              <span class="labelSpan">地理位置</span>
              <span>
                <el-input style="width: 200px" v-model="position"></el-input>
              </span>
            </div>
            <div class="divContent">
             <span class="labelSpan">状态</span>
              <span>
                 <el-radio v-model="status" label="0">启用</el-radio>
              <el-radio v-model="status" label="1">禁用</el-radio>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="详情页" name="second">
            <div class="divContent">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>标题</span>
              <el-input style="width: 200px" v-model="title"></el-input>
            </div>
            <div class="divContent" style="height: 200px">
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>头图</span>
              <el-upload
                class="avatar-uploader"
                :action="`/api/utopa/ar/material/upload/image`"
                :show-file-list="false"
                :headers="header"
                :on-success="AvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="headImageUrl" :src="headImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
              </el-upload>
            </div>
            <div class="divContent">
              <span class="labelSpan">头图关联网址</span>
              <el-input style="width: 200px" v-model="relateUrl"></el-input>
            </div>
            <div class="divContent">
              <span class="labelSpan">分享内容</span>
              <el-input v-model="shareUrl" style="width: 200px"></el-input>
            </div>
            <div >
              <span class="labelSpan"><span style="color: #f56c6c;margin-right: 2px;">*</span>详情描述</span>
              <br>
              <div ref="editor" style="text-align:left;margin-left: 30px;margin-top: 10px"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="margin-top: 20px;margin-left: 50px">
        <el-button @click="createApp" v-if="type=='create'" type="primary">创建</el-button>
        <el-button @click="createApp" v-if="type=='revise'">修改</el-button>
        <el-button @click="goTo">返回</el-button>
      </div>
      <el-dialog title="选择地址" :visible.sync="positionShow" >
        <div style="border-bottom: 1px solid #dcdfe6;line-height: 40px"><span class="positionSpan"></span><span class="positionSpan">ID</span><span class="positionSpan">位置资产</span></div>
        <div>
          <div v-for="(item,index) in positionData" :key="item.id">
            <div v-if="index>page*5-6&&index<page*5" style="border-bottom: 1px dashed #dcdfe6;line-height: 40px">
              <span class="positionSpan"><el-checkbox v-model="item.checked"></el-checkbox></span>
              <span class="positionSpan">{{item.id}}</span>
              <span class="positionSpan">{{item.name}}</span>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-pagination @size-change="limitChange" @current-change="pageChange" :current-page="1"  :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
<!--        <el-button @click="addPosition()">确定</el-button>-->
<!--        <el-button @click="positionShow=false">取消</el-button>-->
      </el-dialog>

    </div>
</template>

<script>
  //import uploadFile from "../../share/uploadFile";
  import E from 'wangeditor';
  import { Base64 } from 'js-base64';
  import {getPlay,addPut,getDetail,getAppId,getPosition} from "../../http/request";
  export default {
        name: "createApplication",
        data(){
          return{
            activeName: 'first',
            id:'',
            name:'',
            subtitle:'',
            coverImage:'',
            playType:'',
            relateMaterial:'',
            relatePageType:'',
            relatePageUrl:'',
            target:0+'',
            category:'',
            title:'',
            headImage:'',
            relateUrl:'',
            description:'',
            useCount:0,
            play:[],
            type:'',
            positions:{

            },
            app:[],
            appId:'',
            positionData:[],
            positionShow:false,
            positionChecked:[],
            limit:5,
            page:1,
            total:0,
            position:'',
            shareUrl:'',
            content:'',
            editorContent:'',
            status:0+'',
            header:{
              Authorization:this.$cookies.get('middlegroundToken')
            },
            imageUrl:'',
            coverImage:'',
            headImageUrl:''
          }
        },
        methods:{
          handleClick(tab, event) {
            console.log(tab, event);
          },
          createApp(){
            let msg={
              id:this.id,
              name:this.name,
              subtitle:this.subtitle,
              coverImage:this.coverImage,
              relateApplicationId:this.appId,
              relatePageType:this.relatePageType,
              relatePageUrl:this.relatePageUrl,
              target:Number(this.target),
              position:this.position,
              title:this.title,
              headImage:this.headImage,
              relateUrl:this.relateUrl,
              description:this.editorContent,
              shareUrl:this.shareUrl,
              status:this.status,
              positions:[]
            }
            msg.name?(()=>{
              msg.coverImage?(()=>{
                msg.relateApplicationId?(()=>{
                  msg.relatePageType?(()=>{
                    msg.title?(()=>{
                      msg.headImage?(()=>{
                        msg.description?(()=>{
                          this.positionData.map(v=>{
                            v.checked?msg.positions.push({positionId:v.id}):'';
                          });
                          msg.positions.length?(()=>{
                            this.id?(()=>{
                              //修改
                              // this.positionData.map(v=>{
                              //   v.checked?msg.positions.push({positionId:v.id}):'';
                              // })
                              console.log(msg,88);
                              addPut(msg).then(res=>{
                                res.code?(()=>{
                                  this.$message.error(res.msg);
                                })():(()=>{
                                  this.$message.success(res.msg);
                                  this.goTo();
                                })()
                              })
                            })():(()=>{
                              //新增
                              // this.positionData.map(v=>{
                              //   v.checked?msg.positions.push({positionId:v.id}):'';
                              // })
                              console.log(msg,88);
                              addPut(msg).then(res=>{
                                res.code?(()=>{
                                  this.$message.error(res.msg);
                                })():(()=>{
                                  this.$message.success(res.msg);
                                  this.goTo();
                                })()
                              })
                            })();
                          })():this.$message.error('投放位置不能为空')
                        })():this.$message.error('详情描述不能为空')
                      })():this.$message.error('头图不能为空')
                    })():this.$message.error('标题不能为空')
                  })():this.$message.error('关联页面不能为空')
                })():this.$message.error('应用类型不能为空')
              })():this.$message.error('封面图不能为空')
            })():this.$message.error('应用名称不能为空')


          },
          goTo(){
            this.$router.push({
              path:'/app/applicationList',
              query:JSON.parse(this.$route.query.msg)
            })
          },
          getAppId(){
            getAppId().then(res=>{
              //console.log(res)
              res.code?this.$message.error(res.msg):(()=>{
                this.app=res.data
              })();
            })
          },
          getPosition(){
            let msg={
              name:'',
              backgroundAppId:this.appId,
              page:1,
              limit:10000
            }
            getPosition(msg).then(res=>{
              console.log(res,9999)
              res.code?this.$message.error(res.msg):(()=>{
                let apple=res.data.items;
                this.total=res.data.total;
                this.positionData=apple.map(v=>{v.checked=false;v.positionId=v.id;v.positionDesc=v.name;return v;});
                this.id?(()=>{
                  let ban=[];
                  this.positionChecked.map(v=>ban.push(v.positionId))
                  console.log(ban,'ban')
                  //判断是否选中
                  this.positionData.map(r=>{
                    ban.includes(r.id)?r.checked=true:r.checked=false;
                    return r;
                  })
                })():'';
                 console.log(this.positionData,789)
              })();
            })
          },
          limitChange(val){
            this.limit=val*1;
          },
          pageChange(val){
              this.page=val*1;
          },
          cancle(){

          },
          // addPosition(){
          //   console.log(this.positionData,7777)
          //   this.positionChecked=this.positionData.filter(v=>v.checked==true)
          //   this.positionChecked.map(v=>{
          //     v.positionId=v.id;
          //     v.positionDesc=v.name;
          //   })
          //   this.positionShow=false;
          //   console.log(this.positionChecked,888)
          // },
          handleAvatarSuccess(res, file) {
            console.log(res,file,777777);
            this.coverImage=res.data.fileId;
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
          AvatarSuccess(res, file) {
            console.log(res,file,777777);
            this.headImage=res.data.fileId;
            this.headImageUrl = URL.createObjectURL(file.raw);
          },
        },
        watch:{
          appId(){
            this.appId?(()=>{
              //this.positionData=[];
              //this.positionChecked=[];
              this.getPosition();
            })():(()=>{
              //this.positionData=[];
              //this.positionChecked=[];
            })();
          },
          relatePageType(){
            console.log(this.relatePageType)
            this.relatePageType!=2?this.relatePageUrl='':'';
          },
          onEditorChange({ quill, html, text }) {
            console.log('editor change!', quill, html, text)
            this.content = html
          },
        },
        created() {
          //this.getPlay();
          //console.log(this.type,88)
        },
        mounted() {
          var editor = new E(this.$refs.editor);
          editor.customConfig.onchange = (html) => {
            this.editorContent = html
          }
          editor.create();
          this.getAppId();
          this.type=this.$route.query.type;
          this.type=='create'?'':(()=>{
            getDetail(this.$route.query.id).then(
              res=>{
                if(res.code){
                  this.$message.error(res.msg);
                }else {
                  this.id = res.data.id,
                    this.name = res.data.name,
                    this.subtitle = res.data.subtitle,
                    this.coverImage = res.data.coverImage,
                    this.imageUrl=`/static/${Base64.decode(res.data.coverImage)}`,
                    this.headImage=res.data.headImage,
                    this.headImageUrl=`/static/${Base64.decode(res.data.headImage)}`,
                    // relateApplicationId:this.appId,
                    this.appId=res.data.relateApplicationId,
                    this.relatePageType = res.data.relatePageType+'',
                    this.relatePageUrl = res.data.relatePageUrl,
                    this.position = res.data.position,
                    this.category = res.data.category,
                    this.title = res.data.title,
                    this.headImage = res.data.headImage,
                    this.relateUrl = res.data.relateUrl,
                    this.editorContent = res.data.description,
                    this.shareUrl=res.data.shareUrl,
                    this.status=res.data.status+'',
                    this.positionChecked=res.data.positions.map(v=>{v.checked=true;v.id=v.positionId;return v;}),
                    console.log(this.positionChecked,9999)
                    editor.txt.html(this.editorContent)
                }
              }
            )
          })();
        }
  }
</script>

<style scoped>
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
  .labelSpan{
    display: inline-block;
    width: 100px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
  }
  .divContent{
    height: 100px;
    line-height: 100px;
    display: flex;
  }
  .positionSpan{
    display: inline-block;
    width: 180px;
    text-align: center;
    height: 40px;
  }

</style>
