import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');

// Create a singleton socket instance
// Create a singleton socket instance but don't auto-connect until user auth
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export default socket;
