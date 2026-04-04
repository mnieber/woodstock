/**
 * Extracts the path from a tree:// reference.
 * Used when fetching blobs.
 *
 * @param treeReference - The full tree:// reference (e.g., "tree://s3://bucket/path/file.json")
 * @returns The path without the tree:// prefix (e.g., "s3://bucket/path/file.json")
 */
export const extractTreePath = (treeReference: string): string => {
  if (treeReference.startsWith('tree://')) {
    return treeReference.substring('tree://'.length);
  }
  return treeReference;
};
