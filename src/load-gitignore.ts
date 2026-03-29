import { readFileSync } from "node:fs";
import { join } from "node:path";
import ignore from "ignore";

export function loadGitignore(sourceDir: string): ignore.Ignore | null {
  const gitignorePath = join(sourceDir, ".gitignore");

  try {
    const content = readFileSync(gitignorePath, "utf-8");
    const ig = ignore();
    ig.add(content);
    return ig;
  } catch {
    // .gitignore doesn't exist - that's fine
    return null;
  }
}
