const fs = require('fs');
const path = require('path');

const directories = ['app', 'lib', 'public'];
const extensions = ['.js', '.jsx', '.xml'];

const replacements = [
  { regex: /\/visualizer\/searching\//g, to: '/visualizer/array/' },
  { regex: /\/visualizer\/sorting\//g, to: '/visualizer/array/' },
  { regex: /\/visualizer\/arrays\//g, to: '/visualizer/array/' },
  { regex: /\/visualizer\/linkedList\//g, to: '/visualizer/linkedlist/' },
  { regex: /\/visualizer\/trees\//g, to: '/visualizer/tree/' },
  { regex: /visualizer\/searching\//g, to: 'visualizer/array/' },
  { regex: /visualizer\/sorting\//g, to: 'visualizer/array/' },
  { regex: /visualizer\/arrays\//g, to: 'visualizer/array/' },
  { regex: /visualizer\/linkedList\//g, to: 'visualizer/linkedlist/' },
  { regex: /visualizer\/trees\//g, to: 'visualizer/tree/' },
  { regex: /og\/sorting\//g, to: 'og/array/' },
  { regex: /og\/searching\//g, to: 'og/array/' },
  { regex: /og\/arrays\//g, to: 'og/array/' },
  { regex: /og\/linkedList\//g, to: 'og/linkedlist/' },
  { regex: /og\/trees\//g, to: 'og/tree/' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.to);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Done replacing strings.');
