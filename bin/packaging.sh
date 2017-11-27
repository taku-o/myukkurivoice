#!/bin/sh
cd `dirname $0`
cd ..
rm -rf MYukkuriVoice-darwin-x64/
electron-packager . MYukkuriVoice --platform=darwin --arch=x64 --electronVersion=1.7.9 --icon=icns/myukkurivoice.icns --overwrite --ignore="(\.gitignore|\.gitmodules|docs|icns|test|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac|vendor/aqtk2-mac|vendor/aqtk10-mac)" --asar.unpackDir=vendor

