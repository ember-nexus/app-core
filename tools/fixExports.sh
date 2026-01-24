#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR/../core/src" || exit 1

folderExports=$( \
  find . -type f -name 'index.ts' | \
  sed -r 's|/[^/]+$||' | \
  sort | \
  uniq | \
  jq --slurp --raw-input '
    split("\n")[:-1]
    | map({
        (.): {
          import: {
            types: ("./dist/types/" + (. | ltrimstr("./")) + "/index.d.ts"),
            default: ("./dist/esm/" + (. | ltrimstr("./")) + "/index.js")
          }
        }
      })
    | add
    | del(.["."])
  '
)

indexExports='{"./package.json": "./package.json", ".": {"import": {"types": "./dist/types/index.d.ts", "default": "./dist/esm/index.js"}}}'
exports=$(jq -n \
  --argjson indexExports "$indexExports" \
  --argjson folderExports "$folderExports" \
  '$indexExports + $folderExports'
)

cd "$SCRIPT_DIR/../core" || exit 1

package=$(cat package.json)
newPackage=$(jq -n \
  --argjson package "$package" \
  --argjson exports "$exports" \
  '$package | .exports = $exports'
)

echo "$newPackage" > package.json
echo "Fixed package.json exports"
