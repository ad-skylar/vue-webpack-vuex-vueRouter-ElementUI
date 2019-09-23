<template>
	<section v-loading="loading" element-loading-customClass="test" class="view">
	<div>
		<div class="" style="width:1100px;margin:0 auto">
			<!-- 编辑 -->
			<template v-if='this.$route.params.topic_id'>
				<div class="writeTop" style="overflow:hidden">
					<div style="width:50%;float:left;">
						<div style="float:left;font-size:14px;margin-right:10px;line-heigt:36px;line-height:36px;">文章标题</div>
						<el-input type="text" v-model="a.title" placeholder="输入文章标题" class="eidttitle"></el-input>
					</div>
				</div>
				<mavon-editor v-model="a.md_content" ref="editor" :ishljs="true" style="height:500px;margin-bottom: 20px;" @change="change" @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>

			</template>
			<!-- 新添 -->
			<template v-else>
				<div class="writeTop" style="overflow:hidden">
					<div style="width:50%;float:left;">
						<div style="float:left;font-size:14px;margin-right:10px;line-heigt:36px;line-height:36px;">文章标题</div>
						<el-input type="text" v-model="title" placeholder="输入文章标题" class="edit_title"></el-input>
					</div>
					<div style="width:25%;float:left">
						<div style="float:left;font-size:14px;margin-right:10px;line-heigt:36px;line-height:36px;">所属分类</div>
						<el-select v-model="type" placeholder="请选择" class="edit_type">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div style="width:25%;float:left">
						<div style="float:left;font-size:14px;margin-right:10px;line-heigt:36px;line-height:36px;">技术分类</div>
						<el-select v-model="tech_type" placeholder="请选择" class="edit_type">
							<el-option v-for="item in optionsTwo" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<mavon-editor v-model="value" :ishljs="true" ref="editor" style="height:500px;margin-bottom: 20px;" @change="change" @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
			</template>
			<div class="writeBtn" @click="articleSubmit">发布</div>

		</div>
	</div>
</section>
</template>
<script>
import api_M from "../api/my";
import api_A from "../api/article";
import { mavonEditor } from "mavon-editor";
import axios from "axios";
import Vue from "vue";
import { mapState } from "vuex";
import { setStore, getStore, removeStore } from "../util/util";
const vm = new Vue({});
let count = 0; //用来判断是否是上传最后一张照片
const config = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};
export default {
  components: {
    mavonEditor
  },
  created() {
    if (this.$route.params.topic_id) {
      this.getOneArticleForedit();
      return;
    } else if (getStore("article")) {
      var obj = JSON.parse(getStore("article"));

      this.title = obj.title;
      this.type = obj.type;
      this.value = obj.md_content;
    }
    document.title = "写文章";
  },
  watch: {
    $route() {
      var obj = JSON.parse(getStore("article"));
      this.title = obj.title;
      this.type = obj.type;
      this.value = obj.md_content;
    },
    content() {
      this.content = this.$refs.editor.d_render;
    }
  },
  computed: {
    ...mapState(["userlogin"])
  },
  data() {
    return {
      loading: false,
      //编辑时候获取的文章的相关信息
      a: {},
      img_file: {},
      img_arr: [],
      value: "",
      title: "",
      content: "",
      type: "",
      tech_type: "",
      optionsTwo: [
        {
          value: "1",
          label: "html"
        },
        {
          value: "2",
          label: "php"
        },
        {
          value: "3",
          label: "java"
        }
      ],
      options: [
        {
          value: "2",
          label: "经验分享"
        },
        {
          value: "3",
          label: "入门学习"
        },
        {
          value: "4",
          label: "成果分享"
        }
      ]
    };
  },

  methods: {
    getOneArticleForedit() {
      api_A
        .getOneArticle({
          topic_id: this.$route.params.topic_id
        })
        .then(({ data }) => {
          this.a = data.data;
        });
    },
    $imgAdd(pos, $file) {
      //判断图片大小是否在30M以内
      if ($file.size <= 30 * 1024 * 1024) {
        //获取图片信息；并添加到img_arr数组里
        var formdata = new FormData();
        formdata.append("upimg", $file);
        formdata.append("token", this.userlogin.token);
        this.img_arr.push({
          name: pos,
          data: formdata
        });
      } else {
        this.$message.error("对不起，您选择的图片过大，请选择30M以内的图片");
      }
    },
    $imgDel(pos) {
      var posIndex = this.img_arr.findIndex(function(item) {
        return item.name == pos;
      });
      if (posIndex > -1) {
        this.img_arr.splice(posIndex, 1);
      }
    },
    change: function(res, render) {
      //res是md文本render是html内容
      this.content = render;
      this.a.content = render;
      if (this.$route.params.topic_id) {
        //编辑
        setStore("article", {
          md_content: res,
          title: this.a.title,
          type: "" + this.a.type
        });
      } else {
        setStore("article", {
          md_content: res,
          title: this.title,
          type: "" + this.type
        });
      }
    },

    articleSubmit: function() {
      //判断文章标题等信息是否完整
      if (this.$route.params.topic_id) {
        var reg = /^\s+$/g;
        if (!this.a.title || reg.test(this.a.title)) {
          this.$message.error("请输入标题");

          return;
        }

        if (!this.a.md_content || reg.test(this.a.md_content)) {
          this.$message.error("请输入内容");
          return;
        }
      } else {
        var reg = /^\s+$/g;
        if (!this.title || reg.test(this.title)) {
          this.$message.error("请输入标题");

          return;
        }
        if (!this.value || reg.test(this.value)) {
          this.$message.error("请输入内容");
          return;
        }
        if (!this.type) {
          this.$message.error("请选择分类");
          return;
        }
        if (!this.tech_type) {
          this.$message.error("请选择技术分类");
          return;
        }
      }
      this.loading = true;
      //重置count;防止上传失败后count值发生了改变
      count = 0;
      //首先判断是否有图片,如果有
      if (this.img_arr.length > 0) {
        //在上传文章之前先首先判断左边的编辑区用户是否通过backpace键删除了照片而不是编辑器提供的删除

        for (let i = 0; i < this.img_arr.length; i++) {
          if (this.value.indexOf(this.img_arr[i].name) == -1) {
            this.img_arr.splice(i, 1);
          }
        }

        //然后上传图片之后上传文章
        this.uploadArticleImg();
      } else {
        //则直接上传文章
        this.uploadArticle();
      }
    },
    transe(res) {
      this.$refs.editor.$imgUpdateByUrl(
        this.img_arr[count].name,
        res.data.data.src
      );
      this.$refs.editor.$img2Url(this.img_arr[count].name, res.data.data.src);
      return Promise.resolve();
    },
    uploadArticleImg() {
      api_M.uploadEditorImage(this.img_arr[count].data, config).then(res => {
        var that = this;
        this.transe(res).then(function() {
          that.img_arr[count]["url"] = res.data.data.src;
          //更新图片名字；防止第二次上传的时候被删除
          that.img_arr[count]["name"] = res.data.data.src;
          count++;
          //如果上传完最后一张了；那么进行文章的上传
          if (count >= that.img_arr.length) {
            //上传文章前更新md_content和content
            that.value = that.$refs.editor.d_value;
            that.a.md_content = that.$refs.editor.d_value;
            that.content = that.$refs.editor.d_render;
            that.a.content = that.$refs.editor.d_render;
            //再次本地存储
            if (that.$route.params.topic_id) {
              //编辑
              setStore("article", {
                md_content: that.value,
                title: that.a.title,
                type: "" + that.a.type
              });
            } else {
              setStore("article", {
                md_content: that.value,
                title: that.title,
                type: "" + that.type
              });
            }
            that.uploadArticle();
          } else {
            that.uploadArticleImg();
          }
        });
      });
    },
    uploadArticle() {
      if (this.$route.params.topic_id) {
        //如果是编辑文章
        api_M
          .topicEdit({
            token: this.userlogin.token,
            user_id: this.userlogin.user_id,
            avatar: this.userlogin.avatar,
            nickname: this.userlogin.nick_name,
            type: this.a.type,
            title: this.a.title,
            content: this.a.content,
            md_content: this.a.md_content,
            topic_id: this.$route.params.topic_id
          })
          .then(res => {
            if (res.data.status == 1) {
              removeStore("article");
              this.loading = false;
              this.$message.success("发布成功");
              this.$router.push("/user/mynote");
            }
          });
      } else {
        //新写的文章
        api_M
          .topicAdd({
            token: this.userlogin.token,
            user_id: this.userlogin.user_id,
            avatar: this.userlogin.avatar,
            nickname: this.userlogin.nick_name,
            type: this.type,
            title: this.title,
            content: this.content,
            md_content: this.value,
            tech_type: this.tech_type
          })
          .then(res => {
            if (res.data.status == 1) {
              removeStore("article");
              this.loading = false;
              this.$message.success("发布成功");
              this.$router.push("/user/mynote");
            }
          });
      }
    },
    cancelSubmit() {}
  }
};
</script>

<style lang="scss">
.edit_title {
  width: 400px !important;
}

.edit_type {
  float: left;
  width: 200px;
}

.writeTop {
  width: 1100px;
  margin: 0 auto;
  overflow: hidden;
  height: 50px;
  padding: 40px 0 20px;
}

.write-title {
  width: 70%;
  display: flex;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  height: 30px;
  line-height: 30px;
}

select[class="write-title"] {
  font-weight: normal;
}

.write-title input {
  border: 1px solid #ddd;
  flex: 1;
  text-indent: 10px;
  font-weight: normal;
} // 提交按钮
.handelEvent {
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: flex-start;
  color: #fff;
}

.writeBtn {
  background: rgba(234, 23, 45, 0.76);
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  border-radius: 6px;
  text-align: center;
  padding: 0 25px;
  cursor: pointer;
  width: 40px;
  float: right;
}

.writeBtn:hover {
  background: #ea0f2d;
} //弹出框样式
.hsy-dialog .main .title .content {
  font-size: 14px;
  min-height: 20px;
  vertical-align: middle;
}

.eidttitle {
  width: 300px;
}
</style>