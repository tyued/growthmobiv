<template>
    <div class="albumMain flexColumn"> 
        <div class="header">
            <span class="h-back" v-on:click="$router.push({path:'/'})">返回</span>
        </div>
        <div id="timeLineBox" class="timeLineBox flexBoxScroll"  >
            <div class="empty" v-if="!ClassGrowList || ClassGrowList.length == 0"></div>
            <div class="timeLine" id="timeLine">
                <ul>
                    <li v-for="(item,index) in ClassGrowList" :key="index">
                        <div class="dateInfo" v-html="_getDate(item.CreateDate)"></div>
                        <div class="photolist clear">
                            <ul>
                                <li v-for="(photo,index) in item.PhotoUrl.split('|')" :key="index">
                                    <div class="photobox" v-on:click="_editImg(photo,$event)">
                                        <img :src="photo?photo:noneimg" onload="_resizeImg(this)" :onerror="mrimg">  
                                    </div>  
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import moment from 'moment'
export default {
    name: 'classGrowList',
    data () {
        return {
            ClassGrowList:[],
            pageIndex:1,            //当前页码
            pageSize:3,    
            TotalPages:'',   
            TotalItemCount:'',      
      
            Birthday:'',            //用户生日
            mrimg:'',
            noneimg:'',
        }
    },
    mounted:function(){
        this.mrimg = this.$store.getters.getmrimg;
        this.noneimg = this.$store.getters.noneimg;

        var bigrollbox = document.getElementById("timeLineBox");
        bigrollbox.addEventListener("scroll",this._scrollEvent,false)

        this.init(this.pageIndex);
    },

    methods:{
        init(pageIndex){
            var that = this;
        // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetClassGrowList?loginUserId=2170907155816420&loginAccountType=0&loginFamilyStudentUserId=2170907155816420&oldclasscode=201000110102&bgtime=&edtime=&pageIndex=1&pageSize=2
            if(SST_Global_Account.CurOldClassCode==""){
                this.$router.push({path:'home'})
            }else{       
                this.$store.dispatch("getClassGrowList",{"loginUserId":SST_Global_Account.LoginUserId,"loginAccountType":SST_Global_Account.LoginUserAccountType,
                            "loginFamilyStudentUserId":SST_Global_Account.LoginFamilyStudentUserId,"oldclasscode":SST_Global_Account.CurOldClassCode,"bgtime":'',"edtime":'',
                            "pageIndex":pageIndex,"pageSize":this.pageSize                
                }).then(res => {
                    that.ClassGrowList = res.Value.List && that.ClassGrowList.concat(res.Value.List) || [];
                    that.TotalPages = res.Value.TotalPage;
                    that.TotalItemCount = res.Value.TotalItemCount;  
                }).catch(function(r){
                    console.log(r)
                })
            }
        },
        _getDate(dateStr){
            var dateNum = dateStr.replace(/\/*/g,"");
            var unixCreatDay = moment(dateNum).format('X');                     //时间戳
            var CreatYear = moment(dateNum).format('YYYY');
            var CreatMonth = moment(dateNum).format('MM');
            var CreatDay = moment(dateNum).format('DD');
            var CreatTime = moment(dateNum).format('HH:mm');
            return "<span>"+CreatYear+"</span>年"+"<span>"+CreatMonth+"</span>月"+"<span>"+CreatDay+"</span>日"+"<span>"+CreatTime+"</span>"
        },
         _editImg(baseurl,athis){
            isEdit = "1";
            var CurCon = athis.currentTarget.getElementsByTagName("img")[0];
            var CurHeight = CurCon.height ? CurCon.height : 'auto';
            var CurWidth = CurCon.width ? CurCon.width : 'auto';
            this.$store.dispatch("setCurSrc",{"Src":baseurl,"rImgLeft":0,"rImgTop":0});
            this.$router.push({path:'editimg'})
        },
        _getIsOverflow(){
            var curbox = document.getElementById("timeLine");
            var bigrollbox = document.getElementById("timeLineBox");
            if(curbox.scrollHeight<bigrollbox.scrollHeight){
                return false
            }else{
                return true
            }
        },
        _scrollEvent(){
            var curbox = document.getElementById("timeLine");
            var bigrollbox = document.getElementById("timeLineBox");

            if(bigrollbox.scrollTop+bigrollbox.clientHeight+100>curbox.scrollHeight && this.pageIndex<this.TotalPages){
                this.pageIndex++;
                this.init(this.pageIndex)
            }
        }

    }

}
</script>
