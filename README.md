# plan

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```




## 项目结构重构中...

```
├─build                       // webpack配置文件
├─config                      // 项目开发环境配置相关代码
├─dist                        // 项目打包目录
├─src                         // 源码目录
│  ├─api                      //  axios请求接口
      ├─article.js            
	  ├─index.js
	  ├─konwledge.js
	  ├─my.js
	  ├─user.js                  // axios请求接口
│  ├─assets                     // 资源
│  │  ├─css             
│  │  └─images             
│  ├─components               //  ui组件
│  │  ├─Dialog               // 弹出框
│  ├─pages                    // 业务组件
│  │  ├─Article               // 文章组件
│  │  ├─usercenter            // 用户中心
│  ├─router                   // vue-router路由管理
│  └─store                    // vuex状态管理
└─static
```









```
mavonEditor [API](https://github.com/hinesboy/mavonEditor#events)
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 2021-10-18 微信登录记录
	1. 根据微信资源中心[api](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN)
		提供一个链接，链接url里包括这些信息
		| 参数      | 是否必须           | 描述  |
		| ------------- |:-------------:| -----:|
		| appid   		|  是 	  |	 应用唯一标识；每个公众号都有的 |
		| redirect_uri  |  是         |  重定向的url地址；必须在微信公众号的安全域下，且需要进行urlEncode加密 |
		| response_type |  是         |  填code |
		| scope    		|  是 	  | 应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可 	|
		| state			|  否	  |	用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验	|
	本来想跳到我们的http://web.li-shang-bin.com/#/login页面的；但发现微信识别不了#
	此处我们的项目填写的url是https://open.weixin.qq.com/connect/qrconnect?appid=wxc649fbdaa41fc636&scope=snsapi_login&redirect_uri=http%3a%2f%2fweb.li-shang-bin.com&login_type=jssdk&self_redirect=default"
	appid:wxc649fbdaa41fc636
	redirect_uri:http://web.li-shang-bin.com;
	用户点击此链接后会跳到一个二维码界面
	2. 用户扫面二维码界面并点击确定后则跳到redirec_uri定义的url里并且把code（后台可以通过code获取用户的openid及昵称等信息）带过来形成
		redirec_uri?code=********&state=***;此处我们还没用到state只用了code
	3. 在此页面通过解析页面的url获取到code
	```javascript
	//可以用此方法解析url
	getUrlVars(url) {
				var hash;
				var myJson = {};
				var hashes = url.slice(url.indexOf('?') + 1).split('&');
				var arr=[];
				for(var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
					if(myJson.hasOwnProperty(hash[0])){
						myJson[hash[0]]=myJson[hash[0]]+','+hash[1]
					}else{
						myJson[hash[0]] = hash[1]						
					}
				}
				return myJson;
			}
	```	
	将code传给后台让他获取用户的信息获取信息后后台分以下几步
		1. 获取了用户的openid；从数据根据openid查找看是否有此用户；
			如果没有没有返回给前端false(0)；让其跳到注册页面，并把openid，等信息页传递过去；前端存在缓存里
				此时用户注册会在基础注册上增加openid等信息；完成用户和微信的绑定；然后删除缓存
			如果有，将查询到的用户信息返回给前端，前端完成登录
		2. 跳到个人信息页的问题；
			开始用的是路由跳转router.push的方法跳转到用户信息页；但发现此方法会在url?code=****&state=后面追加相关路由；
			然后改用window.location.href=‘你想跳的页面url’；但也还是在后面继续追加；具体原因依然不明
			现在使用的是window.open('你想跳的页面url','_self')使其跳转
	至此登录完成；
				
		
commit==>this.$store.commit();
router==>window.open();
JSON.parse
res.data==>data.data

# 2017-11-9
> 编辑器上传图片
> 1. 初始化一个数组用于存储图片文件额信息 imgArr=[{'文件名':{文件信息}}]
> 2. 用户选择图片触发编辑器$imgAdd事件；获取到选择的文件的信息；判断其大小是否在30M以内；如果超过使用编辑器的
> $vm.$refs.toolbar_left.$imgDelByFilename(filename)方法主动删除照片
> 如果大小在30M以内那么用数组中添加此次的文件信息
> 3. 用户点击发布文章时首先便利图片数组将图片上传值服务器
> 上传成功后使用$vm.$imgUpdateByUrl()方法将base64的图片信息更换为网络路劲
> 使用$vm.$imglst2Url()将markdown里的路径也更换为网络路径
> 当上传完最后一张成功后，触发发布文章事件
> 4. 在用户没用通过上传图片按钮里的删除图片进行删除图片而是直接删除markdown文本删除图片时；所以需要在点击发布文章时再次确定markdown文本内是否有文件名的信息；因此还需将imgArr遍历上传图片是还需确认其key值是否存在md_content中
> for(let i=0;i<imgArr.length;i++){
> 		for(var k in imgArr[i]){
> 			if(md_content.indexOf(k)>-1){
> 			}
> 		}
> }
# 解决无法使用编辑器的methods方法
首相在mavon-ditor标签上进行ref引用  如ref="editor"
那么此组件挂载到this.$refs上
通过this.$refs.editor即可访问相关方法
