# Dockerfile to install web server (WWW)
FROM ubuntu:xenial

RUN apt-get -y update \
&& apt-get install -y wget

ADD build/www_.deb /www_.deb

RUN apt-get install -y libpcrecpp0v5 libimlib2 libavcodec-ffmpeg56 libavformat-ffmpeg56 libavutil-ffmpeg54 libpoppler-cpp0 libboost-filesystem1.58.0 \
        libcurl3 libhiredis0.13 libev4 libmagic1 libopencv-highgui2.4v5 \
&& dpkg -i /www_.deb

ADD script/www.sh /www.sh
RUN chmod +x /*.sh

EXPOSE 9000

CMD ["/www.sh"]
