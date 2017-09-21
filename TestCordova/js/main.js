//here is your code...
summerready = function () {
	$summer.byId("content").innerHTML += "<h3 style='text-align: center'>Hello friends, welcome to touch the summer frame!</h3><h3 style='text-align: center'>The frame update at " +(new Date()).toLocaleString()+"</h3>";

   	
};

function getVersion(){
	
	cordova.getAppVersion.getVersionNumber(function (version) {
   		alert("当前APP版本为："+version);
   	});
   	
	
}