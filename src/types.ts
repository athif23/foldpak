export interface PackOptions {
  source: string;
  output?: string;
  gitignore: boolean;
  include: string[];
  exclude: string[];
  verbose: boolean;
}

export interface PackResult {
  outputPath: string;
  fileCount: number;
}
