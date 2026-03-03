import { Server } from 'socket.io';
import { log } from './utils/logger.js';

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    log(`Socket connected - id: ${socket.id}`);

    socket.on('disconnect', () => {
      log(`Socket disconnected - id: ${socket.id}`);
    });
  });

  return io;
};
