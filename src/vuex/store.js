import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
  inxx:"",

  pageIndex: 0,                     //当前页

  //提示弹层  
  isTips:false,          
  tipsTxt:"",

  // 点击图片编辑
  choiceimg:{
    src:'',
    isChoiceImg:false,
    curBoxHeight:0,
    curBoxWidth:0
  },
  curSrc:{                      //选中图片的信息     
    Src:"",
    rImgWidth:0,
    rImgHeight:0,
    rImgTop:0,
    rImgLeft:0,
  },
  
  editSel:{                 //点击编辑信息----橙框
    editSelShow:false,
    editSelSty:'',
    editSelHtml:'',
    editSelID:'',
    pageIndex:'',
    transfcss:'',
  },   
  // editAct:{editSelShow:false},
  
  editAct:false,


  txtInfo:{                   //文字编辑的信息
      cssStyle:'',
      text:'',
  },
  isChange: false,        //是否被编辑

  Status:'',              //是否启动

  mrimg:'this.src="' + require('../assets/defaultclassyouer.png') + '"',  //默认图片
  noneimg:'../assets/mrimg.png',

  changePgId:[],          //修改过的页面的id
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})




