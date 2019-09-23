<template>
	<div>
		<div v-loading="loading" class="view ">
			<div class="markdown-body">
				<div class="post-header">
					<div class="post-title"> {{article.title}}</div>
					<div class="post-meta">
						<span class="author">
              <img :src="photo" alt="">
            </span>
						<span>{{article.nickname}}</span>

						<div class="a_about">
							<span class="post-time">{{article.c_time | moment}}</span>

							<span>
                浏览{{article.browser_num}}
              </span>
							<span>
                评论{{article.comment_num}}
              </span>
						</div>
					</div>
				</div>

				<div class="content" v-html="article.content" style="  padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      margin:auto;"></div>
			</div>

			<div class="someHandel">
				<div class="otherHadel">
					<span class="collect" @click="clickCollect()" v-if="article.is_collect "><img :src="collectsrc" /> 收藏</span>
					<span class="collect" @click="clickCollect()" v-else><img :src="uncollectsrc" /> 收藏</span>
					<span class="approve" @click="clickapprove()" v-if="article.is_like "><img :src="approvesrc" /> 赞</span>
					<span class="approve" @click="clickapprove()" v-else><img :src="unapprovesrc" /> 赞</span>
				</div>
				<div class="shareArticle" @click="showQRcode()">
					分享: <i class="icon iconfont icon-weixin"></i>

					<vue-q-art v-if="QRcodeIsShow" :config="config" :downloadButton="downloadButton" class='qrcode'></vue-q-art>
				</div>
			</div>
			<add-comment v-on:alert='alertDialog' v-on:get='getOneArticle'></add-comment>
			<comments :userlogin='userlogin' v-on:alert='alertDialog'></comments>
			<goTop></goTop>
			<FooterMsg></FooterMsg>

		</div>
		<alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
	</div>
</template>
<script>
import api_A from '../../api/article'
import api_U from '../../api/user'
	import moment from 'moment'

	import VueQArt from 'vue-qart'
	import AlertDig from "../../components/Dialog";
	import comments from "./comments";
	import addComment from "./addComment";
	import goTop from "../../components/Scrolltop";
	import FooterMsg from "../../components/FooterMsg";
	import { mapState } from "vuex";

	//收藏 点赞 icon
	import collect from "../../assets/images/collect.svg";
	import approve from "../../assets/images/approve.svg";
	import collected from "../../assets/images/collected.svg";
	import approved from "../../assets/images/approved.svg";

	export default {
		filters: {
			moment(value) {
				var value = parseInt(value) * 1000
				return moment(value).format('YYYY-MM-DD HH:mm:ss');
			},
		},
		created() {
			this.getOneArticle();
			
		},
		computed: {
			...mapState(["userlogin"])
		},
		components: {
			AlertDig,
			addComment,
			comments,
			goTop,
			FooterMsg,
			VueQArt
		},
		data() {
			return {
				photo: "",
				loading: true,
				article: {},
				showDialog: false,
				QRcodeIsShow: false,
				dialogOption: {
					title: "请先登陆",
					text: "登陆后您可以畅所欲言",
					cancelButtonText: "我偏不",
					confirmButtonText: "去登陆"
				},

				//收藏 未收藏 点赞未点赞
				uncollectsrc: collect,
				collectsrc: collected,
				approvesrc: approved,
				unapprovesrc: approve,
				//标记
				flag: true,
				//分享二维码
				msg: 'Weclode to yjplan',
				config: {
					value: window.location.href,
					imagePath: './static/biglogo.jpg',
					filter: 'green',
					width: 50,
					height: 50
				},
				downloadButton: false,
				articleTitle :"",
			};
		},
		methods: {
			getOneArticle() {
				api_A
					.getOneArticle({
						topic_id: this.$route.params.topic_id,
						user_id: this.userlogin.user_id || "",
						token: this.userlogin.token || ""
					})
					.then(({
						data
					}) => {
						this.article = data.data;
				
						this.articleTitle = this.article.title
				
						document.title = this.articleTitle;
						this.photo = this.article.avatar;
						this.loading = false;
						let artObj = data.data
						let cont = '';
						let descText = '\n'+artObj.collect_num + '人收藏  ' + artObj.browser_num + '人浏览  ' + artObj.comment_num + '人回复';
						//寻找一个DOM元素内第一个有内容的子元素
						//用正则			
						//判断是否从微信内打开
						let ua = navigator.userAgent.toLowerCase();　　
						let isWeixin = ua.indexOf('micromessenger') != -1;
						if(isWeixin) {
							//通过后台获取 微信接口的信息
							api_U.weChatConfigMsg().then(response => {
								var obj = response.data.data;
								//初始化微信接口
								wx.config({
									debug: false,
									appId: obj.appId,
									timestamp: obj.timestamp,
									nonceStr: obj.nonceStr,
									signature: obj.signature,
									jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
								})

								wx.ready(function() {
									wx.checkJsApi({
										jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
										success: function(res) {
											// 以键值对的形式返回，可用的api值true，不可用为false
											console.log(res)
											// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
										}
									});
									//分享到朋友圈
									wx.onMenuShareTimeline({
									title: artObj.title, // 分享标题	
										link: window.location.href, //分享链接
										imgUrl: 'http://www.iplanfly.com/static/img/logo.822452b.png', //分享图标
										success: function() {
											//确认分享后的回调函数
											WeixinJSBridge.call('closeWindow');
										},
										cancel: function() {
											//确认分享后的回调函数
										},
										fail: function(res) {
											console.log(res)
										}
									})
									//分享给好友
									wx.onMenuShareAppMessage({
										title: artObj.title, // 分享标题
										desc: descText, // 分享描述
										link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
										imgUrl: 'http://www.iplanfly.com/static/img/logo.822452b.png', // 分享图标
										type: '', // 分享类型,music、video或link，不填默认为link
										dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
										success: function() {
											// 用户确认分享后执行的回调函数
											WeixinJSBridge.call('closeWindow');
										},

										cancel: function() {
											// 用户取消分享后执行的回调函数
										}
									});
									//分享到QQ
									wx.onMenuShareQQ({
									title: artObj.title, // 分享标题标题
										desc: descText, // 分享描述
										link: window.location.href, // 分享链接
										imgUrl: 'http://www.iplanfly.com/static/img/logo.822452b.png', // 分享图标
										success: function() {
											// 用户确认分享后执行的回调函数
											WeixinJSBridge.call('closeWindow');
										},
										cancel: function() {
											// 用户取消分享后执行的回调函数
										}
									});
									//分享到腾讯微博
									wx.onMenuShareWeibo({
										title: artObj.title, // 分享标题
										desc: descText, // 分享描述
										link: window.location.href, // 分享链接
										imgUrl: 'http://www.iplanfly.com/static/img/logo.822452b.png', // 分享图标
										success: function() {
											// 用户确认分享后执行的回调函数
											WeixinJSBridge.call('closeWindow');
										},
										cancel: function() {
											// 用户取消分享后执行的回调函数
										}
									});
									//分享到QQ空间
									wx.onMenuShareQZone({
										title: artObj.title, // 分享标题
										desc: descText, // 分享描述
										link: window.location.href, // 分享链接
										imgUrl: 'http://www.iplanfly.com/static/img/logo.822452b.png', // 分享图标
										success: function() {
											// 用户确认分享后执行的回调函数
											WeixinJSBridge.call('closeWindow');
										},
										cancel: function() {
											// 用户取消分享后执行的回调函数
										}
									});
								})
							})　
							return true;　　
						} else {　

							return false;　　
						}
					});
			},
			alertDialog() {
				this.showDialog = true;
				this.$refs.dialog
					.confirm()
					.then(() => {
						this.showDialog = false;
						this.$router.push("/login");
					})
					.catch(() => {
						this.showDialog = false;
					});
				return;
			},
			//收藏和取消收藏
			clickCollect() {
				// 未登录提示！
				if(!this.userlogin) {
					this.alertDialog();
					return;
				}
				api_A
					.topicCollect({
						user_id: this.userlogin.user_id,
						topic_id: this.$route.params.topic_id,
						token: this.userlogin.token
					})
					.then(response => {
						if(response.data.status == 1 && response.data.data.tab == 1) {
							this.$message.success("收藏成功!");
							this.collectsrc = collected;
							this.uncollectsrc = collected;
						} else if(response.data.status == 1 && response.data.data.tab == 2) {
							this.$message.success("取消收藏！");
							this.collectsrc = collect;
							this.uncollectsrc = collect;
						}
					});
			},
			//点赞和取消点赞
			clickapprove() {
				// 未登录提示！
				if(!this.userlogin) {
					this.alertDialog();
					return;
				}
				api_A
					.topicApprove({
						user_id: this.userlogin.user_id,
						topic_id: this.$route.params.topic_id,
						token: this.userlogin.token
					})
					.then(response => {
						if(response.data.status == 1 && response.data.data.tab == 1) {
							this.$message.success("点赞成功!");
							this.unapprovesrc = approved;
							this.approvesrc = approved;
						} else if(response.data.status == 1 && response.data.data.tab == 2) {
							this.$message.success("取消赞!");
							this.approvesrc = approve;
							this.unapprovesrc = approve;
						}
					});
			},
			//展示二维码
			showQRcode() {
				this.QRcodeIsShow = !this.QRcodeIsShow
			}
		}
	};
</script>

<style lang="scss">
	.a_about {
		margin-top: 10px;
	}
	
	.post-time {
		margin: 0 3px;
	}
	
	.post-title {
		font-size: 28px;
		text-align: center;
		font-weight: 400;
		margin: 30px 0 10px;
	}
	
	.post-meta {
		text-align: center;
		color: #999;
		font-size: 14px;
	}
	
	.post-icon {
		margin: 0 3px;
	}
	
	.post-header {
		margin-bottom: 40px;
	}
	
	.more {
		clear: both;
		text-align: center;
		padding: 30px 0;
	}
	
	.more a {
		font-size: 13px;
		letter-spacing: 0.05rem;
		font-weight: 700;
		color: #fff;
		background-color: #dc2929;
		display: inline-block;
		padding: 0.8em 2em;
		cursor: pointer;
		border-radius: 3px;
		transition: 0.2s;
	}
	
	.more a:hover {
		color: #000;
	}
	
	.clear {
		clear: both;
		width: 100%;
	}
	
	.commentPage {
		background: #f7f8fa;
		margin-top: 20px; // width:80%;
		margin: auto;
	}
	
	.box {
		display: flex;
		margin-bottom: 1rem;
		margin-top: 0;
	}
	
	.box .left {
		width: 6%;
		padding: 0 10px;
		padding-left: 0;
	}
	
	.box .right {
		flex: 1;
	}
	
	.box .left,
	.box .right {
		float: left;
		text-align: left;
	}
	
	.avatar {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
	
	.author {
		display: inline-block;
		position: relative;
		top: 10px;
	}
	
	.author img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
	
	.author_name {
		display: inline-block;
		line-height: 25px;
		display: flex;
	}
	
	.date {
		display: block;
		height: 22px;
		line-height: 22px;
		clear: left;
		float: right;
		margin-right: 16px;
	}
	
	.main_content {
		padding-left: 0;
	}
	
	.cursor {
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		color: #333;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 1.5;
		word-wrap: break-word;
	}
	
	.footnote {
		height: 41px;
		width: 100%;
		line-height: 56px;
		border-bottom: 1px solid #dcdcdc;
	}
	
	.footnote span {
		margin-right: 8px;
	}
	
	.dis_name {
		color: rgb(21, 19, 19);
		font-size: 15px;
		font-weight: bold;
		float: left;
		white-space: nowrap;
	}
	
	.comment_contents {
		float: left;
		padding-left: 10px;
		font-size: 14px;
		font-weight: normal;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.box-dis {
		padding: 0 0 1rem 0;
		padding: 10px 10px;
	}
	
	.box-child {
		border: 1px solid #dcdcdc;
		width: 90%;
		margin-left: 9%;
		padding: 10px;
		padding-left: 0;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.border_bottom {
		border-bottom: 1px solid #dcdcdc;
		padding: 10px 10px;
	}
	/* 回复 */
	
	.reply {
		float: right;
		height: 22px;
		line-height: 22px;
	}
	/* 被回复者 */
	
	.reply_name {
		font-weight: normal;
	}
	/* 评论按钮 */
	
	.comment-btn {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
		color: #fff;
		background: #dc2929;
		border-radius: 4px;
		font-size: 14px;
		padding: 6px 12px;
		margin-top: 10px;
		display: inline-block;
		float: right;
	}
	
	.comment-btn:hover,
	.comment-btn-two:hover {
		background: rgba(255, 0, 0, 0.68);
	}
	
	.t_t_box {
		display: none;
	}
	
	.t_t_box.cur {
		display: block;
		overflow: hidden;
		background: #efefef;
		padding: 0 16px;
		margin-left: 1%;
	}
	/* 评论框样式 */
	
	.textarea {
		border: 1px solid #ccc;
		width: 100%;
		height: 90px;
		border-radius: 6px;
		margin-top: 15px;
		padding: 5px;
		font-size: 14px;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		box-sizing: border-box;
	}
	/* 楼中评论框 */
	
	.textarea_two {
		border: 1px solid #ccc;
		width: 100%;
		height: 80px;
		border-radius: 6px;
		margin-top: 15px;
		padding: 5px;
		font-size: 14px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		float: left;
		box-sizing: border-box;
	}
	/* 楼中楼按钮 */
	
	.comment-btn-two {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
		color: #fff;
		background: #dc2929;
		border-radius: 4px;
		font-size: 14px;
		padding: 6px 12px;
		display: inline-block;
		float: right;
		margin: 15px 0;
	}
	/* 点击显示 */
	
	.clickShow {
		color: rgba(230, 22, 22, 0.88);
	}
	
	.clickShow.cur {
		display: none;
	}
	/* 收藏 点赞 */
	
	.someHandel {
		// width :80%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #ccc;
		padding: 20px 0;
	}
	
	.otherHadel {
		width: 180px;
		height: 50px;
		border: 1px solid #dc2929;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-radius: 20px;
		padding: 0 10px;
	}
	
	.otherHadel span {
		height: 30px;
		display: inline-block;
		display: flex;
		justify-content: center;
		line-height: 30px;
		flex: 1;
		color: #dc2929;
		cursor: pointer;
	}
	
	.otherHadel span:first-of-type {
		border-right: 1px solid #dc2929;
	}
	
	.otherHadel span>img {
		width: 25px;
		height: 25px;
		opacity: 0.8;
	}
	/*二维码样式*/
	
	.shareArticle {
		position: relative;
		cursor: default;
	}
	
	.shareArticle>i {
		color: green;
	}
	
	.qrcode {
		position: absolute;
		right: -120px;
		height: -15px;
	}
	
	.qrcode>div>canvas {
		width: 120px!important;
		height: 120px!important;
	}
</style>