summerready = function() {
	getApps();
}
function getApps() {
	alert("1");
	emm.getApps({}, "getAPPSuccess()", "getAPPError()");
}

var results = [];
function getAPPSuccess(ret) {
	alert($summer.jsonToStr(ret));

	var apps = ret.apps;
	alert(apps);
	var appArray = JSON.parse(apps);
	/**
	 *格式化的数据格式：
	 * "[{"appgroup":"第一类","list":[{"appgroupcode":"a66f0d53-9b70-4959-be53-c93621d6841e","lastversion":"","appname":"A","appid":"A09081","appdetail":"null","appicon":"","appgroup":"第一类","isupdate":"true","version":"null"}]},{"appgroup":"第二类","list":[{"appgroupcode":"9668bd7c-080b-4421-be19-1e69d50234cd","lastversion":"","appname":"summerDemo","appid":"HI010101","appdetail":"用友应用中心,管理所有用友研发产品,包括U8、NC、CRM等等。用友产品客户不需要自己去Store搜索查找某个相关产品,通过用友应用中心,可以快速找到自己所关心的产品,并登录到AppStore进行下载。查看某个相关应用的时候,可以看到该应用的详情、评论、等级级别等等,方便使用者操作。","appicon":"http://123.103.9.206:9000/mobem/app/download?filename=%5Capp_packages%5Cloc…000000000000000000002%5C20170301022544489%5CAndroid%5CIconYystoreSmall.png","appgroup":"第二类","isupdate":"true","version":"1.0.1"}]}]"
	 */
	//用来记录在数组中的位置
	var result = {};

	//	var results = [];
	for ( i = 0; i < appArray.length; i++) {
		var current = appArray[i];
		var appgroup = current.appgroup;
		var index = result[appgroup];
		if (index !== undefined) {
			results[index].list.push(current);
		} else {
			var item = {
				'appgroup' : appgroup,
				'list' : [current]
			};
			results.push(item);
			result[appgroup] = results.length - 1;
		}
	}

	doData();

}

function doData() {
	var content2 = $summer.byId('classify-modal');
	var tpl2 = $summer.byId('classify-template').text;
	var tempFn2 = doT.template(tpl2);
	this.allArr = results;
	content2.innerHTML = tempFn2(this.allArr);

	var children = $('.right-list').children('ul');

	var active_left_index = 0,
	    $left_li = $(".left-list li");
	var init2 = function() {
		var content_h = $(window).height() - 120;
		$(".left-list,.right-list").height(content_h);
		$.each($(".right-list-item"), function(i, v) {
			var $count = $(this).find(".count"),
			    count = 0,
			    value;
			$.each($count, function() {
				value = $(this).html();
				if (value != "" && ( value = parseInt(value)) > 0) {
					count += value;
					$(this).siblings(".reduce").addBack().addClass("show");
				}
			})
			if (count > 0) {
				$left_li.eq(i).find(".bubble").html(count);
			}
		})
	}
	init2();

	$left_li.on("click", function() {
		var _this = $(this);
		active_left_index = $(this).index();
		//alert(active_left_index);
		_this.find("a").addClass("active");
		_this.siblings("li").find("a").removeClass("active");
		$(".right-list-item").eq(active_left_index).addClass("active").siblings(".right-list-item").removeClass("active");
	});
	$left_li[0].click();

	$(".btn btn-inline btn-sm").on("click", function() {
		//类别
		//active_left_index;
		//某条记录
		/*
		var rowIndex = $(this).closest('li').index();
		//
		alert(JSON.stringify(goods[active_left_index]['list'][rowIndex]));
		*/
		UM.toast({
            "title" : "Fighting",
            "text" : "持续更新ing",
            "duration" : 3000
        });
	})
	
	
}

function getAPPError(ret) {
	alert($summer.jsonToStr(ret));
}