#include "server.h"

#include "cxxopts.hpp"

#include <iostream>
#include <string>

#include "http/mod/exec.h"
#include "http/mod/file.h"
#include "http/mod/match.h"
#include "http/mod/method.h"

static const char* PARAM_LISTEN_ADDRESS = "listen";
static const char* PARAM_HTTP_PORT = "http-port";
static const char* PARAM_CDS_URI = "cds";
static const char* PARAM_DOCROOT = "docroot";
static const char* PARAM_REDIS_PORT = "redis-port";

void signalHandler( int signum ) {
    std::cout << "Interrupt signal (" << signum << ") received.\n";
    exit( signum );
}

int main( int argc, char* argv[] ) {
    //parse args
    cxxopts::Options options("Squawk upnp cli", "Command line interface for the squawk upnp media server.");
    options.add_options()            
        ( PARAM_LISTEN_ADDRESS, "The the address for the http server.", cxxopts::value<std::string>()->default_value("0.0.0.0"), "IP" )
        ( PARAM_HTTP_PORT, "Port of the web server.", cxxopts::value<std::string>()->default_value("9000"), "PORT" )
        ( PARAM_CDS_URI, "CDS uri.", cxxopts::value<std::string>(), "URI" )
        ( PARAM_DOCROOT, "Path to the web application files.)", cxxopts::value<std::string>()->default_value("/usr/local/share/squawk-www"), "PATH" )
        ( "help", "Print help")
      ;

    auto result = options.parse(argc, argv);

    if( result.count( "help" ) ) {
         std::cout << options.help({"", "Group"}) << std::endl;
         exit(0);
    }

    std::string _ip, _port, _docroot, _cds_uri;
    if ( result.count( PARAM_LISTEN_ADDRESS ) )
    { _ip = result[PARAM_LISTEN_ADDRESS].as<std::string>(); }
    else { _ip = "0.0.0.0"; }
    if ( result.count( PARAM_HTTP_PORT ) )
    { _port = result[PARAM_HTTP_PORT].as<std::string>(); }
    else { _port = "9000"; };
    if ( result.count( PARAM_DOCROOT ) )
    { _docroot = result[PARAM_DOCROOT].as<std::string>(); }
    else { _docroot = "/usr/local/share/squawk-www"; }
    if ( result.count( PARAM_CDS_URI ) )
    { _cds_uri = result[PARAM_CDS_URI].as<std::string>(); }
    else { _cds_uri = ""; }

    //start server
    std::cout <<  "Start content directory server ({" << _ip << "}:{" << _port << "})" << std::endl;

    /** Setup and start the HTTP Server **/
    auto _web_server = std::shared_ptr< http::Server< http::HttpServer > >( new http::Server< http::HttpServer >( _ip, _port ) );
    www::Server _server( _web_server, _docroot, _cds_uri );

    // register signal SIGINT and signal handler
    signal(SIGINT, signalHandler);

    while(1)
    { sleep(1); }

    //wait
    return 0;
}

namespace www {
Server::Server(std::shared_ptr< http::Server< http::HttpServer > > web_server, /** @param web_server the server to attach the API uri's. */
               const std::string& docroot, const std::string& cds_uri ) {

    /* path to the web gui files */
    web_server->bind( http::mod::Match<>( "/config.js" ),
                      http::mod::Exec([&cds_uri](http::Request&, http::Response& response ) -> http::http_status {
                          response << "var API_URI=\"" << cds_uri << "\"\r\n";
                           response.parameter ( http::header::CONTENT_TYPE, http::mime::mime_type ( http::mime::JS ) );
                          response.parameter ( "Access-Control-Allow-Origin", "*" );
                          return http::http_status::OK;
                      }), http::mod::Http() );

    /* path to the web gui files */
    web_server->bind( http::mod::Match<>( "*" ),
                      http::mod::File( docroot ),
                      http::mod::Http(), http::mod::Exec([this](http::Request& request, http::Response& response ) -> http::http_status {
                          response.parameter( "Access-Control-Allow-Origin", "*" );
                          return http::http_status::OK;
                      }));
}
}//namespace www
