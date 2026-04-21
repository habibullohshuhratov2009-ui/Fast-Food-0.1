import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5050';

const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('  🛜 Connected to Kitchen Display Live (Chef)');
});

socket.on('connect_error', (error) => {
  console.warn('  ⚠️ Socket connection failed. Falling back to polling.', error.message);
});

export default socket;
