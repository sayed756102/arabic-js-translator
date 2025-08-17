import * as fs from 'fs';
import * as path from 'path';

// Enhanced generator: supports configurable source file, splitting and output dir.
// Usage examples:
//   node ./scripts/generateTranslationDatabase.ts --source=data/words_10k_source.json --out=src/data --split=5
//   node ./scripts/generateTranslationDatabase.ts --source=data/words_10k_source_sample.json --out=src/data --split=2 --prefix=translationDatabase_10k_part

interface Item { ar: string; en: string; source?: string; confidence?: number }

function parseArgs() {
  const args = process.argv.slice(2);
  const res: any = { source: 'data/words_10k_source.json', out: path.join('src', 'data'), split: 5, prefix: 'translationDatabase_10k_part' };
  for (const a of args) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) res[m[1]] = m[2];
  }
  res.split = Number(res.split) || 1;
  return res;
}

function loadSource(sourcePath: string): Item[] {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(sourcePath, 'utf8');
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Expected array');
    return data.map((it: any) => ({ ar: (it.ar||'').toString(), en: (it.en||'').toString(), source: it.source||'auto', confidence: typeof it.confidence === 'number' ? it.confidence : 0.6 }));
  } catch (e) {
    console.error('Failed to parse JSON source:', e);
    process.exit(1);
  }
}

function chunk<T>(arr: T[], n: number): T[][] {
  const len = arr.length;
  const size = Math.ceil(len / n);
  const out: T[][] = [];
  for (let i = 0; i < n; i++) out.push(arr.slice(i*size, (i+1)*size));
  return out;
}

function generateFiles(items: Item[], outDir: string, parts: number, prefix: string) {
  fs.mkdirSync(outDir, { recursive: true });
  const partsArr = chunk(items, parts);
  for (let i = 0; i < partsArr.length; i++) {
    const part = partsArr[i];
    const entries = part.map(it => `  ${JSON.stringify(it.ar)}: ${JSON.stringify(it.en)},`).join('\n');
    const fileName = `${prefix}${i+1}.ts`;
    const content = `// Generated translation database (Arabic -> English)\n` +
      `// Part ${i+1} of ${partsArr.length}\n` +
      `export const translationDatabase: Record<string, string> = {\n${entries}\n};\n\n` +
      `export const getWordCount = (): number => Object.keys(translationDatabase).length;\n`;
    fs.writeFileSync(path.join(outDir, fileName), content, 'utf8');
    console.log('Wrote', fileName, 'with', part.length, 'entries');
  }
}

function main() {
  const opts = parseArgs();
  const sourcePath = path.resolve(opts.source);
  const outDir = path.resolve(opts.out);
  const prefix = opts.prefix;
  const parts = Math.max(1, Number(opts.split) || 1);

  const items = loadSource(sourcePath);
  if (items.length === 0) {
    console.error('No items found in source');
    process.exit(1);
  }
  generateFiles(items, outDir, parts, prefix);
}

main();
