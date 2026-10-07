const fs = require('fs');
const path = require('path');

function search(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('supabase.co')) {
        console.log('Found supabase.co in:', full);
      }
    }
  }
}

search('.');
