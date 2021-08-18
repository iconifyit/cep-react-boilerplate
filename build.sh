#!/usr/bin/env bash

set -o pipefail

# ============================================================
# Create version string.
# ============================================================

HERE=`pwd`
NAME='icon-mason'

echo $HERE

echo "[Build] - Building ${NAME} ..."

DATE=`date +%s`
CERT='selfDB.p12'
KEY='Alias2Mocha7'
ORG="Atomic Lotus, LLC"
COUNTRY="US"
CITY="Richmond"
DOMAIN="atomiclotus.net"
BUNDLE_ID="$NAME"

# ============================================================
# Commit code to git repo
# ============================================================

echo "[Build] - Run git add"

git add *

echo "[Build] - Run git commit"

git commit -m "[Build] - Commit before building packages"

echo "[Build] - Run git push"

git push

#/usr/local/bin/node --max-old-space-size=8192 node_modules/webpack/bin/webpack.js --mode production

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

if [ -f mason-icon.png ]; then
  cp mason-icon.png build/
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
# Build custom installers
# ============================================================

#echo "Build : Running cep-packager to create ZXP & OS Installers"
#
#OUTPUT=$(
#    cep-packager \
#        --name $NAME \
#        --bundle-id $BUNDLE_ID \
#        --version $VERS \
#        --macos-resources $PWD/resources/macos \
#        --windows-resources $PWD/resources/windows \
#        --macos-dest $PWD/zxp/$NAME.$VERS.pkg \
#        --windows-dest $PWD/zxp/$NAME.$VERS.exe \
#        ./build
#)
#
#echo $OUTPUT

# ============================================================
# Nuke the dist dir
# ============================================================

echo "[Build] - Rebuild build dir"

rm -R -f build
mkdir -p build

# ============================================================
# Copy aes source to build dir
# ============================================================

echo "[Build] - Copy AES source code to build dir"

cp -R aes/* build/

# ============================================================
# Delete un-minified main.js
# ============================================================

if [ -f aes/main.js ]; then
  rm aes/main.js
fi

# ============================================================
# Build and sign the AES version of extension.
# ============================================================

echo "[Build] - Build and sign the AES version of ZXP extension."

OUTPUT=$(./bin/ZXPSignCmd -selfSignedCert $COUNTRY $CITY "$ORG" $DOMAIN $KEY ./bin/$CERT)

echo "[Build] - ${OUTPUT}"

OUTPUT=$(./bin/ZXPSignCmd -sign build zxp/$NAME-$VERS.aes.zxp ./bin/$CERT $KEY -tsa https://www.safestamper.com/tsa)

# ============================================================
# Show output
# ============================================================

echo "[Build] - ${OUTPUT}"

echo "[Build] - Done!"
