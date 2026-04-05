/* eslint-disable */
/**
 * Configuration file for VS Code Vandelay extension.
 * https://github.com/ericbiewener/vscode-vandelay#configuration
 */

const baseDir = '/home/maarten/projects/woodstock/src/services/woodstock_ui/';

module.exports = {
  // This is the only required property. At least one path must be included.
  includePaths: [baseDir + 'src'],
  processImportPath: (importPath, absImportPath, activeFilepath, projectRoot) =>
    absImportPath.startsWith(projectRoot)
      ? absImportPath.slice(baseDir.length - 1)
      : null,
};
