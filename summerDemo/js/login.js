summerready = function() {
	$(".um-input-clear.ti-close").click(function() {
		$(this).prev("input").val("");
	})
	$(".um-input-clear.ti-eye").click(function() {
		var $pre_input = $(this).prev("input");
		('password' == $pre_input.attr('type')) ? $pre_input.attr('type', 'text') : $pre_input.attr('type', 'password');
		$(this).toggleClass('eye');
	})

	var login_btn = $summer.byId("lbtn");


	/**
	 * 应用更新：是否有应用（应用内）更新
	 */
//	update();

	$summer.addEvt(login_btn, 'click', function() {
		username = $summer.byId("ubox").value;
		pwd = $summer.byId("pbox").value; 
		alert(username);
		if (!username) {
			$alert("用户名不能为空");
			return;
		}

		if (!pwd) {
			$alert("密码不能为空");
			return;
		}
		summer.setStorage("username", username);
		
		//不进行EMM设备管理，直接进入首页
			openIndex();
		// EMM 用户登录+设备注册
	//	loginEMM(username, pwd);

	});
}

function openIndex(){
	summer.openWin({
			"id" : "index",
			"url" : "index.html",
			"pageParam" : {
				"count" : 1
			}
		});
}
//检查是否有应用（应用内）更新
function update() {
	$service.writeConfig({
		"host" : ma_host, //向configure中写入host键值
		"port" : ma_port//向configure中写入port键值
	})

	var versionInfo = $summer.strToJson(summer.getAppVersion());
	var param = {};
	param.versionCode = versionInfo.versionCode;
	param.versionName = versionInfo.versionName;
	$service.callAction({
		"viewid" : "com.yonyou.example.VersionController", //部署在MA上的Controller的包名
		"action" : "checkVersion", //后台Controller的方法名,
		"params" : param, //自定义参数，json格式
		"callback" : "myCallBack()", //请求成功后回调js方法
		"error" : "myErrCallBack()"//请求失败回调的js方法
	})
}

//应用更新
function upgradeAPP(args) {
	UM.confirm({
		"title" : "提示",
		"text" : "检测到新版本是否进行升级?",
		"btnText" : ["cancle", "ok"],
		"overlay" : true,
		"ok" : function() {
			var url = args.url;
			$alert("进入到更新方法");

			if (url) {
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
		"cancle" : function() {

		}
	});
}

//应用内更新
function upgrade(args) {
	UM.confirm({
		"title" : "提示",
		"text" : "是否进行应用内更新",
		"btnText" : ["取消", "确认"],
		"overlay" : true,
		"ok" : function() {
			var url = args.url;
			if (url) {
				$alert("进入到更新方法");
				summer.upgrade({
					"url" : url, //资源包下载地址
					"showProgress" : true,
					"isIncremental" : true,
					"version" : {
						"versionCode" : 2,
						"versionName" : 2
					}
				}, function(res) {
					if (res.isfinish == true) {
						alert("应用升级完毕");
						summer.openWin({
							"id" : "login",
							"url" : weburl + "html/login.html"
						});
					}

				}, function() {
					alert("应用升级错误");
				});
			}

		},
		"cancle" : function() {
			$alert("取消更新");
		}
	});
}

function myCallBack(args) {
	//根据code，code为0，表示未发现新版本，code为1，表示有新版本，然后提示更新
	$alert(args);
	var code = args.code;
	if (code == 1) {
		//应用更新
		//upgradeAPP(args);
		//应用内更新
		upgrade(args);

	} else if (code == 0) {
		UM.toast({
			"title" : "友情提示：",
			"text" : "未检测到新版本！",
			"duration" : 3000
		});
	}

}

function myErrCallBack(args) {
	$alert(JSON.stringify(args));
	$alert("版本更新检查失败");
}

function loginEMM(username, pwd) {
	//设置EMM地址
	setting();
	//EMM用户登录、设备注册
	register(username, pwd, callback);

}

//open Main
function callback(rest) {

	//	alert(rest);
	var rst = rest.result;
	//	alert( typeof (rst));

	if (JSON.parse(rst).data.code === '1') {
		//	if (rest.indexOf("成功") > 1) {
		alert("成功");
		summer.openWin({
			"id" : "index",
			"url" : "index.html",
			"pageParam" : {
				"count" : 1
			}
		});

	} else {
		alert(JSON.parse(rst).data.msg);
	}

}

//注册EMM地址
function setting() {
	emm.writeConfig({
		"host" : "123.103.9.206",
		"port" : "9000"
	})
}

function autofind() {
	emm.autofind({
		"companyId" : ""
	}, function(ret) {
		alert($summer.jsonToStr(ret));
	}, function(ret) {
		alert($summer.jsonToStr(ret));
	})
}

function register(userName, passWord, callback) {
	emm.registerDevice({
		"username" : userName, //用户名
		"password" : passWord //密码
	}, function(ret) {
		//	alert($summer.jsonToStr(ret));

		//	alert(ret.result);
		callback(ret);

	}, function(ret) {
		alert($summer.jsonToStr(ret));
		return "error";
	});
}

function getApps() {
	emm.getApps({
	}, function(ret) {
		alert($summer.jsonToStr(ret));
	}, function(ret) {
		alert($summer.jsonToStr(ret));
	})
}