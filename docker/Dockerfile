# Dockerfile to install web server (WWW)
FROM base/archlinux:latest

ARG WWW_TAG_VERSION=master

RUN pacman -Syu --noconfirm && \
    pacman --noconfirm -S boost make

ADD build/www_$WWW_TAG_VERSION.tar.gz /

ADD docker/www.sh /www.sh
RUN chmod +x /*.sh

EXPOSE 9000

CMD ["/www.sh"]
