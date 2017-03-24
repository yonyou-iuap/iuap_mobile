package com.yonyou.example;

import org.json.JSONObject;

public class VersionController {
	/**
	 * @param args
	 * @return
	 * @throws Exception
	 */
	
	private  String APP_UPDATE =  "http://192.168.31.199:8085/test/download/summerDemo.apk";
	private  String APP_IN_UPDATE =  "http://192.168.31.199:8085/test/update/android.zip";
	private  String IOS_IN_UPDATE =  "http://192.168.31.199:8085/test/update/ios.zip";
	private  String IOS_UPDATE =  "itms-services://?action=download-manifest&url=https://mbs.yyuap.com:443/ump/portalservice/download/44687/summerDemo.plist";
	
	public String checkVersion(String args) throws Exception{
		
		JSONObject json = new JSONObject(args);
		JSONObject resultJson = new JSONObject();
		
		//实际最新版本versionCode从数据库中获取;目前指定新版本为2
		int latestVersion = 2;
		int versionCode = json.optInt("versionCode");
		int versionName = json.optInt("versionName");
		String style = json.optString("style").trim();
		String deviceType = json.optString("os").trim();
		
		/*
		 * code为1 表示发现新版，code为0表示为发现新版本
		 */
		if(versionCode<latestVersion){
			resultJson.put("code", 1);
			
		}else{
			resultJson.put("code", 0);
		}
		
		//根据设备类型
		if("android".equalsIgnoreCase(deviceType)){
			//android应用更新：更新安装包
//			resultJson.put("url", APP_UPDATE);
			//android应用内更新：更新www的zip包
			resultJson.put("url",APP_IN_UPDATE);
		}else if("ios".equalsIgnoreCase(style)){
			//TODO
			//ios应用更新：更新plist文件
//			resultJson.put("url",IOS_UPDATE );
			//ios应用内更新：更新www的zip包
			resultJson.put("url", IOS_IN_UPDATE);

		}


		return resultJson.toString();
	}
}
