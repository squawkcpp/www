[![Build Status](https://travis-ci.org/squawkcpp/www.svg?branch=master)](https://travis-ci.org/squawkcpp/www)
[![GitHub version](https://badge.fury.io/gh/squawkcpp%2Fwww.svg)](https://badge.fury.io/gh/squawkcpp%2Fwww)

# Web Gui Server (WWW)

Squawk Web Gui Server (WWW) is a service that provides a gui in the browser.

## Installation

### Install static Package

A prebuild static package is available as github release:

<pre>
% wget https://github.com/squawkcpp/cds/releases/download/&lt;TAG&gt;/cds_&lt;TAG&gt;.tar.gz
% tar xfz cds_&lt;TAG&gt;.tar.gz -C /
</pre>

### Use Docker Image

Install and run the docker image with the parameters for the www gui server.

<pre>
sudo docker run -it --name squawk-www -e CDS_URI=http://192.168.0.1:9001 \
                -p 9000:9000 -e HTTP_PORT=9000 -e LISTEN=192.168.0.1
                squawkcpp/www[:TAG]
</pre>

The options are the same as for the command line.

## Usage

```
squawk-www [OPTION...]
```

##### options

name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | value | description
------------ | ------------- | -------------
--listen|IP|API Webserver IP-Adress to bind to.
--http-port|PORT|API Webserver IP Port to bind to.
--cds|Uri|Uri to the content directory API.
--docroot|PATH|Path to the html pages.
--help| |Print help

## Dependencies:

these libraries will be downloaded and staticaly linked during the compile process.

- [asio](http://think-async.com) is a cross-platform C++ library for network and low-level I/O programming that provides developers with a consistent asynchronous model using a modern C++ approach.
- [cxxopts](https://github.com/jarro2783/cxxopts), lightweight C++ command line option parser
- [re2](https://github.com/google/re2) is a fast, safe, thread-friendly alternative to backtracking regular expression engines like those used in PCRE, Perl, and Python. It is a C++ library.

## Licence:

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
