<template>
  <div class="post">
    <h1 class="title header">Post New</h1>
    <div class="post-nav">
      <span 
        class="option" 
        @click="entryMode = 'SINGLE'" 
        :class="entryMode === 'SINGLE' ? 'selected' : ''">Single</span>
      <span 
        class="option" 
        @click="entryMode = 'MULTI'" 
        :class="entryMode === 'MULTI' ? 'selected' : ''">Multi-shift</span>
    </div>
    <component :is='component'></component>
  </div>
</template>

<script>
import PostSingle from './PostSingle.vue'
import MultiPost from './MultiPost.vue'
export default {
  data () {
    return {
      entryMode: 'SINGLE'
    }
  },
  computed: {
    component () {
      return this.entryMode === 'SINGLE' ? PostSingle : MultiPost
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  .post-nav {
    position: relative;
    top: -12px;
    z-index: 0;
    text-align: center;
    &:after {
      border-bottom: 2px solid #23d482;
      position: absolute;
      content: "";
      width: 100%;
      bottom: 0;
      left: 0;
    }
    .tabrow:before {
      z-index: 1;
    }
    
    .option {
      display: inline-block;
      z-index: 1;
      border: 2px solid #23d482;;
      border-color: #23d482;
      padding: .6em 0;
      width: 47.3%;
      margin-left: .18em;
      border-top-left-radius: 6px; 
      border-top-right-radius: 6px; 
      border-bottom: none;
      position: relative;
      bottom: -2px;
      &.selected {
        z-index: 2;
        border-bottom: 4px solid white;
      }  
      &:not(.selected) {
        background-color: #d8d8d8;
      }  
    }
  }
}
</style>