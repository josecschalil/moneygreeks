const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/josec/Desktop/moneygreeks/frontend/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Clean up redundant fallback
    let newContent = content.replace(/\(process\.env\.NEXT_PUBLIC_API_BASE_URL \|\| "http:\/\/127\.0\.0\.1:8000"\)/g, '"http://127.0.0.1:8000"');
    newContent = newContent.replace(/process\.env\.NEXT_PUBLIC_API_BASE_URL\s*\|\|\s*process\.env\.NEXT_PUBLIC_API_BASE_URL/g, 'process.env.NEXT_PUBLIC_API_BASE_URL');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Cleaned up ${file}`);
    }
});
