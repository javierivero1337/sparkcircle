const fs = require('fs');
const path = require('path');

console.log('🔍 Checking SparkCircle Setup...\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✓ Node.js version: ${nodeVersion}`);
if (parseInt(nodeVersion.split('.')[0].substring(1)) < 14) {
  console.log('  ⚠️  Warning: Node.js v14 or higher recommended');
}

// Check if directories exist
const dirs = ['backend', 'frontend', 'backend/node_modules', 'frontend/node_modules'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✓ Directory exists: ${dir}`);
  } else {
    console.log(`✗ Missing directory: ${dir}`);
  }
});

// Check if .env file exists
const envPath = path.join('backend', '.env');
if (fs.existsSync(envPath)) {
  console.log('✓ Backend .env file exists');
} else {
  console.log('✗ Backend .env file missing - copy from backend/env.example');
}

// Check package.json files
const packageFiles = ['package.json', 'backend/package.json', 'frontend/package.json'];
packageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ Found: ${file}`);
  } else {
    console.log(`✗ Missing: ${file}`);
  }
});

console.log('\n📋 Next Steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Copy backend/env.example to backend/.env');
console.log('3. Run: npm run setup (if you haven\'t already)');
console.log('4. Run: npm run dev');
console.log('\nHappy coding! 🚀'); 