#ifndef SERVER_H
#define SERVER_H

#include <memory>

#include "http/server.h"
#include "http/httpserver.h"

namespace www {

class Server {
public:
    /** @brief The CDS Server CTOR. */
    Server(std::shared_ptr< http::Server< http::HttpServer > > web_server, /** @param web_server the server to attach the API uri's. */
           const std::string& docroot, const std::string& cds_uri );
};
}//namespace www
#endif // SERVER_H
