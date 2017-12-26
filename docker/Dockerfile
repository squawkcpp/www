# Dockerfile to install web server (WWW)
FROM nfnty/arch-mini

ARG WWW_TAG_VERSION=master

ADD build/www_master.tar.gz /

ADD docker/www.sh /www.sh
RUN chmod +x /*.sh

EXPOSE 9000

CMD ["/www.sh"]
