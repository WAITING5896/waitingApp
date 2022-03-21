<template>
	<view class="page search-page">
	<!-- 	<mSearch :show="false" @search="search($event)" placeholder="搜预告" backgroundColor="#C6C6C6" class="search-movie"></mSearch>
		<view class="bac-white hot">
			<view class="wrapper">
				<image src="../../static/img/icos/timeline.png" class="icon-like"></image>
				<view class="title">
					热门搜索
				</view>
			</view>
		</view>
		<view class="like-content bac-white" v-for="item in searchList" :key="item.id" @click="toMovieInfo(item.id)">
			<image :src="item.cover" class="like-image"></image>
			<view class="movie-desc">
				<view class="title">{{item.name}}</view>
				<uni-rate :value="item.score/2" size="14" margin="0" :disabled="true"></uni-rate>
				<view class="tag">{{item.basicInfo}}</view>
				<view class="tag">{{item.releaseDate}}</view>
			</view>
		</view> -->
		<view class="top-container" >
			<view class="uni-title">{{trainList.label}}</view>
			<picker @change="bindPickerChange" :value="index" :range="trainList.children" range-key="value">
				<view class="uni-input">{{trainList.children&&trainList.children[index].value}}</view>
			</picker>
		</view>
		
		<view class='middle-container' >
			<view class='comfort common'>
				<view class='circle'>
					{{ comfortArr[comfortableList.comfortLevel]||'--' }}
				</view>	
				舒适度
			</view>
			<view class='crowd common'>
				<view class='circle'>
					{{crowdArr[comfortableList.crowdedness]||'--'}}
				</view>	
				拥挤度
			</view>
			<view class='air common'>
				<view class='circle'>
					{{airArr[comfortableList.airQuality]||'--'}}
				</view>	
				空气质量
			</view>
			<view class='stable common'>
				<view class='circle'>
					{{stableArr[comfortableList.stability]||'--'}}
				</view>	
				平稳度
			</view>
		</view>
		
		<view>
			<image src="../../static/img/longorange.png" class="poster-image"></image>
		</view>
		
		<view class='bottom-container' >
			<view class="row">
				<view >
					{{comfortableList.speed||'--'}}
				</view>
				运行速度（km/h）
			</view>
		    <view class="row">
				<view >
					{{comfortableList.runningScore||'--'}}
				</view>
			运行品质评分
			</view>
		</view>
		<view class='bottom-container' >
			<view class="row">
				<view >
				    {{comfortableList.miles||'--'}}
				</view>
			运行里程（km）
			</view>
			<view class="row">
				<view >
					{{comfortableList.outTemperature||'--'}}
				</view>
				室外温度（℃）
			</view>	
		</view>
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
import uniRate from "@/components/uni-rate/uni-rate.vue"
export default {
    components: {
        mSearch,
		uniRate
    },
	data() {
		return {
			comfortableList:{},
			trainList:{},
			index:0,
			stableArr:["一级","二级","三级","四级"],
			comfortArr:[100,80,60,40,20],
			crowdArr:['稀疏',"较拥挤","拥挤","超载"],
			airArr:['优','良','轻度污染','中度污染','重度污染','严重污染']		
		}
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		})
		// 获取热门搜索
		this.getTrain()
		this.getComfortable('18001002')
	},
	onReachBottom() {		
	},
	methods: {
		bindPickerChange: function(e) {
					this.index = e.detail.value;
					let defaultTrain = this.trainList.children[e.detail.value].value;
					this.getComfortable(defaultTrain)
				},
		// 获取车辆舒适
		getComfortable(defaultTrain) {
			let api = `/phm-web-service-gz/analy/comfort_analysis?lineCode=GZML18&trainCode=${defaultTrain}`
			this.$http.post({api}).then(res => {
				this.comfortableList = res.result;
					uni.hideLoading();
			})
		},
		getTrain() {
			let api = "/phm-web-service-gz/line/ganged";
			this.$http.post({api}).then(res => {
				this.trainList = res.result[0];
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
.search-page{
   .top-container{
	   display: flex;
	   border-top: 1px solid rgba(93,97,105,.5);
	   border-bottom: 1px solid rgba(93,97,105,.5);
	   padding: 10px 0;
	   justify-content: center;
	   .uni-title{
		   margin-right: 20upx;
	   }
   }
   .middle-container{
	   background-image: url(../../static/img/bluetrain.png);
	   background-repeat: no-repeat;
	   background-size: contain;
	   width: 100%;
	   height: 380upx;
	   position: relative;
	   margin-top: 140upx;
	   .comfort{
		   top:50upx;
		   left: 20upx;
	   }
	   .crowd{
	   		  top:-90upx;
	   		  left: 200upx; 
	   }
	   .air{
	   		top:-90upx;
	   		right: 200upx;    
	   }
	   .stable{
	   		top:50upx;
	   		right: 20upx;   
	   }
	   .common{
		   font-size: 12px;
		   position: absolute;
		   text-align: center;
	   }
	   .circle{
		  width: 100upx;
		  height: 100upx;
		  border-radius: 50%;
		  border: 4px solid #00AF50; 
		  line-height: 100upx;
	   }
   }
   .bottom-container{
	   display: flex;
	   justify-content: space-around;
	   .row{
		   width: 300upx;
		   height: 100upx;
		   border-radius: 20upx;
		   border: 2px solid #6BA6FF;
		   text-align: center;
		   line-height: 100upx;
		   margin-bottom: 100upx;
	   }
   }
   .poster-image{
	   width:100%;
	   height: 50upx;
	   margin-bottom: 45upx;
   }
}
</style>
