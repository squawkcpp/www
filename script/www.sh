#! /bin/bash -e

PATH=/bin:/usr/bin:/sbin:/usr/sbin

/usr/local/bin/www $WWW_OPTS

tail -f /var/log/dmesg
