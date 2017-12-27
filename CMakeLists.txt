# -------------------------------------------------------------------------
# Build media server with html gui.
# -------------------------------------------------------------------------
cmake_minimum_required(VERSION 3.3)

project( www )

# -----------------------   Options and Parameters  -----------------------

SET(WWW_TAG_VERSION "master" CACHE STRING "The tagged version.")
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/Modules/")

set_property (GLOBAL PROPERTY USE_FOLDERS ON)

set (CMAKE_CXX_STANDARD 14)
set (CMAKE_CXX_STANDARD_REQUIRED ON)

set (THREADS_PREFER_PTHREAD_FLAG ON)
find_package (Threads REQUIRED)

link_libraries("-static")

find_program(CCACHE_FOUND ccache)
if(CCACHE_FOUND)
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE ccache)
    set_property(GLOBAL PROPERTY RULE_LAUNCH_LINK ccache)
endif(CCACHE_FOUND)

add_definitions( -DHTTP_BUFFER_SIZE=4096 -DHTTP_CLIENT_TIMEOUT=5
                 -DHTTP_SERVER_THREAD_POOL_SIZE=10 -DASIO_STANDALONE )

# ---------------------   External Dependencies       ---------------------
include(ExternalProject)
include(cmake/external/gtest.cmake)
include(cmake/external/re2.cmake)
include(cmake/external/asio.cmake)
include(cmake/external/lightning.cmake)
include(cmake/external/cxxopts.cmake)

# -----------------------   GUI support             -----------------------

FILE(GLOB_RECURSE HeaderFiles "${PROJECT_SOURCE_DIR}/src/*.h")
add_custom_target(www_headers SOURCES ${HeaderFiles})

FILE(GLOB_RECURSE WWWFiles "${PROJECT_SOURCE_DIR}/docroot/*")
add_custom_target(www SOURCES ${WWWFiles})

# -----------------------   Compile Binary          -----------------------

aux_source_directory( ${PROJECT_SOURCE_DIR}/src WWW_SOURCES )
include_directories(${ROOT} ${INCLUDES} ${RE2_INCLUDE_DIR}
                    ${ASIO_INCLUDE_DIR} ${LIGHTNING_INCLUDE_DIR}
                    ${CXXOPTS_INCLUDE_DIR}
)
add_executable(squawk-www ${WWW_SOURCES})
target_link_libraries(squawk-www cxxopts re2 lightning asio Threads::Threads ${LIBS})

install(TARGETS squawk-www RUNTIME DESTINATION bin)

# -----------------------   Generate Package        -----------------------
IF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")
install(DIRECTORY ${CMAKE_SOURCE_DIR}/docroot/ DESTINATION share/squawk-www )

INCLUDE(InstallRequiredSystemLibraries)
SET(CPACK_PACKAGING_INSTALL_PREFIX "/usr/local")
SET(CPACK_GENERATOR "TGZ")
SET(CPACK_COMPONENTS_ALL_IN_ONE_PACKAGE 1)
SET(CPACK_INCLUDE_TOPLEVEL_DIRECTORY 0)

SET(CPACK_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${WWW_TAG_VERSION}")
SET(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${WWW_TAG_VERSION}")
INCLUDE(CPack)

ENDIF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")
