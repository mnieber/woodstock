/* eslint-disable */
/**
 * Configuration file for VS Code Vandelay extension.
 * https://github.com/ericbiewener/vscode-vandelay#configuration
 *
 * To install:
 * 1. Install the Vandelay extension in VS Code
 * 2. Use File -> Add Folder to Workspace to add the .vandelay folder to the workspace
 * 3. Save the current file (the file you are currently reading). You should see a message
 *    saying "Project exports have been cached".
 * 4. Press CTRL+K+S to create a new keyboard shortcut for "Import Active Word".
 * 5. Put the cursor on a word and press the keyboard shortcut to import it.
 */

// Get directory that contains the current file
const path = require("path");
const currentFilePath = __filename;
const currentDir = path.dirname(currentFilePath);
const rootDir = path.dirname(currentDir);

relPaths = [
  ['libs/woodstock_sdk/python/src/', 'woodstock_sdk'],
];

module.exports = {
  // This is the only required property. At least one path must be included.
  includePaths: relPaths.map((rel_path) => {
    return path.join(rootDir, rel_path[0], rel_path[1]);
  }),
  processImportPath: (
    importPath,
    absImportPath,
    activeFilepath,
    projectRoot
  ) => {
    for (const relPath of relPaths) {
      const [relDir, packageName] = relPath;
      const prefixPath = relDir.replaceAll("/", ".")
      if (importPath.startsWith(prefixPath)) {
        return importPath.slice(prefixPath.length);
      }
    }
  },
};
