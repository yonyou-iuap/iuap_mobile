summerready = function(){
	loadData();
	initEvent();
} 

function initEvent(){
	var back_btn = $summer.byId("back_btn");
	$summer.addEvt(back_btn, 'click', function(){
		summer.closeWin();
	})
}

function loadData(){
	//Knockout数据绑定
	var ViewModel = function () {          
	};
	var jsonArray = [{
		"gname": "游戏娱乐", "row": [
			{
				"name": "动听音乐",
				"descri": "这是一段关于应用的描述,可以点击进入查看详情",
				"img": "../img/music.png",
				"update": 1,
				"company": "亚太xxxx公司",
				"downloads": 2200
			}
		]
		}, {
			"gname": "生活应用", "row": [
				{
					"name": "天气预报",
					"descri": "这是一段关于应用的描述,可以点击进入查看详情",
					"img": "../img/weather.png",
					"update": 2,
					"company": "北美xxxx公司",
					"downloads": 4440
				}]
		}, {
			"gname": "其他", "row": [
				{
					"name": "应用商店",
					"descri": "这是一段关于应用的描述,可以点击进入查看详情",
					"img": "../img/app_store.png",
					"update": 3,
					"company": "中东xxxx公司",
					"downloads": 2200
				}]
		}];
	var viewModel = new ViewModel();
	viewModel.datas = ko.observableArray(jsonArray);
	ko.applyBindings(viewModel);
	//构造控件实例
	var listgroup = UM.listgroup("#listgroup");			
	//添加控件方法
	listgroup.on("pullDown", function (sender) {
		//这是可以编写列表下拉加载逻辑，参数sender即为当前列表实例对象
		 var item = {
			"gname": "新增类别",
			"row": [{
				"name": "应用名称一",
				"img": "../img/app_default1.png",
				"descri": "这是一段关于应用的描述",
				"update": 10,
				"company": "欧洲xxxx公司",
				"downloads": 9000
			}]
		};
		for(var i=0;i<4;i++){
			viewModel.datas.unshift(item); 
		}
		sender.refresh(); 
	});
	listgroup.on("pullUp", function (sender) {
		//这是可以编写列表上拉刷新逻辑，参数sender即为当前列表实例对象
		 var item = {
			"gname": "新增类别",
			"row": [{
				"name": "应用名称二",
				"img": "../img/app_default2.png",
				"descri": "这是一段关于应用的描述",
				"update": 15,
				"company": "非洲xxxx公司",
				"downloads": 2300
			}]
		};
		
		for(var i=0;i<4;i++){
			viewModel.datas.push(item);  
		}
		sender.refresh(); 
	});
	listgroup.on("itemSwipeLeft", function (sender, args) {
		//这里可以处理行左滑事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
		//sender.showItemMenu(args.$target);
	});
	listgroup.on("itemDelete", function (sender, args) {
		//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
		/*args.$target.slideUp(500,function(){

		 });*/
	});
	listgroup.on("itemClick", function (sender, args) {
		//这里可以处理行点击事件，参数sender即为当前列表实例对象，args对象有4个属性，即groupIndex(当前行所在分组的索引),childIndex(当前行在所在分组内的索引),rowIndex(当前行在整个列表中的行索引),$target(目标行的jquery对象)
		// alert("您点击的是第" + (args.groupIndex+1) + "分组,第" + (args.childIndex+1) + "行");
	});
	listgroup.on("tapHold", function () {
		//这里可以处理长按事件;
		//console.log("您刚才长按了列表！");
	});
}