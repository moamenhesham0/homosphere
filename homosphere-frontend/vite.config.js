import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

/* Function to automatically generate path aliases based on the src directory structure */
function generateAliases() {
    const srcPath = path.resolve(__dirname, 'src');
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });

    const aliases = {};
    entries.forEach((entry) => {
        if (entry.isDirectory()) {
            const name = entry.name;
            aliases[`@${name}`] = path.resolve(srcPath, name);
        }
    });

    return aliases;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: generateAliases(),
    },
});
