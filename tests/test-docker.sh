#!/bin/bash -e

# shellcheck disable=SC1090
source "$(dirname "$0")"/../scripts/resources.sh

main(){
    for DIRECTORY in ./containers/*; do
        if [ "$DIRECTORY" == "./containers/blockchain" ]; then
          echo "Ignoring blockchain folder"
        else
          pushd "$DIRECTORY"
          if ! docker build --quiet .; then
              test_failed "$0"
          fi
          popd
        fi
    done
    test_passed "$0"
}

main "$@"
