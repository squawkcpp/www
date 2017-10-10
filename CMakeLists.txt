# -------------------------------------------------------------------------
# Build Media server with html gui.
# -------------------------------------------------------------------------
cmake_minimum_required(VERSION 3.3)

project( www )

SET(MAJOR_VERSION "0")
SET(MINOR_VERSION "1")
SET(PATCH_VERSION "1" CACHE PATCH_VERSION "The package build number." )

# -------------------------------------------------------------------------
# -----------------------   Options and Parameters  -----------------------
# -------------------------------------------------------------------------
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/Modules/")

configure_file(${PROJECT_SOURCE_DIR}/Dockerfile.in ${PROJECT_SOURCE_DIR}/Dockerfile @ONLY)
configure_file(${PROJECT_SOURCE_DIR}/travis.yml.in ${PROJECT_SOURCE_DIR}/.travis.yml @ONLY)

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
add_custom_target(cds_headers SOURCES ${HeaderFiles})

FILE(GLOB_RECURSE WWWFiles "${PROJECT_SOURCE_DIR}/docroot/*")
add_custom_target(www SOURCES ${WWWFiles})

# -------------------------------------------------------------------------
# -----------------------   Compile Binary          -----------------------
# -------------------------------------------------------------------------
aux_source_directory( ${PROJECT_SOURCE_DIR}/src WWW_SOURCES )
include_directories(${ROOT} ${INCLUDES} ${GTEST_INCLUDE_DIR})
add_executable(squawk-www ${WWW_SOURCES})
target_link_libraries(squawk-www re2 lightning asio redox fmt spdlog ${LIBS})

install(TARGETS squawk-www RUNTIME DESTINATION bin)

# -------------------------------------------------------------------------
# -----------------------   Generate Package        -----------------------
# -------------------------------------------------------------------------
IF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")
install(DIRECTORY ${CMAKE_SOURCE_DIR}/docroot/ DESTINATION share/squawk-www )

INCLUDE(InstallRequiredSystemLibraries)

SET(CPACK_SET_DESTDIR "on")
SET(CPACK_PACKAGING_INSTALL_PREFIX "/tmp")
SET(CPACK_GENERATOR "DEB")

set(CPACK_ARCHIVE_COMPONENT_INSTALL ON)

SET(CPACK_PACKAGE_DESCRIPTION "loudlabs media server")
SET(CPACK_PACKAGE_DESCRIPTION_SUMMARY "squawk web server.")
SET(CPACK_PACKAGE_VENDOR "loudlabs")
SET(CPACK_PACKAGE_CONTACT "squawkcpp@gmail.com")
SET(CPACK_PACKAGE_VERSION_MAJOR "${MAJOR_VERSION}")
SET(CPACK_PACKAGE_VERSION_MINOR "${MINOR_VERSION}")
SET(CPACK_PACKAGE_VERSION_PATCH "${PATCH_VERSION}")
SET(CPACK_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${MAJOR_VERSION}.${MINOR_VERSION}.${CPACK_PACKAGE_VERSION_PATCH}")
SET(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}_${MAJOR_VERSION}.${MINOR_VERSION}.${CPACK_PACKAGE_VERSION_PATCH}")

SET(CPACK_DEBIAN_PACKAGE_DEPENDS "libpcrecpp0v5")
SET(CPACK_DEBIAN_PACKAGE_PRIORITY "optional")
SET(CPACK_DEBIAN_PACKAGE_SECTION "media")
SET(CPACK_DEBIAN_ARCHITECTURE ${CMAKE_SYSTEM_PROCESSOR})
SET(CPACK_COMPONENTS_ALL applications Libraries ApplicationData)
INCLUDE(CPack)

ENDIF(EXISTS "${CMAKE_ROOT}/Modules/CPack.cmake")

