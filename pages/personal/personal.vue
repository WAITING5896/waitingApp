<template>
	<view class="page page-fill">
		<view class="header">
			<!-- 已登录 -->
			<view v-if="userIsLogin && userInfo" class="user">
				<image src="../../static/img/icos/default-face.png" class="face"  ></image>
				<view class="info-wapper">
					<view class="nickname">
						{{userInfo.nickname}}
					</view>
					<!-- <view class="nav-info">ID：{{userInfo.id}}</view> -->
				</view>
				<view class="set-wapper">
						<image src="../../static/img/icos/settings.png" class="settings" @click="showLogout(!isShowLogout)" ></image>	
				</view>
			</view>
			<!-- 未登录 -->
			<view v-else class="isNoLogin">
				<image src="http://122.152.205.72:88/group1/M00/00/05/CpoxxFw_-5-AFyVyAABLIH8xBTw233.png" class="face"></image>
				<navigator url="../regist-login/regist-login">
					<view class="nickname regist-login">
						<button type="primary" size="mini">登录</button>
					</view>
				</navigator>
			</view>		
		</view>
		
		<view v-if="isShowLogout" class="logout">
			<view class="footer-words" @click="cleanStorage">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
				userInfo: null,
				isShowLogout: false
			}
		},
		onShow() {
			let user = uni.getStorageSync('USER')
			if(user) {
				this.userInfo = user
				this.userIsLogin = true
			}
		},
		methods: {
			showLogout(type){
				this.isShowLogout=type;
			},
			cleanStorage() {
				uni.removeStorageSync('USER')
				uni.showToast({
					title: '清理缓存成功',
					icon: "none",
					duration: 800
				})
				// 跳转重新加载
				uni.reLaunch({
					url: '../personal/personal'
				})
			},
			setAvatar() {
				uni.showActionSheet({
					itemList: [
						'查看我的头像',
						'从相册选择上传'
					],
					success(res) {
						let index = res.tapIndex
						// 预览头像
						uni.previewImage({
							current: this.userInfo.faceImage,
							urls: [this.userInfo.faceImage]
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.page-fill {
	width:100%;
	height: 100%;
}

.footer-words{
	position: fixed;
	bottom: 0upx;
	width: 100%;
	height: 100upx;
	text-align: center;
	background-color: #EDEEF0;
	color: #333333;
	font-size: 16px;
	line-height: 100upx;
}

/* 头部个人信息 start */
.header {
	padding: 40upx 30upx 40upx 30upx;
	background: #092756;
	background: -moz-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%),-moz-linear-gradient(top, rgba(57,173,219,.25) 0%, rgba(42,60,87,.4) 100%), -moz-linear-gradient(-45deg, #670d10 0%, #092756 100%);
	background: -webkit-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), -webkit-linear-gradient(top, rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), -webkit-linear-gradient(-45deg, #670d10 0%,#092756 100%);
	background: -o-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), -o-linear-gradient(top, rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), -o-linear-gradient(-45deg, #670d10 0%,#092756 100%);
	background: -ms-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), -ms-linear-gradient(top, rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), -ms-linear-gradient(-45deg, #670d10 0%,#092756 100%);
	background: -webkit-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), linear-gradient(to bottom, rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(135deg, #670d10 0%,#092756 100%);
	.user{
		display: flex;
		align-items: center;
	}
}

.face {
	width: 120upx;
	height: 120upx;
	border-radius: 50%;
	flex-shrink: 0;
}

.info-wapper {
	margin-left: 40upx;
	display: flex;
	flex-direction: column;
}
.nickname {
	color: #fff;
	font-size: 18px;
	font-weight: bold;
}
.regist-login {
	margin-left: 60upx;
	margin-top: 30upx;
}


.nav-info {
	color: #a38e62;
	font-size: 14px;
	margin-top: 10upx;
}

.set-wapper {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
.settings {
	width: 40upx;
	height: 40upx;
}
/* 头部个人信息 end */

/* 中间的 NEXT 大LOGO start */
.body {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.big-next {
	font-size: 160upx;
	color: #F7F7F7;
}
.isNoLogin{
	display: flex;
}
/* 中间的 NEXT 大LOGO end */
</style>
