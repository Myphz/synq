set -e
# SETUP: Arch Linux machine w/ JDK 21 (jdk21-openjdk AUR) and android-sdk-cmdline-tools-latest.
if [ -z "$1" ]; then
  echo "No argument supplied! Enter version (e.g: 1.2.5)"
  exit
fi

VERSION=$1
VERSION_FILE_PATH="./src/version.ts"

# Save version in version.ts file to be available at runtime
sed -i "s|export const APP_VERSION = \".*\";|export const APP_VERSION = \"$VERSION\";|" "$VERSION_FILE_PATH"

npm run build

rm -rf ./bundle
mkdir bundle

npx cap sync

rm -rf ./build
npx -y @capacitor/assets generate --android

# Set build number
build=$(cat buildnumber)
newbuild=$(($build + 1))
npx -y capacitor-set-version set:android -v $VERSION -b $newbuild
echo $newbuild >buildnumber

cd android

./gradlew bundleRelease
mv app/build/outputs/bundle/release/app-release.aab ../bundle/synq-unsigned.aab

# Sign bundle
cd ../bundle
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore ~/keys/synq.keystore -signedjar synq.aab synq-unsigned.aab synq
rm synq-unsigned.aab

# Update package.json version
npm version $VERSION --no-git-tag-version --allow-same-version

# Commit and push
git add -A
git commit -m "Release version ${VERSION}"
git push
