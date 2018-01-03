#!/bin/bash

set -e

IMAGE=spielhuus/toolchain
TAG=`if [ -z "$2" ]; then echo "master"; else echo "$2" ; fi`
PID=$(sudo docker run -itd -v $(pwd):/repo -v $(pwd)/.build:/build $IMAGE /bin/sh)
echo "build squawk-www tag:$TAG, image:$PID"

DOCKER_EXEC="sudo docker exec $PID /bin/sh -c"

$DOCKER_EXEC "cd build && conan install /repo --build=missing -s compiler.libcxx=libstdc++11"
$DOCKER_EXEC "cmake -H/repo -B/build -G Ninja -DCMAKE_MAKE_PROGRAM=/usr/bin/ninja -DWWW_TAG_VERSION=$TAG"
$DOCKER_EXEC "cmake --build /build"
$DOCKER_EXEC "cmake --build /build --target package"

sudo docker build -f docker/Dockerfile --build-arg WWW_TAG_VERSION=$TAG -t squawk-www .

sudo docker rm -f $PID
