import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { generateSessionCode } from '../utils/sessionUtils';
import { watchFiles, FileChange } from '../utils/fileUtils';
import * as path from 'path';
import * as fs from 'fs';

interface ServerOptions {
  password?: string;
}

export function startServer(options: ServerOptions) {
  const app = express();
  const port = 3000;
  
  const wss = new WebSocketServer({ port: 8080 });
  const sessionCode = generateSessionCode();
  const clients = new Set<WebSocket>();

  // Get the absolute path to test-server directory
  const currentDir = path.resolve('test-server');
  
  // Ensure the directory exists
  if (!fs.existsSync(currentDir)) {
    fs.mkdirSync(currentDir, { recursive: true });
  }
  
  const watcher = watchFiles(currentDir, (change: FileChange) => {
    // Get just the filename without the directory path
    const fileName = path.basename(change.path);
    
    const message = JSON.stringify({
      type: 'file-change',
      data: {
        ...change,
        path: fileName // Send only the filename
      }
    });

    // Broadcast file change to all clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected. Total clients:', clients.size);
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'file-change') {
          // Broadcast file changes to other clients
          clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message.toString());
            }
          });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected. Total clients:', clients.size);
    });
  });

  console.log(`Session started with code: ${sessionCode}`);
  console.log(`Watching directory: ${currentDir}`);
  console.log(`Listening for connections...`);

  return () => {
    watcher.close();
  };
}