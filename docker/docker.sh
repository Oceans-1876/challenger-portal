#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo ./docker.sh to print all commands
export DEBUG=${DEBUG:-""}
export PUBLIC_PATH=${PUBLIC_PATH:-""}


# Build docker image
$DEBUG docker build --build-arg --build-arg PUBLIC_PATH="${PUBLIC_PATH}" -t oceans-1876/frontend -f ./docker/Dockerfile .
