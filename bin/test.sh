cd `dirname $0`
cd ..

# build package
if [ ! -d MYukkuriVoice-darwin-x64 ]
then
    sh bin/packaging.sh
fi

# run test
node_modules/.bin/mocha --bail $*
