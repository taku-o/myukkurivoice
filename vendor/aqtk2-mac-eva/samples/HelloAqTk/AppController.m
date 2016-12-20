//
//  AppController.m
//  HelloAqTk
//
//  Created by yamazaki on 10/01/05.
//  Copyright 2010 AQUEST Corp. All rights reserved.
//

#import "AppController.h"
#import <AquesTalk2/AquesTalk2.h>	//AquesTalk2 Framework
#import "au_play.h"					//DAライブラリ libAuPlay.a

@implementation AppController
- (IBAction)sayHello:(id)sender
{
	// テキストボックスから文字列取得
	NSString *strKoe = [textfield stringValue];

	// 文字コードをShiftJISに変換
	char *sjis = (char*)[strKoe cStringUsingEncoding:NSShiftJISStringEncoding];
	
	// 音声合成　音声記号列->WAVデータ
	int size;
	unsigned char *wav = AquesTalk2_Synthe(sjis, 100, &size, NULL);
	if(wav==0){	// 合成失敗
		NSAlert *alert = [ NSAlert alertWithMessageText:@"Error" defaultButton:@"OK"
						alternateButton: @"" otherButton:@""
						informativeTextWithFormat:@"音声記号列の指定が正しくありません" ]; 						  
		[alert runModal];
		return;
	}
	
	// 音声出力 同期型
	// WAVヘッダー(先頭の44byte)を除いて、StraightPCMとする
	PlaySound((short*)(wav+44), (size-44)/2);	// libAuPlay.aS
	
	// 生成した波形バッファの解放
	AquesTalk2_FreeWave(wav);		
}

@end
