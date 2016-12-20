//
//  HelloAqKanji2KoeAppDelegate.m
//  HelloAqKanji2Koe
//
//  Created by yamazaki on 11/02/04.
//  Modified by yamazaki on 2013/07/02 for Ver.2
//  Copyright 2013 AQUEST All rights reserved.
//

#import "HelloAqKanji2KoeAppDelegate.h"
//#import <AqKanji2Koe/AqKanji2Koe.h>
#import <AqKanji2Koe/AqKanji2Koe.h>  // 評価版の場合

@implementation HelloAqKanji2KoeAppDelegate

@synthesize window;

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
	// Insert code here to initialize your application 
}


- (IBAction)convKanji2Koe:(id)sender
{
	// 辞書データのディレクトリパス取得(HelloAqKanji2Koe.app/Resourcesに辞書ファイルをおいた場合)
	NSBundle *bundle = [NSBundle mainBundle];
	NSString *path= [bundle resourcePath];
	const char *pathDic = [path UTF8String];
	
	// AqKAnji2Koeインスタンス生成
	int iErr;
	void *pAqK2K = AqKanji2Koe_Create(pathDic, &iErr);
		
	// テキストボックスから文字列取得
	NSString *strKoe = [textfieldKanji stringValue];
	
	// NSString文字列をC言語文字列(Utf8)に変換
	const char *kanji = [strKoe UTF8String];

	// 漢字かな交じり文を音声記号列に変換
	char koe[4096];
	AqKanji2Koe_Convert(pAqK2K, kanji, koe, 4096);
	
	// C言語文字列(Utf8)をNSStringに変換してテキストボックスへセット
	[textfieldKoe setStringValue:[NSString stringWithCString:koe encoding:NSUTF8StringEncoding]];
		
	// AqKAnji2Koeインスタンス解放
	if(pAqK2K) AqKanji2Koe_Release(pAqK2K);
}
@end
