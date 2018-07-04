var archivesInfo = [];
var pageIndex = 0;
var gratio = 420/(document.getElementsByTagName('html')[0].style.fontSize.replace("px","")*7.5);

// console.log(_getQueryId("themeStyleId"))
//themeStyleId=&themeTemplateId=&userId=&growthType=2&growthId=&classcode=2010400104004&oldclasscode=2010400104004&r=0.08714134169534282#/home
// http://192.168.0.178:8081/?themeStyleId=eafb9654-37aa-11e8-b046-a4badb17ff39&themeTemplateId=62b1dd81-3d77-11e8-b046-a4badb17ff39&userId=2160525101813577&loginUserId=2160525101813577&growthType=2&growthId=62b1dd80-3d77-11e8-b046-a4badb17ff39&userAccountType=1&familyStudentUserId=2160525101813577#/
//themeStyleId=&themeTemplateId=&userId=&growthType=2&growthId=&userAccountType=&familyStudentUserId="
var loginAccountType = _getQueryId("userAccountType")
var loginFamilyStudentUserId = _getQueryId("familyStudentUserId")
var loginUserId = (_getQueryId("loginUserId")==undefined||_getQueryId("loginUserId")=='')?_getQueryId("userId"):_getQueryId("loginUserId")

var growthId = _getQueryId("growthId");
if(!growthId){
    $("#app").append('<div class="tipsBox" style=""><div class="hDialog" style=""><div class="tipTxt">正在生成新成长档案...</div></div></div><div class="maskTips" style=""></div>')
}
// http://www.91sst.cn/webapi/api/GrowthEditor/GetLoginUserJson?loginUserId
// var _url_ = 'http://192.168.0.3:5581';
var _url_ = 'http://www.91sst.cn';
$.ajax({
    url: _url_+"/webapi/api/GrowthEditor/GetLoginUserJson?loginUserId="+loginUserId+"&loginAccountType="+loginAccountType+"&loginFamilyStudentUserId="+loginFamilyStudentUserId,
    type: 'get',
    dataType: 'json',
    async:false,
    success: function(res){

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.text = $(res.Value).text();
        
        document.body.appendChild(script);
        if(!growthId){
            $.ajax({
                url:_url_+"/webapi/api/GrowthEditor/SaveGrowth?loginUserId="+SST_Global_Account.LoginUserId+"&loginAccountType="+SST_Global_Account.LoginUserAccountType+"&loginFamilyStudentUserId="+SST_Global_Account.LoginFamilyStudentUserId+"&themeStyleId="+_getQueryId('themeStyleId')+"&themeTemplateId="+_getQueryId('themeTemplateId')+"&userId="+_getQueryId('userId'),
                data:{},
                async:false,
                type:'post',
                dataType: "json",
                beforeSend:function(){
                },
                success:function(data){              
                    if(data.ResultCode==1){       
    
                        window.location.href="http://www.91sst.cn/editGrowV2/index.html?themeStyleId="+_getQueryId("themeStyleId")+"&themeTemplateId="+_getQueryId("themeTemplateId")+"&userId="+_getQueryId("userId")+"&userAccountType="+_getQueryId("userAccountType")+"&familyStudentUserId="+_getQueryId("familyStudentUserId")+"&growthType=1&growthId="+data.Value.GrowthId+"&loginUserId="+_getQueryId("loginUserId")
                        // console.log(window.location)
                        // // window.location.href=""              
                        // // paramObj.growthId=data.Value.GrowthId;
                        // paramObj.growthType=1;
                    }else{
                        // commit("set_IsTips",{"_isShow":false})
                    }
                }
            })
        }
    },
    // error: function(){
        
    // }
})

// var SST_Global_Account={
//     LoginUserId:'1070428102732390',
//     LoginUserType:1,
//     CurClassCode:'2010400101002',
//     CurClassName:'小小班(02)班',
//     CurOldClassCode:'2010400101002',
//     LoginUserSchoolCode:'400',
//     LoginUserSchoolType:'幼',
//     LoginUserDetailType:'1',
//     LoginTrueUserName:'校管理员',
//     LoginUserAccountType:'0',
//     LoginFamilyUserId:'',
//     LoginFamilyStudentUserId:'1070428102732390',
//     RelationSourceUserId:'',
//     RelationSourceFamilyUserId:'',
//     RelationSourceUserAccountType:'-1'
// }

// LoginUserType  1：校管理员   2:老师   3：学生  4：家长  5：亲友账号  
// RoleType       0:所有人都可以用  1：学校管理员能用  2：老师能用  3：学生能用  4：超级管理员
// growthType     1:学校那份成长档案   2：个人成长档案  3：管理员编辑模版   4：超级管理员编辑模版
// Status: 1,启动   其他  不启动

// 非growthType=2
// roleType = 3、2  Status启动  校管理园不能编辑
// 校管理园权限（LoginUserType）： 不启动   校管理园所有的都能编辑（RoleType）       启动后  只能编辑校管理园权限的页面（RoleType=1）
// 老师权限：  RoleType（2、3）
// 4：超级管理员什么权限都没有


// growthType=2的话  所有权限放开

function _getQueryId(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return "";
}

var qxgrowthType = _getQueryId("growthType");                   
var qxLoginUserType = SST_Global_Account.LoginUserType;


// function qxJudge(RoleType,Status){  
//     if(qxgrowthType!=2){
//         if(Status==1){                  //启动
//             if(qxLoginUserType==1){         //校管理园
//                 if(RoleType==1){
//                     return true;
//                 }else{
//                     return false;
//                 }
//             }else if(qxLoginUserType==2){           //老师
//                 if(RoleType==2 || RoleType==3){
//                     return true;
//                 }else{
//                     return false;
//                 }
//             }else if(qxLoginUserType==3 || qxLoginUserType==4 || qxLoginUserType==5){                //学生、家长、亲友
//                 if(RoleType==3){
//                     return true;
//                 }else{
//                     return false;
//                 }
//             }           
//         }else{
//             if(qxgrowthType==3||qxgrowthType==4){
//                 return true
//             }
//             if(qxLoginUserType==1){
//                 return true;
//             }else if(qxLoginUserType==2){
//                 if(RoleType==3 || RoleType==2){
//                     return true
//                 }else{
//                     return false;
//                 }
//             }else if(qxLoginUserType==3||qxLoginUserType==4||qxLoginUserType==5){
//                 if(RoleType==3){
//                     return true;
//                 }else{
//                     return false;
//                 }
//             }
//         }
//     }else{
//         return true;
//     }
// }
function qxJudge(roleType,growthStatus){  
    var growthType = this._getQueryId("growthType");
    var loginUserType=SST_Global_Account.LoginUserType;
    if(growthType==2){
        return true
    }
    if(growthStatus==1){
        if(growthType==4){
            return true
        }
        if(roleType==3){
            if(loginUserType==2||loginUserType==3||loginUserType==4){
            
                return true
            }else{
            
                return false
            }
        }else if(roleType==2){
            if(loginUserType==2){
            
                return true
            }else{
            
                return false
            }
        }else if(roleType==1){
            if(loginUserType==1){
                
                return true
            }else{
                
                return false
            }
        }else if(roleType==4){
            return true 
        }
    }else{
        if(growthType==3||growthType==4){
            return true
        }
        if(roleType==3){
            if(loginUserType==1||loginUserType==2||loginUserType==3||loginUserType==4){
                
                return true
            }else{
                
                return false
            }
        }else if(roleType==2){
            if(loginUserType==1||loginUserType==2){
            
                return true
            }else{
            
                return false
            }
        }else if(roleType==1){
            if(loginUserType==1){
                
                return true
            }else{
                
                return false
            }
        }else if(roleType==4){
            return true 
        }
    }
    // return true
}


function backAppendStr(pageNo){ 
        if(pageNo==-1){
            return
        }
        var appendstr = "";
        var elJson = archivesInfo[pageNo].JsonPage
        try{
            for(var j=0;j<elJson.el_type.length;j++){
                var elSty =  _css2obj(elJson.el_style[j]).style;            
                var elimg = elJson.el_img[j];  
                var elimgSty = _css2obj(elJson.el_img_style[j]).style;
                var eltextSty = _css2obj(elJson.el_text_style[j]).style;                
                var eltext = elJson.el_text[j];
                var elimgmask = elJson.el_mask_img[j];
                var elimgmaskSty = elJson.el_mask_style[j];
                var elactStyle =  _css2obj(elJson.el_style[j]).actstyle;   
                if(elJson.el_type[j]==0){
                    appendstr = appendstr + "<div data-id='" + j + "' class='editel el_img' style='"+ elSty +"'><div class='transf' style='"+elactStyle+"'><div class='editborder'><img src='"+ elimg +"' style='"+ elimgSty +"'></div></div></div>"
                }else if(elJson.el_type[j]==1){
                    appendstr = appendstr + "<div data-id='" + j + "' class='editel el_text' style='"+ elSty +"'><div class='transf' style='"+elactStyle+"'><div style='"+ eltextSty +"' class='editText' spellcheck='false' contenteditable='false'>"+ eltext +"</div></div></div>"
                }else if(elJson.el_type[j]==2){
                    appendstr = appendstr + "<div data-id='" + j + "' class='editel el_photo' style='"+ elSty +"'><div class='transf' style='"+elactStyle+"'><div class='editborder'><img src='"+ elimgmask +"'/><div class='shapeimg' style='"+elimgmaskSty+"'><img src='"+elimg+"' style='"+elimgSty+"'></div></div></div></div>"
                }                               
            }
        }catch(e){ 
            return ""
        }
        return appendstr
}


function _css2obj(cssstr){
    if(!cssstr||cssstr=="null"||cssstr=="undefined"){
        return ""
    }
    var cssobj = {};
    var cssobj_act = {};
    var temp;
    var spec_cssarr = cssstr.split("||");
    var cssarr = spec_cssarr[0].split(";")

    for(var i in cssarr){
        if(cssarr[i]!=""&&cssarr[i]!="undefined"&&cssarr[i]!="null"){

            temp = cssarr[i].split(":");
            var cssN = myStr(temp[0]).myTrim
            cssobj[myStr(cssN).myCssn] = myStr(temp[1]).myTrim;
        }
    }

    if(spec_cssarr[1]!="undefined"&&spec_cssarr[1]){
        var cssarr_act = spec_cssarr[1].split(";")
        for(var i in cssarr_act){
            if(cssarr_act[i]!=""&&cssarr_act[i]!="undefined"&&cssarr_act[i]!="null"){
                temp = cssarr_act[i].split(":");              
                var cssN = myStr(temp[0]).myTrim
                cssobj_act[myStr(cssN).myCssn] = myStr(temp[1]).myTrim;
            }
        }
    }   
    return _obj2css(cssobj,cssobj_act,gratio)
}
function _obj2css(cssobj,cssobj_act,gratio){
    var width = cssobj.width ? ("width:" + ((cssobj.width.indexOf("px")>-1) ? (parseInt(cssobj.width)/gratio).toFixed(2) +"px;":"auto;")) : "";



    var height = cssobj.height ? ("height:" + ((cssobj.height.indexOf("px")>-1) ? (parseInt(cssobj.height)/gratio).toFixed(2) +"px;":"auto;")) : "";
    var top = cssobj.top ? ("top:" + ((cssobj.top.indexOf("px")>-1) ? (parseInt(cssobj.top)/gratio).toFixed(2) +"px;" : "auto;")) : "";
    var left = cssobj.left ? ("left:" + ((cssobj.left.indexOf("px")>-1) ? (parseInt(cssobj.left)/gratio).toFixed(2) +"px;" : "auto;")) : "";
    
    var opacity = cssobj.opacity ? ("opacity:" + cssobj.opacity+";") :"";
    var radius = cssobj.borderradius ? ("border-radius:" + cssobj.borderradius + ";") : "";
    var transform = cssobj.transform ? ("transform:" +cssobj.transform + ";") : "";
    var webkittransform = transform ? ("-webkit-transform:" +cssobj.transform + ";") : "";
    var zindex = cssobj.zindex ? ("z-index:" + cssobj.zindex + ";") : "";
    var borderwidth = cssobj.borderwidth ? ("border-width:" + cssobj.borderwidth + ";") : "";
    var borderstyle = cssobj.borderstyle ? ("border-style:" + cssobj.borderstyle + ";") : "";
    var bordercolor = cssobj.bordercolor ? ("border-color:" + cssobj.bordercolor + ";") : "";
    var backgroundcolor = cssobj.backgroundcolor ? ("background-color:" + cssobj.backgroundcolor + ";") : ""; 
    var fontsize = cssobj.fontsize ? ("font-size:" + (parseInt(cssobj.fontsize)/gratio).toFixed(2) + "px;") : ""; 
    var color = cssobj.color ? ("color:" + cssobj.color + ";") : ""; 
    var textalign = cssobj.textalign ? ("text-align:" + cssobj.textalign + ";") : ""; 
    var visibility = cssobj.visibility ? ("visibility:" + cssobj.visibility + ";") : ""; 
    var fontweight = cssobj.fontweight ? ("font-weight:" + cssobj.fontweight + ";") : ""; 
    var animation = cssobj.animation ? ("animation:" + cssobj.animation + ";") : ""; 
    var webkitanimation = animation ? ("-webkit-animation:" + cssobj.animation + ";") : ""; 
    var lineheight = cssobj.lineheight ? ("line-height:" + ((cssobj.lineheight.indexOf("px")>-1) ? (parseInt(cssobj.lineheight)/gratio).toFixed(2) +"px;":"auto;")) : ""; 
    
    var acttransform = cssobj_act.transform ? ("transform:" + cssobj_act.transform + ";") : "";
    var webkitacttransform = acttransform ? ("-webkit-transform:" + cssobj_act.transform + ";") : "";

    if(!cssobj){
        return "";
    }
    var _obj2cssStr = {
        style: width + height + top + left + opacity + transform + webkittransform + radius + zindex + borderwidth + borderstyle + bordercolor + backgroundcolor + fontsize + color + textalign + visibility + fontweight + animation + webkitanimation + lineheight,
        str:cssobj,
        actstyle:  acttransform + webkitacttransform
    };
    return _obj2cssStr
}


// 使用正则
function myStr(x) {
    var str={
        myTrim : x.replace(/^\s+|\s+$/gm,''),                             //去掉字符串两边多余的空格========>" ddd dd d "--------"ddd dd d"
        myCssn : x.replace(/\-/gm,''),                                    //去掉字符串中的“-”
    };
    return str;
}

// 图片居中显示
function _resizeImg(obj){
    var m_W = window.getComputedStyle(obj.parentNode,null).getPropertyValue("width").replace("px","");
		var m_H = window.getComputedStyle(obj.parentNode,null).getPropertyValue("height").replace("px","");
		var ratio = m_W/m_H;
		var i_W = obj.width;
        var i_H = obj.height;
        var i_ratio = i_W/i_H

		if(i_W>i_H*ratio){ 
			minSize = m_W;
			standSize = m_H;
			pos_W=((standSize/i_H)*i_W-minSize)/2
			obj.style.height = standSize + "px";
            obj.style.width = "auto";
			obj.style.left = -pos_W + "px";	
			obj.style.top = "0px";
		}else{        
			minSize = m_H;
			standSize = m_W;
			pos_W=((standSize/i_W)*i_H-minSize)/2
			obj.style.width = standSize + "px";
            obj.style.height = "auto";
			obj.style.top = -pos_W + "px";
			obj.style.left = "0px";
		}
		$(obj).css({"opacity":1,"transform":"scale(1)"});
		$(obj).attr("data-width",$(obj).width());
        $(obj).attr("data-height",$(obj).height());
        obj.style.width = $(obj).width() + "px";
        obj.style.height = $(obj).height() + "px";
		
}

// 编辑过的话返回 1
var isEdit = "0";
function saveState(){
    return isEdit
}

