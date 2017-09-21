//
//  CordovaBaiduStats.m
//  MyPlugins
//
//  Created by gct on 2017/6/29.
//
//

#import "CordovaBaiduStats.h"
#import <AdSupport/AdSupport.h>

static BOOL BDStats_IsInit = NO;


@interface CordovaBaiduStats()

+(BOOL) convertStringToBOOL:(NSString *) value;

+(void) loadDefaultConfig;

+(NSString *) getAppVersion;

+(id) valueAdapter:(NSString *) value  default:(id) defaultvalue;

+(id) parseValue:(NSDictionary *) dict name:(NSString *) name  default:(id) defaultvalue;

@end


@implementation CordovaBaiduStats


+(id) parseValue:(NSDictionary *) dict name:(NSString *) name  default:(id) defaultvalue
{
    if(dict==nil) return defaultvalue;

    id value =  dict[name]!=nil ?dict[name]:defaultvalue;
    
    value  = [NSString stringWithFormat:@"%@",value];
    
    return value;
}

+(id) valueAdapter:(NSString *) value  default:(id) defaultvalue
{

    id _value =  value!=nil ?value:defaultvalue;
    _value  = [NSString stringWithFormat:@"%@",_value];
    
    return _value;

}

+(void) loadDefaultConfig
{

    NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"BaiduStats" ofType:@"plist"];
    
    if(plistPath==nil)
    {
        return;
    }
    
    NSMutableDictionary *infoDict = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    
    NSString * appKey                       = infoDict[@"BaiduMobAd_STAT_ID"];
    NSString * appChannel                   = infoDict[@"BaiduMobAd_CHANNEL"];
    NSString * isLogAllError                = infoDict[@"BaiduMobAd_EXCEPTION_LOG"];
    NSString * logSendStraregy              = infoDict[@"BaiduMobAd_SEND_STRATEGY"];
    
    NSString * logIntervalTime              = infoDict[@"BaiduMobAd_TIME_INTERVAL"];
    NSString * isWifiOnly                   = infoDict[@"BaiduMobAd_ONLY_WIFI"];
    NSString * isCanUseCellLocation         = infoDict[@"BaiduMobAd_CELL_LOCATION"];
    NSString * isCanUseGPSLocation          = infoDict[@"BaiduMobAd_GPS_LOCATION"];
    NSString * isCanUseWIFILocation         = infoDict[@"BaiduMobAd_WIFI_LOCATION"];
    
    
    appKey                  = [[self class] valueAdapter:appKey default:@"" ];
    appChannel              = [[self class] valueAdapter:appChannel default:@"" ];
    isLogAllError           = [[self class] valueAdapter:isLogAllError default:@"true" ];
    logSendStraregy         = [[self class] valueAdapter:logSendStraregy default:@"APP_START" ];
    
    logIntervalTime         = [[self class] valueAdapter:logIntervalTime default:@"5" ];
    isWifiOnly              = [[self class] valueAdapter:isWifiOnly default:@"false" ];
    isCanUseCellLocation    = [[self class] valueAdapter:isCanUseCellLocation default:@"true" ];
    isCanUseGPSLocation     = [[self class] valueAdapter:isCanUseGPSLocation default:@"true" ];
    isCanUseWIFILocation    = [[self class] valueAdapter:isCanUseWIFILocation default:@"true" ];
    

    //广告id，也可以认为是uuid
    NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    [[BaiduMobStat defaultStat] setAdid:adId];
    [[BaiduMobStat defaultStat] setShortAppVersion:[[self class] getAppVersion]];
    [[BaiduMobStat defaultStat] setEnableGps:[[self class] convertStringToBOOL:isCanUseGPSLocation]];
    
    [[BaiduMobStat defaultStat] setLogSendWifiOnly:[[self class] convertStringToBOOL:isWifiOnly]];
    
    
    [[BaiduMobStat defaultStat] setEnableDebugOn:NO];
    
    if([@"APP_START" isEqualToString:logSendStraregy])
    {
        [[BaiduMobStat defaultStat] setLogStrategy:BaiduMobStatLogStrategyAppLaunch];
    }else if([@"ONCE_A_DAY" isEqualToString:logSendStraregy]){
        [[BaiduMobStat defaultStat] setLogStrategy:BaiduMobStatLogStrategyDay];
    }else if([@"SET_TIME_INTERVAL" isEqualToString:logSendStraregy]){
        [[BaiduMobStat defaultStat] setLogStrategy:BaiduMobStatLogStrategyCustom];
    }else{
        [[BaiduMobStat defaultStat] setLogStrategy:BaiduMobStatLogStrategyAppLaunch];
        
        int intervalTime = [logIntervalTime intValue];
        
        intervalTime  = MAX(MIN(24,intervalTime),1);
        [[BaiduMobStat defaultStat] setLogSendInterval:intervalTime];
    }
    
    [[BaiduMobStat defaultStat] setEnableExceptionLog:[[self class ]convertStringToBOOL:isLogAllError]];
    
    if(appChannel!=nil && [appChannel length]>0)
    {
        [[BaiduMobStat defaultStat] setChannelId:appChannel];
    }
    if(appKey!=nil && [appKey length]>0)
    {
        [[BaiduMobStat defaultStat] startWithAppId:appKey];
    }
    
    
}

+(BOOL) convertStringToBOOL:(NSString *) value
{
    
    if([value isEqualToString:@"true"] || [value isEqualToString:@"YES"] || [value isEqualToString:@"1"])
    {
        return YES;
    }
    
    return NO;

}

+(NSString *) getAppVersion
{
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    CFShow((__bridge CFTypeRef)(infoDictionary));
    // app版本
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    
    return app_Version;
}

-(void)init:(CDVInvokedUrlCommand*)command
{
    
    @try {
        
        [[self class] loadDefaultConfig];
        
        NSArray * arguments = command.arguments;
        if(arguments!=nil && arguments.count>0)
        {
            
            NSDictionary * configInfo   = arguments[0];
            
            NSString * appKey =  [[self class] parseValue:configInfo name:@"appKey" default:@"" ];
            NSString * appChannel =  [[self class] parseValue:configInfo name:@"appChannelId" default:@"" ];
            
            NSString * isDebugMode =  [[self class] parseValue:configInfo name:@"isDebugMode" default:@"false" ];
            
            NSString * isLogAppError =  [[self class] parseValue:configInfo name:@"isLogAppError" default:@"true" ];
            
            [[BaiduMobStat defaultStat] setEnableExceptionLog:[[self class] convertStringToBOOL:isDebugMode]];
            [[BaiduMobStat defaultStat] setEnableDebugOn:[[self class] convertStringToBOOL:isLogAppError]];
            
            if(appChannel!=nil || [appChannel length]>0)
            {
                [[BaiduMobStat defaultStat] setChannelId:appChannel];
            }
            
            if(appKey!=nil && [appKey length]>0)
            {
                [[BaiduMobStat defaultStat] startWithAppId:appKey ];
            }
            
        }
        
        CDVPluginResult * rs = [self createPluginResponse:@{} code:@"1000" status:@"OK"];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
        BDStats_IsInit = YES;
        
    } @catch (NSException *exception) {
        BDStats_IsInit = NO;
        CDVPluginResult * rs = [self createPluginResponse:[exception userInfo] code:@"-1000" status:[exception reason]];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
    } @finally {
        
    }
}

-(CDVPluginResult *) createPluginResponse:(NSDictionary * ) data code:(NSString *) code status:(NSString*) msg{
    
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    
    if(data==nil) data = @{};
    
    [dictionary setObject:data forKey:@"data"];
    [dictionary setObject:code forKey:@"code"];
    [dictionary setObject:msg forKey:@"msg"];
    CDVPluginResult *pluginResult = nil;
    if([@"1000" isEqualToString:code])
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
    }
    
    return pluginResult;
}

-(void)recordEvent:(CDVInvokedUrlCommand*)command
{
    
    if(!BDStats_IsInit)
    {
        CDVPluginResult * rs = [self createPluginResponse:@{} code:@"-2000" status: @"插件位初始化成功！"];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
        return;
    }
    
    @try {
        NSArray * arguments = command.arguments;
        
        NSString * stateName = @"Unkown";
        NSDictionary * userInfo = @{};
        
        if(arguments!=nil && arguments.count==1)
        {
            stateName = arguments[0];
            
        }
        
        if(arguments!=nil && arguments.count>=2)
        {
            stateName = arguments[0];
            userInfo = arguments[1];
        }
        
        NSString * eventId = [[self class] parseValue:userInfo name:@"id" default:@"Unkown"];
        NSString * eventLabel= [[self class] parseValue:userInfo name:@"label" default:@"Unkown"];
        
        if([@"START" isEqualToString:stateName])
        {
            
            [[BaiduMobStat defaultStat] eventStart:eventId eventLabel:eventLabel];
        }
        else if([@"END" isEqualToString:stateName])
        {
            [[BaiduMobStat defaultStat] eventEnd:eventId eventLabel:eventLabel];
        }
        else
        {
            [[BaiduMobStat defaultStat] logEvent:eventId eventLabel:eventLabel attributes:userInfo];
        }
        CDVPluginResult * rs = [self createPluginResponse:@{} code:@"1000" status: @"OK"];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
        
    } @catch (NSException *exception) {
        CDVPluginResult * rs = [self createPluginResponse:[exception userInfo] code:@"-2000" status:[exception reason    ]];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
    } @finally {
        
    }

}

-(void)recordPage:(CDVInvokedUrlCommand*)command
{
    if(!BDStats_IsInit)
    {
        CDVPluginResult * rs = [self createPluginResponse:@{} code:@"-2000" status: @"插件未初始化成功！"];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
        return;
    }
    
    @try {
        NSArray * arguments = command.arguments;
        
        NSString * stateName = @"Unkown";
        NSDictionary * userInfo = @{};
        
        if(arguments!=nil && arguments.count==1)
        {
            stateName = arguments[0];
            
        }
        
        if(arguments!=nil && arguments.count>=2)
        {
            stateName = arguments[0];
            userInfo = arguments[1];
        }
        
        NSString * pageName = [[self class] parseValue:userInfo name:@"pageName" default:@"Unkown"];
      
        
        if([@"START" isEqualToString:stateName])
        {
            
            [[BaiduMobStat defaultStat] pageviewStartWithName:pageName];
        }
        else if([@"END" isEqualToString:stateName])
        {
            [[BaiduMobStat defaultStat] pageviewEndWithName:pageName ];
        }
        else
        {
            @throw [NSException exceptionWithName:@"不支持此类系参数！" reason:@"不支持此类系参数！" userInfo:@{@"msg":@"不支持的类型！"}];
        }
        CDVPluginResult * rs = [self createPluginResponse:@{} code:@"1000" status: @"OK"];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
        
    } @catch (NSException *exception) {
        CDVPluginResult * rs = [self createPluginResponse:[exception userInfo] code:@"-2000" status:[exception reason]];
        [self.commandDelegate sendPluginResult:rs callbackId:command.callbackId];
    } @finally {
        
    }

}

@end
