cmake_minimum_required(VERSION 3.11)
project(pntr_app_web
    DESCRIPTION "Web host for pntr_app games"
    HOMEPAGE_URL "https://github.com/konsumer/pntr_app_web"
    VERSION 0.0.1
    LANGUAGES C
)

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif()

set(CMAKE_EXE_LINKER_FLAGS "-s USE_GLFW=3  -O2 -s WASM=1")

list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/.cmake")

find_package(pntr REQUIRED)
find_package(pntr_app REQUIRED)

add_executable(${PROJECT_NAME} src/main.c)
target_compile_definitions(${PROJECT_NAME} PUBLIC PNTR_APP_WEB)
target_link_libraries(${PROJECT_NAME} PUBLIC pntr pntr_app)
set_target_properties(${PROJECT_NAME} PROPERTIES SUFFIX ".mjs")
set_property(TARGET ${PROJECT_NAME} PROPERTY C_STANDARD 99)

set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS}")
