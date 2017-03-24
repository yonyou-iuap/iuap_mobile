

summerready = function(){
	/*
	openTab("main");
	var item0 = $summer.byId("item0");
	var item1 = $summer.byId("item1");
	var item2 = $summer.byId("item2");
	$summer.addEvt(item0, 'click', function(){
		openTab("main");
	});
	$summer.addEvt(item1, 'click', function(){
		openTab("framegroup");
	});
	$summer.addEvt(item2, 'click', function(){
		openTab("framenormal");
	});
	*/
	
	var btn0 = $summer.byId("btn0");
	var btn1 = $summer.byId("btn1");
	var btn2 = $summer.byId("btn2");
	var btn3 = $summer.byId("btn3");
	$summer.addEvt(btn0, 'click', function(){
		summer.openWin({
            "id" : "wingroup",
            "url" : "html/wingroup.html"
        });
	});
	$summer.addEvt(btn1, 'click', function(){
		summer.openWin({
            "id" : "winnormal",
            "url" : "html/winnormal.html"
        });
	});
	$summer.addEvt(btn2, 'click', function(){
		summer.openWin({
            "id" : "common",
            "url" : "html/common.html",
            "pageParam":{
            	"sign":"framegroup"
            }
        });
	});
	$summer.addEvt(btn3, 'click', function(){
		summer.openWin({
            "id" : "common",
            "url" : "html/common.html",
            "pageParam":{
            	"sign":"framenormal"
            }
        });
	});
}

function openTab(type){
	var top = $summer.offset($summer.byId('header')).h;
	var bottom = $summer.offset($summer.byId('footer')).h;
    summer.openFrame({
        id: type,
        url: 'html/'+type+'.html',
        bounces: true,
        position: {
            top: top,
			bottom: bottom,
            left: 0,
            right: 0
        }
    });
}