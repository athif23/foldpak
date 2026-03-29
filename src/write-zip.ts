import { statSync } from "node:fs";
import { createWriteStream } from "node:fs";
import { resolve, join } from "node:path";
import yazl from "yazl";

export async function writeZip(
  files: string[],
  source: string,
  outputPath: string,
  verbose: boolean,
): Promise<number> {
  const absoluteSource = resolve(source);
  const absoluteOutput = resolve(outputPath);

  const zip = new yazl.ZipFile();
  let fileCount = 0;

  // Normalize output path for comparison
  const normalizedOutput = absoluteOutput.replace(/\\/g, "/");

  for (const file of files) {
    const absoluteFile = join(absoluteSource, file);
    const normalizedFile = absoluteFile.replace(/\\/g, "/");

    // Skip if this file is the output archive itself
    if (normalizedFile === normalizedOutput) {
      if (verbose) {
        console.log(`  skipping output archive: ${file}`);
      }
      continue;
    }

    // Normalize path separators for archive entries
    const archivePath = file.replace(/\\/g, "/");

    try {
      const stats = statSync(absoluteFile);
      zip.addFile(absoluteFile, archivePath, {
        mtime: stats.mtime,
        compress: true,
      });
      fileCount++;
    } catch (err) {
      throw new Error(`Failed to read file: ${file} - ${err}`);
    }
  }

  zip.end();

  return new Promise((resolve, reject) => {
    const ws = createWriteStream(absoluteOutput);
    ws.on("close", () => resolve(fileCount));
    ws.on("error", reject);
    zip.outputStream.pipe(ws);
  });
}
