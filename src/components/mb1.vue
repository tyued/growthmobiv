<template>
    <div class="page">
        <div class="growthMain" :style="pgSty" v-html="vhtml"></div>

    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import edittxt from '../components/edittxt.vue'
export default {
    name: 'home',
    data () {
        return {
            pgSty:"",                         //growthMain样式
            vhtml:"",
            pgNum:"",                       //总页码
            pageIndex:'',                   //当前页

            Status:'',                      //是否启动
            roleType:'',

            themeStyleId:'',
            themeTemplateId:'',
        }
    },
    mounted:function(){
        this.themeStyleId = this._getQueryId("themeStyleId");
        this.themeTemplateId = this._getQueryId("themeTemplateId");
        this.init()

    },
    computed:mapGetters(['getPageIndex']),
    components:{"edit-txt" : edittxt},
    watch:{
        getPageIndex() {
            this.init();
            
        },

    },
    methods:{
        init(){
            this.pageIndex = this.$store.getters.getPageIndex;          //当前页
            this.vhtml = backAppendStr(this.pageIndex);

            this.pgSty = archivesInfo[this.pageIndex].JsonPage.page_style;
            this.$nextTick(function () {
                this._ChoiceImg(document.querySelectorAll(".editel"))
            })
        },
        _ChoiceImg(athis){
            var that = this;
            this.Status = this.$store.getters.getStatus;
            this.roleType = archivesInfo[this.pageIndex].RoleType;
            var resJ = qxJudge(that.roleType,that.Status)
            if(resJ){
                for(var i=0;i<athis.length; i++){
                    athis[i].onclick = function(){                        
                        if(this.className.indexOf("el_photo")>-1){            //图片编辑
                            var CurCon = this.getElementsByClassName("shapeimg")[0].getElementsByTagName("img")[0];
                            var CurSrc = CurCon.src;

                            
                            if(CurCon.attributes["src"].value==""){                            
                                $(".isEditImg").hide()
                            }else{
                                $(".isEditImg").show()
                            }

                            that.$store.dispatch("setIsChoiceImg",{"src":CurSrc,"isChoice":true,"index":this.getAttribute("data-id"), "boxHeight":this.clientHeight,"boxWidth":this.clientWidth});
                            
                            var CurHeight = CurCon.style.height ? ((CurCon.style.height=="auto")?this.clientHeight:parseInt(CurCon.style.height)) : this.clientHeight;               
                            var CurWidth = CurCon.style.width ? ((CurCon.style.width=="auto")?this.clientWidth:parseInt(CurCon.style.width)) : this.clientWidth;
                            var CurLeft = CurCon.style.left ? parseInt(CurCon.style.left) : 0;
                            var CurTop = CurCon.style.top ? parseInt(CurCon.style.top) : 0;

                            that.$store.dispatch("setCurSrc",{"Src":CurSrc,"rImgWidth":CurWidth,"rImgHeight":CurHeight,"rImgLeft":CurLeft,"rImgTop":CurTop});                  

                            window.uploadImage=function(data){
                                that.$store.dispatch("setCurSrc",{"Src":data,"rImgWidth":CurWidth,"rImgHeight":CurHeight,"rImgLeft":CurLeft,"rImgTop":CurTop});
                                that.$router.push({path:'/editimg'})    

                                var imgData = new Image();  
                                imgData.src = data;  
                                // 图片上传到成长档案素材
                                // http://192.168.0.3:5581/webapi/api/GrowthEditor/UploadPhoto4Url?loginUserId={loginUserId}&loginAccountType={loginAccountType}&loginFamilyStudentUserId={loginFamilyStudentUserId}&themeStyleId={themeStyleId}&themeTemplateId={themeTemplateId}&fileUrl={fileUrl}&width={width}&height={height}
                                that.$store.dispatch("getUploadPhoto4Url",{"loginUserId":SST_Global_Account.LoginUserId,
                                    "loginAccountType":SST_Global_Account.LoginUserAccountType,
                                    "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,
                                    "themeStyleId":that.themeStyleId,"themeTemplateId":this.themeTemplateId,
                                    "fileUrl":data,"width":imgData.width,"height":imgData.height}).then(response => {


                                }).catch(function(r){
                                    console.log(r)
                                })
                                
                                
                            }
                        }else if(this.className.indexOf("el_text")>-1){             //文字编辑
                            var editTxtHtml = this.style.cssText;
                            var transfcss = this.getElementsByClassName('transf')[0].style.cssText
                            var innerHTML = this.getElementsByClassName('transf')[0].innerHTML
                            this.style.visibility = 'hidden';
                            isEdit = "1";
                            that.$store.dispatch("seteditAct",true)
                            that.$store.dispatch("seteditSel",{'transfcss':transfcss,"editSelID":this.getAttribute("data-id"),"editSelSty":editTxtHtml,"editSelShow":true,"editSelHtml":innerHTML,"pageIndex":that.pageIndex});     

                        }
                    }
                }
            }else{
                for(var i=0;i<athis.length; i++){
                    athis[i].onclick = function(){
                        that.$store.dispatch("setIsTips",{"_isShow":true,"_value":"当前无权限操作"});
                        var thatthis = that
                        setTimeout(function(){
                            thatthis.$store.dispatch("setIsTips",{"_isShow":false});
                        },1500);
                    }
                }
            }
        },
        _getQueryId(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },
        
    }
}
</script>

