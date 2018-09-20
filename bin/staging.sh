cd `dirname $0`
cd release
cap staging clean
if [ $# -ne 1 ]; then
  GIT_BRANCH="develop" cap staging package
else
  GIT_BRANCH="$1" cap staging package
fi

