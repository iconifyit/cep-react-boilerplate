#!/usr/bin/env bash

set -o pipefail

# ============================================================
# Create version string.
# ============================================================

HERE=`pwd`
NAME=${PWD##*/}

echo $HERE

echo "[Build] - Building ${NAME} ..."

DATE=`date +%s`
CERT='selfDB.p12'
KEY='[add-your-key]'
ORG="[add-your-org]"
COUNTRY="US"
CITY="New York"
DOMAIN="atomiclotus.net"
BUNDLE_ID="$NAME"

# ============================================================
# Execute Gulp build to concat assets.
# ============================================================

echo "[Build] - Run webpack & gulp builds"

npm run dev

# ============================================================
# Wait for gulp build to complete.
# ============================================================

wait $!

# ============================================================
# Get version number (was written by gulpfile.js)
# ============================================================

VERS=`cat VERSION`

# ============================================================
# If the `build` directory exists, delete it.
# ============================================================

echo "[Build] - clear previous build folder"

if [ -d build ]; then
    rm -Rf build
fi

# ============================================================
# If the `zxp` directory exists, clear its contents.
# ============================================================

echo "[Build] - clear previous zxp folder"

if [ -d zxp ]; then
    rm -Rf zxp/*
fi

# ============================================================
# If the `zxp` directory does not exist, create it.
# ============================================================

if [ ! -d zxp ]; then
    echo "[Build] - create zxp folder"
    mkdir -p zxp
fi

# ============================================================
# Create a clean build directory.
# ============================================================

echo "[Build] - create build folder"

mkdir -p build

# ============================================================
# Copy source code to build directory.
# ============================================================

echo "[Build] - copy source code"

cp -R dist/* build/

if [ -f icon.png ]; then
  cp icon.png build/
fi

# ============================================================
# Build and sign the extension.
# ============================================================

echo "[Build] - Build and sign the ZXP extension."

OUTPUT=$(./bin/ZXPSignCmd -selfSignedCert $COUNTRY $CITY "$ORG" $DOMAIN $KEY ./bin/$CERT)

echo "[Build] - ${OUTPUT}"

OUTPUT=$(./bin/ZXPSignCmd -sign build zxp/$NAME-$VERS.zxp ./bin/$CERT $KEY -tsa https://www.safestamper.com/tsa)

echo "[Build] - ${OUTPUT}"

# ============================================================
# Nuke the dist dir
# ============================================================

echo "[Build] - Rebuild build dir"

rm -R -f build
mkdir -p build

# ============================================================
# Build and sign the extension.
# ============================================================

OUTPUT=$(./bin/ZXPSignCmd -sign build zxp/$NAME-$VERS.zxp ./bin/$CERT $KEY -tsa https://www.safestamper.com/tsa)

# ============================================================
# Show output
# ============================================================

echo "[Build] - ${OUTPUT}"

echo "[Build] - Done!"
