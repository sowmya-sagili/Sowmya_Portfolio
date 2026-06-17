const fs = require('fs');
let html = fs.readFileSync('D:/portfolio/index.html', 'utf8');

const map = {
  'â€”': '—',
  'ðŸ‘‹': '👋',
  'ðŸŽ“': '🎓',
  'ðŸ¤–': '🤖',
  'ðŸ’¡': '💡',
  'ðŸ“Š': '📊',
  'Â·': '·',
  'ðŸ’»': '💻',
  'ðŸŒ\x90': '🌐',
  'ðŸ—„ï¸\x8F': '🗄️',
  'ðŸ›\xA0ï¸\x8F': '🛠️',
  'ðŸ“š': '📚',
  'ðŸŒŸ': '🌟',
  'ðŸ’¼': '💼',
  'ðŸ”\x8D': '🔍',
  'âœ“': '✓',
  'ðŸ\x8F\xA0': '🏠',
  'ðŸš¦': '🚦',
  'ðŸ•·ï¸\x8F': '🕸️',
  'ðŸŒ¿': '🌿',
  'ðŸš€': '🚀',
  'â†’': '→',
  'Â©': '©',
  'ðŸ—„': '🗄️',
  'ðŸ›\xA0': '🛠️'
};

let count = 0;
for (const [bad, good] of Object.entries(map)) {
  const parts = html.split(bad);
  if (parts.length > 1) {
    count += (parts.length - 1);
    html = parts.join(good);
  }
}

fs.writeFileSync('D:/portfolio/index.html', html, 'utf8');
console.log('Fixed ' + count + ' corrupted characters.');
