<template>
	<view class="page">
		<swiper :indicator-dots="true" :autoplay="true" :circular="true" class="carousel">
			<swiper-item v-for="item in imgList" :key="item.id">
				<image :src="item.image" class="img"></image>
			</swiper-item>
		</swiper>	
		<view class="model-container" >
			<view class="model">
				模块功能
			</view>
			<view class='componentRow'>
				<view class="bac-white hot" @click='toComform'>
					<view class="wrapper">
						<image src="../../static/img/icos/like.png" class="icon"></image>
						<view class="title">
							车辆舒适
						</view>
					</view>
				</view>	
				<view class="bac-white hot" @click='toFault'>
					<view class="wrapper">
						<image src="../../static/img/icos/timeline.png" class="icon"></image>
						<view class="title">
							故障处理
						</view>
					</view>
				</view>	
			</view>		
			<view class='componentRow'>	
			<view class="bac-white hot" @click='toEnergy'>
			 	<view class="wrapper">
			 		<image src="../../static/img/icos/praise.png" class="icon"></image>
			 		<view class="title">
			 			能耗分析
			 		</view>
			 	</view>
			 </view>
			  <view class="bac-white hot" @click='toCondition'> 
				  <view class="wrapper">
					<image src="../../static/img/icos/praise.png" class="icon"></image>
					<view class="title">
						运营工况
				    </view>
			      </view>
			  </view>
			</view>	
		</view>
		
		<view class="model-container" >
			<view class="model">
				时间模块
			</view>
			<view class="calendar">
				<view>
				    <uni-calendar 
				        :lunar="true"
				        :showMonth='false'
				     />
				</view>
		    </view>	 
		</view>

	</view>
</template>

<script>
import uniRate from "@/components/uni-rate/uni-rate.vue"
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
export default {
	components: {
		uniRate,
		mSearch
	},
	data() {
		return {
			imgList: [{id:1,image:'../../static/img/company1.jpg'},
			{id:2,image:'../../static/img/company2.jpg'},
			{id:3,image:'../../static/img/company3.jpg'}],
			hotList: [],
			trailerList: [],
			likeList: [],
			animationData: {},
			animationDataArr: [],
			currentIndex: null
		}
	},
	onReady() {
		
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		})
		// 初始化动画对象 h5端不支持
		this.animation = uni.createAnimation({})
		this.getComfortable()
	},
	// 下拉监听
	onPullDownRefresh() {
		this.getComfortable()
	},
	onUnload() {
		// 清除动画
	},
	methods: {
		myPlay(id) {
			// #ifndef MP-ALIPAY || MP-TOUTIAO
			let videContext = uni.createVideoContext(id)
			this.trailerList.forEach(v => {
				if(v.id !== id) {
					uni.createVideoContext(v.id).pause()
				}
			})
			// #endif
		},
		toEnergy(){
			uni.navigateTo({
				url: '../energy/energy'
			})
		},	
		toComform(){
			uni.navigateTo({
				url: '../search/search'
			})
		},
		toFault(){
			uni.navigateTo({
				url: '../fault/fault'
			})
		},
		toCondition(){
			uni.navigateTo({
				url: '../condition/condition'
			})
		},
		// 获取电影
		getHotMovie(type) {
			let api = "/index/movie/hot"
			this.$http.post({api, params: {type}}).then(res => {
				if(type === 'superhero') {
					this.hotList = res
				} else {
					this.trailerList = res
				}
			})
		},
		// 获取车辆舒适
		getComfortable() {
			let api = '/phm-web-service-gz/analy/comfort_analysis?lineCode=GZML18&trainCode=18041042'
			this.$http.post({api}).then(res => {
				this.comfortableList = res
				uni.stopPullDownRefresh()
				setTimeout(function () {
					uni.hideLoading();
				}, 500)
			})
		},
		// 跳转电影详情页
		toMovieInfo(id) {
			uni.navigateTo({
				url: '../movie/movie?vid=' + id
			})
		}
		
	}
}
</script>

<style lang="scss">

	.model-container{
		border-radius: 10px;
		width: 92%;
		margin: 20upx auto;
		padding: 10px 0;
		background-color: #fff;
		.model{
			padding-left: 20upx;
			margin-bottom: 10upx;
			color: #004FD9;
			font-weight: bold;
			font-family: Arial, Helvetica, sans-serif;
		}
		.calendar{
		}
		.componentRow{
			display: flex;
			justify-content: space-between;

		}
	}
	.search{
		width: 600upx;
		position: absolute;
		/* #ifndef MP */
		top: 20upx;
		/* #endif */
		/* #ifdef MP */
		top: 0;
		/* #endif */
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		border-bottom: 0upx !important;
	}
	.active{
		.button-item{
			color: #fff !important;
		}
	}
	.carousel{
		width: 100%;
		height: 340upx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	// 热门推荐
	.hot{
		.wrapper{
			display: flex;
			align-items: center;
			justify-items: center;
			padding: 15upx;
			.icon{
				height: 50upx;
				width: 50upx;
			}
			.icon-like{
				width: 45upx;
				height: 45upx;
				padding-top: 5upx;
				padding-left: 5upx;
			}
			.title{
				font-size: 40upx;
				margin-left: 15upx;
				font-weight: 900;
			}
		}
	}
	// 热门推荐内容
	.hot-content{
		width: 100%;
		white-space: nowrap;
		.single-poster{
			display: inline-block;
			margin-left: 20upx;
			line-height: 40upx;
			&:last-child{
				margin-right: 20upx;
			}
			.wrapper{
				display: flex;
				flex-direction: column;
				.poster-image{
					width: 200upx;
					height: 270upx;
				}
				.name{
					font-weight: bold;
					margin-top: 10upx;
					text-align: center;
					width: 200upx;
					font-size: 28upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.rate{
					width: 200upx;
					display: flex;
					align-items: center;
					justify-content: center;
					.text-rate{
						font-size: 24upx;
						color: coral;
					}
				}
			}
		}
	}
	.movie{
		width: 350upx;
		height: 220upx;
	}
	.like-content{
		display: flex;
		padding: 20upx;
		.like-image{
			height: 240upx;
			width: 180upx;
			border-radius: 3%;
		}
		.movie-desc{
			width: 360upx;
			padding: 0upx 20upx;
			line-height: 45upx;
			.title{
				font-size: 32upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.tag{
				font-size: 26upx;
				color: #808080;
			}
		}
		.praise{
			flex: 1;
			border-left: 2px dashed #dbdbda;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.head{
				height: 62upx;
				width: 62upx;
			}
			.click{
				font-size: 28upx;
				color: #feab2a;
			}
			.animation-opacity{
				transition: all .4s;
				font-weight: bold;
				opacity: 0;
			}
			.animation-praise{
				opacity: 1;
				transform: translateY(-150upx);
			}
		}
	}
</style>
