const fs = require('fs');

let html = fs.readFileSync('D:/portfolio/index.html', 'utf8');
let style = fs.readFileSync('D:/portfolio/style.css', 'utf8');

// Find all mojibake characters starting with specific corrupted sequences
const corruptedRegex = /[^\x00-\x7F]{2,}/g;

function fixMojibake(content) {
  return content.replace(corruptedRegex, match => {
    // Attempt to decode the mojibake
    try {
      const fixed = Buffer.from(match, 'latin1').toString('utf8');
      // Verify if it looks like a valid UTF-8 character (not empty or just garbled)
      if (fixed.length > 0 && fixed !== match && !fixed.includes('')) {
        return fixed;
      }
    } catch (e) {}
    return match; // return original if decoding fails
  });
}

const fixedHtml = fixMojibake(html);
if (fixedHtml !== html) {
  fs.writeFileSync('D:/portfolio/index.html', fixedHtml, 'utf8');
  console.log('Fixed index.html emojis.');
}

const fixedStyle = fixMojibake(style);
if (fixedStyle !== style) {
  fs.writeFileSync('D:/portfolio/style.css', fixedStyle, 'utf8');
  console.log('Fixed style.css emojis.');
}
