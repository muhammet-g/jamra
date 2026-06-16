import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const targets = [
  {
    dir: path.join(root, 'src/assets/images/products'),
    width: 960,
    quality: 72,
  },
  {
    dir: path.join(root, 'src/assets/images/logo'),
    width: 420,
    quality: 78,
  },
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      files.push(fullPath);
    }
  }

  return files;
}

for (const target of targets) {
  const files = await walk(target.dir);

  for (const file of files) {
    const output = file.replace(/\.png$/i, '.webp');

    await sharp(file)
      .resize({ width: target.width, withoutEnlargement: true })
      .webp({ quality: target.quality, effort: 6 })
      .toFile(output);

    const before = (await fs.stat(file)).size;
    const after = (await fs.stat(output)).size;
    const relativeInput = path.relative(root, file);
    const relativeOutput = path.relative(root, output);

    console.log(`${relativeInput} -> ${relativeOutput} ${before} => ${after}`);
  }
}
