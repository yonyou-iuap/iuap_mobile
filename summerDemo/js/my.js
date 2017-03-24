summerready = function(){
	window.update = $summer.byId("update");
	alert("pageParam传递的值为"+summer.pageParam.a);
	
	$service.writeConfig({
        "host" : ma_host,//向configure中写入host键值
        "port" : ma_port//向configure中写入port键值
    })
    
	initialEvent();
	
	
}

function initialEvent(){
	//获取登录用户名在我的界面显示
	var username = summer.getStorage("username");
	var myname = $summer.byId("myname");
	window.image = $summer.byId("image");
	//点我试试标签
	var download_label = $summer.byId("download_label");
	//email标签
	var email_label = $summer.byId("email_label");
	//打开照相页面标签
	var add_label = $summer.byId("add_label");
	//生成二维码标签
	var generate_code = $summer.byId("generate_code");
	//二维码显示图片
	var code_img = $summer.byId("code_img");
	//跳转到新页面按钮
	var button = $summer.byId("btn0");
	if(username){
		$summer.text(myname, username);
		$summer.text(email_label, username+"@yonyou.com");
	}else{
		alert("未从缓存中获取到username");
	}
	
	//跳转事件
	$summer.addEvt(button, 'click',function(){
		/*
		summer.openWin({
            "id" : "test",
            "url" : weburl+"html/test.html"
        });
       */
	});
	//为版本更新标签添加点击事件
	$summer.addEvt(update, 'click',function(){
		UM.toast({
            "title" : "当前版本：",
            "text" : summer.getVersion().versionCode,
            "duration" : 3000
        });
	});
	
	//为头像添加 点击事件，点击图像打开相册
	$summer.addEvt(image, 'click', function(){
		
		UM.actionsheet({
			title: '请选择：',
			items: ['拍照', '选取本地图片'],
			callbacks: [function () {
				alert('拍照');
				//打开新页面
				/*
				summer.openWin({
		            "id" : "profile",
		            "url" : weburl+"html/image.html",
		            "reload":true
		        });
		        */
				summer.openCamera({
			        callback : "takephoto()"
			    });
			}, function () {
				alert('选取本地图片');
				summer.openPhotoAlbum({
		               "callback" : function(sender,args){
		                     alert(args.imgPath);
		                     //如果选择了相册中的图片就会在返回图片路径
		                     albumPhoto = args.imgPath;
		                     if(albumPhoto){
		                     	$summer.attr(image,'src',albumPhoto);
		                     }
		                } 
		        });
			}]
		});
	

	})
	

	
	
	
	
	//下载头像
	$summer.addEvt(download_label, 'click', function(){
	
	alert("1");
		summer.download({
		    "url" : down_url,
		    "locate" : "download/image",
		    "filename" : "newfile.png",
		    "override" : "true",
		    "callback" : "downloadCallBack()"
		})
	})
	
	//生成二维码点击事件
	$summer.addEvt(generate_code, 'click', function(){
		if(username){
			alert("username"+username);
			twocodepath = summer.generateQRCode({
                      "size" : 120 ,//二维码正方形的宽高
                      "content" : username//生成二维码所需的源文字 string类型 
             });
             alert("twocodepath:"+twocodepath);
             $summer.attr(code_img,'src',twocodepath);
		}else{
			alert("未读取取到username");
		}
	});
	
	//二维码图片点击事件
	$summer.addEvt(code_img, 'click', function(){
		var $this = $(this);
		alert("twocodepath:"+twocodepath);
		var src = $summer.attr(code_img,"src");
		if(twocodepath && (src==twocodepath)){
			UM.confirm({
			    title: '友情提示：',
			    text: '您确定要上传二维码吗？',
			    btnText: ["cancle", "ok"],
			    overlay: true,
			    ok: function () {
			        $this.css('backgroundColor', 'red');
					summer.upload({
		                  fileURL : src, //需要上传的文件路径
		                  type : "image/jpeg", //上传文件的类型 > 例：图片为"image/jpeg"
		                  params : {}, //上传参数
		                  SERVER : up_url//服务器地址
		              }, function(ret){
		              		alert("上传成功" + JSON.stringify(ret));
		              		
		              } , function(err){
		              		alert("失败" + JSON.stingify(err));
		              } );
			    },
			    cancle: function () {
			        $this.css('backgroundColor', '#007aff');
			    }
			});
		
		}
		

	});
}

function takephoto(sender,args){
	alert(JSON.stringify(args));
	$summer.attr(image,'src',args.imgPath);
}

function myCallBack(args){
	//根据code，code为0，表示未发现新版本，code为1，表示有新版本，然后提示更新
	$alert(args);
	var code = args.code ;
	if(code==1){
		
		UM.confirm({
            "title" : "提示",
            "text" : "检测到新版本\n是否进行升级?",
            "btnText" : ["cancle", "ok"],
            "overlay" : true,
            "ok" :function(){
                 var url = args.url;
                 $alert("进入到更新方法");
                 
                 if(url){
					summer.upgradeApp({
                        "url" : url, //App下载地址
                        "version" : {
                            "versionCode" : 2,
                            "versionName" : 2
                        }
                    }, function() {
                        alert("应用升级完毕");
                    }, function() {
                        alert("应用升级错误");
                    });
                 }
                 
            },
            "cancle" :function(){
				
            }
        });

	}else if(code==0){
		UM.toast({
            "title" : "友情提示：",
            "text" : "未检测到新版本！",
            "duration" : 3000
        });
	}
	
	
}

function myErrCallBack(args){
	$alert(JSON.stringify(args));
	$alert("版本更新检查失败");
}

function checkPhoto(){
	//检查缓存中是否缓存了相机照的图片
	var imgPath = summer.getStorage("imgPath");
	if(imgPath){
		$summer.attr(image,'src',imgPath);
	}
}

function downloadCallBack(args){
	//实际测试中downloadCallBack被执行了两次，第一次有数据，第二次没有数据
	if(!!args && !!args.savePath &&args.savePath.length>0)
	{
		$summer.attr(image,'src',args.savePath);
	}
}