const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) { 
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
    
    // Remove the hardcoded fallback
    let newContent = content.replace(/ \|\| "https:\/\/moneygreeks\.com"/g, '');
    newContent = newContent.replace(/ \|\| 'https:\/\/moneygreeks\.com'/g, '');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Cleaned up ${file}`);
    }
});
