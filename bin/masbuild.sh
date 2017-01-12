#!/bin/sh
electron-packager . myukkurivoice --platform=mas --arch=x64 --version=1.4.12 --icon=icns/myukkurivoice.icns --overwrite --ignore="(\.gitignore|\.gitmodules|docs|icns|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac-eva|vendor/aqtk2-mac)" --asar.unpackDir=vendor --app-bundle-id="jp.nanasi.myukkurivoice" --app-category-type="public.app-category.utilities" --app-version="0.2.0" --build-version="0.2.0" --osx-sign --entitlements="bin/parent.plist" --entitlements-inherit="bin/child.plist" --identity="3rd Party Mac Developer Application: Taku Omi (52QJ97GWTE)"

