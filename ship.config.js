// Currently, ship.js does not support ignoring individual packages.
// The code below is adapted from shipjs-lib to ignore specific packages by prefixing their names with "!".
// Reference: https://github.com/algolia/shipjs/blob/main/packages/shipjs-lib/src/lib/util/expandPackageList.js

const { resolve, join, sep } = require("path");
const { readdirSync, existsSync } = require("bun:fs");

// Get all directories within a directory that contain a package.json file.
const getPackageDirectories = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          existsSync(join(dir, entry.name, "package.json"))
      )
      .map((entry) => join(dir, entry.name));
  } catch {
    return [];
  }
};

// Expand a list of package patterns into absolute paths while ignoring specific packages.
function expandPackageList(patterns, baseDir = ".") {
  const ignoreSet = new Set(
    patterns
      .filter((pattern) => pattern.startsWith("!"))
      .map((pattern) => resolve(baseDir, pattern.slice(1)))
  );

  const expandedPaths = [];
  for (const pattern of patterns) {
    // Skip ignored patterns
    if (pattern.startsWith("!")) continue;

    // Expand directories (e.g., "packages/*")
    if (pattern.endsWith("/*")) {
      expandedPaths.push(
        ...getPackageDirectories(resolve(baseDir, pattern.slice(0, -2)))
      );
    }
    // Handle grouped patterns (e.g., "@(a|b)")
    else if (pattern.includes("@(")) {
      const parts = pattern.split(sep);
      const newPatterns = [];

      for (const part of parts) {
        if (part.startsWith("@(") && part.endsWith(")")) {
          const options = part.slice(2, -1).split("|");
          for (const option of options) {
            newPatterns.push(
              parts.map((p) => (p === part ? option : p)).join(sep)
            );
          }
          break;
        }
      }

      expandedPaths.push(...expandPackageList(newPatterns, baseDir));
    }
    // Default case: treat as a single package path
    else {
      expandedPaths.push(resolve(baseDir, pattern));
    }
  }

  // Remove ignored packages and filter for valid package.json paths
  return expandedPaths.filter(
    (pkg) => !ignoreSet.has(pkg) && existsSync(join(pkg, "package.json"))
  );
}

module.exports = {
  appName: "@yeti/ecosystem",
  buildCommand: () => "bun run build",
  installCommand: () => "bun install --recursive",
  monorepo: {
    mainVersionFile: "package.json",
    packagesToBump: expandPackageList([
      "packages/*",
      "!packages/eslint-config",
      "!packages/ui",
    ]),
    packagesToPublish: expandPackageList([
      "packages/*",
      "!packages/eslint-config",
      "!packages/ui",
    ]),
  },
  publishCommand: () => "npm publish --access public",
};
