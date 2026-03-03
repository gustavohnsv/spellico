import { Room, Player } from './types.js';

const rooms = new Map<string, Room>();                 // In-memory room storage

export const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};                                                     // Generates a 6-char alphanumeric code

export const createRoom = (code: string, host: Player, language: 'EN' | 'PT'): Room => {
  const room: Room = {
    code,
    players: [host],
    language,
  };
  rooms.set(code, room);
  return room;
};                                                     // Creates and stores a new room

export const getRoom = (code: string): Room | undefined => {
  return rooms.get(code);
};                                                     // Retrieves a room by code

export const addPlayerToRoom = (code: string, player: Player): boolean => {
  const room = rooms.get(code);
  if (!room || room.players.length >= 2) return false;
  room.players.push(player);
  return true;
};                                                     // Adds a player if room exists and has space

export const removePlayerFromRooms = (playerId: string) => {
  rooms.forEach((room, code) => {
    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
      rooms.delete(code);
    }
  });
};                                                     // Cleanup on disconnect
