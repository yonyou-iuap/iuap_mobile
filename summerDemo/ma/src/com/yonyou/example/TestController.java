package com.yonyou.example;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.yonyou.uap.um.controller.UmControllerException;
import com.yonyou.uap.um.gateway.service.GatewayServiceFactory;
import com.yonyou.uap.um.gateway.service.IGatewayService;

import nc.bs.logging.Logger;

public class TestController {
	public String getData(String args) throws Exception{
		JSONObject json = new JSONObject(args);
	JSONArray jsonArray = new JSONArray();
		
		
	//	 * MA端返回address.html通讯录数据
		 
		JSONArray tempArray = null;
		//存储每一组数据，包括组号
		JSONObject tempJson = null;
		JSONObject resultJson = new JSONObject();
		
		try{
			for(int i=0;i<2;i++){
				//存储每一条数据
				JSONObject json_temp = new JSONObject();
				tempArray = new JSONArray();
				json_temp.put("gname", "第"+(i+1)+"组");
				for(int j=0;j<2;j++){
					tempJson = new JSONObject();
					if(j==0){
						tempJson.put("company", "优酷网");
						tempJson.put("slogan", "世界都在看");
						tempJson.put("img", "../img/youku.jpg");
						tempJson.put("address", "中国北京");
						tempJson.put("scope", "用户视频分享服务");
					}else if(j==1){
						tempJson.put("company", "爱奇艺");
						tempJson.put("slogan", "悦享品质");
						tempJson.put("img", "../img/aiqiyi.jpg");
						tempJson.put("address", "中国北京");
						tempJson.put("scope", "网络视频");
					}
					tempArray.put(tempJson);
				}
				json_temp.put("row", tempArray);
				jsonArray.put(json_temp);
			}
			resultJson.put("list", jsonArray);
		}catch(Exception e){
			e.printStackTrace();
			Logger.error("load error", e);
			String errorString = e.getMessage()+(
					e.getCause()==null?"":("——>"+e.getCause().getMessage()));
			throw new UmControllerException(errorString,e);
		}
		
		return resultJson.toString();
		
		//调用网关返回数据,需在ma/conf/configure/项目名
/*		
		String appid = json.optString("appid");
		String msg = "";
		Object result = null;
		try{
			Map<String,String> paraMap = new HashMap<String,String>();
			paraMap.put("param1", "world");
			IGatewayService service =  GatewayServiceFactory.findGatewayService(appid, "MyWebService", paraMap);
			if(service != null){
				result= service.doService();
			}
		}catch(Exception e){
			msg += e.getMessage();
		}
		return result.toString();*/

	
	}
	
	
	
	
}