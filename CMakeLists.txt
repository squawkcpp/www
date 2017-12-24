# -------------------------------------------------------------------------
# Build Media server with html gui.
# -------------------------------------------------------------------------
cmake_minimum_required(VERSION 3.3)

project( www )

SET(UPNP_TAG_VERSION "master" CACHE STRING "The tagged version.")

# -------------------------------------------------------------------------
# -----------------------   Options and Parameters  -----------------------
# -------------------------------------------------------------------------
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/Modules/")

# -------------------------------------------------------------------------
# -----------------------   Config Toolchain        -----------------------
# -------------------------------------------------------------------------
if(CMAKE_COMPILER_IS_GNUCXX)
    add_definitions(-std=c++14)
endif()

# -------------------------------------------------------------------------
# ---------------------   External Dependencies       ---------------------
# -------------------------------------------------------------------------
include(ExternalProject)
include(cmake/external/re2.cmake)
include(cmake/external/gtest.cmake)
include(cmake/external/asio.cmake)
include(cmake/external/fmt.cmake)
include(cmake/external/lightning.cmake)
include(cmake/external/cxxopts.cmake)
include(cmake/external/redox.cmake)
include(cmake/external/spdlog.cmake)

SET( INCLUDES ${INCLUDES} ${GTEST_INCLUDE_DIR} ${FMT_INCLUDE_DIR}
            ${RE2_INCLUDE_DIR} ${ASIO_INCLUDE_DIR} ${LIGHTNING_INCLUDE_DIR}
            ${CXXOPTS_INCLUDE_DIR} ${REDOX_INCLUDE_DIR} ${SPDLOG_INCLUDE_DIR})

# -------------------------------------------------------------------------
# -----------------------   Find Dependencies       -----------------------
# -------------------------------------------------------------------------
find_package(Boost 1.54.0 COMPONENTS filesystem system)
#find_package(CURLpp REQUIRED)
find_package(CURL REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(Hiredis)
find_package(Libev)

SET( LIBS ${LIBS}
    ${Boost_LIBRARIES} ${CURL_LIBRARIES}
    ${OPENSSL_LIBRARIES} ${LIBHIREDIS_LIBRARIES} ${LIBEV_LIBRARIES}
    -lpthread -luuid -lm -lz
)

#add headers for editor
FILE(GLOB_RECURSE HeaderFiles "${PROJECT_SOURCE_DIR}/src/*.h")
add_custom_target(www_headers SOURCES ${HeaderFiles})

FILE(GLOB_RECURSE WWWFiles "${PROJECT_SOURCE_DIR}/docroot/*")
add_custom_target(www SOURCES ${WWWFiles})

# -------------------------------------------------------------------------
# -----------------------   Compile Binary          -----------------------
# -------------------------------------------------------------------------
aux_source_directory( ${PROJECT_SOURCE_DIR}/src WWW_SOURCES )
include_directories(${ROOT} ${INCLUDES} ${GTEST_INCLUDE_DIR})
add_executable(squawk-www ${WWW_SOURCES})
target_link_libraries(squawk-www cxxopts re2 lightning redox fmt spdlog asio gtest ${LIBS})
#TODO remove gtest, it is required because of lightning

install(TARGETS squawk-www RUNTIME DESTINATION bin)

# -------------------------------------------------------------------------
# -----------------------   Generate Package        -----------------------
# -------------------------------------------------------------------------
IF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")
install(DIRECTORY ${CMAKE_SOURCE_DIR}/docroot/ DESTINATION share/squawk-www )

INCLUDE(InstallRequiredSystemLibraries)
SET(CPACK_PACKAGING_INSTALL_PREFIX "/usr/local")
SET(CPACK_GENERATOR "TGZ")
SET(CPACK_COMPONENTS_ALL_IN_ONE_PACKAGE 1)
SET(CPACK_INCLUDE_TOPLEVEL_DIRECTORY 0)

if(WWW_TAG_VERSION MATCHES "^([0-9]+)[.]([0-9]+)[.]([0-9]+)$" )
    string(REPLACE "." ";" WWW_TAG_VERSION_STRING ${WWW_TAG_VERSION})
    list(GET WWW_TAG_VERSION_STRING 0 MAJOR_VERSION)
    list(GET WWW_TAG_VERSION_STRING 1 MINOR_VERSION)
    list(GET WWW_TAG_VERSION_STRING 2 PATCH_VERSION)
else()
    SET(MAJOR_VERSION "0")
    SET(MINOR_VERSION "0")
    SET(PATCH_VERSION "0")
endif()

SET(CPACK_PACKAGE_VERSION_MAJOR "${MAJOR_VERSION}")
SET(CPACK_PACKAGE_VERSION_MINOR "${MINOR_VERSION}")
SET(CPACK_PACKAGE_VERSION_PATCH "${PATCH_VERSION}")

SET(CPACK_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${WWW_TAG_VERSION}")
SET(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${WWW_TAG_VERSION}")
INCLUDE(CPack)

ENDIF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")

