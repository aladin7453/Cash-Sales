const fs = require('fs-extra');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT = __dirname;
const BUILD_DIR = path.join(ROOT, 'build-temp');

const OBFUSCATE_OPTIONS = {
  compact: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  renameGlobals: false,
};

function obfuscateFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATE_OPTIONS);
  fs.writeFileSync(filePath, result.getObfuscatedCode());
}

function obfuscateDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      obfuscateDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      obfuscateFile(fullPath);
    }
  }
}

async function run() {
  console.log('Cleaning old build-temp...');
  await fs.remove(BUILD_DIR);
  await fs.ensureDir(BUILD_DIR);

  console.log('Copying files to build-temp...');
  await fs.copy(path.join(ROOT, 'electron.js'), path.join(BUILD_DIR, 'electron.js'));
  await fs.copy(path.join(ROOT, '.next'), path.join(BUILD_DIR, '.next'));
  await fs.copy(path.join(ROOT, 'public'), path.join(BUILD_DIR, 'public'));
  console.log('Writing stripped package.json...');
  const pkg = require(path.join(ROOT, 'package.json'));
  const appPkg = {
    name: pkg.name,
    version: pkg.version,
    main: pkg.main,
    description: pkg.description || 'Cash Sales App',
    author: pkg.author || 'Cash Sales',
    private: pkg.private,
  };
  await fs.writeJson(path.join(BUILD_DIR, 'package.json'), appPkg, { spaces: 2 });

  console.log('Obfuscating electron.js...');
  obfuscateFile(path.join(BUILD_DIR, 'electron.js'));

  console.log('Obfuscating .next/standalone...');
  obfuscateDir(path.join(BUILD_DIR, '.next', 'standalone'));

  console.log('Done. Obfuscated build is in ./build-temp');
}

run().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});