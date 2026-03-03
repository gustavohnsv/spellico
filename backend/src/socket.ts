import { Server } from 'socket.io';
import { log } from './utils/logger.js';
import { CreateRoomPayload, JoinRoomPayload, Player } from './types.js';
import { generateRoomCode, createRoom, getRoom, addPlayerToRoom, removePlayerFromRooms } from './rooms.js';

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    log(`Socket connected - id: ${socket.id}`);

    socket.on('create-room', (payload: CreateRoomPayload) => {
      const code = generateRoomCode();
      const host: Player = { id: socket.id, nickname: payload.nickname };

      createRoom(code, host, payload.language);
      socket.join(code);

      log(`Room created: ${code} by ${payload.nickname}`);
      socket.emit('room-created', { code });
    });

    socket.on('join-room', (payload: JoinRoomPayload) => {
      const room = getRoom(payload.code);

      if (!room) {
        return socket.emit('room-error', { message: 'Room not found' });
      }

      if (room.players.length >= 2) {
        return socket.emit('room-error', { message: 'Room full' });
      }

      const player: Player = { id: socket.id, nickname: payload.nickname };
      addPlayerToRoom(payload.code, player);
      socket.join(payload.code);

      log(`Player ${payload.nickname} joined room: ${payload.code}`);

      if (room.players.length === 2) {
        io.to(payload.code).emit('room-ready', {
          players: room.players,
          language: room.language,
        });
        log(`Room ${payload.code} is ready`);
      }
    });

    socket.on('disconnect', () => {
      removePlayerFromRooms(socket.id);
      log(`Socket disconnected - id: ${socket.id}`);
    });
  });

  return io;
};
