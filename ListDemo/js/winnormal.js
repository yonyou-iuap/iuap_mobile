summerready = function(){
	loadData();
	initEvent();
} 

function initEvent(){
	var back_btn = $summer.byId("btn");
	$summer.addEvt(back_btn, 'click',function(){
		summer.closeWin();
	})
}

function loadData(){
	//构造控件实例
	var listview = UM.listview("#listview");
	//Knockout绑定
	var ViewModel = function() {
	};
	var jsonArray = [{
		"sender" : "xyz1@yonyou.com",
		"img" : "../img/sender1.png",
		"msgNum" : 0,
		"title": "P2P管理办法征求意见 网贷机构不得从事十二项活动",
		"lastMsg" : "依《办法》，网络借贷（简称网贷，这里也指p2p个体网贷）是指个体和个体之间，通过互联网平台实现的直接借贷。个体包括自然人、法人及其他经济组织。。",
		"lastTime" : "12月24日"
	}, {
		"sender" : "abc2@yonyou.com",
		"img" : "../img/sender2.png",
		"title": "iUAP中心技术分享会2015收官之战-iUAP项目实战分享报名中",
		"msgNum" : 4,
		"lastMsg" : "iUAP中心技术分享会2015收官之战-iUAP项目实战分享报名中（12月29、30日连续两场）",
		"lastTime" : "12月22日"
	}, {
		"sender" : "kk3@yonyou.com",
		"img" : "../img/sender3.png",
		"title": "iUAP中心2015年度重要创新&微创新申报通知",
		"msgNum" : 5,
		"lastMsg" : "大家好，iUAP中心2015年度重要创新&微创新申报即日启动。",
		"lastTime" : "12月21日"
	}]
	var viewModel = new ViewModel();
	viewModel.data = ko.observableArray(jsonArray);
	viewModel.rowCollect = function(data, e) {
		alert("点击收藏！这一行的数据是" + JSON.stringify(data));
		var $row = $(e.target).closest(".um-listview-row");
		listview.hideItemMenu($row);
	}
	ko.applyBindings(viewModel);
	//添加控件方法
	listview.on("pullDown", function(sender) {
		//这是可以编写列表下拉加载逻辑，参数sender即为当前列表实例对象
		var row = {
			"sender" : "king4@yonyou.com",
			"img" : "../img/sender4.png",
			"title": "【用友大学友学堂】Uber、奇虎360、百度等公司大咖来分享经验了！",
			"msgNum" : 2,
			"lastMsg" : "用友大学友学堂年终特别策划,原汁原味的互联网时代企业转型案例,Uber、奇虎360、百度等公司大咖为你直播分享心得",
			"lastTime" : "12月22日",
		};
		for(var i=0;i<4;i++){
			viewModel.data.unshift(row); 
		}
		sender.refresh(); 
	});
	listview.on("pullUp", function(sender) {
		//这是可以编写列表上拉刷新逻辑，参数sender即为当前列表实例对象
		var row = {
			"sender" : "fire5@yonyou.com",
			"img" : "../img/sender5.png",
			"title": "【培训通知】：1月15日某某教授《用户体验、服务设计与智慧的钱》讲座",
			"msgNum" : 6,
			"lastMsg" : "2016年1月15日（周五），有幸邀请到北京科技大学教授，博士生导师，覃京燕教授来用友做一期《用户体验、服务设计与智慧的钱》讲座，内容如下。",
			"lastTime" : "12月22日"
		};
		for(var i=0;i<4;i++){
			viewModel.data.push(row);  
		}
		sender.refresh(); 
	});
	listview.on("itemClick", function(sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有2个属性，即rowIndex(行索引)和$target(目标行的jquery对象)
		alert("您点击了列表第" + (args.rowIndex + 1) + "行！");
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