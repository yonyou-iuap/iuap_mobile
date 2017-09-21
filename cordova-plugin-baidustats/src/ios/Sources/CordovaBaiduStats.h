//
//  CordovaBaiduStats.h
//  MyPlugins
//
//  Created by gct on 2017/6/29.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import "BaiduMobStat.h"

@interface CordovaBaiduStats : CDVPlugin


@property (nonatomic,strong) CDVInvokedUrlCommand * currentCommand;

-(void)init:(CDVInvokedUrlCommand*)command;

-(void)recordEvent:(CDVInvokedUrlCommand*)command;

-(void)recordPage:(CDVInvokedUrlCommand*)command;
@end
