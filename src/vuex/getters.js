export function getinxx(state){                                        //当前页
    
    return state.inxx
}




export function getPageIndex(state){                                        //当前页
    return state.pageIndex
}
export function getIsChoiceImg(state){
    return state.choiceimg.isChoiceImg
}
export function getChoiceImg(state){
    return state.choiceimg
}
export function getCurSrc(state){
    return state.curSrc
}

// 提示弹层
export function getIsTips(state){
    return state.isTips
}
export function getTipsTxt(state){
    return state.tipsTxt
}

export function getmrimg(state){                        //===>>默认图片
    return state.mrimg
}
export function getnoneimg(state){                        //===>>默认图片
    return state.noneimg
}

export function getEditSel(state){                      //点击编辑信息----橙框
    return state.editSel
}
export function gettxtInfo(state){                      //文字编辑的信息
    return state.txtInfo
}
export function getisChange(state){                      //是否有编辑
    return state.isChange
}

export function getStatus(state){                      //是否启动
    return state.Status
}

export function getEditAct(state){                      //是否启动
    return state.editAct
}

export function getChangePgId(state){                      //是否启动
    return state.changePgId
}

