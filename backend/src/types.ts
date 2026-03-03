export interface SpellCooldown {
  spell: string;
  readyAt: number;
}

export interface Player {
  id: string;                                          // Socket ID
  nickname: string;                                    // Player's chosen name
  hp: number;                                          // Player's health points
  cooldowns: SpellCooldown[];                         // Spell cooldown tracking
}

export interface Room {
  code: string;                                        // 6-character alphanumeric code
  players: Player[];                                   // List of players in the room
  language: 'EN' | 'PT';                               // Game language
}

export interface CreateRoomPayload {
  nickname: string;
  language: 'EN' | 'PT';
}

export interface JoinRoomPayload {
  nickname: string;
  code: string;
}
