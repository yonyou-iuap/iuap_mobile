summerready = function(){
	loadData();
	summer.setRefreshHeaderInfo({
        "visible" : true,
        "bgColor" : "#F5F5F5",
        "textColor" : "#4d4d4d",
        "textDown" : "下拉刷新...",
        "textUp" : "松开刷新...",
        "textDo" : "正在刷新数据...",
        "showTime" : true
    }, function(ret,err){
    	refreshNewData();
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
     	 refreshAddData();
     	 setTimeout(function(){
     	 	summer.hideProgress();
     	 	summer.refreshFooterLoadDone();	
     	 },1000);
     });
}


var viewModel;
var listview;

function refreshNewData(){
	var row = {
		"sender" : "下拉刷新添加数据",
		"img" : "../img/org1.png",
		"msgNum" : 0,
		"lastMsg" : "因无线网络后台故障，暂停服务。",
		"lastTime" : "15:24"
	}
	for(var i=0;i<4;i++){
		viewModel.data.unshift(row); 
	};
	listview.refresh();
}

function refreshAddData(){
	var row = {
		"sender" : "集团人力资源部",
		"img" : "../img/org3.png",
		"msgNum" : 5,
		"lastMsg" : "各位同仁，跟据国务院发布的放假安排，2016年元旦、春节放假安排如下。",
		"lastTime" : "12:21"
	};
	for(var i=0;i<4;i++){
		viewModel.data.push(row); 
	};
	listview.refresh();
}

var listview;
var viewModel;
function loadData(){
	//构造控件实例
	listview = UM.listview("#listview");
	//Knockout绑定
	var ViewModel = function() {
	};
	var jsonArray = [{
		"sender" : "集团IT服务台",
		"img" : "../img/org1.png",
		"msgNum" : 0,
		"lastMsg" : "因无线网络后台故障，暂停服务。",
		"lastTime" : "15:24"
	}, {
		"sender" : "集团行政部",
		"img" : "../img/org2.png",
		"msgNum" : 4,
		"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
		"lastTime" : "12:40"
	}, {
		"sender" : "集团人力资源部",
		"img" : "../img/org3.png",
		"msgNum" : 5,
		"lastMsg" : "各位同仁，跟据国务院发布的放假安排，2016年元旦、春节放假安排如下。",
		"lastTime" : "12:21"
	}];
	for(var i=0,len=2;i<len;i++){
		jsonArray.push({
			"sender" : "集团行政部",
			"img" : "../img/b"+i%3+".png",
			"msgNum" : i%5,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "12:40"
		});
    }
	viewModel = new ViewModel();
	viewModel.data = ko.observableArray(jsonArray);
	ko.applyBindings(viewModel);
	//添加控件方法
	/*listview.on("pullDown", function(sender) {
		//这是可以编写列表下拉加载逻辑，参数sender即为当前列表实例对象
		var row = {
			"sender" : "集团技术部",
			"img" : "../img/org4.png",
			"msgNum" : 2,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "16:22",
		};
		viewModel.data.unshift(row);
		sender.refresh();
	});*/
	/*listview.on("pullUp", function(sender) {
		//这是可以编写列表上拉刷新逻辑，参数sender即为当前列表实例对象
		var row = {
			"sender" : "集团咨询部",
			"img" : "../img/org5.png",
			"msgNum" : 6,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "12月22日"
		};
		viewModel.data.push(row);
		sender.refresh();
	});*/
	listview.on("itemClick", function(sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		//alert("您点击了列表第" + (args.rowIndex + 1) + "行！");
	});
	listview.on("itemDelete", function(sender, args) {
		//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		var item = viewModel.data()[args.rowIndex];
		alert("您点击了删除按钮!这一行的数据是" + JSON.stringify(item));
		/* args.$target.slideUp(500, function() {
		 viewModel.data.remove(item);
		 }); */
	});
	listview.on("itemSwipeLeft", function(sender, args) {
		//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		/*sender.showItemMenu(args.$target);*/

	});
	listview.on("tapHold", function() {
		//这里可以处理长按事件
		/*console.log("您长按了列表！");*/
	});
}