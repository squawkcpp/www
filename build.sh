#!/bin/bash

set -e

sudo docker run -it -v $(pwd):/repo -v $(pwd)/.build:/build spielhuus/toolchain /bin/bash -c 'cd /build && \
	conan remote add bincrafters https://api.bintray.com/conan/bincrafters/public-conan && \
	conan remote add conan-cpp https://api.bintray.com/conan/squawkcpp/conan-cpp && \
	conan install /repo --build=missing -s compiler.libcxx=libstdc++11 && \
	cmake -H/repo -B/build -G Ninja -DCMAKE_MAKE_PROGRAM=/usr/bin/ninja -DWWW_TAG_VERSION=master
	cmake --build /build && \
	cmake --build /build --target package'

sudo docker build -f docker/Dockerfile -t squawk-www .

sudo rm -rf .build
