<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="!$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/新增场景/新增背景音乐</span>
      <span v-if="$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/编辑场景/新增背景音乐</span>
    </div>
    <el-row class="tac" style="padding-bottom:15px">
      <el-input placeholder="请输入名称" class="input-with-select" v-model="bgmName" style="width: 20%;" maxlength="50">
        <el-button slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
    </el-row>
    <el-table ref="multipleBgm" :data="bgmList" border style="width: 100%" class="mt15 mb15" @select="bgmSelect" @select-all="bgmSelectAll">
      <el-table-column type="selection" width="50" :selectable="(row)=>row.state==1" ></el-table-column>
      <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
      <el-table-column prop="name" label="歌曲名称" align="center"></el-table-column>
      <el-table-column label="音乐试听">
        <template slot-scope="scope">
          <span style="cursor: pointer;" >
            <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="bgmList.forEach(v=>{v.play=false;});scope.row.play=true;playMusic(scope.row.androidMaterial,scope.row)">
            <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="materialCategoryName" label="所属类别" align="center"></el-table-column>
      <el-table-column prop="androidResourcePackageSize" label="安卓资源包大小(M)" align="center">
        <template slot-scope="scope">
          {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
        </template>
      </el-table-column>
      <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小(M)" align="center">
        <template slot-scope="scope">
          {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
        </template>
      </el-table-column>
      <el-table-column prop="durationTimeStr" label="总时长" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column label="上下架状态" prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">上架</span>
          <span v-if="scope.row.state==2" style="color:red;">下架</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[ 20, 40, 60,80]"
        :page-size="limit"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total?total:0">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createscene`,query:{id:$route.query.id,sceneId:$route.query.sceneId,sceneName:$route.query.sceneName,sceneTime:$route.query.sceneTime,selectModel:$route.query.selectModel,selectProgramList:$route.query.selectProgramList,oldQuery:$route.query.oldQuery}})">取 消</el-button>
    </span>
    <div>
      <audio :src="url" autoplay="autoplay" ref="audio"></audio>
    </div>
  </div>
</template>

<script>
import {getMaterialList,getFile} from '../../../http/request'
import { Base64 } from 'js-base64';
import { resolve, reject } from 'q';
export default {
  name:'createBgm',
  inject:['reload'],
  data(){
    return{
      bgmName:'',
      bgmList:[],
      total:0,//总行数
      page:1,//页码
      limit:20,//一页行数
      choseMusic:[],
      selectMusic:[],
      url:'',
    }
  },
  computed:{
    allParams(){
      return{
        "name":this.bgmName,
        "page":this.page,
        "limit":this.limit,
        "appId":this.$route.params.appId,
        "module":'100',
        "state":1,
      }
    }
  },
  watch:{
    async page(){
      await this.listData();
      this.clashBgm();
    },
    async limit(){
      if(this.page!=1){
        this.page=1;
      }
      await this.listData();
      this.clashBgm();
    },
    bgmName(){
      if(this.page!=1){
        this.page=1;
      }
      this.listData();
    }
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    bgmSelect(arr,row){
      if(arr.map(v=>v.id).indexOf(row.id)==-1){
        this.choseMusic = this.choseMusic.filter(v=>v.id!=row.id);
      }else{
        this.choseMusic.push(row);
      }
    },
    bgmSelectAll(arr){
      if(arr.length){
        this.choseMusic=this.choseMusic.filter(v=>arr.map(v=>v.id).indexOf(v.id)==-1);
        this.choseMusic=this.choseMusic.concat(arr)
      }else{
        this.choseMusic=this.choseMusic.filter(v=>this.bgmList.map(v=>v.id).indexOf(v.id)==-1);
      }
    },
    handleSelectionChange(arr){
      this.choseMusic=arr;
    },
    clashBgm(){//将选择音乐的行高亮
      let selectAllRow=[];
      for(let i=0;i<this.choseMusic.length;i++){
        var row=this.bgmList.find(v=>v.id==this.choseMusic[i].id);
        if(row){
          selectAllRow.push(row);
        }
      };
      this.$nextTick(()=>{
        selectAllRow.forEach(v=>{
          this.$refs.multipleBgm.toggleRowSelection(v,true); 
        })
      });
    },
    listData(){
      return new Promise((resolve,reject)=>{
        getMaterialList(this.allParams).then(res=>{
          if(res.code){
            this.$message.error(res.msg)
          }else{
            this.bgmList =res.data.items.map(v=>{
              v.play=false;
              return v;
            });
            this.total= res.data.total;
            resolve();
          }
        }).catch(err=>{
          reject(err);
        })
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
      this.choseMusic.map(v=>{v.duration = v.durationTimeStr;v.materialId = v.id;v.rank='';v.fileId = v.androidMaterial;v.musicId = (new Date()).valueOf();return v;})
      this.selectMusic=this.selectMusic.concat(this.choseMusic);
      this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createscene`,query:{id:this.$route.query.id,sceneId:this.$route.query.sceneId,sceneName:this.$route.query.sceneName,sceneTime:this.$route.query.sceneTime,selectModel:this.$route.query.selectModel,selectProgramList:this.$route.query.selectProgramList,selectMusic:JSON.stringify(this.selectMusic),oldQuery:this.$route.query.oldQuery}});
      this.reload();
    }
  },
  created(){
    if(this.$route.query.selectMusic){
      this.selectMusic=JSON.parse(this.$route.query.selectMusic)
    }
    this.listData();
  }
}
</script>

<style scoped>

</style>