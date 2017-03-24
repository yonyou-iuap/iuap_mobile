summerready = function(){
	//local_data();
	getMaData();
	refresh();
	
} 

var viewModel;
var listgroup;

function refresh(){
	summer.setRefreshHeaderInfo({
        "visible" : true,
        "bgColor" : "#F5F5F5",
        "textColor" : "#4d4d4d",
        "textDown" : "下拉刷新...",
        "textUp" : "松开刷新...",
        "textDo" : "正在刷新数据...",
        "showTime" : true
    }, function(ret,err){
    	refreshHeadData();
    	setTimeout(function(){
    		summer.hideProgress();
    		summer.refreshHeaderLoadDone();
    	},1000);
        
    });
    
    summer.setRefreshFooterInfo({
        "visible" : true,
        "bgColor" : "#F5F5F5",
        "textColor" : "#4d4d4d",
        "textDown" : "上拉刷新...",
        "textUp" : "松开刷新...",
        "textDo" : "正在刷新数据...",
        "showTime" : true
    }, function(ret,err){
    	
    	refreshFootData();
        summer.refreshFooterLoadDone();
    });
    
}

//下拉刷新
function refreshHeadData(){
	var row = {
				"gname" : "优酷土豆",
				"row" : [{
					"company" : "优酷网",
					"slogan" : "世界都在看",
					"img" : "../img/youku.jpg",
					"address" : "中国北京",
					"scope" : "用户视频分享服务"
				}]
			};
	viewModel.datas.unshift(row);
	listgroup.refresh(); 
}

//上拉刷新
function refreshFootData(){
	var row = {
				"gname" : "百度集团",
				"row" : [{
					"company" : "爱奇艺",
					"slogan" : "悦享品质",
					"img" : "../img/aiqiyi.jpg",
					"address" : "中国北京",
					"scope" : "网络视频"
				}, {
					"company" : "百度搜索",
					"slogan" : "百度一下，你就知道",
					"img" : "../img/baidu_search.jpg",
					"address" : "中国北京",
					"scope" : "大数据检索，收集"
				}]
			};
	viewModel.datas.push(row);
	listgroup.refresh();
}	

function getMaData(){
	summer.writeConfig({
        "host" : ma_host,//MA主机地址
        "port" : ma_port //MA主机端口
    });
    
    summer.callAction({
         "viewid" : "com.yonyou.example.TestController", //后台带包名的Controller名
         "action" : "getData", //方法名
         "params" : {a:1,b:2}, //自定义参数
         "callback" : "success()", //请求回来后执行的js方法
         "error" : "fail()" //失败回调的js方法 
    })
}

function success(args){
	alert(JSON.stringify(args));
	var ViewModel = function() {					
		};
		var jsonArray = args.list;
		viewModel = new ViewModel(jsonArray);
		viewModel.datas = ko.observableArray(jsonArray);
		ko.applyBindings(viewModel);
		//构造控件实例
		listgroup = UM.listgroup("#listgroup");		
}

function fail(){
	alert("调用失败");
	alert(JSON.stringify(args));
}

function local_data(){
	//Knockout数据绑定
		var ViewModel = function() {					
		};
		var jsonArray = [{
				"gname" : "优酷土豆",
				"row" : [{
					"company" : "优酷网",
					"slogan" : "世界都在看",
					"img" : "../img/youku.jpg",
					"address" : "中国北京",
					"scope" : "用户视频分享服务"
				}]
			}, {
				"gname" : "百度集团",
				"row" : [{
					"company" : "爱奇艺",
					"slogan" : "悦享品质",
					"img" : "../img/aiqiyi.jpg",
					"address" : "中国北京",
					"scope" : "网络视频"
				}, {
					"company" : "百度搜索",
					"slogan" : "百度一下，你就知道",
					"img" : "../img/baidu_search.jpg",
					"address" : "中国北京",
					"scope" : "大数据检索，收集"
				}]
			}];
		viewModel = new ViewModel(jsonArray);
		viewModel.datas = ko.observableArray(jsonArray);
		ko.applyBindings(viewModel);
		//构造控件实例
		listgroup = UM.listgroup("#listgroup");				
		//添加控件方法
		listgroup.on("pullDown", function(sender) {
			//这是可以编写列表下拉加载逻辑，参数sender即为当前列表实例对象
			/* var item = {
				"gname" : "腾讯",
				"row" : [{
					"company" : "QQ",
					"slogan" : "每一天,乐在沟通",
					"img" : "../img/qq.jpg",
					"address" : "广东深圳",
					"scope" : "新闻信息、互动社区、娱乐产品和基础服务"
				}, {
					"company" : "微信",
					"slogan" : "微信，是一个生活的方式",
					"img" : "../img/weixin.jpg",
					"address" : "广东深圳",
					"scope" : "新闻信息、互动社区、娱乐产品和基础服务"
				}]
			};
			viewModel.datas.unshift(item); */
			sender.refresh(); 
		});
		listgroup.on("pullUp", function(sender) {
			//这是可以编写列表上拉刷新逻辑，参数sender即为当前列表实例对象
			/* var item = {
				"gname" : "360",
				"row" : [{
					"company" : "360安全卫士",
					"slogan" : "功能强、效果好、受用户欢迎",
					"img" : "../img/360weishi.jpg",
					"address" : "北京市",
					"scope" : "互联网安全"
				}, {
					"company" : "360浏览器",
					"slogan" : "新一代安全上网导航",
					"img" : "../img/360liulanqi.jpg",
					"address" : "北京市",
					"scope" : "上网"
				}]
			};
			viewModel.datas.push(item); */
			sender.refresh(); 
		});
		listgroup.on("itemSwipeLeft", function(sender, args) {
			//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			//sender.showItemMenu(args.$target);
		});
		listgroup.on("itemDelete", function(sender, args) {
			//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			/* args.$target.slideUp(500,function(){

			 });*/
		});
		listgroup.on("itemClick", function(sender, args) {
			//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
			// alert("您点击的是第" + (args.groupIndex+1) + "分组,第" + (args.childIndex+1) + "行");
		});
		listgroup.on("tapHold", function() {
			//这里可以处理长按事件;
			//console.log("您刚才长按了列表！");
		});
}