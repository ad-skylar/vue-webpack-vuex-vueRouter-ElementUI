<template>
  <div v-show="isShowTop" class="gotop" @click.prevent="gotop">
    <i class="fa fa-arrow-up"></i>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowTop: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (window.scrollY > 200) {
        this.isShowTop = true
      } else {
        this.isShowTop = false
      }
    },
    gotop() {
      window.scrollTo(0, 0)
      
    }
  }
}
</script>
<style scoped>
.gotop {
  position: fixed;
  right: 2%;
  bottom: 25px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  cursor: pointer;
  -moz-transition: all 0.1s;
  -o-transition: all 0.1s;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}

.gotop i {
  font-size: 2em;
  color: #fff;
  margin-top: 3px;
}

.gotop:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>

