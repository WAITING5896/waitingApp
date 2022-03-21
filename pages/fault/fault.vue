<template>
	<view class="page fault-page">
		<view class="top-container" >
			<view class="uni-title">列车号:
				<picker @change="bindPickerChange" :value="index" :range="trainList" range-key="value">
				<view class="uni-input">{{trainList[index]&&trainList[index].value}}</view>
			</picker>
			</view>
		
			<view class="uni-title">故障系统:
				<picker @change="bindPickerChangeSys" :value="index" :range="systemList" range-key="value">
				<view class="uni-input">{{systemList[indexSystem].value}}</view>
			</picker>
			</view>
		
			<view class="search-button" @click="searchFault(true)" >查询</view>
		</view>
		<view>
				<uni-collapse v-for="(item,index) in faultList" :key="item.id">
		    <uni-collapse-item :show-animation="true" :title="`${(index+1)}.  ${(item.trainCode)}  (${(item.faultName)})`">
		        <view class="detail" >
					<view>
						列车号:{{item.trainCode}}
					</view>
					<view>
						节车号:{{item.coachNo}}
					</view>
					<view>
						故障系统:{{item.systemCode}}
					</view>
					<view>
						故障等级:{{item.faultLevel}}
					</view>
					<view>
						故障名称:{{item.faultName}}
					</view>
					<view>
						发生次数:{{item.happenCount}}
					</view>
					<view>
						故障状态:{{item.faultStatus===1?"未处理":"已处理"}}
					</view>
					<view>
						发生时间:{{item.happenTime}}
					</view>
					<view class="faultpush" @click="faultPush(`${item.trainCode}_${item.faultCode}_${item.happenTime}`)" >
						故障推送
					</view>
				</view>
		    </uni-collapse-item>
		</uni-collapse>
		</view>
	
	</view>
</template>

<script>
export default {
    components: {
    },
	data() {
		return {
			trainList:{},
			index:0,
			indexSystem:0,
			pageNo:1,
			faultList:[],
			systemList:[{"value":"全部"},{"value":"TCMS"},{"value":"BCU"},{"value":"TCU"},{"value":"HVAC"},{"value":"EDCU"},
			{"value":"LCU"},{"value":"ATDS"},{"value":"PIS"},{"value":"BC"},{"value":"FAS"},{"value":"WTD"},
			{"value":"BMS"},{"value":"PMS"}],
			currentTrain:"全部",
			currentSystem:"全部",
			prevTrain:"全部",
			prevSystem:"全部",
			type:'all'
		}
	},
	onLoad() {
		this.getTrain()
		this.getFault()
	},
	// 下拉刷新
	onPullDownRefresh() {
		uni.stopPullDownRefresh()
	},
	// onPageScroll(detail) {
	// 	if(this.scrollTimer) clearTimeout(this.scrollTimer);	
	// },
	// 上拉触底刷新
	onReachBottom(){
		this.pageNo+=1;		
		if(this.type==='all'){
			this.getFault()
		}else if(this.type==='local'){	
			this.searchFault(false)
		}
	},
	methods: {
		faultPush(value){
			if(typeof value === 'string'){
				let param = value.split(' ')[0];
			    let api = `/phm-web-service-gz/fault/fault_code_list?param=${param}`;
				this.$http.post({api}).then(res => {
					if(res.code===200){
							let response = res.result;
							let api = `/phm-web-service-gz/fault/dispose_fault`;
							let faultsArr = [];
							response.map((item,index)=>{
								let tempObj = {};
								tempObj.id = item.id;
								tempObj.faultStatus = 2;
								index ===0 ? tempObj.type=1: tempObj.type=2;
								faultsArr.push(tempObj)
							})
							this.$http.post({api, methods: 'POST', params: {faults:faultsArr}}).then(res=>{
								if(res.code===200){
									uni.showToast({
										title: "推送成功",
										icon: 'success',
										duration: 1800
									})
								this.refreshPage()
								}else{
									uni.showToast({
										title: '网络错误请重试',
										icon: 'error',
										duration: 1800
									})
								}
							})
					}	else{
						uni.showToast({
							title: '网络错误请重试',
							icon: 'none',
							duration: 800
						})
					}			
				})
			}
		},
		bindPickerChange: function(e) {
					this.index = e.detail.value;
					this.prevTrain = this.currentTrain;
					this.currentTrain = this.trainList[e.detail.value].value;			
				},
				bindPickerChangeSys(e){
					this.indexSystem = e.detail.value;
					this.prevSystem = this.currentSystem;
					this.currentSystem = this.systemList[e.detail.value].value;
				},
		getTrain() {
			let api = "/phm-web-service-gz/line/ganged";
			this.$http.post({api}).then(res => {
				this.trainList = res.result[0].children;
				this.trainList.unshift(
					 {label: "全部", value: "全部"}
				)
			})
		},
		getFault(){
			let api = `/phm-web-service-gz/fault/train_fault?lineCode=GZML18&faultType=1
			&pageNo=${this.pageNo}&pageSize=15`;
			this.type='all'
			this.$http.post({api}).then(res => {
				this.faultList = this.faultList.concat(res.result.records);
					uni.hideLoading();
			})
		},
		searchFault(value){
			let api = `/phm-web-service-gz/fault/train_fault?lineCode=GZML18&faultType=1&pageSize=15`;
			if((this.prevSystem!==this.currentSystem||this.prevTrain!==this.currentTrain)&&value){
				this.pageNo = 1;
				this.faultList=[];
			}
			api=api+`&pageNo=${this.pageNo}`;
			this.type='all';
			if(this.currentTrain!=='全部'){
				api=api+`&trainCode=${this.currentTrain}`;
				this.type='local';
			}
			if(this.currentSystem!=='全部'){
				api=api+`&systemCode=${this.currentSystem}`;
				this.type='local';
			}
			this.$http.post({api}).then(res => {
				this.faultList = this.faultList.concat(res.result.records);
					uni.hideLoading();
			})
		},
		refreshPage(){
			this.faultList=[];
			this.pageNo = 1;
		 let api = `/phm-web-service-gz/fault/train_fault?lineCode=GZML18&faultType=1&pageSize=15&pageNo=${this.pageNo}`;	
		 if(this.currentTrain!=='全部'){
		 	api=api+`&trainCode=${this.currentTrain}`;
		 }
		 if(this.currentSystem!=='全部'){
		 	api=api+`&systemCode=${this.currentSystem}`;
		 }
		 this.$http.post({api}).then(res => {
		 	this.faultList = this.faultList.concat(res.result.records);
		 		uni.hideLoading();
		 })
		}
	}
}
</script>

<style lang="scss">
.fault-page{
	height: 100vh;
	.detail{
		margin: 0 25upx 20upx;
		padding: 10upx 15upx;
		background-color: rgba(255,255,255,.8);
		border-radius: 20upx;
		.faultpush{
			float: right;
			width: 200upx;
			height: 60upx;
			border-radius: 20upx;
			background-color: #6BA6FF;
			text-align: center;
			line-height: 60upx;
			margin-top: -55upx;
		}
	}
  .top-container{
  	   display: flex;
  	   border-top: 1px solid rgba(93,97,105,.5);
  	   border-bottom: 1px solid rgba(93,97,105,.5);
  	   padding: 10px 0;
  	   justify-content: center;
  	   .uni-title{
		   display: flex;
		   justify-content: center;
		   align-items: center;
		   padding: 0 10upx;
		   height: 70upx;
		   border: 1px solid #6BA6FF;
  		   margin-right: 20upx;
  	   }
	   .search-button{
		   width: 100upx;
		   height: 70upx;
		   border-radius: 35upx;
		   background-color: #6BA6FF;
		   border: 1px solid #fff;
		   text-align: center;
		   line-height: 70upx;
	   }
  }
}
</style>
