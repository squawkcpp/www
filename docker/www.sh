#! /bin/sh -e

PATH=/bin:/usr/bin:/sbin:/usr/sbin

OPTIONS=""

if [ -n "$LISTEN" ]; then
    OPTIONS="$OPTIONS --listen $LISTEN"
fi

if [ -n "$HTTP_PORT" ]; then
    OPTIONS="$OPTIONS --http-port $HTTP_PORT"
fi

if [ -n "$CDS_URI" ]; then
    OPTIONS="$OPTIONS --cds $CDS_URI"
fi

if [ -n "$DOCROOT" ]; then
    OPTIONS="$OPTIONS --docroot DOCROOT"
fi

echo "start /usr/local/bin/squawk-www $OPTIONS"
/usr/local/bin/squawk-www $OPTIONS
