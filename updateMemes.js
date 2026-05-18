import fs from 'fs';
import path from 'path';

const MEDIA_EXTS = ['.png', '.jpg', '.jpeg', '.mp4', '.jfif'];
const isMedia = (f) => MEDIA_EXTS.some(ext => f.toLowerCase().endsWith(ext));

// ── Memes (public/memes → src/memesList.js) ─────────────────────────────────
const memesDir = path.join(process.cwd(), 'public', 'memes');
const memeListPath = path.join(process.cwd(), 'src', 'memesList.js');

const memeFiles = fs.readdirSync(memesDir).filter(isMedia).sort();
fs.writeFileSync(
  memeListPath,
  'export const MEME_FILES = ' + JSON.stringify(memeFiles, null, 2) + ';\n'
);
console.log(`✔ memesList.js updated — ${memeFiles.length} files`);

// ── Screenshots (public/ss → src/screenshotsList.js) ─────────────────────────
const ssDir = path.join(process.cwd(), 'public', 'ss');
const ssListPath = path.join(process.cwd(), 'src', 'screenshotsList.js');

const ssFiles = fs.readdirSync(ssDir).filter(isMedia).sort();
fs.writeFileSync(
  ssListPath,
  'export const SCREENSHOT_FILES = ' + JSON.stringify(ssFiles, null, 2) + ';\n'
);
console.log(`✔ screenshotsList.js updated — ${ssFiles.length} files`);
