#!/bin/sh

set -e

docker build --build-arg PUBLIC_PATH="${PUBLIC_PATH:-"/"}" -t oceans-1876/challenger-portal -f ./docker/Dockerfile .
