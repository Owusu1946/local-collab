import WebSocket from 'ws';
import { FileChange, applyFileChange, watchFiles } from '../utils/fileUtils';
import * as path from 'path';
import * as fs from 'fs';

interface ClientOptions {
  password?: string;
}

export function startClient(sessionCode: string, options: ClientOptions) {
  const ws = new WebSocket('ws://localhost:8080');
  // Get the absolute path to test-client directory
  const currentDir = path.resolve('test-client');
  
  // Ensure the directory exists
  if (!fs.existsSync(currentDir)) {
    fs.mkdirSync(currentDir, { recursive: true });
  }
  
  console.log('Client working directory:', currentDir);

  ws.on('open', () => {
    console.log(`Connected to session ${sessionCode}`);
    console.log(`Syncing with directory: ${currentDir}`);

    // Watch for changes in the client directory
    const watcher = watchFiles(currentDir, (change: FileChange) => {
      // Get just the filename
      const fileName = path.basename(change.path);
      
      const message = JSON.stringify({
        type: 'file-change',
        data: {
          ...change,
          path: fileName
        }
      });
      ws.send(message);
    });
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'file-change') {
        const change: FileChange = message.data;
        console.log('Received file change:', {
          type: change.type,
          path: change.path,
          contentLength: change.content?.length
        });
        
        // Create the file in the test-client directory
        await applyFileChange(currentDir, change);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Disconnected from session');
    process.exit(0);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    process.exit(1);
  });
}