package com.yonyou.example;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.yonyou.uap.um.gateway.service.GatewayServiceFactory;
import com.yonyou.uap.um.gateway.service.IGatewayService;




public class TestController {
	public String getData(String args) throws Exception {
		JSONObject json = new JSONObject(args);
		JSONArray jsonArray = new JSONArray();
		String sender = "";
		String img = "";
		String lastMsg = "";
		
		

		// * MA端返回address.html通讯录数据

//		JSONArray tempArray = null;
//		// 存储每一组数据，包括组号
//		JSONObject tempJson = null;
//		JSONObject resultJson = new JSONObject();
//		 //MA返回数据到list.html
//		
//		 for (int i = 0; i < 10; i++) {
//		 JSONObject json_temp = new JSONObject();
//		 int k = i%3;
//		 switch (k) {
//		 case 0:
//		 sender = "集团IT服务台";
//		 lastMsg = "因无线网络后台故障，暂停服务。";
//		 break;
//		 case 1:
//		 sender = "集团行政部";
//		 lastMsg = "各位同仁，2015年4季度油料报销标准5.85元/升。";
//		 break;
//		 case 2:
//		 sender = "集团人力资源部";
//		 lastMsg = "各位同仁，跟据国务院发布的放假安排，2016年元旦、春节放假安排如下。";
//		 break;
//		 }
//		 img = "../img/b"+k+".png";
//		 json_temp.put("sender", sender);
//		 json_temp.put("img", img);
//		 json_temp.put("msgNum", i);
//		 json_temp.put("lastMsg", lastMsg);
//		 json_temp.put("lastTime", "12:21");
//		
//		 jsonArray.put(json_temp);
//		 }
//		 resultJson.put("list", jsonArray);
//		 return resultJson.toString();

//		 调用网关返回数据,需在ma/conf/configure/项目名
//	 String appid1 = json.optString("appid");
//
//		String params = json.optString("params");
//		JSONObject paramsT = new JSONObject(params);
		String appid = json.optString("appid");

		String msg = "";
		Object result = null;
		try {
			Map<String, String> paraMap = new HashMap<String, String>();
			paraMap.put("param1", "world");
			paraMap.put("appid","summerDemo");
//			IGatewayService service = GatewayServiceFactory.findGatewayService(appid, "MyWebService", paraMap);
			IGatewayService service = GatewayServiceFactory.findGatewayService("summerDemo", "MyWebService", paraMap);
			if (service != null) {
				result = service.doService();
			}
		} catch (Exception e) {
			msg += e.getMessage();
			e.printStackTrace();
			
		}
		
		
		return result.toString();

	}

}