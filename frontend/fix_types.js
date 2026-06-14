const fs = require('fs');
const file = 'c:/Users/josec/Desktop/moneygreeks/frontend/app/post-market/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\.map\(\(([^,:)]+)\) =>/g, '.map(($1: any) =>');
content = content.replace(/\.map\(\(([^,:)]+), ([^,:)]+)\) =>/g, '.map(($1: any, $2: number) =>');
content = content.replace(/\.sort\(\(([^,:)]+), ([^,:)]+)\) =>/g, '.sort(($1: any, $2: any) =>');

// Wait, sometimes it's .map(x => ...)
content = content.replace(/\.map\(([a-zA-Z0-9_]+) =>/g, '.map(($1: any) =>');

// Wait, what about .filter?
content = content.replace(/\.filter\(\(([^,:)]+)\) =>/g, '.filter(($1: any) =>');
content = content.replace(/\.filter\(([a-zA-Z0-9_]+) =>/g, '.filter(($1: any) =>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed types in post-market/[slug]/page.tsx');
