#!/bin/sh
cd `dirname $0`
cd ..
rm -rf MYukkuriVoice-darwin-x64/
electron-packager . MYukkuriVoice --platform=darwin --arch=x64 --electronVersion=1.7.9 --icon=icns/myukkurivoice.icns --overwrite --asar.unpackDir=vendor \
    --ignore="^/MYukkuriVoice-darwin-x64" \
    --ignore="^/README.md" \
    --ignore="^/\.git" \
    --ignore="^/\.gitignore" \
    --ignore="^/\.gitmodules" \
    --ignore="^/bin" \
    --ignore="^/docs" \
    --ignore="^/icns" \
    --ignore="^/test" \
    --ignore="^/vendor/.gitignore" \
    --ignore="^/vendor/aqk2k_mac" \
    --ignore="^/vendor/aqtk1-mac" \
    --ignore="^/vendor/aqtk10-mac" \
    --ignore="^/vendor/aqtk2-mac" \
    --ignore="\.DS_Store"

