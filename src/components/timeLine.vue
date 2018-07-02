<template>
    <div class="photoMain flexColumn"> 
        <div class="header">
            <span class="h-back"  v-on:click="$router.push({path:'/'})">返回</span>
        </div>
        <div id="timeLineBox" class="timeLineBox flexBoxScroll"  >
            <div class="empty" v-if="!TimeLinelist || TimeLinelist.length == 0"></div>
            <div class="timeLine" id="timeLine">
                <ul>
                    <li v-for="(item,index) in TimeLinelist" :key="index">
                        <div class="dateInfo" v-html="_getDate(item.CreateDate)"></div>
                        <div class="photolist clear">
                            <ul>
                                <li v-for="(photo,index) in item.PhotoUrl.split('|')" :key="index">
                                    <div class="photobox" v-on:click="_editImg(photo,$event)">
                                        <img :src="photo" onload="_resizeImg(this)">  
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
    name: 'timeLine',
    data () {
        return {
            userId:"",
            page:1,
            pageSize:2,
            TimeLinelist:[],        //时光轴数据
            TotalPages: '',         //按一页pageSize个一共分TotalPages页 
            TotalItemCount:'',      //一共有TotalItemCount条数据
            Birthday:'',            //用户生日
       
        }
    },
    mounted:function(){
        this.userId = this._getQueryId("userId");

        var bigrollbox = document.getElementById("timeLineBox");
        bigrollbox.addEventListener("scroll",this._scrollEvent,false)

        this._getBirthday();
        this._getTimeLineList(this.page);
    },

    methods:{
        _getQueryId(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },
        _getTimeLineList(page){
            var that = this;
            //http://192.168.0.3:5581/webapi/api/GrowthEditor/GetGrowList?userId=2170907160456827&pageIndex=1&pageSize=2&category=-1
            this.$store.dispatch("getTimeLineList",{"userId":this.userId,"pageIndex":page,"pageSize":this.pageSize,"category":"-1"}).then(res => {
                that.TimeLinelist = res.Value && res.Value.List && that.TimeLinelist.concat(res.Value.List) || [];
                that.TotalPages = res.TotalPages;
                that.TotalItemCount = res.TotalItemCount;         
                //setTimeout保证数据渲染完成后执行
                setTimeout(function(){
                    if(!that._getIsOverflow()){
                        that.page++;
                        if(that.page<=that.TotalPages){
                            that._getTimeLineList(that.page)
                        }
                    }
                },0)    
            });
        },
        _getBirthday(){
            var that = this;
            // http://192.168.0.3:5581/webapi/api/GrowthEditor/GetUserInfo?userId={userId}
            this.$store.dispatch("getUserInfo",{"userId":this.userId}).then(res => {
                that.Birthday = res.Value.Birthday;     
            });
        },
        _getDate(dateStr){
            var dateNum = dateStr.replace(/\/*/g,"");
            var birthday = this.Birthday.replace(/\/*/g,"");
            var unixCreatDay = moment(dateNum).format('X');                     //时间戳
            var unixBirthDay = moment(birthday).format('X')
            var Difference = unixCreatDay-unixBirthDay;
            var sumDays = Difference/(3600*24);
            var DiffYear = parseInt(sumDays/365);
            var DiffMonth = parseInt((sumDays-(DiffYear*365))/30)
            var DiffDay = parseInt(sumDays-(DiffYear*365)-(DiffMonth*30));
            return "<span>"+DiffYear+"</span>岁"+"<span>"+DiffMonth+"</span>个月"+"<span>"+DiffDay+"</span>天"
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
            if(bigrollbox.scrollTop+bigrollbox.clientHeight+100>curbox.scrollHeight && this.page<this.TotalPages){
                this.page++;
                this._getTimeLineList(this.page)
            }
        }
    }

}
</script>
