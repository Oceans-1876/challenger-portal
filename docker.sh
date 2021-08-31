#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo ./docker.sh to print all commands
export DEBUG=${DEBUG:-""}
export MAPBOX_TOKEN=${MAPBOX_TOKEN:-""}

# Build docker image
$DEBUG docker build --build-arg MAPBOX_TOKEN="${MAPBOX_TOKEN}" -t oceans-1876/frontend .
