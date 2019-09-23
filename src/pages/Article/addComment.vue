<template>
  <div class="" style="overflow: hidden;padding: 0 10px;">
        <textarea name="" class='textarea' ref="textarea" style='' placeholder="法治社会，文明发言" v-model="content">
        </textarea>
        <div class="">
            <a href='javascript:;' @click="postCommentOne($event)" class="comment-btn">发布评论</a>
        </div>
    </div>
</template>
<script>

import {bus} from '../../util/util'

import { mapState } from 'vuex'
import api_A from '../../api/article'

export default {



    data() {
        return {
            content: ''
        }
    },
    computed: {
        ...mapState([
            'userlogin'
        ])
    },
    methods: {

        postCommentOne(event) {
            event.cancelBubble = true;
            if (!this.content) {
                this.$message.error('请输入评论内容！')
                return;
            }
            // 未登录提示！
            if (!this.userlogin) {
                this.$emit('alert')
                return;
            }
            api_A.topicCommentAdd({
                "user_id": this.userlogin.user_id,
                "topic_id": this.$route.params.topic_id,
                "content": this.content,
            })
                .then(response => {
                    if (response.data.status == 1) {
                        this.$message.success('发布成功!')
         
                        bus.$emit('get','1')
                
                        this.show_comment_replay = false;
                        this.content = '';

                    }
                })
        },
    }
}
</script>
