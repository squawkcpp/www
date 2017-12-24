#!/bin/bash

sudo docker pull spielhuus/clang:latest
sudo docker run -itd --name build_www -v $(pwd):/repo -v $(pwd)/build:/build spielhuus/clang
sudo docker exec build_www /usr/sbin/pacman --noconfirm -S boost doxygen make git

sudo docker exec build_www cmake -H/repo -B/build -G Ninja -DCMAKE_MAKE_PROGRAM=/usr/bin/ninja -DCDS_TAG_VERSION=master
sudo docker exec build_www cmake --build /build
sudo docker exec build_www cmake --build /build --target package

sudo docker build -f docker/Dockerfile --build-arg CDS_TAG_VERSION=master -t www .

sudo docker rm -f build_www
sudo rm -rf build



