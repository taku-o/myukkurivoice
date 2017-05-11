#!/bin/sh
cd `dirname $0`
cd ..
rm -rf myukkurivoice-darwin-x64/
rm -f myukkurivoice-darwin-x64.zip
electron-packager . myukkurivoice --platform=darwin --arch=x64 --version=1.4.12 --icon=icns/myukkurivoice.icns --overwrite --ignore="(\.gitignore|\.gitmodules|docs|icns|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac|vendor/aqtk2-mac)" --asar.unpackDir=vendor

