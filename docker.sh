#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo ./docker.sh to print all commands
export DEBUG=${DEBUG:-""}
export MAPBOX_TOKEN=${MAPBOX_TOKEN:-""}
export PUBLIC_PATH=${PUBLIC_PATH:-""}


# Build docker image
$DEBUG docker build --build-arg MAPBOX_TOKEN="${MAPBOX_TOKEN}" --build-arg PUBLIC_PATH="${PUBLIC_PATH}" -t oceans-1876/frontend .
