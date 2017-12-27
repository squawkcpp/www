# Dockerfile to install web server (WWW)
FROM busybox:musl

ARG WWW_TAG_VERSION=master

ADD build/www_$WWW_TAG_VERSION.tar.gz /

ADD docker/www.sh /www.sh
RUN chmod +x /*.sh

EXPOSE 9000

CMD ["/www.sh"]
