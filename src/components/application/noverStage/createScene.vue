<template>
  <div>
    <div v-if="$route.name=='createScene'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
        <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次 / 新增场景</span>
        <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次 / 编辑场景</span>
      </div>
      <el-form label-position="right" :model="form" label-width="150px" style="width: 100%">
        <el-form-item label="场景名称">
          <el-input type="text" v-model="form.sceneName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="场景播放时间">
          <el-time-picker
            is-range
            v-model="form.time"
            format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="场景模型">
          <span v-if="!modelId">
            <el-button type="primary" @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createscene/createscenemodel`,query:{id:$route.query.id,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">新增场景模型</el-button>
          </span>
          <div v-if="modelId">
            <div style="display:inline-block;vertical-align:middle;">
              <img :src="`/static/${modelImg}`" alt="" width="150px">
              <div style="width:150px;text-align:center;line-height:0;">{{modelName}}</div>
            </div>
            <div style="display:inline-block;vertical-align:middle;">
              <el-button type="text" @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createscene/createscenemodel`,query:{id:$route.query.id,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">重新选择</el-button>
              <el-button type="text" @click="clearModel" style="color:red;">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择素材">
          <span v-for="(item,idx) in materialList" :key="idx">
            <el-button size="mini" type="primary" :plain="!item.isCheck" round @click="tabMaterial(idx)">{{item.value}}</el-button>
          </span>
        </el-form-item>
        <el-form-item :label="`${titleName}列表`">
          <div v-if="isMusic">
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="inputMusic" style="width: 205px;" maxlength="50">
                <el-button slot="append" icon="el-icon-search">搜索</el-button>
              </el-input>
              <el-button type="primary" @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createscene/createbgm`,query:{id:$route.query.id,sceneId:$route.query.sceneId,sceneName:form.sceneName,sceneTime:JSON.stringify(form.time),selectModel:$route.query.selectModel,selectMusic:JSON.stringify(musicTable),selectProgramList:JSON.stringify(programTable),oldQuery:$route.query.oldQuery}})">新增背景音乐</el-button>
              <el-button type="danger" @click="delMusic">批量删除</el-button>
            </el-row>
            <el-table ref="musicTable" :data="musicTable" tooltip-effect="dark" :key="(new Date()).valueOf()" @selection-change="selectionMusic">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="materialId" label="ID" width="50"></el-table-column>
                <el-table-column label="音乐名称" prop="name"></el-table-column>
                <el-table-column label="音乐试听">
                  <template slot-scope="scope">
                    <span style="cursor: pointer;" >
                      <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="musicTable.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.fileId,scope.row)">
                      <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="总时长" prop="duration"></el-table-column>
                <el-table-column label="上下架状态" prop="state">
                  <template slot-scope="scope">
                    <span v-if="scope.row.state==1">上架</span>
                    <span v-if="scope.row.state==2" style="color:red;">下架</span>
                  </template>
                </el-table-column>
                <el-table-column label="播放顺序" prop="materialCategoryName">
                  <template slot-scope="scope">
                    <el-input style="width:50px;" v-model="scope.row.rank" maxlength="50"></el-input>
                  </template>
                </el-table-column>
            </el-table>
          </div>
          <div v-if="!isMusic">
            <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="inputProgram" style="width: 205px;" maxlength="50">
                <el-button slot="append" icon="el-icon-search">搜索</el-button>
              </el-input>
              <el-button type="primary" @click="createProgram">新增节目</el-button>
              <el-button type="danger" @click="delProgram">批量删除</el-button>
            </el-row>
            <el-table ref="musicTable" :data="programTable" tooltip-effect="dark" :key="(new Date()).valueOf()" @selection-change="selectionProgram">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="materialId" label="ID" width="50"></el-table-column>
              <el-table-column label="节目名称" prop="programName"></el-table-column>
              <el-table-column label="动画名称" prop="materialName"></el-table-column>
              <el-table-column label="节目时长" prop="duration"></el-table-column>
              <el-table-column label="开始时间" prop="startTime">
                <template slot-scope="scope">
                  {{scope.row.startTime?scope.row.startTime.slice(11):''}}
                </template>
              </el-table-column>
              <el-table-column label="结束时间" prop="endTime">
                <template slot-scope="scope">
                  {{scope.row.startTime?scope.row.endTime.slice(11):''}}
                </template>
              </el-table-column>
              <el-table-column label="上下架状态" prop="state">
                <template slot-scope="scope">
                  <span v-if="scope.row.state==1">上架</span>
                  <span v-if="scope.row.state==2" style="color:red;">下架</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="320">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="editProgram(scope)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button type="primary" plain @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createstagecontent`,query:{id:$route.query.id,oldQuery:$route.query.oldQuery}})">取消</el-button>
        </el-form-item>
      </el-form>
      <div>
        <audio :src="url" autoplay="autoplay" ref="audio"></audio>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {createStageScene,eidtStageScene,getStageSceneInfo,getStageMusicList,getStageProgramList,getFile} from '../../../http/request'
import { Base64 } from 'js-base64';
import { resolve, reject } from 'q';
export default {
  name:'createScene',
  inject:['reload','replace'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      form:{
        sceneName:'',
        time:null,
      },
      materialList:[{"code":1,"value":"背景音乐","isCheck":true},{"code":2,"value":"节目","isCheck":false}],
      currentIndex:0,
      titleName:'背景音乐',
      inputMusic:'',
      musicTable:[],
      inputProgram:'',
      programTable:[],
      isMusic:true,
      modelId:'',
      modelName:'',
      modelImg:'',
      selectModel:null,
      selectMusicId:[],
      selectProgramId:[],
      loading:'',
      preProgramEndTime:null,
      musicListParams:[],
      programListParams:[],
      url:'',
    }
  },
  computed:{
    allParams(){
      return{
        "contentCarrierId":this.$route.query.id,//场次id
        "sceneName":this.form.sceneName,
        "startTime":this.form.time?this.form.time[0]:null,
        "endTime":this.form.time?this.form.time[1]:null,
        "appId":this.$route.params.appId,
        "sceneModelMaterialId":this.modelId,//模型id
        "modelName":this.modelName,//模型名称
        "bgmMaterials":this.musicListParams,
        "programMaterials":this.programListParams,
      }
    },
    musicParams(){
      return{
        "parentCarrierId":this.$route.query.sceneId?this.$route.query.sceneId:''
      }
    },
    programParams(){
      return{
        "parentCarrierId":this.$route.query.sceneId?this.$route.query.sceneId:''
      }
    }
  },
  methods:{
    selectionMusic(arr){
      this.selectMusicId=arr.map(v=>{if(v.musicId){
        return v.musicId;
      }else{
        return v.id;
      }});
    },
    delMusic(){
      if(!this.selectMusicId.length){
        this.$message.error('请选择需要删除的行');
      }else{
        this.$confirm('确认删除吗？','提示').then(v=>{
          this.musicTable=this.musicTable.filter(v=>this.selectMusicId.indexOf(v.id)==-1);
          this.musicTable=this.musicTable.filter(v=>this.selectMusicId.indexOf(v.musicId)==-1);
          this.replace('selectMusic',JSON.stringify(this.musicTable));
        })
      }
    },
    selectionProgram(arr){
      this.selectProgramId=arr.map(v=>{if(v.musicId){
        return v.musicId;
      }else{
        return v.id;
      }});
    },
    delProgram(){
      if(!this.selectProgramId.length){
        this.$message.error('请选择需要删除的行');
      }else{
        this.$confirm('确认删除吗？','提示').then(v=>{
          this.programTable=this.programTable.filter(v=>this.selectProgramId.indexOf(v.id)==-1);
          this.programTable=this.programTable.filter(v=>this.selectProgramId.indexOf(v.musicId)==-1);
          this.replace('selectProgramList',JSON.stringify(this.programTable));
        })
      }
    },   
    clearModel(){
      this.modelId='';
      this,modelName='';
      this.modelImg='';
    },
    createProgram(){
      if(!this.form.time){
        this.$message.error('请先选择场景时间再操作');
        return;
      }
      this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createscene/createprogram`,query:{id:this.$route.query.id,sceneId:this.$route.query.sceneId,sceneName:this.form.sceneName,sceneTime:JSON.stringify(this.form.time),selectModel:this.$route.query.selectModel,selectMusic:JSON.stringify(this.musicTable),selectProgramList:this.programTable.length?JSON.stringify(this.programTable):null,oldQuery:this.$route.query.oldQuery}})
    },
    editProgram(scope){
      if(!this.form.time){
        this.$message.error('请先选择场景时间再操作');
        return;
      }
      let currentProgram  = scope.row;
      currentProgram .currentIndex = scope.$index;
      this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createscene/createprogram`,query:{id:this.$route.query.id,sceneId:this.$route.query.sceneId,sceneName:this.form.sceneName,sceneTime:JSON.stringify(this.form.time),currentProgram:JSON.stringify(currentProgram),selectModel:this.$route.query.selectModel,selectMusic:JSON.stringify(this.musicTable),selectProgramList:this.programTable.length?JSON.stringify(this.programTable):null,oldQuery:this.$route.query.oldQuery}})
    },
    tabMaterial(idx){
      this.currentIndex = idx;                 
      this.materialList.forEach(v=>{v.isCheck=false});
      this.materialList[idx].isCheck=true;
      this.titleName= this.materialList[idx].value;
      if(idx==0){this.isMusic=true;}else{this.isMusic=false};
    },
    sceneInfo(){
      this.loading=this.$loading({
        lock: true,
        text: `数据获取中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise((resolve,reject)=>{
        getStageSceneInfo({"carrierId":this.$route.query.sceneId}).then(res=>{
          this.loading.close();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.form.sceneName=res.data.sceneName;
            this.modelName = res.data.modelName;
            this.modelId = res.data.sceneModelMaterialId;
            this.modelImg = Base64.decode(res.data.pic);
            this.form.time = [res.data.startTime,res.data.endTime];
            resolve();
          }
        }).catch(err=>{
          this.loading.close();
          reject(err);
        })
      })
    },
    musicList(){
      getStageMusicList(this.musicParams).then(res=>{
        this.musicTable = res.data?res.data.map(v=>{
          v.play=false;
          return v;
        }):[];
      })
    },
    programList(){
      getStageProgramList(this.programParams).then(res=>{
        this.programTable=res.data?res.data:[];
      })
    },
    playMusic(id,row){
      if(id){
        this.url=`/static/${Base64.decode(id)}`;
        this.$refs.audio.load();
        this.$refs.audio.play();
        this.$refs.audio.onended=()=>{
          row.play = !row.play;
        }
      }else{
        this.$refs.audio.pause();
      }     
    },
    confirm(){
      if(this.allParams.sceneName===''){
        this.$message.error('请输入场景名称')
        return;
      }
      if(!this.allParams.startTime){
        this.$message.error('请选择时间')
        return;
      }
      if(!this.allParams.sceneModelMaterialId){
        this.$message.error('请选择场景模型')
        return;
      }
      if(!this.musicTable.length){
        this.$message.error('请添加背景音乐素材')
        return;
      }
      if(!this.programTable.length){
        this.$message.error('请添加节目素材')
        return;
      };
      let sceneTime1 = new Date(`2019/01/01 ${this.allParams.startTime.slice(11)}`);
      let sceneTime2 = new Date(`2019/01/01 ${this.allParams.endTime.slice(11)}`);
      let programClashList = this.programTable.filter(v=>{
          let programStartTime = new Date(`2019/01/01 ${v.startTime.slice(11)}`);
          let programEndTime = new Date(`2019/01/01 ${v.endTime.slice(11)}`);
          return programStartTime-sceneTime1<0||programEndTime-sceneTime2>0
        });
      console.log(programClashList,1515)
      if(programClashList.length){
        this.$message.error(`‘${programClashList.map(v=>v.programName).join('、')}’等节目超出场景时间`);
        return;
      }
      this.musicListParams = this.musicTable.map(v=>{v.id=v.materialId;return v;});
      this.programListParams = this.programTable.map(v=>{v.id=v.materialId;return v;});
      if(this.isCreate){
        createStageScene(this.allParams).then(res=>{
          this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createstagecontent`,query:{id:this.$route.query.id,oldQuery:this.$route.query.oldQuery}})
          this.reload();
        })
      }else if(this.isEdit){
        eidtStageScene({"sceneCarrierId":this.$route.query.sceneId,...this.allParams}).then(res=>{
          this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createstagecontent`,query:{id:this.$route.query.id,oldQuery:this.$route.query.oldQuery}})
          this.reload();
        })
      }
      
    }
  },
  async created(){    
    if(this.$route.query.selectMusic){
      this.musicTable = JSON.parse(this.$route.query.selectMusic);
    }
    if(this.$route.query.selectProgramList){
      this.programTable = JSON.parse(this.$route.query.selectProgramList);
    }
    if(this.$route.query.sceneId){
      this.isEdit=true;
      await this.sceneInfo();
      if(!this.musicTable.length){
        this.musicList();
      }
      if(!this.programTable.length){
        this.programList();
      }
    }else{
      this.isCreate=true;
    }
    if(this.$route.query.sceneName){
      this.form.sceneName = this.$route.query.sceneName;
    }
    if(this.$route.query.sceneTime){
      this.form.time = JSON.parse(this.$route.query.sceneTime);
    }
    if(this.$route.query.selectModel){
      this.selectModel = JSON.parse(this.$route.query.selectModel);
      this.modelId = this.selectModel.id;
      this.modelName = this.selectModel.name;
      this.modelImg = this.selectModel.webUrl;
    }
  }
}
</script>

<style scoped>

</style>