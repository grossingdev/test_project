//
//  RNUeno.m
//  
//
//  Created by burmistrov on 21/02/2018.
//
#import "RNUeno.h"

@implementation RNUeno

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  
  static BOOL isDebug = 
#if DEBUG
    true
#else
    false
#endif
  ;
  BOOL isTestFlight = [[[[NSBundle mainBundle] appStoreReceiptURL] lastPathComponent] isEqualToString:@"sandboxReceipt"];
  return @{
    @"isTestFlight": @(isTestFlight),
    @"isDebug": @(isDebug),
    @"testMode": @(false),
  };
}

@end
