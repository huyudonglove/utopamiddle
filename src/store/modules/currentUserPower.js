import {currentUserPower} from '../../http/request'

const state={
  appPower:[],
  positionPower:[],
  userPower:[],
  rolePower:[],
  putInPower:[],
  arAppPower:[],
  mapListPower:[],
  pageSettingPower:[],
};
const mutations={

};
const actions={
  getUserPower({commit}){
    currentUserPower().then(res=>{
      state.appPower = res.data.filter(v=>v.code=='utopa:app')[0].permissionList;//应用管理
      state.positionPower = res.data.filter(v=>v.code=='utopa:asset:position')[0].permissionList;//位置管理
      state.userPower = res.data.filter(v=>v.code=='utopa:sys:user')[0].permissionList;//用户管理
      state.rolePower = res.data.filter(v=>v.code=='utopa:sys:permission')[0].permissionList;//权限管理
      state.putInPower = res.data.filter(v=>v.code=='utopa:putin:list')[0].permissionList;//投放列表
      state.arAppPower = res.data.filter(v=>v.code=='utopa:ar:app:manage')[0].permissionList;//app应用管理
      state.mapListPower = res.data.filter(v=>v.code=='utopa:putin:map')[0].permissionList;//空间识别图
      state.pageSettingPower = res.data.filter(v=>v.code=='utopa:ar:app:page')[0].permissionList;//页面配置
    })
  }
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
