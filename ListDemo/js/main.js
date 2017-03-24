//here is your code...
summerready = function () {
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
            "url" : "html/common.html"
        });
	});
	$summer.addEvt(btn3, 'click', function(){
		summer.openWin({
            "id" : "common",
            "url" : "html/common.html"
        });
	});
};