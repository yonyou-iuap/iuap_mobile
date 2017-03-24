summerready = function(){
	gallery();
	initEvent();
} 


function gallery(){
	
	var list = [
		{
			content: "../img/g1.jpg"
		}, 
		{
			content: "../img/g2.jpg"
		},
		 {
			content: "../img/g3.jpg"
		}
	];
	var islider = new iSlider({
		type: 'pic',
		data: list,
		dom: document.getElementById("iSlider-wrapper"),
		isLooping: true,
		animateType: 'default',
		onslideend: function(idx) {
			$("#nav").find("li").eq(idx).addClass("active").siblings("li").removeClass("active");
		},
	});
	islider.addBtn();
	$("#nav").find("li").on("click", function() {
		$(this).addClass("active").siblings("li").removeClass("active");
		var i = $(this).index();
		islider.slideTo(i);
	});	
	$(islider.wrap).on("click",".islider-btn-outer",function(){
		var i = islider.slideIndex;
		("#nav").find("li").eq(i).addClass("active").siblings("li").removeClass("active");
	});		

}

function initEvent(){
	var camera = $summer.byId("camera");
	var back_label = $summer.byId("back_label");
	var file_btn = $summer.byId("file");
	var download_btn = $summer.byId("download_btn");
	var save_label = $summer.byId("save_label");
	
	//为点击拍照的按钮添加点击事件
	$summer.addEvt(camera, 'click', function(){
		summer.openCamera({
	        callback : "takephoto()"
	    });
	})
	
	//为返回按钮添加点击事件
	$summer.addEvt(back_label, 'click', function(){
		summer.closeWin();
		/*
		summer.closeFrame();//直接关闭的话，返回的上一页面不刷新
		//frame返回的时候怎么刷新
		summer.openFrame({
            "id" : "index",
            "url" : "html/my.html",
            "rect" : {
                "x" : 0,
                "y" : 0,
                "w" : summer.getStorage("width"),
                "h" : summer.getStorage("height")
            }
        });
        */
       	summer.execScript({
		    winId: 'index',
		    frameId: 'my',
		    script: 'checkPhoto();'
		});
	})
	//为上传按钮添加事件
	$summer.addEvt(file, 'click', function(){
		summer.openFileSelector({
   			 "callback" : "mycallback()"
		})
	});
	
	//为下载按钮
	$summer.addEvt(file, 'click', function(){
		summer.download({
            "url" : "http://xxx/xxx/xxx.png", //下载文件的url
            "locate" : "download/image", //下载后文件存放的路径
            "filename" : "newfile.png", //下载后重命名的文件名
            "override" : "true", //下载后是否覆盖同名文件(true和false)
            "callback" : "downloadCallback()" //下载完成之后的回调函数
        })
	});
	
	//为保存按钮添加点击事件
	$summer.addEvt(save_label,"click",function(){
		summer.execScript({
		    winId: 'win',
		    frameId: 'my',
		    script: 'checkPhoto();'
		});
	});
}

function takephoto(sender,args){
	alert(JSON.stringify(args));
	var photo = $summer.byId("photo"); 
	$summer.attr(photo,'src',args.imgPath);
	if(args.imgPath){
		summer.setStorage("imgPath", args.imgPath);
	}
}

function mycallback(sender,args){
	alert('打开文件成功');
	alert(JSON.stringify(args));
	
}

function downloadCallback(){
	//TODO
}