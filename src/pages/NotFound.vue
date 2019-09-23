<template>
    <div>
        <img :src='notfound' alt="" style="width:100%">
    </div>
</template>
<script>
import notfound from '../assets/images/404.jpg'
export default {
    data() {
        return {
            notfound
        }
    },
    created(){
        document.title = '404'
    }
}
</script>
