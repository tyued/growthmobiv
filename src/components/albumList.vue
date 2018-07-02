<template>
    <div class="albumMain flexColumn"> 
        <div class="header">
            <span class="h-back" v-on:click="$router.push({path:'/'})">返回</span>
        </div>
        <div class="albumList flexBoxScroll">
            <li v-for="(item,index) in albumlist" v-bind:key="index" v-on:click="_openAlbum(item.AlbumId)">
                <div class="albumImg">
                    <img :src="item.ImgUrl?item.ImgUrl:noneimg" onload="_resizeImg(this)"  :onerror="mrimg">
                </div>
                <div class="albumName">{{item.AlbumName}}</div>
                <div class="photoCount">{{item.PhotoCount}}张</div>
            </li>
        </div>
    </div>
</template>


<script>
export default {
    name: 'mb6',
    data () {
        return {
            albumlist:[],
            pageIndex:1,            //当前页码
            pageSize:8,             
            bgtime:'',
            edtime:'',
            mrimg:'',
            noneimg:'',
        }
    },
    mounted:function(){
        this.mrimg = this.$store.getters.getmrimg;
        this.noneimg = this.$store.getters.noneimg;
        this.init();
    },

    methods:{
        init(){
            var that = this;
        //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetAlbumList?oldclasscode=2010400101002
            if(SST_Global_Account.CurOldClassCode==""){
                this.$router.push({path:'home'})
            }else{       
                this.$store.dispatch("getAlbumList",{"oldclasscode":SST_Global_Account.CurOldClassCode}).then(res => {
                    that.albumlist = res.Value;
                }).catch(function(r){
                    console.log(r)
                })
            }
        },
        _openAlbum(aid){
            
            isEdit = "1";
            this.$router.push({path:'photoList',query:{albumnId:aid}})
        }
    }

}
</script>
