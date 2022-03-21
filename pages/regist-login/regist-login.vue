<template>
	<view class="body">
		<view  class="container">
		<form @submit="submit" >
			<view class="face-wapper">
				<image src="../../static/img/gzLogo.png" class="face"></image>
				<view class="auto-main">智能维保</view>
			</view>
			<view class="title-text">
				城市轨道交通健康管理系统
			</view>
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">登录</button>
		</form>	
		</view>
		
	</view>
</template>

<script>
	class UserInfo {
		id = 'UID' + ((+new Date() + '').slice(6, -1));
		modifySex = 3;
		birthday = '9012-21-21';
		constructor(nickname, faceImage) {
			this.nickname = nickname
			this.faceImage = faceImage
		}
	} 
	export default {
		data() {
			return {
				userList: {}
			}
		},
		methods: {
			submit(e) {
				let {username, password} = e.detail.value
				if(!username || !password) {
					uni.showToast({
						title: '请输入用户名与密码',
						icon: 'none',
						duration: 800
					})
					return
				}
				this.registLogin(username, password)
			},
			registLogin(username, password) {
				// 本地缓存登录
				// 用户信息缓存
			
				// 登录成功跳转到我的
				// uni.showToast({
				// 	title: '登录成功',
				// 	icon: "none",
				// 	duration: 800
				// })
				// uni.switchTab({
				// 	url: '../personal/personal'
				// })
				
				let api = '/phm-web-service-gz/sys/login'
				this.$http.post({api, methods: 'POST', params: {password: password, username: username, captcha: "1231"}}).then(res => {
					  if(res.code== 200){
							uni.setStorageSync("USER", new UserInfo(username, res.token,'http://img5.imgtn.bdimg.com/it/u=2557475870,1515901425&fm=26&gp=0.jpg'))
							uni.switchTab({
								url: '../index/index'
							})
					  }else{
						  uni.showToast({
						  	title:'密码或用户名错误',
							icon: "none",
						  })
					  }			
				})
			},
		}
	}
</script>

<style lang="scss">
.body {
	border-top: solid 1px #DBDBDA;
	padding: 0 40upx;
}
.container{
	margin-top: 450upx;
}

/* 头像 start */
.face-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	
	margin-top: 130upx;
	margin-bottom: 35upx;
	.auto-main{
		font-size: 36px;
		color: #808080;
	}
}

.title-text{
	font-size: 20px;
	text-align: center;
	color: #808080;
	margin-bottom: 85upx;
}

.face {
	width: 150upx;
	height: 150upx;
}
/* 头像 end */

/* 注册登录 start */
.info-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	border-bottom: solid 1px #DBDBDA;
	
	padding-bottom: 20upx;
}

.words-lbl {
	color: #808080;
}

.input {
	width: 500upx;
	margin-left: 40upx;
}

.graywords {
	color: #EAEAEA;
}

/* 注册登录 end */

/* 第三方登录 start */
.third-wapper {
	width: 100%;
	/* 固定底部 */
	/* bottom: 0;
	position: fixed; */
	
	margin-top: 60upx;
	
}

.third-line {
	display: flex;
	flex-direction: row;
	justify-content: center
}

.third-words {
	color: #A9A9A9;
	font-size: 13px;
	
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.single-line {
	padding: 15upx 20upx;
	width: 25%;
	align-items: center;
}

.third-icos-wapper {
	margin-top: 30upx;
	
	display: flex;
	flex-direction: row;
	justify-content: center
}

.third-ico {
	width: 60upx;
	height: 60upx;
}

.third-btn-ico {
	background-image:url(http://122.152.205.72:88/group1/M00/00/05/CpoxxFxFO-yAOjTaAAATCIZEzRU503.png);
	width: 60upx;
	height: 60upx;
	background-color: white;
	background-size: 60upx 60upx;
	background-repeat:no-repeat;
	border:none;
	padding: 0;
}
button::after{
	border: none;
}
/* 第三方登录 end */
</style>
