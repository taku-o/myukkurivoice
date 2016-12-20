//////////////////////////////////////////////////////////////////////
/*!	@class	AqKanji2Koe

	@brief	AquesTalk(2)用言語処理部 (Linux)

  漢字かな混じりテキスト->音声記号列

	@author	N.Yamazaki (Aquest)

	@date	2010/12/27	N.Yamazaki	Creation
	@date	2013/06/11	N.Yamazaki	Ver.2
*/
//  COPYRIGHT (C) 2010 AQUEST CORP.
//////////////////////////////////////////////////////////////////////
#if !defined(_AQ_KANJI2KOE_H_)
#define _AQ_KANJI2KOE_H_
#ifdef __cplusplus
extern "C"{
#endif


/////////////////////////////////////////////
//!	言語処理インスタンス生成（初期化）
//! @param	pathDic[in]		辞書のディレクトリを指定(最後に/が有っても無くても良い）
//! @param	pErr[out]		エラー時にはエラーコードが入る 正常終了時は不定値
//!	@return	インスタンスハンドル エラーの時は０が返る
void *  AqKanji2Koe_Create(const char *pathDic, int *pErr);

/////////////////////////////////////////////
//!	言語処理インスタンス生成 （初期化）その２
//!   呼び出し側で辞書データ(バイナリ)をメモリに読み込んでから指定
//!   初期化を高速化するためのメモリマップトファイルなどが使える
//! @param	pSysDic[in]		システム辞書データ先頭アドレス(必須)
//! @param	pUserDic[in]	ユーザ辞書データ先頭アドレス（使用しないときは0を指定）
//! @param	pErr[out]		エラー時にはエラーコードが入る 正常終了時は不定値
//!	@return	インスタンスハンドル エラーの時は０が返る
void *  AqKanji2Koe_Create_Ptr(const void *pSysDic, const void *pUserDic, int *pErr);

/////////////////////////////////////////////
//!	インスタンス解放
//! @param	hAqKanji2Koe[in]	AqKanji2Koe_Create()で返されたインスタンスハンドル
void   AqKanji2Koe_Release(void *hAqKanji2Koe);

/////////////////////////////////////////////
//!	言語処理 マルチバイト文字(UTF8)版
//! @param	hAqKanji2Koe[in]	AqKanji2Koe_Create()で返されたインスタンスハンドル
//! @param	kanji[in]	漢字かな混じり文テキスト（UTF8)
//! @param	koe[out]	音声記号列（UTF8)
//! @param	nBufKoe[in]	koeのバッファサイズ[byte]
//!	@return	0:正常終了 それ以外：エラーコード
int  AqKanji2Koe_Convert(void *hAqKanji2Koe, const char *kanji, char *koe, int nBufKoe);

/////////////////////////////////////////////
//!	言語処理 ワイド文字 Unicode(UTF32) 版
//! @param	hAqKanji2Koe[in]	AqKanji2Koe_Create()で返されたインスタンスハンドル
//! @param	wKanji[in]	漢字かな混じり文テキスト（UTF32)
//! @param	wKoe[out]	音声記号列（UTF32)
//! @param	nBufKoe[in]	wKoeのバッファサイズ(配列の要素数)
//!	@return	0:正常終了 それ以外：エラーコード
int  AqKanji2Koe_ConvertW(void *hAqKanji2Koe, const wchar_t *kanji, wchar_t *wKoe, int nBufKoe);

#ifdef __cplusplus
}
#endif
#endif // !defined(_AQ_KANJI2KOE_H_)
//  ----------------------------------------------------------------------
// !  Copyright AQUEST Corp. 2006- .  All Rights Reserved.                !
// !  An unpublished and CONFIDENTIAL work.  Reproduction, adaptation, or !
// !  translation without prior written permission is prohibited except   !
// !  as allowed under the copyright laws.                                !
//  ----------------------------------------------------------------------
