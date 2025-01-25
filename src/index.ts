#!/usr/bin/env node

import { program } from 'commander';
import { startServer } from './server/server';
import { startClient } from './client/client';

program
  .version('1.0.0')
  .description('Real-time local network collaboration tool');

program
  .command('start')
  .description('Start a collaboration session')
  .option('-p, --password <password>', 'Session password')
  .action((options) => {
    startServer(options);
  });

program
  .command('join')
  .description('Join a collaboration session')
  .argument('<sessionCode>', 'Session code to join')
  .option('-p, --password <password>', 'Session password')
  .action((sessionCode, options) => {
    startClient(sessionCode, options);
  });

program.parse();