const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to your frontend URL
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Middleware to inject io into requests if needed, 
// but we'll export it for services to use directly.
global.io = io;

io.on('connection', (socket) => {
  console.log('  🔌 Client connected to Socket.io:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('  ❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`\n  🍔 Fast-Food API Server (Real-time enabled)`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  🚀 Running on: http://localhost:${PORT}`);
  console.log(`  📡 Health:     http://localhost:${PORT}/api/health`);
  console.log(`  🔌 Sockets:    Connected and ready`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
