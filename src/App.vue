<template>
  <div id="app">
    
      <transition name='flod'>
          <router-view>
          </router-view>
      </transition>

      <div v-show="isTips" class="tipsBox">
        <transition name='tips'>
          <div v-show="isTips" class="hDialog">
              <div class="tipTxt" v-html="tipsTxt"></div>
          </div>
        </transition>
      </div>
      <div v-show="isTips" class="maskTips"></div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      tipsTxt:"测试信息",
      isTips:false,
    }
  },
  mounted : function(){ 
        var growthId = _getQueryId("growthId");
        // if(!growthId){
        //     this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"正在生成新成长档案..."});
        // }
  },
  computed : mapGetters(['getIsTips']),
  watch : {
    getIsTips(data) {
        // if(this.$store.getters.getIsTips){        
          this.isTips = this.$store.getters.getIsTips;
          this.tipsTxt = this.$store.getters.getTipsTxt;
          // setTimeout(this.closeTips,1500);

    },
  },
  methods : {
    closeTips(){
      this.$store.dispatch("setIsTips",{"_isShow":false});
      this.isTips = false;
    },
  }
}
</script>

<style>
#app {
  height:100%;
  width:100%;
  background:#FFF;
  overflow: hidden;
}
.flod-enter-active{
    animation-name:fadeInRight;animation-duration:.5s;
}
.tips-enter-active{
    animation-name:zoomIn;animation-duration:.5s;
}
.tips-leave-active{
    animation-name:zoomOut;animation-duration:.5s;
}

</style>
