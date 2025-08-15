/**
 * سكربت لتوليد ملف TypeScript لقاعدة الترجمة من ملف JSON مصدر.
 * Usage:
 *   node ./scripts/generateTranslationDatabase.ts
 *
 * يفترض وجود data/words_5k_source.json بصيغة:
 *   [{ "ar": "كلمة بالعربي", "en": "englishWord" }, ...]
 *
 * الناتج: src/data/translationDatabase_5k.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const srcDir = path.resolve(__dirname, '..', 'src', 'data');
const dataDir = path.resolve(__dirname, '..', 'data');
const sourcePath = path.join(dataDir, 'words_5k_source.json');
const outPath = path.join(srcDir, 'translationDatabase_5k.ts');

function loadSource(): Array<{ ar: string; en: string }> {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(sourcePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON source:', e);
    process.exit(1);
  }
}

function buildRecord(items: Array<{ ar: string; en: string }>) {
  const map = new Map<string, string>();
  for (const it of items) {
    const key = it.ar.trim();
    if (!key) continue;
    if (!map.has(key)) map.set(key, it.en);
  }
  return map;
}

function generateFile(map: Map<string, string>) {
  const entries = Array.from(map.entries()).map(
    ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`
  ).join('\n');

  const content = `// Generated translation database (Arabic -> English)\n` +
  `// Source: data/words_5k_source.json\n` +
  `export const translationDatabase: Record<string, string> = {\n${entries}\n};\n\n` +
  `export const getWordCount = (): number => Object.keys(translationDatabase).length;\n`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Wrote', outPath, 'with', map.size, 'entries');
}

function main() {
  const items = loadSource();
  const map = buildRecord(items);
  generateFile(map);
}

main();