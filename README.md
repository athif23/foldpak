# pack

A tiny CLI to package a folder into a zip archive with simple include, exclude, and `.gitignore` support.

## Install

```bash
npm install -g @athif/pack
```

Or run directly with `npx`:

```bash
npx tsx src/cli.ts .
```

## Usage

```bash
pack [source]
```

### Options

- `-o, --output <file>` — Output zip file path
- `--no-gitignore` — Don't use .gitignore rules (by default, .gitignore is respected)
- `--include <glob>` — Include files matching glob (can be repeated)
- `--exclude <glob>` — Exclude files matching glob (can be repeated)
- `--verbose` — Show detailed output

### Examples

```bash
# Package current directory
pack .

# Package a specific directory
pack ./my-project

# Specify output file
pack . -o my-app.zip

# Include everything (ignore .gitignore rules)
pack . --no-gitignore

# Include only specific files
pack . --include "src/**" --include "package.json"

# Exclude specific files (in addition to .gitignore)
pack . --exclude "dist/**" --exclude "node_modules/**"

# Combine options
pack . --include "dist/**" --exclude "**/*.map"
```

## Rule Summary

- Files are archived relative to the source root
- `.gitignore` rules are applied by default (use `--no-gitignore` to disable)
- `--include` narrows the file set to matching files
- `--exclude` removes matching files (always wins last)

## Building

```bash
npm install
npm run build
```

The compiled CLI will be at `dist/cli.js`.

## Testing

```bash
npm test
```
