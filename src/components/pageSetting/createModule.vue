<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{title}}模块</span>
    </div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="模块类型">
        <el-select :disabled="isSee" v-model="moduleTypeX" style="width:150px;">
          <el-option v-for="(item,idx) in moduleTypeList" :key="idx" :label="item.description" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块标题">
        <el-input style="width:200px;" :disabled="isSee" v-model="moduleTitle" placeholder="请输入内容" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="副标题" v-if="moduleTypeX=='Slide'">
        <el-input style="width:200px;" :disabled="isSee" v-model="subTitle" placeholder="请输入内容" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="投放时间段">
        <el-date-picker
          v-model="bigTime"
          type="datetimerange"
          :disabled="isSee"
          format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          @change="bigTimeChange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'?'投放内容':'投放应用'">
        <el-table ref="multipleTable"
        :data="moduleList"
        tooltip-effect="dark"
        border>
          <el-table-column label="序号">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column label="投放内容" v-if="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'">
            <template slot-scope="scope">
              <uploadImg buttonName="图片" :isSee="isSee" :parentName="scope.row.releaseContent" :idx="scope.$index" moduleCode="ARModuleImg" @getImgId="getImgId"></uploadImg>
            </template>
          </el-table-column>
          <el-table-column label="关联" width="420" v-if="moduleTypeX=='CyclePlay'||moduleTypeX=='Slide'||moduleTypeX=='ImageShow'">
            <template slot-scope="scope">
              <el-select :disabled="isSee" v-model="scope.row.relateType" style="width:120px;" @change="selectChange(scope.$index)">
                <el-option v-for="(item,idx) in relateTypeList" :key="idx" :label="item.description" :value="item.code"></el-option>
              </el-select>
              <el-input :disabled="isSee" v-if="scope.row.relateType=='2'" style="width:200px;" v-model="scope.row.relateContent" placeholder="请输入URL地址" maxlength="50"></el-input>
              <el-input disabled v-if="scope.row.relateType=='1'||scope.row.relateType=='3'" style="width:200px;" v-model="scope.row.relateContent" maxlength="50"></el-input>
              <el-button :disabled="isSee" v-if="scope.row.relateType=='1'||scope.row.relateType=='3'" type="primary" plain size="mini" @click="applicationOpen(scope.$index)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column label="关联应用" width="420" v-if="moduleTypeX=='Module1'||moduleTypeX=='Module2'||moduleTypeX=='ApplicationList'">
            <template slot-scope="scope">
              <el-input :disabled="isSee" style="width:200px;" placeholder="请输入" v-model="scope.row.relateContent" maxlength="50"></el-input>
              <el-button :disabled="isSee" type="primary" plain size="mini" @click="applicationOpen(scope.$index)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column label="个性化投放时间段" width="440">
            <template slot-scope="scope">
              <el-checkbox :disabled="isSee" v-model="scope.row.isAbleSelectTime">
                <el-date-picker
                  v-model="scope.row.smallTime"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="!scope.row.isAbleSelectTime||isSee"
                  @change="smallTimeChange(scope.$index)"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-checkbox>
            </template>
          </el-table-column>          
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" :disabled="isSee" @click="del(scope.$index)">删除</el-button>
              <el-button type="primary" size="mini" :disabled="isSee" v-if="scope.$index==moduleList.length-1" @click="addRow()">添加</el-button>
            </template>
          </el-table-column>
          <div slot="empty">
            <p>
              <el-button size="mini" type="primary" :disabled="isSee" @click="addRow()">添加</el-button>
            </p>
          </div>
        </el-table>
      </el-form-item>
      <el-form-item label="使用状态">
        <el-radio-group :disabled="isSee" v-model="state">
        <el-radio :label="0">启用</el-radio>
        <el-radio :label="-1">禁用</el-radio>
      </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.push({path:'/app/modulelist',query:JSON.parse($route.query.oldQuery)})">返回</el-button>
        <el-button v-if="isCreate" type="primary" @click="addOrEdit('add')">创建模块</el-button>
        <el-button v-if="isEdit" type="primary" @click="addOrEdit('edit')">编辑模块</el-button>
      </el-form-item>
    </el-form>
    <div>
      <selectApplication :fSee="showApplication" @applicationClose="applicationClose" @getApplicationDtailId="getApplicationDtailId"></selectApplication>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import selectApplication from './selectAppplication'
import uploadImg from '../../share/uploadImg'
import {getDropdown,getModuleDetail,createModule,editModule} from '../../http/request'
export default {
  name:'createModule',
  inject:['reload'],
  components:{
    selectApplication,
    uploadImg,
  },
  data(){
    return{
      isCreate:false,
      title:'',//头部标题
      isEdit:false,
      isSee:false,
      moduleTypeX:'',//类型
      moduleTypeList:[],//下拉框列表
      relateType:'',//关联类型
      relateTypeList:[],//关联类型下拉框列表
      moduleTitle:'',
      subTitle:'',//副标题
      moduleList:[],
      state:0,
      showApplication:false,
      bigTime:[],//模块时间段
      smallTime:[],//个性化时间段
      // relateOption:"1",//关联选择器
      // address:'',//自定义url地址
      applicationIndex:'',//保存选择弹窗的行索引
      loading:'',//请求数据加载框
    }
  },
  computed:{
    module(){
      return{
        "category": this.moduleTypeX,
        "title": this.moduleTitle,
        "effectFrom": this.bigTime.length?this.bigTime[0]:'',
        "effectTo": this.bigTime.length?this.bigTime[1]:'',
        "status": this.state,
        "subTitle":this.subTitle,
        "modifyBy": ""
      }
    },
    contents(){
      return{
        "id":"",
        "moduleId":this.$route.query.id?this.$route.query.id:'',
        "releaseContent":"",
        "relateType":this.relateType,
        "relateContent":"",
      }
    }
  },
  methods:{
    addRow(){
      this.moduleList.push({isAbleSelectTime:true,...this.contents,"effectFrom":this.bigTime.length?this.bigTime[0]:'',"effectTo":this.bigTime.length?this.bigTime[1]:'',"smallTime":this.bigTime.length?JSON.parse(JSON.stringify(this.bigTime)):[]});
    },
    del(index){
      this.moduleList.splice(index,1) 
    },
    applicationOpen(index){//打开应用详情弹窗
      this.showApplication = true;
      this.applicationIndex = index;
    },
    getApplicationDtailId(id){//获取选择的应用详情id
      this.moduleList[this.applicationIndex].relateContent=id;
    },
    applicationClose(){//关掉应用详情弹窗
      this.showApplication = false;
    },
    getModuleType(){//获取下拉框
      getDropdown({category:'moduleType'}).then(res=>{
        this.moduleTypeList = res.data;
        this.moduleTypeX = this.moduleTypeList[0].code;
      })
      getDropdown({category:'relateType'}).then(res=>{
        this.relateTypeList = res.data.slice(0,2);
        this.relateType = this.relateTypeList[0].code;
      })
    },
    getImgId(imgId,imgName,idx){//获取上传的图片id
      this.moduleList[idx].releaseContent=imgId;
    },
    bigTimeChange(){
      this.bigTime=this.bigTime==null||(typeof this.bigTime[0]) =='object'?[]:this.bigTime;
    },
    smallTimeChange(index){
      if(this.moduleList[index].smallTime){
        this.moduleList[index].effectFrom =this.moduleList[index].smallTime[0];
        this.moduleList[index].effectTo =this.moduleList[index].smallTime[1];
      }else{
        this.moduleList[index].effectFrom='';
        this.moduleList[index].effectTo='';
      }
    },
    selectChange(index){//关联类型变化，清掉选的内容
      this.moduleList[index].relateContent='';
      // this.moduleList[index].effectFrom='';
      // this.moduleList[index].effectTo='';
      // this.moduleList[index].isAbleSelectTime=false;
      // this.moduleList[index].smallTime=[];
    },
    getDetail(){
      this.loading=this.$loading({
        lock: true,
        text: `数据获取中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getModuleDetail({moduleId:this.$route.query.id}).then(res=>{
        this.loading.close();
        if(res.data.contents.length>0){
          res.data.contents.forEach(v=>{
            if(v.effectFrom){
              v.smallTime=[v.effectFrom,v.effectTo];
              v.isAbleSelectTime=true;
            }else{
              v.smallTime=[];
              v.isAbleSelectTime=false;
            }
          });
        }
        this.moduleList = res.data.contents;
        this.moduleTypeX = res.data.module.category;
        this.moduleTitle = res.data.module.title;
        this.subTitle = res.data.module.subTitle;
        this.bigTime = [res.data.module.effectFrom,res.data.module.effectTo];
        this.state = res.data.module.status;
        this.moduleId = res.data.module.id;//保存模块id
      }).catch(u=>{
        this.loading.close();
      })
    },
    addOrEdit(type){
      if(this.moduleList.length>0){
        // var isTimeOk = this.moduleList.some(v=>v.effectFrom==false);
        // if(isTimeOk){
        //   this.$alert('请选择个性化投放时间段','提示');
        //   return;
        // }
        var isContentOk = this.moduleList.some(v=>v.relateContent==false);
        if(isContentOk){
          this.$alert('请选择关联应用或者输入关联地址','提示');
          return;
        }
      }
      
      if(this.moduleTitle===''){
        this.$alert('请输入标题','提示');
        return;
      }
      if(this.moduleTypeX=='Slide'){
        if(this.module.subTitle===''){
          this.$alert('请输入副标题','提示');
          return;
        } 
      }
      if(!this.module.effectFrom){
        this.$alert('请选择投放时间段','提示');
        return;
      } 
      if(type==='add'){
        createModule({"module":this.module,"contents":this.moduleList}).then(res=>{
          this.$router.push({path:'/app/modulelist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })  
      }else if(type==='edit'){
        editModule({"module":{id:this.moduleId,...this.module},"contents":this.moduleList}).then(res=>{
          this.$router.push({path:'/app/modulelist',query:JSON.parse(this.$route.query.oldQuery)});
          this.reload();
        })
      }
    },   
  },
  created(){
    this.getModuleType();
    if(this.$route.query.isEdit){
      this.isEdit = true;
      this.title = '编辑';
      this.getDetail();
    }else if(this.$route.query.isSee){
      this.isSee = true;
      this.title = '查看';
      this.getDetail();
    }else{
      this.isCreate = true;
      this.title = '创建';
    }
  }
}
</script>

<style scoped>

</style>