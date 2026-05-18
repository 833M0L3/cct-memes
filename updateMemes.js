import fs from 'fs';
import path from 'path';

const memesDir = path.join(process.cwd(), 'public', 'memes');
const memesDataPath = path.join(process.cwd(), 'src', 'memesData.js');
const memeListPath = path.join(process.cwd(), 'src', 'memesList.js');

const files = fs.readdirSync(memesDir).filter(f => {
  const lower = f.toLowerCase();
  return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.mp4');
});

const CATEGORIES = ["exam-szn", "lab-life", "teacher", "batch-chaos", "hostel", "feelings"];

const newMemes = files.map((file, index) => {
  const category = CATEGORIES[index % CATEGORIES.length];
  return {
    id: index + 1,
    filename: file,
    title: `Meme ${index + 1}`,
    category: category,
    tags: ["cct", category],
    caption: `Meme ${index + 1}`,
    year: "2021",
    likes: Math.floor(Math.random() * 100),
  };
});

let data = fs.readFileSync(memesDataPath, 'utf8');
const parts = data.split('export const MEMES = [');
const newData = parts[0] + 'export const MEMES = ' + JSON.stringify(newMemes, null, 2) + ';\n';
fs.writeFileSync(memesDataPath, newData);

// Write a simple list of filenames for static rendering
const fileListContent = 'export const MEME_FILES = ' + JSON.stringify(files, null, 2) + ';\n';
fs.writeFileSync(memeListPath, fileListContent);

console.log('Memes updated successfully! Added ' + files.length + ' memes.');
