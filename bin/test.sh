cd `dirname $0`
cd ..

# build package
if [ ! -d MYukkuriVoice-darwin-x64 ]
then
    sh bin/packaging.sh
fi

# run test
NODE_PATH="$HOME/.nvm/versions/node/v8.2.1/lib/node_modules" mocha --bail $*
