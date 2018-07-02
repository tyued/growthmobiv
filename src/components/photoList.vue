<template>
    <div class="photoMain flexColumn"> 
        <div class="header">
            <span class="h-back" v-on:click="$router.push({path:'/albumList'})">返回</span>
            <span class="h-close" v-on:click="$router.push({path:'/'})">关闭</span>
        </div>
        <div id="photoList" class="photoList flexBoxScroll">
            <div id="photoListBox" class="photoListBox">
                <li v-for="(item,index) in photolist" v-bind:key="index">
                    <div class="photobox" v-on:click="_editImg(item.PhotoUrl,$event)">
                        <img :src="item.PhotoUrl?item.PhotoUrl:noneimg" onload="_resizeImg(this)" :onerror="mrimg">  
                    </div>  
                </li>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'photoList',
    data () {
        return {
            photolist:[],
            albumnId:'',
            page:1,
            pageSize:1,
            TotalPages: '',         //按一页pageSize个一共分TotalPages页 
            TotalItemCount:'',      //一共有TotalItemCount条数据
        }
    },
    mounted:function(){
        this.albumnId = this.$route.query.albumnId;
        this._getPhotoList(this.page);
        this.mrimg = this.$store.getters.getmrimg;
        this.noneimg = this.$store.getters.noneimg;

        var bigrollbox = document.getElementById("photoList");
        bigrollbox.addEventListener("scroll",this._scrollEvent,false);

    },

    methods:{
        _getPhotoList(page){
            var that = this;
        // http://192.168.0.3:5581/Growing/GrowH5Editor/GetAlbumnPhotoList?albumnId={albumnId}&pageIndex={pageIndex}&pageSize={pageSize}       
            if(this.albumid==""){
                this.$router.push({path:'home'})
            }else{
                this.$store.dispatch("getPhotoList",{"albumnId":that.albumnId,"pageindex":page,"pageSize":that.pageSize}).then(res => {
                    that.photolist = res.Value && that.photolist.concat(res.Value) || [];  
                    that.TotalPages = res.TotalPages;
                    that.TotalItemCount = res.TotalItemCount
                    //setTimeout保证数据渲染完成后执行
                    setTimeout(function(){
                        if(!that._getIsOverflow()){
                            that.page++;
                            if(that.page<=that.TotalPages){
                                that._getPhotoList(that.page)
                            }
                        }
                    },0)    
                });
            }
        },
        _editImg(baseurl,athis){
            isEdit = "1";
            var CurCon = athis.currentTarget.getElementsByTagName("img")[0];
            var CurHeight = CurCon.height ? CurCon.height : 'auto';
            var CurWidth = CurCon.width ? CurCon.width : 'auto';
            var that = this;

            if(baseurl==CurCon.src){
                this.$store.dispatch("setCurSrc",{"Src":baseurl,"rImgLeft":0,"rImgTop":0});
                this.$router.push({path:'editimg'})
            }else{
                this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"图片错误"});
                setTimeout(function(){
                    that.$store.dispatch("setIsTips",{"_isShow":false});
                },1500);
            }       
        },
        _getIsOverflow(){
            var curbox = document.getElementById("photoListBox");
            var bigrollbox = document.getElementById("photoList");
            if(curbox.scrollHeight<bigrollbox.scrollHeight){
                return false
            }else{
                return true
            }
        },
        _scrollEvent(){
            var curbox = document.getElementById("photoListBox");
            var bigrollbox = document.getElementById("photoList");
            if(bigrollbox.scrollTop+bigrollbox.clientHeight+20>curbox.scrollHeight && this.page<this.totalPages){
                this.page++;
                this._getPhotoList(this.page)
            }

        },
    }

}
</script>
