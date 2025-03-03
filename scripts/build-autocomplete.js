#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to build react-textarea-autocomplete from GitHub source
 * This runs after the package is installed to ensure the dist files are available
 */

const packagePath = path.resolve(process.cwd(), 'node_modules/react-textarea-autocomplete');

// Check if the package directory exists
if (!fs.existsSync(packagePath)) {
  console.error('react-textarea-autocomplete package not found in node_modules');
  process.exit(1);
}

// Check if dist directory already exists
const distPath = path.join(packagePath, 'dist');
if (fs.existsSync(distPath) && fs.readdirSync(distPath).length > 0) {
  console.log('dist directory already exists and is not empty. Skipping build.');
  process.exit(0);
}

console.log('Building react-textarea-autocomplete...');

try {
  // Change to the package directory
  process.chdir(packagePath);

  // Install dependencies
  console.log('Installing dependencies...');
  execSync('yarn install', { stdio: 'inherit' });

  // Build the package
  console.log('Building the package...');
  execSync('yarn build', { stdio: 'inherit' });

  console.log('Successfully built react-textarea-autocomplete');
} catch (error) {
  console.error('Error building react-textarea-autocomplete:', error.message);
  process.exit(1);
}
