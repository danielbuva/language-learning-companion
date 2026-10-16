#!/bin/sh
set -eu
cd "$(dirname "$0")"
swift build -c release
mkdir -p dist/Kuwento.app/Contents/MacOS
cp .build/release/Kuwento dist/Kuwento.app/Contents/MacOS/Kuwento
cp Info.plist dist/Kuwento.app/Contents/Info.plist
codesign --force --sign - dist/Kuwento.app
(cd dist && ditto -c -k --sequesterRsrc --keepParent Kuwento.app Kuwento-macOS-arm64.zip)
printf 'Built %s/macos/dist/Kuwento.app\n' "$(dirname "$PWD")"
