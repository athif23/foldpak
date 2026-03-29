import fg from "fast-glob";
import { resolve } from "node:path";

export async function discoverFiles(source: string): Promise<string[]> {
  const absoluteSource = resolve(source);

  const entries = await fg.glob("**/*", {
    cwd: absoluteSource,
    absolute: false,
    onlyFiles: true,
    dot: true,
    suppressErrors: true,
  });

  return entries.sort();
}
