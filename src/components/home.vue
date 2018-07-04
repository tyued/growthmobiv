<template>
    <div id="mbbg" class="mbbg" @touchstart="touchStart" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <div class="header" @click="templateSave_Cut">
            <span class="h-templateSave">模版保存</span>
        </div>
        <transition :name="flodName">
            <component :is="playMB1" ></component>
        </transition>
        <div v-show="isChoiceImg" class="mask" v-on:click="_closeChoiceImg()"></div>
        <transition name='ciU'>
            <form action="" id="form">
            <div v-show="isChoiceImg" class="ChoiceImgBox">
                <div class="ciBtn isEditImg" @click="$router.push({path:'/editimg'})">调整图片</div> 
                <div class="ciBtn" @click="$router.push({path:'/timeLine'})">时光轴</div>
                <div class="ciBtn" @click="$router.push({path:'/albumList'})">班级相册</div>
                <div class="ciBtn" @click="$router.push({path:'/classGrowList'})">班级空间</div>
                <div class="ciBtn" @click="uploadimg_app">本地上传</div>
                <!-- <div class="ciBtn">本地上传<input class="ciInput_file" type="file" @change="uploadimg($event)" /></div> -->
            </div>
            </form>
        </transition>

        <edit-txt></edit-txt>
       <!-- <audio :src="musicSrc" autoplay loop></audio> -->

    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import mb1 from '../components/mb1.vue'
import mb2 from '../components/mb2.vue'
import edittxt from '../components/edittxt.vue'

export default {
    name: 'home',
    data () {
        return {
            themeStyleId:"",
            themeTemplateId:"",
            growthType:"",
            growthId:'',
            userId:"",

            flodName:"flodFade",
            
            playMB1:"",
            pgNum:"",               //总页码
            pageIndex:'',           //当前页

            startY: 0,              //滑动开始的Y坐标

            isChoiceImg: false,     //弹框弹层    

            isChange:false,         //判断是否进行编辑
            musicSrc:'',            //背景音乐
            GrowthType:'',          
            Status:'',

            editSel:[],
            editAct:false,
            changePgId:[],
        }
    },
    components:{
        mb1,mb2,"edit-txt" : edittxt
    },
    mounted:function(){
        this.$store.dispatch("setIsChoiceImg",{"src":'',"isChoice":false,"boxHeight":0,"boxWidth":0});
        
        this.themeStyleId = this._getQueryId("themeStyleId");
        this.themeTemplateId = this._getQueryId("themeTemplateId");
        this.growthType = this._getQueryId("growthType");
        this.growthId = this._getQueryId("growthId");
        this.userId = this._getQueryId("userId");
        this.pageIndex = this.$store.getters.getPageIndex;                      //当前页

        if(archivesInfo.length==0){
            this.$store.dispatch("getUserGrowthInfo",{"themeStyleId":this.themeStyleId,"themeTemplateId":this.themeTemplateId,"growthType":this.growthType,"userId":this.userId}).then(response => {
                this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"网络信号不稳定，请尝试切换网络后重试。"});
                if(response.ResultCode!=1){                                
                    console.log("数据加载失败.请重试.")
                }else{
                    this.$store.dispatch("setIsTips",{"_isShow":false});
                    console.log("数据加载成功.")
                    this.pgNum = archivesInfo.length;
                    this.playMB1="mb1";
                }
            })
        }else if(archivesInfo.length>0){
            this.pgNum = archivesInfo.length;
            this.playMB1="mb1";
        }       
    
    
        this.isChange = this.$store.getters.getisChange;
        this.editSel = this.$store.getters.getEditSel; 
        this.editAct = this.$store.getters.getEditAct;

        this.changePgId = this.$store.getters.getChangePgId

        this.init();
    },
    computed:mapGetters(['getIsChoiceImg','getisChange','getEditAct']),
    watch:{
        getIsChoiceImg() {
            if(this.$store.getters.getIsChoiceImg){
                this.isChoiceImg = true;
            }else{
                this.isChoiceImg = false;
            }
        },
        getisChange(){
            this.isChange = this.$store.getters.getisChange;
            // console.log(this.isChange)
        },
        getEditAct(){
            this.editAct = this.$store.getters.getEditAct 
        },
    },
    methods:{
        _getQueryId(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },
        init(){
            var that = this;
            // 获取背景音乐
            // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetTemplateInfo?themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}
            this.$store.dispatch("getTemplateInfo",{"themeStyleId":this.themeStyleId,"themeTemplateId":this.themeTemplateId,}).then(response => {
                that.musicSrc = response.Value.BgMusicPath;
                that.Status = response.Value.Status;
                that.$store.dispatch("setStatus",that.Status);

            }).catch(function(r){
                console.log(r)
            })
            
        },
        touchStart(e) {
            this.startY = e.changedTouches[0].clientY;
        },
        touchMove(e) {           
            e.preventDefault(); 
        },
        touchEnd(e){            
            // if(!this.editSel.editSelShow){
            if(!this.editAct){
                var iseditChange= false;
                var actY = e.changedTouches[0].clientY;	
                var HtmlFont = document.getElementsByTagName('html')[0].style.fontSize.replace("px","");          
                if((actY-this.startY)<-HtmlFont*2){                         //向上滑加载下一页
                    if(this.isChange){
                        this.templateSave();
                    }
                    if(this.pageIndex<this.pgNum-1){                             //如果当前页小于总页数-1
                        this.flodName = "flodU";
                        this.pageIndex++;
                        // iseditChange = true;      
                        this.playMB1= (this.playMB1=="mb1") ? "mb2" : "mb1";             
                    }
                }
                if((actY-this.startY)>HtmlFont*2){                          //向下滑返回上一页
                    if(this.isChange){
                        this.templateSave();
                    }
                    if(this.pageIndex>0){
                        this.flodName = "flodD";
                        this.pageIndex--;
                        // iseditChange = true;         
                        this.playMB1= (this.playMB1=="mb1") ? "mb2" : "mb1";        
                    }
                }
                this.$store.dispatch("setPageIndex",this.pageIndex);
            }
        },
        _closeChoiceImg(){
            this.$store.dispatch("setIsChoiceImg",{"isChoice":false});
        },
        templateSave(){                                                 //模板保存              当前保存的只有文字编辑
            var el_JsonPg = archivesInfo[this.pageIndex].JsonPage;          //取得当前页的数据
            
        //所在页面里元素的类型     0：图片   1：文字    2：带相框 
            var el_type = el_JsonPg.el_type;
            var that = this;
            var isAdd = true

            this.changePgId.forEach(function(item,index){
                if(item==archivesInfo[that.pageIndex].Id){
                    isAdd = false
                }
            })
            if(isAdd){
                this.changePgId.push(archivesInfo[this.pageIndex].Id) 
            }
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
            // if(this.isChange){
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

                // this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"正在保存中..."});

                
                // 保存（上传）编辑         pageId---->对应archivesInfo[this.pageIndex]里的值
                // http://192.168.0.3:5581/webapi/api/GrowthEditor/SavePage?loginUserId=1070428102732390&loginAccountType=0&loginFamilyStudentUserId=1070428102732390&themeStyleId=1&themeTemplateId=1&userId=2170907160208153&plateId=&roleType=4&pageId=59368767-00ba-11e8-ae58-a4badb17ff39&growthType=4&growthId=1
                this.$store.dispatch("setSavePage",{
                    "loginUserId":SST_Global_Account.LoginUserId,
                    "loginAccountType":SST_Global_Account.LoginUserAccountType,
                    "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,
                    "themeStyleId":this.themeStyleId,"themeTemplateId":this.themeTemplateId,
                    "userId":this.userId,"growthId":this.growthId,
                    "plateId":'',"roleType":"4",
                    "growthType":this.growthType,
                    "pageId":archivesInfo[this.pageIndex].Id,
                    "pageInfo":"="+(encodeURIComponent(JSON.stringify(dataParamet)))
                }).then(response => {
                    if(response.ResultCode!=1){
                        console.log("数据加载失败.请重试.")
                    }else{         
                        that.isChange = false;       
                        isEdit = "0";
                        that.$store.dispatch("setisChange",false); 
                        // that.$store.dispatch("setIsTips",{"_isShow":false});
                    }
                })
            // }else{
            //     this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"保存完成"});
            //     setTimeout(this.closeTips,1000);
            // }
        },
        templateSave_Cut(){
            this.templateSave()
            var that = this
            this.$store.dispatch("setBatchPrintImage",{
                "loginUserId":SST_Global_Account.LoginUserId,
                "loginAccountType":SST_Global_Account.LoginUserAccountType,
                "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,               
                "growthId":this.growthId,
                "pageIds":this.changePgId.join("|")
            }).then(response => {
                if(response.ResultCode!=1){
                    console.log("数据加载失败.请重试.")
                }else{         
                    that.isChange = false;       
                    isEdit = "0";
                    that.$store.dispatch("setisChange",false); 
                    // that.$store.dispatch("setIsTips",{"_isShow":false});
                }
            })
        



        },


        closeTips(){
            this.$store.dispatch("setIsTips",{"_isShow":false});
        },
        uploadimg(event){
            var that = this;
            if (/image\/\w+/.test(event.target.files[0].type)) {
                
                if (event.target.files[0].size <= 1024 * 1024 * 10) {
                    var reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    var fd = new FormData(form);                                //FormData对象，可以把所有表单元素的name与value组成一个queryString，提交到后台
                    fd.append(0,event.target.files[0]);
                    // 保存（上传）本地图片上传         pageId---->对应archivesInfo[this.pageIndex]里的值
                    // http://192.168.0.3:5581/webapi/api/GrowthEditor/UploadPhoto?themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}&loginUserId={loginUserId}&loginAccountType={loginAccountType}&loginFamilyStudentUserId={loginFamilyStudentUserId}
                    this.$store.dispatch("setUploadPhoto",{
                            "themeStyleId":this.themeStyleId,
                            "themeTemplateId":this.themeTemplateId,
                            "loginUserId":SST_Global_Account.LoginUserId,
                            "loginAccountType":SST_Global_Account.LoginUserAccountType,
                            "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,
                            "pageInfo":fd
                    }).then(response => {
                        if(response.ResultCode!=1){
                            console.log("数据加载失败.请重试.")
                        }else{                     
                            that.$store.dispatch("setIsTips",{"_isShow":false});
                            that.isChange = false;
                            that.$store.dispatch("setisChange",false); 
                        }
                    })
                }else{
                    //console.log("上传的图片请小于10M");
                    // Panel.showFlashTips("上传的图片请小于10M",1500)
                }
            }else{
                // Panel.showFlashTips("上传图片的格式有误",1500)
            }
        },
        uploadimg_app(){
            this.$store.dispatch("setIsChoiceImg",{"isChoice":false});
            this.isChoiceImg = false;
            selectImage();
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
