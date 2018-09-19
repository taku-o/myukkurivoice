cd `dirname $0`
cd ..

# build package
sh bin/packaging.sh

# run test
node_modules/.bin/mocha --bail $*
