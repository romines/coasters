<template>
  <div class="post">
    <h1 class="title header">Post widget</h1>
    <div class="post-nav">
      <span class="option selected">Single</span>
      <span class="option">Multi-shift</span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.post {
  .post-nav {
    // display: flex;
    // justify-content: space-around;
    position: relative;
    z-index: 0;      
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
      padding: .6em 2.4em;
      border-top-left-radius: 6px; 
      border-top-right-radius: 6px; 
      border-bottom: none;
      position: relative;
      bottom: 0;
      &.selected {
        z-index: 2;
        border-bottom: 2px solid white;
      }    
    }
  }
}
</style>