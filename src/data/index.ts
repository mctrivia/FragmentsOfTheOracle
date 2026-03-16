import levelsJson from './levels.json';
import passagesJson from './passages.json';
import cluesJson from './clues.json';
import archiveRoomsJson from './archiveRooms.json';
import dialogueJson from './dialogue.json';
import interpretationsJson from './interpretations.json';
import rewardsJson from './rewards.json';

import type {
  Level,
  Passage,
  Clue,
  ArchiveRoom,
  Dialogue,
  Interpretation,
  Reward,
} from '../types';

// Typed data arrays
export const levels = levelsJson as Level[];
export const passages = passagesJson as Passage[];
export const clues = cluesJson as Clue[];
export const archiveRooms = archiveRoomsJson as ArchiveRoom[];
export const dialogues = dialogueJson as Dialogue[];
export const interpretations = interpretationsJson as Interpretation[];
export const rewards = rewardsJson as Reward[];

// Lookup helpers
export const getLevel = (id: string) => levels.find((l) => l.id === id);
export const getPassage = (id: string) => passages.find((p) => p.id === id);
export const getClue = (id: string) => clues.find((c) => c.id === id);
export const getRoom = (id: string) => archiveRooms.find((r) => r.id === id);
export const getDialogue = (id: string) => dialogues.find((d) => d.id === id);
export const getReward = (id: string) => rewards.find((r) => r.id === id);
export const getInterpretation = (id: string) => interpretations.find((i) => i.id === id);

export const getLevelsForRoom = (roomId: string) =>
  levels.filter((l) => l.roomId === roomId);
