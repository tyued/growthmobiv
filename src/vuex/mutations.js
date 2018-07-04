export default {
    set_inxx(state,type){                                      //当前页
        state.inxx = type;
    },

    
    set_PageIndex(state,type){                                      //当前页
        state.pageIndex = type;
    },
    set_IsChoiceImg(state,type){                                    //弹框弹层--图片点击编辑
        if(!(typeof(type.isChoice)=='undefined')){
            state.choiceimg.isChoiceImg = type.isChoice;
        }
        if(!(typeof(type.boxHeight)=='undefined')){
            state.choiceimg.curBoxHeight = type.boxHeight;
        }
        if(!(typeof(type.boxWidth)=='undefined')){
            state.choiceimg.curBoxWidth = type.boxWidth;  
        }
        if(!(typeof(type.index)=='undefined')){
            state.choiceimg.index = type.index;  
        }     
        if(!(typeof(type.src)=='undefined')){
            state.choiceimg.src = type.src;              
        }
    },
    set_CurSrc(state,type){
        if(!(typeof(type.Src)=='undefined')){
            state.curSrc.Src = type.Src;
        }
        if(!(typeof(type.rImgWidth)=='undefined')){
            state.curSrc.rImgWidth = type.rImgWidth;
        }
        if(!(typeof(type.rImgHeight)=='undefined')){
            state.curSrc.rImgHeight = type.rImgHeight;
        }
        if(!(typeof(type.rImgLeft)=='undefined')){
            state.curSrc.rImgLeft = type.rImgLeft;
        }
        if(!(typeof(type.rImgTop)=='undefined')){
            state.curSrc.rImgTop = type.rImgTop;
        }     
    },
    set_IsTips(state,type){                 //提示弹层
        state.isTips = type._isShow;
        state.tipsTxt = type._value;
    },

    set_mrimg(state,type){
        state.mrimg = type;            //===>>默认图片
    },
    set_noneimg(state,type){
        state.noneimg = type;            //===>>默认图片
    },
    
    set_editSel(state,type){                         //点击编辑信息----橙框
        if(!(typeof(type.editSelSty)=='undefined')){
            state.editSel.editSelSty = type.editSelSty;
        }
        if(!(typeof(type.editSelShow)=='undefined')){
            state.editSel.editSelShow = type.editSelShow;
        }if(!(typeof(type.editSelHtml)=='undefined')){
            state.editSel.editSelHtml = type.editSelHtml;
        }if(!(typeof(type.editSelID)=='undefined')){
            state.editSel.editSelID = type.editSelID;
        }if(!(typeof(type.pageIndex)=='undefined')){
            state.editSel.pageIndex = type.pageIndex;
        }
        if(!(typeof(type.transfcss)=='undefined')){
            state.editSel.transfcss = type.transfcss;
        }
    },
    set_txtInfo(state,type){                         //文字编辑的信息
        if(!(typeof(type.cssStyle)=='undefined')){
            state.txtInfo.cssStyle = type.cssStyle;
        }
        if(!(typeof(type.text)=='undefined')){
            state.txtInfo.text = type.text;
        }
    },
    set_isChange(state,type){                                      //是否有编辑
        state.isChange = type;
    },

    set_Status(state,type){                                      //是否启动
        state.Status = type;
    },
    

    set_editAct(state,type){                                      //是否启动
        state.editAct = type
    },
    
    set_changePgId(state,type){                                  
        state.changePgId = type
    },
    
}