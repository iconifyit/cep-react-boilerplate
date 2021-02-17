#!/usr/bin/env bash

PORT="8086"

if [[ "$1" ]]; then
  PORT="$1"
fi

/Applications/cefclient.app/Contents/MacOS/cefclient --url=http://127.0.0.1:$PORT

