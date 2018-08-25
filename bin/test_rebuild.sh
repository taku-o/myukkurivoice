cd `dirname $0`
cd ..

# build package
sh bin/packaging.sh

# run test
NODE_PATH="$HOME/.nvm/versions/node/v8.2.1/lib/node_modules" mocha --bail $*
