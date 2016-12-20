//
//  HelloAqKanji2KoeAppDelegate.h
//  HelloAqKanji2Koe
//
//  Created by yamazaki on 11/02/04.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface HelloAqKanji2KoeAppDelegate : NSObject <NSApplicationDelegate> {
    NSWindow *window;
	IBOutlet id textfieldKanji;
	IBOutlet id textfieldKoe;
}

@property (assign) IBOutlet NSWindow *window;
- (IBAction)convKanji2Koe:(id)sender;

@end
