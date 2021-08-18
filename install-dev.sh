#!/usr/bin/env bash

function mydirname {
  pwd  >/tmp/x
  STR=`cat /tmp/x`
  FN=`awk -F\/ '{print NF}' /tmp/x`
  DIR=$(echo $STR | cut -f$FN -d"/")
  echo $DIR
}

HERE=`pwd`
NAME=${PWD##*/}

sudo ln -s "$HERE/dist" "/Library/Application Support/Adobe/CEP/extensions/$NAME.dev"
# echo "Faking install extension"
