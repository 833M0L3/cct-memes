# 🔥 CCT Batch 2021 — Meme Vault

> The official unofficial meme archive of **Chitwan College of Technology**, BSc CSIT Batch 2021.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:5173/cct-memes/](http://localhost:5173/cct-memes/)

---

## 📸 How to Add Your Memes

### Step 1 — Drop image files
Put all your meme images inside:

```
/public/memes/
```

Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### Step 2 — Register them in the config
Open `src/memesData.js` and add an entry to the `MEMES` array:

```js
{
  id: 7,                              // unique number
  filename: "my-meme.jpg",           // filename inside /public/memes/
  title: "When sir asks for report", // short title
  category: "exam-szn",              // see categories below
  tags: ["report", "panic", "sir"],  // 2-4 tags
  caption: "Friday 11:59pm energy",  // optional funny caption
  year: "2023",                      // year this happened
  likes: 0,
},
```

### Categories

| ID             | Label           | Use for                         |
|----------------|-----------------|----------------------------------|
| `exam-szn`     | 📚 Exam Szn     | Exams, submissions, deadlines   |
| `lab-life`     | 💻 Lab Life     | Lab practicals, crashes         |
| `teacher`      | 👨‍🏫 Teacher Mode | Teacher moments                 |
| `batch-chaos`  | 🤡 Batch Chaos  | General batch nonsense          |
| `hostel`       | 🏠 Hostel Diaries | Hostel, after-college life    |
| `feelings`     | 💀 Feelings     | Relatable emotional damage      |

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Update `package.json`
Change the homepage to match your GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/cct-memes"
```

### Step 2 — Update `vite.config.js`
Make sure the base matches your repo name:

```js
base: '/cct-memes/',
```

If your repo is named something else (e.g. `cct-batch-2021`), change it to `/cct-batch-2021/`.

### Step 3 — Create GitHub repo
Create a repo named `cct-memes` on GitHub (or whatever you named it).

### Step 4 — Push your code

```bash
git init
git add .
git commit -m "🔥 CCT Batch 2021 Meme Vault"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cct-memes.git
git push -u origin main
```

### Step 5 — Deploy!

```bash
npm run deploy
```

This builds the site and pushes it to the `gh-pages` branch automatically.

### Step 6 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select `gh-pages` branch
3. Your site will be live at: `https://YOUR_USERNAME.github.io/cct-memes`

### Updating later
Whenever you add new memes or change anything:

```bash
npm run deploy
```

That's it. Done. 🎉

---

## 📁 Project Structure

```
cct-memes/
├── public/
│   └── memes/           ← 📸 PUT YOUR MEME IMAGES HERE
├── src/
│   ├── components/
│   │   ├── Hero.jsx     ← Landing hero section
│   │   ├── Gallery.jsx  ← Masonry grid + filters
│   │   ├── MemeCard.jsx ← Individual meme card
│   │   ├── Lightbox.jsx ← Full-screen viewer
│   │   └── Footer.jsx   ← Footer
│   ├── memesData.js     ← ⚙️ ADD YOUR MEMES HERE
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠 Tech Stack

- **React 18** + **Vite** — fast dev + build
- **Tailwind CSS** — utility-first styling
- **Permanent Marker** + **Nunito** + **Space Mono** — fonts
- **gh-pages** — zero-config GitHub Pages deploy

---

*Made with 💛 and too much chiya. © CCT CSIT Batch 2021*
