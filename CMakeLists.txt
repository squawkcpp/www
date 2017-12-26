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

# ---------------------   External Dependencies       ---------------------
include(ExternalProject)
include(cmake/external/re2.cmake)
include(cmake/external/gtest.cmake)
include(cmake/external/asio.cmake)
include(cmake/external/lightning.cmake)
include(cmake/external/cxxopts.cmake)

SET( INCLUDES ${INCLUDES} ${GTEST_INCLUDE_DIR} ${FMT_INCLUDE_DIR}
            ${RE2_INCLUDE_DIR} ${ASIO_INCLUDE_DIR} ${LIGHTNING_INCLUDE_DIR}
            ${CXXOPTS_INCLUDE_DIR})

# -----------------------   GUI support             -----------------------

FILE(GLOB_RECURSE HeaderFiles "${PROJECT_SOURCE_DIR}/src/*.h")
add_custom_target(www_headers SOURCES ${HeaderFiles})

FILE(GLOB_RECURSE WWWFiles "${PROJECT_SOURCE_DIR}/docroot/*")
add_custom_target(www SOURCES ${WWWFiles})

# -----------------------   Compile Binary          -----------------------

aux_source_directory( ${PROJECT_SOURCE_DIR}/src WWW_SOURCES )
include_directories(${ROOT} ${INCLUDES} ${GTEST_INCLUDE_DIR})
add_executable(squawk-www ${WWW_SOURCES})
target_link_libraries(squawk-www cxxopts re2 lightning asio gtest Threads::Threads ${LIBS})
#TODO remove gtest, it is required because of lightning

install(TARGETS squawk-www RUNTIME DESTINATION bin)

# -----------------------   Generate Package        -----------------------
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

