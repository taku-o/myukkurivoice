//////////////////////////////////////////////////////////////////////
/*!	@class	AquesTalk2

	@brief	規則音声合成エンジン AquesTalk2

  音声記号列から音声波形データをメモリ上に生成する
  出力音声波形は、8HKzサンプリング, 16bit,モノラル,WAVフォーマット


	@author	N.Yamazaki (Aquest)

	@date	2009/11/28	N.Yamazaki	Creation (from AuesTalk.h)
	@date	2011/02/03	N.Yamazaki	_Synthe CAqTkF_Init()の戻り値をチェック
*/
//  COPYRIGHT (C) 2009 AQUEST CORP.
//////////////////////////////////////////////////////////////////////
#if !defined(_AQUESTALK2_H_)
#define _AQUESTALK2_H_
#ifdef __cplusplus
extern "C"{
#endif

#if defined(AQUESTALK2_EXPORTS)
#undef	DllExport
#define DllExport	__declspec( dllexport )
#else
#define DllExport
#endif

#if !(defined(WIN32)||defined(WINCE))
#define	__stdcall		// for Linux etc.
#endif

/////////////////////////////////////////////
//!	音声記号列から音声波形を生成
//!	音声波形データは内部で領域確保される。
//!	音声波形データの解放は本関数の呼び出し側でAquesTalk_FreeWave()にて行う
//! @param	koe[in]		音声記号列（SJIS NULL終端）
//! @param	iSpeed[in]	発話速度 [%] 50-300 の間で指定 default:100
//!	@param	pSize[out]	生成した音声データのサイズ[byte]（エラーの場合はエラーコードが返る）
//!	@param	phontDat[in]	phontデータの先頭アドレスを指定します。このDLLのデフォルトPhontを用いるときは０を指定します。
//!	@return	WAVフォーマットの音声データの先頭アドレス。エラー時はNULLが返る
DllExport unsigned char * __stdcall AquesTalk2_Synthe(const char *koe, int iSpeed, int *pSize, void *phontDat);
//! @param	koe[in]		音声記号列（EUC NULL終端）
DllExport unsigned char * __stdcall AquesTalk2_Synthe_Euc(const char *koe, int iSpeed, int *pSize, void *phontDat);
//! @param	koe[in]		音声記号列（UTF8 NULL終端 BOMはつけられない）
DllExport unsigned char * __stdcall AquesTalk2_Synthe_Utf8(const char *koe, int iSpeed, int *pSize, void *phontDat);
//! @param	koe[in]		音声記号列（UTF16 NULL終端 BOMの有無は問わない　エンディアンは実行環境に従う）
DllExport unsigned char * __stdcall AquesTalk2_Synthe_Utf16(const unsigned short *koe, int iSpeed, int *pSize, void *phontDat);
//! @param	koe[in]		音声記号列（ローマ字表記 NULL終端）
DllExport unsigned char * __stdcall AquesTalk2_Synthe_Roman(const char *koe, int iSpeed, int *pSize, void *phontDat);

/////////////////////////////////////////////
//!	音声データの領域を開放
//!	@param  wav[in]		AquesTalk_Synthe()で返されたアドレスを指定
DllExport void __stdcall AquesTalk2_FreeWave(unsigned char *wav);

#ifdef __cplusplus
}
#endif
#endif // !defined(_AQUESTALK2_H_)
//  ----------------------------------------------------------------------
// !  Copyright AQUEST Corp. 2006- .  All Rights Reserved.                !
// !  An unpublished and CONFIDENTIAL work.  Reproduction, adaptation, or !
// !  translation without prior written permission is prohibited except   !
// !  as allowed under the copyright laws.                                !
//  ----------------------------------------------------------------------
