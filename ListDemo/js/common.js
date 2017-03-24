summerready = function(){
	initEvent();
}

function initEvent(){
	var sign = summer.pageParam.sign;
	alert(sign);
	var item0 = $summer.byId("item0");
	var item1 = $summer.byId("item1");
	var close_btn = $summer.byId("close_btn");
	if(sign=="framegroup"){
		$summer.addCls(item0,"active");
		$summer.removeCls(item1,"active");
		openTab("framegroup");
	}else{
		$("#item0").removeClass("active").siblings().addClass("active");
		openTab("framenormal");
	}
	$summer.addEvt(item0, 'click', function(){
		openTab("framegroup");
	})
	$summer.addEvt(item1, 'click', function(){
		openTab("framenormal");
	})
	$summer.addEvt(close_btn, 'click', function(){
		summer.closeWin();
	})
}

function openTab(type){
	var top = $summer.offset($summer.byId("header")).h;
	var bottom = $summer.offset($summer.byId("footer")).h;
	summer.openFrame({
        "id" : type,
        "url" : "html/"+type+".html",
        "position" : {
            "left" :0,
            "right" : 0,
            "top" : top,
            "bottom" : bottom
        }
    });
}