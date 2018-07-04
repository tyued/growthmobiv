<template> 
    <div class="editpg" @touchend="touchcloseEdit" v-show="editSel.editSelShow">  
        <div class="editpgBox">    
            <div ref="editSize" class="edSize_main" v-show="editSel.editSelShow" :style="editSel.editSelSty+editSel.transfcss" @touchstart="touchstartEdit" @touchmove="touchmoveEdit" @touchend="touchendEdit">
                <div class="edSize_text proxy-text" v-html="editSel.editSelHtml"></div>
                <div ref="editresize" class="editresize" style="" @touchstart="touchstartEditResize"><span></span></div>
            </div>
        </div> 
    </div> 
</template>

<script>
import {mapGetters} from 'vuex';

export default {  
    name: 'edittxt',
    data () {
        return {
            editSel:[],          //点击编辑信息
            edit_isScale:false,     //是否缩放
            start:{                         //移动
                pageX: 0,
                pageY: 0
            },
            editpgH:'',
            editpgW:'',
            editBoxTop:'',
            editBoxLeft:'',
            editBoxWidth:'',
            editBoxHeight:'',

            clickch:false,          //是否点击第二次
            clickedit: true,
            editSelHtml:'',         //内容

            isTxtedit:false,        //是否在编辑文字

            isChange:false,
            
            themeStyleId:"",
            themeTemplateId:"",
            growthType:"",
            growthId:'',
            userId:"",
        }   
    },
    mounted:function(){
        this.editSel = this.$store.getters.getEditSel; 
        var that = this
        $(document).on('focusout', function () {
            that.clickedit = true

        });
        
    },
    computed:mapGetters(['getEditSel']),
    watch:{
        getEditSel() {
            this.editSel = this.$store.getters.getEditSel;
        },
    },
    methods:{
        touchstartEdit(e){
            e.stopPropagation();
            this.start.pageX = e.changedTouches[0].pageX;
            this.start.pageY = e.changedTouches[0].pageY;
            this.editBoxTop = parseInt(this.$refs.editSize.style.top);
            this.editBoxLeft = parseInt(this.$refs.editSize.style.left);
            this.editBoxWidth = parseInt(this.$refs.editSize.style.width); 
            this.editBoxHeight = parseInt(this.$refs.editSize.style.height); 
            this.editpgH = document.getElementsByClassName("editpgBox")[0].offsetHeight-5;   
            this.editpgW = document.getElementsByClassName("editpgBox")[0].offsetWidth-5;  
            this.clickch = false;           //可以开始输入
        },
        touchmoveEdit(e){
            e.preventDefault(); 
            var pageX = e.changedTouches[0].pageX - this.start.pageX;
            var pageY = e.changedTouches[0].pageY - this.start.pageY;
            if(this.clickedit){
                if(this.edit_isScale){                  //是否在缩放
                    var targetWidth = this.editBoxWidth + pageX;
                    var targetHeight = this.editBoxHeight + pageY;
                    if(Math.abs(pageX)>4){                                      //绝对值>4 (初始4个像素以内不予反应)   targetWidth>100 && targetHeight>20                       
                        this.isChange = true
                        this.clickch = true;
                        if(targetWidth + this.editBoxLeft > this.editpgW && targetHeight + this.editBoxTop<this.editpgH){
                            targetWidth = this.editpgW - this.editBoxLeft;
                        }else if(targetHeight + this.editBoxTop > this.editpgH && targetWidth + this.editBoxLeft < this.editpgW){
                            targetHeight = this.editpgH - this.editBoxTop;
                        }else if(targetWidth + this.editBoxLeft > this.editpgW && targetHeight + this.editBoxTop > this.editpgH) {
                            targetWidth = this.editpgW - this.editBoxLeft;
                            targetHeight = this.editpgH - this.editBoxTop;
                        }else if(targetWidth<100 && targetHeight>20){
                            targetWidth = 100;
                        }else if(targetHeight<20 && targetWidth>100){
                            targetHeight = 20;
                        }else if(targetWidth<100 && targetHeight<20){
                            targetHeight = 20;
                            targetWidth = 100;
                        }
                        this.$refs.editSize.style.width =  (targetWidth-1) + "px";
                        this.$refs.editSize.style.height = (targetHeight-1) + "px";
                    }
                }else{           
                    var targetTop = this.editBoxTop + pageY;
                    var targetLeft = this.editBoxLeft + pageX;
                    if(Math.abs(pageX)>4 || Math.abs(pageY)>4){                     //绝对值>4 (初始4个像素以内不予反应)                         
                        this.isChange = true
                        this.clickch = true;
                        //边缘判断
                        if(targetTop<=1){
                            this.$refs.editSize.style.top = '1px';
                            targetTop=1;
                        }else if((targetTop + this.editBoxHeight + 1)>=this.editpgH){       
                            this.$refs.editSize.style.top = this.editpgH - this.editBoxHeight - 1 + 'px';
                            targetTop = this.editpgH - this.editBoxHeight- 1;
                        }else{
                            this.$refs.editSize.style.top = targetTop + 1 + 'px';    
                        }
                        if(targetLeft<=1){
                            this.$refs.editSize.style.left = '1px';
                            targetTop=1;
                        }else if((targetLeft + this.editBoxWidth +1)>=this.editpgW){        // + this.cut_canH >= this.$refs.canvas.height
                            this.$refs.editSize.style.left = this.editpgW - this.editBoxWidth - 1 + 'px';
                            targetLeft = this.editpgW - this.editBoxWidth - 1;
                        }else{
                            this.$refs.editSize.style.left = targetLeft + 1 + 'px';    
                        }
                    }
                    
                    
                }
                var obj = document.getElementsByClassName("editel");
                for(var i=0;i<obj.length;i++){
                    if(obj[i].getAttribute('data-id')==this.editSel.editSelID){
                        obj[i].style.cssText = this.$refs.editSize.style.cssText;
                        obj[i].style.visibility = "hidden";
                    }
                }  
                
            }   
            
        },
        touchendEdit(e){
            e.stopPropagation();
            if(this.edit_isScale){
                this.edit_isScale = false;
            }

            var obj = document.getElementsByClassName("editel");
            var objcur;
            for(var i=0;i<obj.length;i++){
                if(obj[i].getAttribute('data-id')==this.editSel.editSelID){
                    objcur = obj[i];
                }
            }  

            var edSty = this.$refs.editSize.style.cssText.replace(/\s/ig,'').split(";");
            var transfSty = this.editSel.transfcss.replace(/\s/ig,'').split(";")
            edSty.forEach(function(item,index){
                transfSty.forEach(function(sty,ind){
                    if(item==sty){
                        edSty.splice(index,1);
                    }
                })
            })
            
            var edSelSty = edSty.join(";")

    
            objcur.style.cssText = edSelSty;
            objcur.style.visibility = "hidden";
            if(!this.clickch){
                this.clickedit = false;
                this.clickch = true;
                this.isChange = true
                this.editSel.editSelHtml = this.editSel.editSelHtml.replace(/false/g,"true") 
                document.getElementsByClassName("edSize_text")[0].children[0].focus();
                this.isTxtedit = true;            
            } 
            // this.$store.dispatch("setisChange",this.isChange);

        },
        touchstartEditResize(e){
            if(this.clickedit){
                this.edit_isScale = true;                                        //是否缩放
                this.clickch = true;
                this.start.pageX = e.changedTouches[0].pageX;
                this.start.pageY = e.changedTouches[0].pageY;
                this.editBoxWidth = parseInt(this.$refs.editSize.style.width);
                this.editBoxHeight = parseInt(this.$refs.editSize.style.height);
            }
        },
        touchcloseEdit(e){
            var obj = document.getElementsByClassName("editel");
            var objcur;
            for(var i=0;i<obj.length;i++){
                if(obj[i].getAttribute('data-id')==this.editSel.editSelID){
                    objcur = obj[i];
                }
            }

            if(this.editSel.editSelShow){
                this.clickch = false;
                this.clickedit = true;
                
                this.editSel.editSelShow = false;

                            
                objcur.style.visibility = "visible";
                objcur.children[0].innerHTML = document.getElementsByClassName("edSize_text")[0].innerHTML;
                
                if(this.editSel.editSelHtml!=document.getElementsByClassName("edSize_text")[0].innerHTML || this.isChange){
                    this.templateSave()
                }
                objcur.children[0].innerHTML=document.getElementsByClassName("edSize_text")[0].innerHTML=document.getElementsByClassName("edSize_text")[0].innerHTML.replace(/true/g,"false")

                
                this.$store.dispatch("seteditAct",false)
                this.$store.dispatch("seteditSel",{"editSelShow":false,"editSelSty":'',"editSelHtml":'',"pageIndex":"",'transfcss':''});
                // console.log(this.editSel.editSelSty)
                this.$store.dispatch("settxtInfo",{"cssStyle":this.editSel.editSelSty,"text":objcur.children[0].innerHTML});
            }            

        },     
        _getQueryId(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },
        templateSave(){                                                 //模板保存              当前保存的只有文字编辑          
            this.$store.dispatch("setisChange",this.isChange);




            this.themeStyleId = this._getQueryId("themeStyleId");
            this.themeTemplateId = this._getQueryId("themeTemplateId");
            this.growthType = this._getQueryId("growthType");
            this.growthId = this._getQueryId("growthId");
            this.userId = this._getQueryId("userId");
            var el_JsonPg = archivesInfo[this.editSel.pageIndex].JsonPage;          //取得当前页的数据
        //所在页面里元素的类型     0：图片   1：文字    2：带相框 
            var el_type = el_JsonPg.el_type;
        // 编辑后传给数据库的信息
            var obj_div = document.getElementsByClassName("editel");
            var obj_divtransf = document.getElementsByClassName("transf");
            var objcur;

            for(var i=0;i<obj_div.length;i++){
                if(obj_divtransf[i].children[0].className == "editText"){
    
                    el_JsonPg.el_text[i] = obj_divtransf[i].children[0].innerHTML;
                    var objcss = obj_div[i].style;
                    var objcss_transf = obj_divtransf[i].style;
                    
                    el_JsonPg.el_style[i] = "width:"+(parseInt(objcss.width)*gratio).toFixed(2)+"px;"+"height:"+(parseInt(objcss.height)*gratio).toFixed(2)+"px;"
                                +"top:"+(parseInt(objcss.top)*gratio).toFixed(2)+"px;"+"left:"+(parseInt(objcss.left)*gratio).toFixed(2)+"px;"
                                +"opacity:"+objcss.opacity +";" + "border-radius:"+objcss.borderRadius +";" +"transform:"+objcss.transform +";" + "animation:"+objcss.animation +";"
                                +"||"+"transform:"+ objcss_transf.transform +";";
                }
            }

        // 拼接post正确传参
            var ElementListArr = [];
            var elobj = {};         

            
        // 判断页面是否被编辑过           减少通过上传保存数据步骤   优化请求  
            if(this.isChange){
                for(var i=0;i<el_type.length;i++){
                    if(el_type[i]==0){                  //图片
                        elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                    {"Element":el_JsonPg.el_img_original[i],"Thumbnail":el_JsonPg.el_img[i],"Style":el_JsonPg.el_img_style[i],"Level3Element":null}
                                }; 
                    }else if(el_type[i]==1){
                        elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                    {"Element":el_JsonPg.el_text[i],"Style":el_JsonPg.el_text_style[i],"Level3Element":null}
                                }; 
                    }
                    else if(el_type[i]==2){
                        elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                    {"Element":el_JsonPg.el_img_original[i],"Thumbnail":el_JsonPg.el_img[i],"Style":el_JsonPg.el_img_style[i],"Level3Element":
                                        {"Element":el_JsonPg.el_mask_img_original[i],"Element2":el_JsonPg.el_mask_source_original[i],"Thumbnail":el_JsonPg.el_mask_img[i],"Thumbnail2":el_JsonPg.el_mask_source[i],"Style":el_JsonPg.el_mask_style[i]}
                                        
                                    }
                                };
                    }
                    ElementListArr.push(elobj)
                }
                var dataParamet = {"Style":el_JsonPg.page_style,"Level1ElementList":ElementListArr}

                var that = this;
                // 保存（上传）编辑         pageId---->对应archivesInfo[this.pageIndex]里的值
                // http://192.168.0.3:5581/webapi/api/GrowthEditor/SavePage?loginUserId=1070428102732390&loginAccountType=0&loginFamilyStudentUserId=1070428102732390&themeStyleId=1&themeTemplateId=1&userId=2170907160208153&plateId=&roleType=4&pageId=59368767-00ba-11e8-ae58-a4badb17ff39&growthType=4&growthId=1
                // this.$store.dispatch("setSavePage",{
                //     "loginUserId":SST_Global_Account.LoginUserId,
                //     "loginAccountType":SST_Global_Account.LoginUserAccountType,
                //     "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,
                //     "themeStyleId":this.themeStyleId,"themeTemplateId":this.themeTemplateId,
                //     "userId":this.userId,"growthId":this.growthId,
                //     "plateId":'',"roleType":"4",
                //     "growthType":this.growthType,
                //     "pageId":archivesInfo[this.editSel.pageIndex].Id,
                //     "pageInfo":"="+(encodeURIComponent(JSON.stringify(dataParamet)))
                // }).then(response => {
                //     if(response.ResultCode!=1){
                //         console.log("数据加载失败.请重试.")
                //     }else{         
                //         that.isChange = false;       
                //         isEdit = "0";
                //     }
                // })
            }
        },
    }
}
</script>

<style>
.Ed_Page{
    width:6.3rem; 
    height:8.91rem; 
    position: relative;  
    background: #F00;/* left:50%; transform: translateX(-50%);*/ 
    transform:scale(1.1904); 
    -webkit-transform:scale(1.1904); 
    -webkit-transform-origin:0 0; 
    float: left;
}
.mbbg{
    height:100%;
    width:100%;
}
.flodU-enter-active{
    animation-name:fadeInUp;
    animation-duration:1s;
}
.flodU-leave-active{
    animation-name:fadeOutUp;
    animation-duration:1s;
}
.flodD-enter-active{
    animation-name:fadeInDown;
    animation-duration:1s;
}
.flodD-leave-active{
    animation-name:fadeOutDown;
    animation-duration:1s;
}
.flodFade-enter-active{
    animation-name:fadeIn;
    animation-duration:1s;
}
.ciU-enter-active{
    animation-name:fadeInUp;animation-duration:.5s;
}
.ciU-leave-active{
    animation-name:fadeOutDown;animation-duration:.5s;
}
.flodD-enter-active{
    animation-name:fadeInDown;animation-duration:.5s;
}

</style>
