<template>
	<view class='condition-page'>
		<view class="page search-page">
			<view class="top-container" >
				<view class="uni-title">{{trainList.label}}:</view>
				<picker @change="bindPickerChange" :value="index" :range="trainList.children" range-key="value">
					<view class="uni-input">{{trainList.children&&trainList.children[index].value}}</view>
				</picker>
								<view class="widthcss" ></view>
				<view class="uni-title">系统:</view>
				<picker @change="bindPickerChangeSys" :value="index" :range="systemList" range-key="value">
					<view class="uni-input">{{systemList[indexSystem].value}}</view>
				</picker>
			</view>
		</view>
		<view class="scene" >
			运营场景信息：
			<view v-for="(item,index) in profileInfo[currentSystem]">
				<radio value="item.id" :checked="item.id===id" @click="handleRadio(item.id)">{{item.value}}</radio>
			</view>
		</view>

			
			<uni-table border stripe emptyText="暂无更多数据" >
			    <!-- 表头行 -->
			    <uni-tr>
			        <uni-th align="center">序号</uni-th>
			        <uni-th align="center">排查项点</uni-th>
			        <uni-th align="center">监测系统</uni-th>
					<uni-th align="center">设备准确性</uni-th>
					<uni-th align="center">监测状态</uni-th>
					<uni-th align="center">检测时间</uni-th>
			    </uni-tr>
			    <!-- 表格数据行 -->
			
			    <uni-tr v-for="(item,index) in stepData[currentSystem+id]">
			        <uni-td>{{item.id}}</uni-td>
			        <uni-td>{{item.faultCode}}</uni-td>
			        <uni-td>{{item.faultName}}</uni-td>
					<uni-td>{{item.faultLevel}}</uni-td>
					<uni-td class="noclick">  <checkbox :checked="item.status"/></uni-td>
					<uni-td>{{formatDateTime(item.startTime,"full")}}</uni-td>
			    </uni-tr>
			
			</uni-table>
	
<!-- 		<view class="charts-box">
		  <qiun-data-charts
			type="line"
			:chartData="faultCurve1"
			background="none"
			:ontouch="true"
		  />
		</view> -->
		<view class="qiun-columns">
		    <view class="qiun-bg-white qiun-title-bar qiun-common-mt qiun-rows" >
		        <view style="flex: 1;qiun-rows;text-align: right; margin-top: 10px;">
		            <button type="default" size="mini" @tap="tapButton('in')">放大</button>
		            <button type="default" size="mini" style="margin-left: 20upx;" @tap="tapButton('out')">缩小</button>
		        </view>
		    </view>
		    <view class="qiun-charts">
		        <canvas canvas-id="canvasCandle" id="canvasCandle" class="charts" disable-scroll=true @touchstart="touchCandle" @touchmove="moveCandle" @touchend="touchEndCandle"></canvas>
		    </view>
		    <view class="qiun-padding qiun-bg-white ">
		        <slider :value="itemCount" min="5" :max="sliderMax" block-color="#f8f8f8" block-size="18" @changing="sliderMove" @change="sliderMove"/>
		    </view>
		</view>
		<view class="timeZone">
		  <qiun-data-charts
			type="line"
			:chartData="timeZone"
			background="none"
			:ontouch="true"
			:opts="timeOpt"				
		  />
		</view>
		<view class="heightcss" ></view>
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
import uniRate from "@/components/uni-rate/uni-rate.vue";
import {faultPoint,faultCurve1,faultCurve2,stepData,sceneData} from './dataMock.js';
 import uCharts from '@/components/u-charts/u-charts-v2.0.0.js';
    var _self;
    var canvaCandle=null;
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
			indexSystem:0,
			faultCurve1:{},
			faultPoint:{},
			timeZone:{},
			timeOpt:{},
			systemList:[{"value":"空调","lable":"HVAC"},{"value":"走行部","lable":"TDS"}],
			currentSystem:'HVAC',
			   profileInfo : {},
			  id:1,
			  stepData:{},
			  cWidth:'',
			  cHeight:'',
			  pixelRatio:1,
			  itemCount:20,//x轴单屏数据密度
			  sliderMax:50,
		}
	},
	created(){
		this.faultCurve1 = faultCurve1;
		this.faultPoint = faultPoint;
		this.timeZone = this.handleTimeZone(faultCurve1, faultPoint.HVAC);
		this.profileInfo = sceneData;
		this.stepData = stepData;
		this.timeOpt={
			"dataLabel": false,
			"legend": {
				"show": false
				},
			"xAxis": {
				"labelCount": 5,
				"disabled": false,
				"itemCount": 60,
				"calibration": true,
				"rotateLabel": true,
				},
			"yAxis": {
				"disabled":true,
				"disableGrid":true,
				},
			"padding": [0,15,15,22],		
		}
		_self = this;
		this.cWidth=uni.upx2px(750);
		this.cHeight=uni.upx2px(500);
		_self.showCandle("canvasCandle",this.faultCurve1);		
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		})
		// 获取热门搜索
		this.getTrain();
	},
	onReachBottom() {		
	},
	methods: {
		showCandle(canvasId,chartData){
		    canvaCandle=new uCharts({
		        $this:_self,
		        canvasId: canvasId,
				context:uni.createCanvasContext(canvasId,_self),
		        type: 'line',
		        fontSize:11,
		        legend:true,
		        background:'#FFFFFF',
		        pixelRatio:_self.pixelRatio,
		        categories: chartData.categories,
		        series: chartData.series,
		        animation: true,
		        enableScroll: true,
				enableMarkLine:true,
		        xAxis: {
		            disableGrid:true,
		            itemCount:_self.itemCount,
		            scrollShow:true,
		            scrollAlign:'right',
					"disabled": true,
		        },
		        yAxis: {
		            //disabled:true
		            gridType:'dash',
		            splitNumber:5,
		            format:(val)=>{return val.toFixed(0)}
		        },
				"legend": {
					"position": "top"
				},
				"padding": [0,15,0,0],
		        width: _self.cWidth*_self.pixelRatio,
		        height: _self.cHeight*_self.pixelRatio,
		        dataLabel: false,
		        dataPointShape: true,
		        extra: {
		            candle:{
		                color:{
		                    upLine:'#f04864',
		                    upFill:'#f04864',
		                    downLine:'#2fc25b',
		                    downFill:'#2fc25b'
		                },
		                average:{
		                    show:true,
		                    name:['MA5','MA10','MA30'],
		                    day:[5,10,30],
		                    color:['#1890ff', '#2fc25b', '#facc14']
		                },
		            },
		            tooltip:{
		                bgColor:'#000000',
		                bgOpacity:0.7,
		                gridType:'dash',
		                dashLength:5,
		                gridColor:'#1890ff',
		                fontColor:'#FFFFFF',
		                horizentalLine:true,
		                xAxisLabel:true,
		                yAxisLabel:false,
		                labelBgColor:'#DFE8FF',
		                labelBgOpacity:0.95,
		                labelAlign:'left',
		                labelFontColor:'#666666'
		            }
		        },
		    });
		},
		touchCandle(e){
		    canvaCandle.scrollStart(e);
		},
		moveCandle(e) {
		    canvaCandle.scroll(e);
		},
		touchEndCandle(e) {
		    canvaCandle.scrollEnd(e);
		    //下面是toolTip事件，如果滚动后不需要显示，可不填写
		    canvaCandle.showToolTip(e, {
		        format: function (item, category) {
		            return category + ' ' + item.name + ':' + item.data 
		        }
		    });
		},
		tapButton(type){
		    let step=5;
		    if(type=='in'){
		        _self.itemCount -= step;
		        if(_self.itemCount<=5){
		            _self.itemCount=5;
		        }
		    }else{
		        _self.itemCount += step;
		        if(_self.itemCount>=_self.sliderMax){
		            _self.itemCount=_self.sliderMax;
		        }
		    }
		    _self.zoomCandle(_self.itemCount);
		},
		sliderMove(e){
		    _self.itemCount=e.detail.value;
		    _self.zoomCandle(e.detail.value);
		},
		zoomCandle(val) {
		    canvaCandle.zoom({
		        itemCount: val
		    });
		},
		 formatDateTime (timeStamp, returnType){
		  var date = new Date(timeStamp);
		  var y = date.getFullYear();
		  var m = date.getMonth() + 1;
		  m = m < 10 ? ('0' + m) : m;
		  var d = date.getDate();
		  d = d < 10 ? ('0' + d) : d;
		  var h = date.getHours();
		  h = h < 10 ? ('0' + h) : h;
		  var minute = date.getMinutes();
		  var second = date.getSeconds();
		  minute = minute < 10 ? ('0' + minute) : minute;
		  second = second < 10 ? ('0' + second) : second;
		  if(returnType == 'full'){return y + '-' + m + '-' + d + ' '+ h +':' + minute + ':' + second;}
		  if(returnType == 'y-m-d'){return y + '-' + m + '-' + d;}
		  if(returnType == 'h:m'){return  h +':' + minute;}
		  if(returnType == 'h:m:s'){return  h +':' + minute +':' + second;}
		  return [y, m, d, h, minute, second];
		},
		handleRadio(id){
			this.id = id;
		},
		bindPickerChangeSys(e){
			this.indexSystem = e.detail.value;
			this.currentSystem = this.systemList[e.detail.value].lable;
			this.faultCurve1 = this.currentSystem==="HVAC"?faultCurve1:faultCurve2;
			this.timeZone = this.handleTimeZone(faultCurve1, this.currentSystem==="HVAC"?faultPoint.HVAC:faultPoint.TDS);
			this.id = 1;
			_self.showCandle("canvasCandle",this.faultCurve1);		
		},
		bindPickerChange: function(e) {		
					this.index = e.detail.value;
					let defaultTrain = this.trainList.children[e.detail.value].value;
					// this.getComfortable(defaultTrain)
				},
		getTrain() {
			let api = "/phm-web-service-gz/line/ganged";
			this.$http.post({api}).then(res => {
				this.trainList = res.result[0];
				uni.hideLoading();
			})
		},
		handleTimeZone(faultCurve,arr){
			 const point = [];
			    faultCurve?.categories?.map(item1 => {
			      const matched = arr.find(item2 => item1 === item2.time);
			      point.push(matched !== undefined ? {faultName:matched.faultName,value:0} : null)
			    });
				let tempObj = {};
				let tempSeries = [];
				tempSeries.push({"data":point,'name':"故障点","color":"#ff0000", "format":"timeTooltip",})
				tempObj.categories = faultCurve.categories;
				tempObj.series = tempSeries;
			    return tempObj;
		}
	}
}
</script>

<style lang="scss">
	.condition-page{
		.qiun-charts {
		    width: 750upx;
		    height: 500upx;
		    background-color: #FFFFFF;
		}
		.charts {
		    width: 750upx;
		    height: 500upx;
		    background-color: #FFFFFF;
		}
		.qiun-textarea{height: 300upx;}
		.charts-box{
			height: 400px;
		}
		.timeZone{
			height: 120px;
		}
		.heightcss{
			height: 30px;
		}
		.widthcss{
			width: 60upx;
		}
		.scene{
			display: flex;
			justify-content: space-around;
			width: 100%;
			height: auto;
			padding: 20upx;
			background-color: rgba(255,255,255, 0.7);
		}
		.noclick{
			pointer-events: none;
		}
		.search-page{
			margin-bottom: 30upx;
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
	}

</style>
