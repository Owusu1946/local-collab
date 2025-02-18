# local-collab

[![npm version](https://img.shields.io/npm/v/local-collab.svg)](https://www.npmjs.com/package/local-collab)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A lightweight, secure real-time collaboration tool for local network file synchronization. Perfect for pair programming, collaborative writing, or any scenario where multiple users need to work on files simultaneously in a local network environment.

## Features

- 🔄 Real-time file synchronization across multiple devices
- 🔐 Optional password protection for secure sessions
- 🎯 Automatic session code generation for easy connection
- 👀 Live file change watching and broadcasting
- 🚀 Zero configuration required
- 💻 Works across all major platforms

## Installation

```bash
npm install -g local-collab
```

## Quick Start

### Starting a New Session

```bash
local-collab start
```

With password protection:
```bash
local-collab start -p mypassword
```

### Joining an Existing Session

```bash
local-collab join SESSION-CODE
```

With password:
```bash
local-collab join SESSION-CODE -p mypassword
```

## Usage Guide

### Session Host

1. Navigate to the directory you want to share
2. Run `local-collab start`
3. Share the generated session code with collaborators
4. Start collaborating!

### Session Participant

1. Create or navigate to your working directory
2. Run `local-collab join SESSION-CODE`
3. Files will automatically sync with the host

## Command Line Options

| Command | Option | Description |
|---------|--------|-------------|
| `start` | `-p, --password <password>` | Set a session password |
| `join`  | `-p, --password <password>` | Provide session password |

## How It Works

local-collab uses WebSocket connections to establish real-time communication between peers on the same local network. File changes are detected using efficient file system watchers and synchronized across all connected clients.

## Technical Details

- Built with TypeScript for type safety
- Uses WebSocket for real-time communication
- Implements file system watching with chokidar
- Supports binary file synchronization
- Minimal network overhead

## Requirements

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Security

Please note that local-collab is designed for use within trusted local networks. While we implement basic security measures like password protection, you should not use it over untrusted networks without additional security measures.