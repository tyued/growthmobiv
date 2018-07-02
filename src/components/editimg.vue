<template>
    <div class="editview flexColumn" @touchmove="touchmovePG($event)">
        <div class="header">
            <span class="h-back" v-on:click="$router.push({path:'/'})">返回</span>
            <span class="h-save" v-on:click="imgsave()">保存</span>
        </div>
        <div class="editImg flexBox"> 
            <div id="editBox" class="editBox">
                <canvas id="myCanvas" ref="canvas"></canvas>  

                <div class="canvasmasking" @touchstart="touchMask"></div>

                <div ref="movemask" class="masking" :style="{width:(cut_canW + 2) + 'px',height:(cut_canH + 2) + 'px',top:curtop+'px',left:curleft+'px'}" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
                    <canvas ref="can"></canvas>
                    <div ref="resize" class="resize" @touchstart="touchstartResize"><span></span></div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'editImg',
    data () {
        return {
            themeStyleId:'',    
            themeTemplateId:'',
            userId:'',
            growthType:'',
            growthId:'',
            pageIndex:'',

            CurSrc:[],                      //图片在页面里的信息（img图片大小、显示位置在图片里的位移）   w、h、left、top、src
            imgInfo:[],                     //图片在页面里显示的信息（editel的宽高）  w、h、isChoice（弹层显示）、index
            // 初始话2个画板
            cantas2d: null,
            can2d: null,

            HtmlFont:'',                     //html的基础值--->750======50 
            cutimg: '',                      //所绘制的图片 （原始图片）         
            cur_cutW:'',                     //图片大小     （原页面显示图片的大小，非原始图片大小）
            cur_cutH:'',                    
            Org_r:'',                       //图片的原始比例(宽/高)
            Cur_r:'',                       //截图框比例
            sw:'',                           //myCanvas绘制所限制最大高度/宽度
            izoom:'',                       //原页面图片与绘制的比例
            izoompar:'',                    //原页面图片的实际大小与绘制的比例
            canW:'',                        //绘制myCanvas大小
            canH:'',
            cut_canW:'',                    //绘制canvas截取框大小------can
            cut_canH:'',                         
            curtop:'',                         //剪切图片在原始图片上的定位
            curleft:'',                         //剪切图片在原始图片上的定位
            cratio: '',                     //初始状态的宽高比例
            base:'',                        //判断图片是否按屏幕宽为基准   （base=1）

            isScale: false,                 //是否在缩放
            start:{                         //移动
                pageX: 0,
                pageY: 0
            },
            startcutW:'',                   //初始时剪切框大小
            startcutH:'',                   //初始时剪切框大小

            //保存
            realR:'',                       //当前状态下   绘制图片canvas与原页面图片大小（非原始大小）的比例         
        }
    },
    mounted:function(){
        this.themeStyleId = this._getQueryId("themeStyleId");
        this.themeTemplateId = this._getQueryId("themeTemplateId");
        this.userId = this._getQueryId("userId");
        this.growthType = this._getQueryId("growthType");
        this.growthId = this._getQueryId("growthId");
        this.pageIndex = this.$store.getters.getPageIndex;          //当前页
        this.editType = this.$store.getters.editType;
    //取得rem的基准值.页面单位是rem.手指移动单位是px
        this.HtmlFont = document.getElementsByTagName('html')[0].style.fontSize.replace("px","");
    // 获得图片基础信息
        this.CurSrc = this.$store.getters.getCurSrc;                //图片在页面里信息  w、h、left、top、src
        this.imgInfo = this.$store.getters.getChoiceImg;            //图片在页面里截取的信息  w、h、isChoice（弹层显示）
    // 初始话2个画板 取得图片的数据源
        this.canvas2d = this.$refs.canvas.getContext('2d');
        this.can2d = this.$refs.can.getContext('2d');
    //新建图片对象,canvas绘画需要一个image对象
        this.cutimg = new Image();
        this.cutimg.src = this.CurSrc.Src;       

    //初始化---------图片大小（非原始大小）
        this.cur_cutW = this.CurSrc.rImgWidth;
        this.cur_cutH = this.CurSrc.rImgHeight;    
        this.Cur_r = this.imgInfo.curBoxWidth/this.imgInfo.curBoxHeight;

    
        this.initCanvas();              //画板绘图


    },
    methods:{
        touchmovePG(e){
            e.preventDefault(); 
        },
        initCanvas(){
            var that = this;            
        //图片加载完成后..开始渲染canvas
            this.cutimg.onload = function(){
            //取得原始图片的比例 
                that.Org_r = that.cutimg.width/that.cutimg.height; 
            // 
                if(that.Org_r>0.75){                                    //宽满屏            
                    that.base = 1;
                    that.sw = 7.5*that.HtmlFont;
                    that.izoom = that.cur_cutW/that.sw;                 // 原页面图片与绘制的比例                           
                    that.izoompar = that.cutimg.width/that.sw;          // 原页面图片的实际大小与绘制的比例      

                //初始赋值 myCanvas绘制          
                    that.canW = that.sw;
                    that.canH = that.sw/that.Org_r;
                    that.$refs.canvas.width = that.canW;
                    that.$refs.canvas.height = that.canH;
                    // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);      剪切图像，并在画布上定位被剪切的部分：
                    that.canvas2d.drawImage(that.cutimg, 0, 0, that.cutimg.width, that.cutimg.height, 0, 0, that.canW, that.canH)   
                //初始赋值 截屏框的大小
                    that.cut_canW = parseInt(that.imgInfo.curBoxWidth/that.izoom);
                    that.cut_canH = parseInt(that.imgInfo.curBoxHeight/that.izoom);

                    //当通过图片库进入是判断是否大于mycanvas 
                    if(that.cut_canH>that.canH){
                        that.cut_canH=that.canH;
                        that.cut_canW=that.cut_canH*that.Cur_r;
                    }
    
                    that.cratio = that.cut_canW/that.cut_canH;  
                    that.$refs.can.width = that.cut_canW;
                    that.$refs.can.height = that.cut_canH;
                    that.curleft = -parseInt(that.CurSrc.rImgLeft/that.izoom);
                    that.curtop = -parseInt(that.CurSrc.rImgTop/that.izoom); 
                    // 画板画的图是原始图片大小----->所以画图要按实际图片的宽高位移来计算
                   that.can2d.drawImage(that.cutimg, that.curleft*that.izoompar, that.curtop*that.izoompar, that.cut_canW*that.izoompar, that.cut_canH*that.izoompar, 0,0, that.cut_canW, that.cut_canH)
            
            //
                }else{                                          //高远大于宽       
                    that.base = 2;             
                    that.sw = 10*that.HtmlFont;                 //限制最大高度
                    that.izoom = that.cur_cutH/that.sw;                              // 原页面图片与绘制的比例 
                    that.izoompar = that.cutimg.height/that.sw;                      // 原页面图片的实际大小与绘制的比例
                //初始赋值 myCanvas绘制                  
                    that.canW = that.sw*that.Org_r;
                    that.canH = that.sw;
                    that.$refs.canvas.width = that.sw*that.Org_r;
                    that.$refs.canvas.height = that.sw;
                    that.canvas2d.drawImage(that.cutimg, 0, 0, that.cutimg.width, that.cutimg.height,0,0, that.canW, that.canH);

                //初始赋值 截屏框的大小       
                    that.cut_canW = parseInt(that.imgInfo.curBoxWidth/that.izoom);
                    that.cut_canH = parseInt(that.imgInfo.curBoxHeight/that.izoom);    
                    //当通过图片库进入是判断是否大于mycanvas 
                    if(that.cut_canW>that.sw*that.Org_r){
                        that.cut_canW=that.sw*that.Org_r;
                        that.cut_canH=that.cut_canW/that.Cur_r;
                    }

                    that.cratio = that.cut_canW/that.cut_canH;  
                    that.$refs.can.width = that.cut_canW;
                    that.$refs.can.height = that.cut_canH;
                    that.curleft = -parseInt(that.CurSrc.rImgLeft/that.izoom);
                    that.curtop = -parseInt(that.CurSrc.rImgTop/that.izoom);         
                    // 画板画的图是原始图片大小----->所以画图要按实际图片的宽高位移来计算
                    that.can2d.drawImage(that.cutimg, that.curleft*that.izoompar, that.curtop*that.izoompar, that.cut_canW*that.izoompar, that.cut_canH*that.izoompar, 0,0, that.cut_canW, that.cut_canH)
            
                }    
            };      
        },
        touchstartResize(event){            //是否缩放
            this.isScale = true;            
            isEdit = "1";                            
            this.start.pageX = event.changedTouches[0].pageX;
            this.start.pageY = event.changedTouches[0].pageY;
            this.startcutW = this.cut_canW;
            this.startcutH = this.cut_canW;
        },
        touchMask(event){      
            isEdit = "1";
        },
        touchstart (event) {                
            this.start.pageX = event.changedTouches[0].pageX
            this.start.pageY = event.changedTouches[0].pageY
            this.curtop = parseInt(this.$refs.movemask.style.top);
            this.curleft = parseInt(this.$refs.movemask.style.left);
        },
        touchmove (event) {
            event.preventDefault(); 
            var pageX = event.changedTouches[0].pageX - this.start.pageX;
            var pageY = event.changedTouches[0].pageY - this.start.pageY;
            if(this.isScale){                                               // 是否缩放（剪切）
                if(Math.abs(pageX)>4 && (this.startcutW + pageX)>20){                                      // 绝对值>4 (初始4个像素以内不予反应)  
                    this.cut_canW = this.startcutW + pageX;        
                    this.cut_canH = this.cut_canW / this.cratio;
                    if(this.curleft + this.cut_canW > this.$refs.canvas.width){
                        this.cut_canW = this.$refs.canvas.width -this.curleft;
                        this.cut_canH = this.cut_canW / this.cratio;
                    }else if(this.curtop + this.cut_canH > this.$refs.canvas.height){
                        this.cut_canH = this.$refs.canvas.height - this.curtop;
                        this.cut_canW = this.cut_canH * this.cratio;
                    }

                    this.$refs.can.width =  this.cut_canW;
                    this.$refs.can.height = this.cut_canH;
                    this.can2d.drawImage(this.cutimg, this.curleft*this.izoompar, this.curtop*this.izoompar, this.cut_canW*this.izoompar, this.cut_canH*this.izoompar, 0,0, this.cut_canW, this.cut_canH)
                
                }
            }else{                              // 移动剪切框
                var targetTop = this.curtop + pageY;
                var targetLeft = this.curleft + pageX;
                if(Math.abs(pageX)>4 || Math.abs(pageY)>4){                  // 绝对值>4 (初始4个像素以内不予反应)  
                    // 边缘判断
                    if(targetTop<=0){
                        this.$refs.movemask.style.top = '0px';
                        targetTop=0;
                    }else if(targetTop + this.cut_canH >= this.$refs.canvas.height){
                        this.$refs.movemask.style.top = this.$refs.canvas.height - this.cut_canH + 'px';
                        targetTop = this.$refs.canvas.height - this.cut_canH;
                    }else{
                        this.$refs.movemask.style.top = this.curtop + pageY + 'px';    
                    }
                    if(targetLeft<=0){
                        this.$refs.movemask.style.left = '0px';
                        targetLeft=0;
                    }else if(targetLeft+this.cut_canW>=this.$refs.canvas.width){
                        this.$refs.movemask.style.left = this.$refs.canvas.width - this.cut_canW+ 'px';
                        targetLeft = this.$refs.canvas.width - this.cut_canW;
                    }else{
                        this.$refs.movemask.style.left = this.curleft + pageX + 'px'
                    }
                    this.can2d.drawImage(this.cutimg, targetLeft*this.izoompar, targetTop*this.izoompar, this.cut_canW*this.izoompar, this.cut_canH*this.izoompar, 0,0, this.cut_canW, this.cut_canH)
                
                }
            }
        

        },
        touchend(event){
            if(this.isScale){
                this.startcutH = this.cut_canH;
                this.startcutW = this.cut_canW;
                this.isScale = false;
            }
            this.curtop = parseInt(this.$refs.movemask.style.top);
            this.curleft = parseInt(this.$refs.movemask.style.left);
        },
        imgsave(){
            var el_JsonPg = archivesInfo[this.pageIndex].JsonPage;
            //所在页面里元素的类型     0：图片   1：文字    2：带相框 
            var el_type = el_JsonPg.el_type;            
            // 编辑后传给数据库的信息
            var edit_imginfo = [];
            var edit_Org_img_w;    //原页面图片宽（非原始图片大小）
            var edit_Org_img_h;    //原页面图片宽（非原始图片大小）
            var posR;            //剪切页与原页面比例    
            var edit_src = this.CurSrc.Src;
            if(this.base==1){                       //canvas绘制的图片宽设为屏幕宽
                this.realR = this.$refs.canvas.width / this.cut_canW;   //myCanvas的宽度与剪切框的宽度比-------这个也是框宽（所示图片大小）与 原页面里图片宽（非原始图片大小）比
                this.realR_h = this.$refs.canvas.height / this.cut_canH;
                edit_Org_img_w = this.imgInfo.curBoxWidth * this.realR;      //已知原页面里框宽与（宽度比），得出原页面图片宽（非原始图片大小）
                edit_Org_img_h = this.imgInfo.curBoxHeight * this.realR_h;
                posR = (edit_Org_img_w*gratio)/this.$refs.canvas.width;
                edit_imginfo = "top:" + (-this.curtop*posR).toFixed(2)+"px;"+"left:" + (-this.curleft*posR).toFixed(2)+"px;"+"width:"+(edit_Org_img_w*gratio).toFixed(2)+"px;"+"height:"+(edit_Org_img_h*gratio).toFixed(2)+"px;"
            }else{
                this.realR = this.$refs.canvas.height / this.cut_canH; 
                this.realR_w = this.$refs.canvas.width / this.cut_canW; 
                edit_Org_img_w = this.imgInfo.curBoxWidth * this.realR_w; 
                edit_Org_img_h = this.imgInfo.curBoxHeight * this.realR; 
                posR = (edit_Org_img_h*gratio)/this.$refs.canvas.height;
                edit_imginfo = "top:"+(-this.curtop*posR).toFixed(2)+"px;"+"left:"+(-this.curleft*posR).toFixed(2)+"px;"+"width:"+(edit_Org_img_w*gratio).toFixed(2)+"px;"+"height:"+(edit_Org_img_h*gratio).toFixed(2)+"px;"
            }
            el_JsonPg.el_img_style[this.imgInfo.index] = edit_imginfo;          //替换archivesInfo里面当前图片的信息
            el_JsonPg.el_img[this.imgInfo.index] = edit_src;
            el_JsonPg.el_img_original[this.imgInfo.index] = edit_src;


            // 拼接post正确传参
            var ElementListArr = [];
            var elobj = {};           
            for(var i=0;i<el_type.length;i++){
                if(el_type[i]==0){                  //图片
                    elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                {"Element":el_JsonPg.el_img_original[i],"Thumbnail":el_JsonPg.el_img[i],"Style":el_JsonPg.el_img_style[i],"Level3Element":null}
                            }; 
                }else if(el_type[i]==1){
                    elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                {"Element":el_JsonPg.el_text[i],"Style":el_JsonPg.el_text_style[i],"Level3Element":null}
                            }; 
                }else if(el_type[i]==2){
                    elobj = {"Style":el_JsonPg.el_style[i],"ElementType":el_JsonPg.el_type[i],"Level2Element":
                                {"Element":el_JsonPg.el_img_original[i],"Thumbnail":el_JsonPg.el_img[i],"Style":el_JsonPg.el_img_style[i],"Level3Element":
                                    {"Element":el_JsonPg.el_mask_img_original[i],"Element2":el_JsonPg.el_mask_source_original[i],"Thumbnail":el_JsonPg.el_mask_img[i],"Thumbnail2":el_JsonPg.el_mask_source[i],"Style":el_JsonPg.el_mask_style[i]}
                                    
                                }
                            };
                }
                ElementListArr.push(elobj)
            }
            var dataParamet = {"Style":el_JsonPg.page_style,"Level1ElementList":ElementListArr}


            this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"正在保存中..."});
            var that = this;
            // 保存（上传）编辑         pageId---->对应archivesInfo[this.pageIndex]里的值
            //http://192.168.0.3:5581/webapi/api/GrowthEditor/SavePage?loginUserId=1070428102732390&loginAccountType=0&loginFamilyStudentUserId=1070428102732390&themeStyleId=1&themeTemplateId=1&userId=2170907160208153&plateId=&roleType=4&pageId=59368767-00ba-11e8-ae58-a4badb17ff39&growthType=4&growthId=1
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
                    console.log("数据加载成功.")
                    isEdit = "0";
                    that.$store.dispatch("setIsTips",{"_isShow":false});
                    that.$router.push({path:'home'})
                }
            })
        },
        _getQueryId(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },

    }
}
</script>

<style>
    @import url();

</style>