cd `dirname $0`
cd ..

NODE_PATH="$HOME/.nvm/versions/node/v8.2.1/lib/node_modules" mocha
