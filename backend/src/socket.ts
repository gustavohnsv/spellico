import { Server } from 'socket.io';
import { log } from './utils/logger.js';
import { CreateRoomPayload, JoinRoomPayload, Player } from './types.js';
import { generateRoomCode, createRoom, getRoom, addPlayerToRoom, removePlayerFromRooms, getRoomByPlayerId } from './rooms.js';
import { getSpellIdByName, SPELL_STATS } from './spells.js';

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
      const host: Player = { id: socket.id, nickname: payload.nickname, hp: 100, cooldowns: [] };

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

      const player: Player = { id: socket.id, nickname: payload.nickname, hp: 100, cooldowns: [] };
      addPlayerToRoom(payload.code, player);
      socket.join(payload.code);

      log(`Player ${payload.nickname} joined room: ${payload.code}`);

      if (room.players.length === 2) {
        io.to(payload.code).emit('room-ready', {
          players: room.players,
          language: room.language,
        });                                            // Emit room ready with language
        log(`Room ${payload.code} is ready`);
      }
    });

    socket.on('cast-spell', (payload: { spell: string }) => {
      const room = getRoomByPlayerId(socket.id);
      if (!room) return;

      const spellId = getSpellIdByName(payload.spell, room.language);
      if (!spellId) return;

      const stats = SPELL_STATS[spellId];
      const player = room.players.find(p => p.id === socket.id)!;
      const opponent = room.players.find(p => p.id !== socket.id);

      const now = Date.now();
      const cooldown = player.cooldowns.find(c => c.spell === spellId);
      if (cooldown && cooldown.readyAt > now) return;

      if (cooldown) {
        cooldown.readyAt = now + stats.cooldown;
      } else {
        player.cooldowns.push({ spell: spellId, readyAt: now + stats.cooldown });
      }

      if (stats.damage > 0 && opponent) {
        opponent.hp = Math.max(0, opponent.hp - stats.damage);
      }

      if (stats.heal > 0) {
        player.hp = Math.min(100, player.hp + stats.heal);
      }

      io.to(room.code).emit('spell-cast', {            // Notify clients of spell cast
        spellId,                                       // Spell ID
        casterId: socket.id                            // Caster ID
      });

      io.to(room.code).emit('hp-update', {
        player1HP: room.players[0].hp,
        player2HP: room.players[1].hp
      });                                              // Sync health points (Contract format)

      const winner = room.players.find(p => {          // Check for winner
        const opp = room.players.find(o => o.id !== p.id); // Get opponent
        return opp && opp.hp <= 0;                     // Winner found if opponent HP is 0
      });

      if (winner) {                                    // Game over condition
        log(`Victory - Player ${winner.nickname}`);    // Required log format
        io.to(room.code).emit('game-over', {           // Emit game over event
          winnerId: winner.id,                         // Winner ID
          winnerName: winner.nickname                  // Winner Name
        });
      }

      log(`Spell ${spellId} cast by ${player.nickname} in room ${room.code}`);
    });

    socket.on('disconnect', () => {
      removePlayerFromRooms(socket.id);
      log(`Socket disconnected - id: ${socket.id}`);
    });
  });

  return io;
};
