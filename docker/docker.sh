#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo ./docker.sh to print all commands
export DEBUG=${DEBUG:-""}
export PUBLIC_PATH=${PUBLIC_PATH:-""}
# export UNIT_PREF=unit_pref # TODO: Add this line to add this required environment variable? 


# Build docker image
$DEBUG docker build --build-arg --build-arg PUBLIC_PATH="${PUBLIC_PATH}" -t oceans-1876/frontend -f ./docker/Dockerfile .
