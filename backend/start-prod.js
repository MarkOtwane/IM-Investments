const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'dist', 'main.js');

if (!fs.existsSync(mainPath)) {
  console.error(`\nERROR: Expected build output not found: ${mainPath}\n`);
  console.error('Run `npm run build` before starting the production server.');
  process.exit(1);
}

// eslint-disable-next-line unicorn/no-process-exit
require(mainPath);
