cordova.define("cordova-plugin-baidustats.BaiduStats", function(require, exports, module) {
//支付
var exec = require('cordova/exec');

var BaiduStatsProxy  =  function(){

};

var methods = {};

methods.init = function(options,callback){


	var cb = typeof(callback)=='function'?callback:function(s){console.dir(arguments);};
	if(typeof(options)!='object')
	{
		cb(-3333,'参数错误！');
		return false;
	}
	var keys = ['appKey','appChannelId','isDebugMode','sendLogTimeout','isLogAppError','enableDeviceMac'];
	var settings =  {};
	Array.prototype.forEach.call(keys,function(n){

		if(options.hasOwnProperty(n) && typeof(options[n])!='function')
		{
			settings[n] =  options[n];
		}else{
			settings[n] = '';
		}
	});
	exec(callback, callback, "BaiduStats", "init", [settings]);
};

methods.sendEvent = function(eventId,eventLabel,userInfo,state){

	userInfo = typeof(userInfo)=='object'?userInfo:{};

	userInfo['id'] = eventId;
	userInfo['label'] = eventLabel;

	var statelist = ['DOING','START','END'];
	if(statelist.indexOf(state)==-1)
	{
		state = statelist[0];
	}

	exec(function(){
		console.dir(arguments);
	}, function(){
		console.error(arguments);
	}, "BaiduStats", "recordEvent", [state,userInfo]);

};

methods.sendEventStart = function(eventId,eventLabel){

	this.sendEvent(eventId,eventLabel,{},'START');

};

methods.sendEventEnd = function(eventId,eventLabel){

	this.sendEvent(eventId,eventLabel,{},'END');
};

methods._sendPage = function(pageName,state){

 	var page = {pageName:pageName};
	exec(function(){
		console.dir(arguments);
	}, function(){
		console.dir(arguments);
	}, "BaiduStats", "recordPage", [state,page]);
};

methods.sendPageStart = function(pageName){

	this._sendPage(pageName,'START');
};

methods.sendPageEnd = function(pageName){
	this._sendPage(pageName,'END');
};

BaiduStatsProxy.prototype = methods;

module.exports = new BaiduStatsProxy();

});
