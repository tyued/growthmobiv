
import axios from 'axios'

export const setinxx = function({commit},type){            //当前页
    commit("set_inxx",type)
}

export const setPageIndex = function({commit},type){            //当前页
    commit("set_PageIndex",type)
}
export const setIsChoiceImg = function({commit},type){          //弹框弹层--图片点击编辑
    commit("set_IsChoiceImg",type)
}
export const setCurSrc = function({commit},type){
    commit("set_CurSrc",type)
}

// 提示弹层
export const setIsTips = function({commit},type){
    commit("set_IsTips",type)
}
export const setTipsTxt = function({commit},type){
    commit("set_TipsTxt",type)
}

export const setmrimg = function({commit},type){                 //===>>默认图片
    commit("set_mrimg",type)
}
export const setnoneimg = function({commit},type){                 //===>>默认音频图片
    commit("set_noneimg",type)
}

export const seteditSel = function({commit},type){                  //点击编辑信息----橙框
    commit("set_editSel",type)
}
export const settxtInfo = function({commit},type){                  //文字编辑的信息
    commit("set_txtInfo",type)
}
export const setisChange = function({commit},type){                  //是否有编辑
    commit("set_isChange",type)
}

export const setStatus = function({commit},type){                  //是否启动
    commit("set_Status",type)
}

export const seteditAct = function({commit},type){                  //是否启动
    commit("set_editAct",type)
}

export const setchangePgId = function({commit},type){                  //是否启动
    commit("set_changePgId",type)
}



// http://192.168.0.178:8080/index.html

// http://192.168.0.178:8080/index.html?themeStyleId=16d3aacf-0496-11e8-ae58-a4badb17ff39&themeTemplateId=1e60882d-0496-11e8-ae58-a4badb17ff39&userId=2170907160456827&growthType=4&growthId=1e60882e-0496-11e8-ae58-a4badb17ff39#/
// http://192.168.0.3:5581/Growing/GrowthEditorV2/Index?themeStyleId=16d3aacf-0496-11e8-ae58-a4badb17ff39&themeTemplateId=1e60882d-0496-11e8-ae58-a4badb17ff39&userId=2170907160456827&growthType=4&growthId=1e60882e-0496-11e8-ae58-a4badb17ff39
// http://www.91sst.cn/editGrow/index.html?tempId=8115&userId=2160808190233400&type=3&isApp=1#/

// http://192.168.0.3:5581/webapi/api/GrowthEditor/GetPhotoList?loginUserId=2170907155816420&loginAccountType=0&loginFamilyStudentUserId=2170907155816420&pageIndex=1&pageSize=8

// let _url_ = 'http://192.168.0.3:5581';
let _url_ = 'http://www.91sst.cn';


export const getUserGrowthInfo = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetPageList?themeStyleId=1&themeTemplateId=1&growthType=4&userId=2170907160208153
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetPageList";
        var growthId = _getQueryId("growthId")
        if(growthId){
            axios.get(getUrl,{params:paramObj}).then(response => {
                //console.log(response.data)
                //commit("set_OldClassCode",response.data.Value.GrowthInfo.OldClassCode);
                archivesInfo =  response.data.Value;
                resolve(response.data);
            }, response => {
                //console.log(response);
            })
        }
    })  
}

// 保存编辑
export const setSavePage = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/SavePage?loginUserId=1070428102732390&loginAccountType=0&loginFamilyStudentUserId=1070428102732390&themeStyleId=1&themeTemplateId=1&userId=2170907160208153&plateId=&roleType=4&pageId=59368767-00ba-11e8-ae58-a4badb17ff39&growthType=4&growthId=1
        var postUrl = _url_ + "/webapi/api/GrowthEditor/SavePage?loginUserId="+paramObj.loginUserId+
            "&loginAccountType="+paramObj.loginAccountType+
            "&loginFamilyStudentUserId="+paramObj.loginFamilyStudentUserId+
            "&themeStyleId="+paramObj.themeStyleId+
            "&themeTemplateId="+paramObj.themeTemplateId+
            "&userId="+paramObj.userId+
            "&plateId="+paramObj.plateId+
            "&roleType="+paramObj.roleType+
            "&pageId="+paramObj.pageId+
            "&growthType="+paramObj.growthType+
            "&growthId="+paramObj.growthId;
        axios.post(postUrl,paramObj.pageInfo,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response => {
            // console.log(response)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 时光轴
export const getTimeLineList = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetGrowList?userId=2170907160456827&pageIndex=1&pageSize=2&category=-1
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetGrowList";
        // console.log(paramObj);
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 班级相册
export const getAlbumList = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetAlbumList?oldclasscode=2010400101002
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetAlbumList";
        // console.log(paramObj);
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}
// 班级相册---图片列表
export const getPhotoList = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetAlbumnPhotoList?albumnId={albumnId}&pageIndex={pageIndex}&pageSize={pageSize}
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetAlbumnPhotoList";
        axios.get(getUrl,{params:paramObj}).then(response => {
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 班级空间
export const getClassGrowList = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetClassGrowList?loginUserId=2170907155816420&loginAccountType=0&loginFamilyStudentUserId=2170907155816420&oldclasscode=201000110102&bgtime=&edtime=&pageIndex=1&pageSize=2
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetClassGrowList";
        // console.log(paramObj);
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 用户个人信息
export const getUserInfo = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetUserInfo?userId={userId}
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetUserInfo";
        // console.log(paramObj);
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 保存本地上传图片
export const setUploadPhoto = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        //api/GrowthEditor/UploadPhoto?themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}&loginUserId={loginUserId}&loginAccountType={loginAccountType}&loginFamilyStudentUserId={loginFamilyStudentUserId}
        var postUrl = _url_ + "/webapi/api/GrowthEditor/UploadPhoto?themeStyleId="+paramObj.themeStyleId+
                "&themeTemplateId="+paramObj.themeTemplateId+
                "&loginUserId="+ paramObj.loginUserId+
                "&loginAccountType="+paramObj.loginAccountType+
                "&loginFamilyStudentUserId="+paramObj.loginFamilyStudentUserId;
        axios.post(postUrl,paramObj.pageInfo,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response => {
            // console.log(response)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 获取成长档案的模板信息
export const getTemplateInfo = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetTemplateInfo?themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}
        var getUrl = _url_ + "/webapi/api/GrowthEditor/GetTemplateInfo";
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}

// 图片上传到成长档案素材
export const getUploadPhoto4Url = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        // http://192.168.0.3:5581/webapi/api/GrowthEditor/UploadPhoto4Url?loginUserId={loginUserId}&loginAccountType={loginAccountType}&loginFamilyStudentUserId={loginFamilyStudentUserId}&themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}&fileUrl={fileUrl}&width={width}&height={height}
        var getUrl = _url_ + "/webapi/api/GrowthEditor/UploadPhoto4Url";
        axios.get(getUrl,{params:paramObj}).then(response => {
            //console.log(response.data)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}


// 生成截图
export const setBatchPrintImage = function({commit},paramObj){  
    return new Promise((resolve, reject) => {
        var postUrl = _url_ + "/webapi/api/GrowthEditor/BatchPrintImage?loginUserId="+paramObj.loginUserId+
                "&loginAccountType="+paramObj.loginAccountType+
                "&loginFamilyStudentUserId="+paramObj.loginFamilyStudentUserId+
                "&growthId="+paramObj.growthId+
                "&pageIds="+paramObj.pageIds;
        axios.post(postUrl,'',{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response => {
            // console.log(response)
            resolve(response.data);
        }, response => {
            //console.log(response);
        })
    })  
}



