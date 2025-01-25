import chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

export interface FileChange {
  type: 'add' | 'change' | 'unlink';
  path: string;
  content?: string;
}

export function watchFiles(
  directory: string,
  onChange: (change: FileChange) => void
) {
  // Normalize the directory path
  const watchDir = path.resolve(directory);
  
  // Initialize watcher with ignored patterns
  const watcher = chokidar.watch(watchDir, {
    ignored: [
      /(^|[\/\\])\../, // ignore hidden files
      '**/node_modules/**', // ignore node_modules
      '**/dist/**', // ignore dist directory
      '**/.git/**', // ignore git directory
      '**/*.log', // ignore log files
    ],
    persistent: true,
    ignoreInitial: true // Don't emit 'add' events for files that already exist
  });

  console.log(`Watching directory: ${watchDir}`);
  console.log('Ignored patterns: node_modules, dist, .git, and hidden files');

  // Handle file events
  watcher.on('add', async (filePath) => {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const relativePath = path.relative(watchDir, filePath).replace(/\\/g, '/');
      console.log('File added:', relativePath);
      onChange({ type: 'add', path: relativePath, content });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  });

  watcher.on('change', async (filePath) => {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const relativePath = path.relative(watchDir, filePath).replace(/\\/g, '/');
      console.log('File changed:', relativePath);
      onChange({ type: 'change', path: relativePath, content });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  });

  watcher.on('unlink', (filePath) => {
    const relativePath = path.relative(watchDir, filePath).replace(/\\/g, '/');
    console.log('File deleted:', relativePath);
    onChange({ type: 'unlink', path: relativePath });
  });

  // Log when the initial scan is complete
  watcher.on('ready', () => {
    console.log('Initial scan complete. Ready for changes');
  });

  return watcher;
}

export async function applyFileChange(
  baseDir: string,
  change: FileChange
) {
  // Normalize paths
  const normalizedPath = change.path.replace(/\\/g, '/');
  const fullPath = path.join(baseDir, normalizedPath);
  const directory = path.dirname(fullPath);

  try {
    console.log('Applying file change:', {
      type: change.type,
      path: normalizedPath,
      fullPath,
      contentLength: change.content?.length
    });

    // Ensure directory exists
    await fs.promises.mkdir(directory, { recursive: true });

    if (change.type === 'unlink') {
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log('File deleted successfully:', fullPath);
      }
    } else if (change.content !== undefined) {
      await fs.promises.writeFile(fullPath, change.content, 'utf-8');
      console.log('File written successfully:', fullPath);
    }
  } catch (error) {
    console.error(`Error applying file change to ${fullPath}:`, error);
  }
} 