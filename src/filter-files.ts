import fg from "fast-glob";
import ignore from "ignore";

export async function filterFiles(
  files: string[],
  source: string,
  gitignoreIg: ignore.Ignore | null,
  includePatterns: string[],
  excludePatterns: string[],
): Promise<string[]> {
  // Apply gitignore rules first
  let result = files;

  if (gitignoreIg) {
    result = result.filter((file) => {
      const relativePath = file.replace(/\\/g, "/");
      return !gitignoreIg.ignores(relativePath);
    });
  }

  // Apply include patterns - narrows the set if any are specified
  if (includePatterns.length > 0) {
    const includedSet = new Set<string>();

    for (const pattern of includePatterns) {
      const matches = await fg.glob(pattern, {
        cwd: source,
        onlyFiles: true,
        dot: true,
        suppressErrors: true,
      });

      for (const match of matches) {
        includedSet.add(match);
      }
    }

    // Keep only files that are in the include set
    result = result.filter((file) => includedSet.has(file));
  }

  // Apply exclude patterns - always wins last
  for (const pattern of excludePatterns) {
    const matches = await fg.glob(pattern, {
      cwd: source,
      onlyFiles: true,
      dot: true,
      suppressErrors: true,
    });

    const excludedSet = new Set(matches);
    result = result.filter((file) => !excludedSet.has(file));
  }

  return result;
}
