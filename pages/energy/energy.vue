<template>
	<view class="charts-box">
	<view class="top-container" >
		<view class='train'>
			<view class="uni-title">列车号</view>
			<picker @change="bindPickerChange" :value="index" :range="trainList" range-key="value">
				<view class="uni-input">{{trainList.length>0?trainList[index].value:'no data'}}</view>
			</picker>
		</view>	
		<picker @change="bindPickerChangeDirection" :value="directionIndex" :range="direction" range-key="value">
			<view class="uni-input direction">{{direction[directionIndex].value}}</view>
		</picker>
	</view>
	<view class='text' >载荷折线图：</view>
	<view class='heightcss' ><qiun-data-charts type="line" :chartData="chartDataLoad" :ontouch='true' :opts="zoneStyle"/></view>	
	<view class='text' >能耗折线图：</view>
		<view class='heightcss' ><qiun-data-charts type="column" :chartData="chartDataEnergy" :ontouch='true' :opts="zoneStyle" /></view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				trainList:[],
				index:0,
				direction:[{value:'上行'},{value:'下行'}],
				directionIndex:0,
				defaultTrain:'',
				defaultDirection:1,
				chartDataLoad:{},
				chartDataEnergy:{},
				zoneStyle:{}
			}
		},
		onLoad() {
			this.getTrain();
		},
		created() {
			this.zoneStyle={
				"yAxis": {
					"disabled":false,
					"disableGrid":false,
					},
					"enableScroll":true,
					"xAxis": {
						itemCount:3,
					}			
			}
		},
		methods:{
			bindPickerChange: function(e) {
						this.index = e.detail.value;
						this.defaultTrain = this.trainList[e.detail.value].value;
						this.getload()
					},
			bindPickerChangeDirection(e){
				this.directionIndex = e.detail.value;
				this.defaultDirection = e.detail.value+1;
				this.getload()
			},
			getTrain() {
				let api = "/phm-web-service-gz/line/ganged";
				this.$http.post({api}).then(res => {
					this.trainList = res.result[0].children;
					this.defaultTrain = res.result[0].children[0].value;
					this.getload()
				})
			},
			getload(){
			 let api = `/phm-web-service-gz/energy/energy_distribution?lineCode=GZML18&trainCode=${this.defaultTrain}&direction=${this.defaultDirection}`;
			 this.$http.post({api}).then(res => {
				let response = res.result;
			 	let chartDataLoadTemp = {};
			 	let chartDataEnergyTemp = {};
			 	chartDataLoadTemp.categories = response.sites;
			 	chartDataEnergyTemp.categories = response.sites;			 	 
			 	 let loadObj = {};
			 	 let loadArr = [];
			 	 const loadTemp = response.datas[0];
			 	 loadObj.name = loadTemp.name;
			 	 loadObj.data = loadTemp.value;
			 	 loadArr.push(loadObj);
			 	 chartDataLoadTemp.series = loadArr;		 	 
			 	 let energyObj = {};
			 	 let energyArr = [];
			 	 const energyTemp = response.datas[1];				   
			 	 energyObj.name = energyTemp.name;
			 	 energyObj.data = energyTemp.value;
			 	 energyArr.push(energyObj)
			 	 chartDataEnergyTemp.series = energyArr;
			 	 
			 	 this.chartDataLoad = chartDataLoadTemp;
			 	 this.chartDataEnergy = chartDataEnergyTemp;
			 })	
			}
		}
	}
</script>

<style lang="scss">
	.charts-box{
		.top-container{
			   display: flex;
			   border-top: 1px solid rgba(93,97,105,.5);
			   border-bottom: 1px solid rgba(93,97,105,.5);
			   padding: 10px 0;
			   margin-bottom: 50upx;
			   justify-content: space-around;
			   .uni-title{
				   margin-right: 20upx;
			   }
			   .train{
				   display: flex;
			   }
		}	
		.heightcss{
			height: 300px;
		}
		.text{
			font-size: 36upx;
			font-weight: bold;
			margin-left: 20upx;
			margin-bottom: 20upx;
		}
	}
	
</style>
