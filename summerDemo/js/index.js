var preFrame,
    curFrame;
var frameArr = [];

summerready = function(){
	
    var item0 = $summer.byId("item0");
    var item1 = $summer.byId("item1");
    var item2 = $summer.byId("item2");
    var item3 = $summer.byId("item3");
    $summer.addEvt(item0,'click',function(){
    	openTab('main');
    });
    $summer.addEvt(item1,'click',function(){
    	openTab('application');
    });
    $summer.addEvt(item2,'click',function(){
    	openTab('address');
    });
    $summer.addEvt(item3,'click',function(){
    	openTab('my');
    });
	openTab('main')
}

function openTab(type){
	//var y = $summer.offset($summer.byId('header')).h;
	var width = $summer.offset(document.getElementsByTagName("body")[0]).w;
	var height = $summer.offset($summer.byId('main')).h;
	var headerHeight = $summer.offset($summer.byId('header')).h;
	summer.setStorage("width", width);
	summer.setStorage("height", height);
	type = type || 'main'
	preFrame = curFrame;
	curFrame = type;
	if (preFrame !== curFrame) {
		if (isOpend(curFrame)) {
			summer.setFrameAttr({
				"id" : preFrame,
				"hidden" : true
			}, null, null);
			summer.setFrameAttr({
				"id" : curFrame,
				"hidden" : false
			}, null, null);
		} else {
			summer.openFrame({
				name : curFrame,
				url : weburl+'html/' + curFrame + '.html',
				bounces : true,
				rect : {
					x : 0,
					y : headerHeight,
					w : width,
					h : height
				},
				pageParam:{
					'a':1
				}
			});
			frameArr.push(curFrame);
			if (preFrame) {
				summer.setFrameAttr({
					"id" : preFrame,
					"hidden" : true
				}, null, null);
			}
		}

	}
}

function isOpend(type) {
	for (var i = 0; i < frameArr.length; i++) {
		if (frameArr[i] === type) {
			return true;
		}
	}
	return false;
}