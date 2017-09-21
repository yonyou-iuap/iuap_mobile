package com.yyuap.tianwt;

import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.text.TextUtils;
import android.util.Log;

import com.baidu.mobstat.PrefOperate;
import com.baidu.mobstat.SendStrategyEnum;
import com.baidu.mobstat.StatService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class CordovaBaiduStats extends CordovaPlugin {
	
	private static final String TAG 			=   "CordovaBaiduStats";
	private static final String TAG_START 		=   "START";
	private static final String TAG_END 		=   "END";
	private final String ACTION_INIT 			=   "init";
	private final String ACTION_RECORD_EVENT 	=   "recordEvent";
	private final String ACTION_RECORD_PAGE 	=   "recordPage";
	
	private Context ctx = null;
	
	private static boolean isInit = false;

	@Override
	public void initialize(CordovaInterface cordovainterface,
			CordovaWebView cordovawebview) {
		ctx = cordovainterface.getActivity();
		Log.e(TAG, "---------initialize-------");
		super.initialize(cordovainterface, cordovawebview);
	}
	
	public void refuseRecord(CallbackContext callbackContex) throws JSONException
	{
		
		if(!isInit)
		{
			JSONObject retJSON = new JSONObject();
			retJSON.put("code", "-2000");
			retJSON.put("msg", "插件未初始化成功！");
			PluginResult pr = new PluginResult(PluginResult.Status.OK, retJSON);
			callbackContex.sendPluginResult(pr);
		}
		
	}
	
	@Override
	public boolean execute(String action, CordovaArgs args,
			CallbackContext callbackContext) throws JSONException {
		
		Log.e(TAG, "-------->act="+action+"<--------");
		if(ACTION_INIT.equalsIgnoreCase(action)){
			return doInitialize( action,  args,callbackContext);
		}
		else if(ACTION_RECORD_EVENT.equalsIgnoreCase(action))
		{
			return doRecordEvent( action,  args,callbackContext);
		}
		else if(ACTION_RECORD_PAGE.equalsIgnoreCase(action))
		{
			return doRecordPage( action,  args,callbackContext);
		}
		return super.execute(action, args, callbackContext);
	}

	private boolean doRecordPage(String action, CordovaArgs args,
			CallbackContext callbackContext) {
		try {
			
			if(!isInit)
			{
				 refuseRecord(callbackContext);
				 return false;
			}
			
			String pageState = args.optString(0);
			JSONObject pageInfo = args.optJSONObject(1);
			
			if(pageState!=null && pageState.length()>0){
				
				if(pageInfo==null) {
					pageInfo = new JSONObject();
				}
				if(pageInfo.opt("pageName")==null)
				{
					pageInfo.put("pageName", ctx.getClass().getName());
				}
				Log.e(TAG, " pageState =>>>> "+pageState);
				Log.e(TAG, " pageName =>>>> "+pageInfo.optString("pageName", ""));
				if( TAG_START.equalsIgnoreCase(pageState))
				{
					StatService.onPageStart(ctx, pageInfo.optString("pageName", ""));
				}
				else if(TAG_END.equalsIgnoreCase(pageState))
				{
					StatService.onPageEnd(ctx, pageInfo.optString("pageName", ""));
				}
				else{
					throw new Exception("不支持此操作！");
				}
			}else{
				throw new Exception("不支持此操作！");
			}
			sendSuccessState(callbackContext);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			Log.e(TAG, e.getLocalizedMessage(),e);
			sendFailedState(callbackContext, e);
		}
		
		return false;
	}

	private boolean doRecordEvent(String action, CordovaArgs args,
			CallbackContext callbackContext) {
		try {
			
			if(!isInit)
			{
				 refuseRecord(callbackContext);
				 return false;
			}
			
			String pageState = args.optString(0);
			JSONObject pageInfo = args.optJSONObject(1);
			
			if(pageState!=null && pageState.length()>0){
				
				if(pageInfo==null) pageInfo = new JSONObject();
				pageInfo.put("activity_pageName", ctx.getClass().getName());
				
				String eventId = pageInfo.optString("id","Unkown");
				String eventLabel = pageInfo.optString("label","Unkown");
				int eventCount = pageInfo.optInt("count",1);
				Log.e(TAG, " pageState =>>>> "+pageState);
				Log.e(TAG, "eventId = "+eventId + ", eventLabel="+eventLabel+", info="+pageInfo.toString());
				
				if(TAG_START.equalsIgnoreCase(pageState))
				{
					StatService.onEventStart(ctx, eventId, eventLabel);
				}
				else if(TAG_END.equalsIgnoreCase(pageState))
				{
					StatService.onEventEnd(ctx,eventId,eventLabel);
				}else{
					Map<String,String> mapAttr = new Gson().fromJson(pageInfo.toString(), new TypeToken<Map<String,String>>(){}.getType());
					StatService.onEvent(ctx, eventId, eventLabel, eventCount, mapAttr);
				}
			}else{
				throw new Exception("不支持此操作！");
			}
			sendSuccessState(callbackContext);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			Log.e(TAG, e.getLocalizedMessage(),e);
			sendFailedState(callbackContext, e);
		}
		return false;
	}

	private void sendFailedState(CallbackContext callbackContext, Exception e) {
		try {
			JSONObject retJSON = new JSONObject();
			retJSON.put("code", "-1000");
			retJSON.put("msg", e.getLocalizedMessage());
			PluginResult pr = new PluginResult(PluginResult.Status.ERROR, retJSON);
			callbackContext.sendPluginResult(pr);
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
	}

	private void sendSuccessState(CallbackContext callbackContext)
			throws JSONException {
		JSONObject retJSON = new JSONObject();
		retJSON.put("code", "1000");
		retJSON.put("msg", "OK");
		PluginResult pr = new PluginResult(PluginResult.Status.OK, retJSON);
		callbackContext.sendPluginResult(pr);
	}

	private boolean doInitialize(String action, CordovaArgs args,
			CallbackContext callbackContext) {
		
		try {
			
			setDefaultConfig();
			
			if(StatService.getSdkVersion().compareTo("3.8")<0)
			{
				StatService.setSendLogStrategy(ctx,  SendStrategyEnum.APP_START,1, false);
			}else{
				StatService.start(ctx);
			}
			StatService.setForTv(ctx,false);
			StatService.setDebugOn(appIsDebugable(ctx));
			StatService.setOn(ctx, StatService.EXCEPTION_LOG);
			
			StatService.autoTrace(ctx, true, true); //自动埋点
			
			JSONObject optArgs = args.optJSONObject(0);
			if(optArgs!=null)
			{
				initWithArguments(optArgs);
			}
			sendSuccessState(callbackContext);
			isInit = true;
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			try {
				JSONObject retJSON = new JSONObject();
				retJSON.put("code", "-1000");
				retJSON.put("msg", e.getLocalizedMessage()+"");
				PluginResult pr = new PluginResult(PluginResult.Status.ERROR, retJSON);
				callbackContext.sendPluginResult(pr);
			} catch (JSONException et) {
			}
		}
		
		isInit = false;
		
		return false;
	}

	private void setDefaultConfig() {
		StatService.setLogSenderDelayed(90);
		StatService.setOn(ctx, StatService.EXCEPTION_LOG);
		StatService.enableDeviceMac(ctx, true);
		PrefOperate.loadMetaDataConfig(ctx);
	}

	private void initWithArguments(JSONObject optArgs) throws Exception
	{
		Log.e(TAG, "init.args = "+optArgs.toString());
		
		try {
			
			String appKey = optArgs.optString("appKey");
			String appChannel = optArgs.optString("appChannelId");
			String isDebugMode = optArgs.optString("isDebugMode");
			String sendLogTimeout = optArgs.optString("sendLogTimeout");
			String isLogAppError = optArgs.optString("isLogAppError");
			String enableDeviceMac = optArgs.optString("enableDeviceMac");
			
			StatService.setSessionTimeOut(30); //如果进入后台，每30秒唤醒一次
			if(!TextUtils.isEmpty(appKey) && appKey.trim().length()>0)
			{
				Log.i(TAG, "StartAppKey="+StatService.getAppKey(ctx));
				StatService.setAppKey(appKey);
				Log.i(TAG, "EndAppKey="+StatService.getAppKey(ctx));
			}
			if(!TextUtils.isEmpty(appChannel) && appChannel.trim().length()>0)
			{
				StatService.setAppChannel(ctx,appChannel,true);
			}
			if(!TextUtils.isEmpty(isDebugMode) && isDebugMode.trim().length()>0)
			{
				StatService.setDebugOn(convertStringToBoolean(isDebugMode,false));
			}
			
			if(!TextUtils.isEmpty(sendLogTimeout) && sendLogTimeout.trim().length()>0)
			{
				int longSeconds = convertStringToIntegerSeconds(sendLogTimeout, 5, 30);
				StatService.setLogSenderDelayed(longSeconds);
			}
			if(!TextUtils.isEmpty(isLogAppError) && isLogAppError.trim().length()>0)
			{
				boolean logNativeError = convertStringToBoolean(isLogAppError,true);
				StatService.setOn(ctx, logNativeError?StatService.EXCEPTION_LOG:StatService.JAVA_EXCEPTION_LOG);
			}
			if(!TextUtils.isEmpty(enableDeviceMac) && enableDeviceMac.trim().length()>0)
			{
				boolean isEnableDeviceMac = convertStringToBoolean(enableDeviceMac,true);
				StatService.enableDeviceMac(ctx, isEnableDeviceMac);
			}
		} catch (Exception e) {
			throw e;
		}
	}
	
	public boolean appIsDebugable(Context ctx)
	{
		 	PackageManager packagemanager = ctx.getPackageManager();
	        ApplicationInfo applicationinfo;
	        try
	        {
	            applicationinfo = packagemanager.getApplicationInfo(ctx.getPackageName(), 128);
	            boolean isDebugMode =  (applicationinfo.flags&ApplicationInfo.FLAG_DEBUGGABLE)!=0;
	            return isDebugMode;
	        }
	        catch(Exception e)
	        {
	           Log.e(TAG,e.getLocalizedMessage(),e );
	        }
	      return false;  
	}
	
	public int convertStringToIntegerSeconds(String time,long minTime,long maxTime)
	{
		try {
			int parseLong = Integer.parseInt(time);
			parseLong = (int) Math.min(maxTime,parseLong);
			parseLong = (int) Math.max(minTime,parseLong);
			
			return parseLong;
		} catch (NumberFormatException e) {
			e.printStackTrace();
			return  120;
		}
	}
	
	public boolean convertStringToBoolean(String booleanStr,boolean defaultValue)
	{
		try {
			boolean value = Boolean.parseBoolean(booleanStr);
			return value;
			
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		return  defaultValue;
	}
}
