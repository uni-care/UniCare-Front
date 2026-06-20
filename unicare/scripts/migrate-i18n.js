const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const appDir = path.join(srcDir, 'app');
const localeDir = path.join(appDir, '[locale]');

// Create [locale] directory if not exists
if (!fs.existsSync(localeDir)) {
  fs.mkdirSync(localeDir, { recursive: true });
  console.log('Created [locale] directory');
}

const foldersToMove = ['(auth)', '(main)', 'about', 'contribute'];
const filesToMove = ['page.tsx'];

// Move folders
foldersToMove.forEach(folder => {
  const oldPath = path.join(appDir, folder);
  const newPath = path.join(localeDir, folder);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved folder ${folder} to [locale]/${folder}`);
  } else {
    console.log(`Folder ${folder} not found, skipping`);
  }
});

// Move files
filesToMove.forEach(file => {
  const oldPath = path.join(appDir, file);
  const newPath = path.join(localeDir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved file ${file} to [locale]/${file}`);
  } else {
    console.log(`File ${file} not found, skipping`);
  }
});

// Move layout.tsx to [locale]/layout.tsx
const oldLayoutPath = path.join(appDir, 'layout.tsx');
const newLayoutPath = path.join(localeDir, 'layout.tsx');

if (fs.existsSync(oldLayoutPath) && !fs.existsSync(newLayoutPath)) {
  fs.renameSync(oldLayoutPath, newLayoutPath);
  console.log('Moved layout.tsx to [locale]/layout.tsx');

  // Create new minimal root layout.tsx
  const rootLayoutContent = `import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
`;
  fs.writeFileSync(oldLayoutPath, rootLayoutContent, 'utf8');
  console.log('Created new root layout.tsx wrapper');
} else {
  console.log('layout.tsx already moved or not found');
}

console.log('Migration structure complete! Please proceed to file modifications.');
