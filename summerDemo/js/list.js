summerready = function() {
	//getLocalData();
	getMaData();
	refresh();
}
function refresh() {
	//下拉刷新flag为0，上拉刷新为1
	summer.setRefreshHeaderInfo({
		"visible" : true,
		"bgColor" : "#F5F5F5",
		"textColor" : "#4d4d4d",
		"textDown" : "下拉刷新...",
		"textUp" : "松开刷新...",
		"textDo" : "正在刷新数据...",
		"showTime" : true
	}, function(ret, err) {
		flag = 0;
		refreshHeadData();
		setTimeout(function() {
			summer.hideProgress();
			summer.refreshHeaderLoadDone();
		}, 1000)

	});

	summer.setRefreshFooterInfo({
		"visible" : true,
		"bgColor" : "#F5F5F5",
		"textColor" : "#4d4d4d",
		"textDown" : "上拉刷新...",
		"textUp" : "松开刷新...",
		"textDo" : "正在刷新数据...",
		"showTime" : true
	}, function(ret, err) {
		flag = 1;
		refreshFootData();
		setTimeout(function() {
			summer.hideProgress();
			summer.refreshFooterLoadDone();
		}, 1000)

	});
}

function refreshHeadData() {

	for (var i = 0,
	    len = 5; i < len; i++) {
		var row = {
			"sender" : "集团行政部",
			"img" : "../img/b" + i % 3 + ".png",
			"msgNum" : i % 5,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "12:40"
		};
		viewModel.data.unshift(row);
	}

	listview.refresh();

}

function refreshFootData() {
	for (var i = 0,
	    len = 5; i < len; i++) {
		var row = {
			"sender" : "集团咨询部",
			"img" : "../img/b" + i % 3 + ".png",
			"msgNum" : i % 5,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "12:40"
		};
		viewModel.data.push(row);
	}

	listview.refresh();
}

function mycallback(args) {
	alert(JSON.stringify(args));
	if (flag == 0) {

	} else if (flag == 1) {

	}
}

function myerror(args) {
	alert(JSON.stringify(args));
}

function getMaData() {
	summer.writeConfig({
		"host" : ma_host, //MA主机地址
		"port" : ma_port //MA主机端口
	});

	summer.callAction({
		"viewid" : "com.yonyou.example.TestController", //后台带包名的Controller名
		"action" : "getData", //方法名
		"params" : {
			a : 1,
			b : 2,
			"appid" : "summerDemo"
		}, //自定义参数
		"callback" : "success()", //请求回来后执行的js方法
		"error" : "fail()" //失败回调的js方法
	})
}

var listview;
var viewModel;
var flag = 0;
function success(args) {
	alert(JSON.stringify(args));
	listview = UM.listview("#listview");
	var ViewModel = function() {
	};
	var jsonArray = args.list;
	viewModel = new ViewModel();
	viewModel.data = ko.observableArray(jsonArray);
	ko.applyBindings(viewModel);
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
}

function fail(args) {
	alert(JSON.stringify(args));
}

function getLocalData() {
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
	for (var i = 0,
	    len = 5; i < len; i++) {
		jsonArray.push({
			"sender" : "集团行政部",
			"img" : "../img/b" + i % 3 + ".png",
			"msgNum" : i % 5,
			"lastMsg" : "各位同仁，2015年4季度油料报销标准5.85元/升。",
			"lastTime" : "12:40"
		});
	}
	viewModel = {};
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