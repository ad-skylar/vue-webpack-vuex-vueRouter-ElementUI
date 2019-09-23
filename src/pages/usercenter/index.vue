<template>
    <section class="user-page">
        <side-bar></side-bar>
        <div class="list-item">
            <router-view></router-view>
        </div>
        
    </section>
</template>

<script>
    import SideBar from '../../components/SideBar.vue'
    export default {
        data () {
            return {
                msg: ''
            }
        },
        created(){
            document.title = '个人中心'
        },

        components:{
            SideBar
        },

    }
</script>

<style>
.list-item{
    padding-left: 26px;
    flex-grow: 1;
}
.item label{
  width:100px;
  /* text-align: right; */
}

</style>