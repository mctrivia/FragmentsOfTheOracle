import levelsJson from '../../level_design_pack/data/levels.json';
import passagesJson from '../../level_design_pack/data/passages.json';
import cluesJson from '../../level_design_pack/data/clues.json';
import archiveRoomsJson from '../../level_design_pack/data/archiveRooms.json';
import dialogueJson from '../../level_design_pack/data/dialogue.json';
import interpretationsJson from '../../level_design_pack/data/interpretations.json';
import rewardsJson from '../../level_design_pack/data/rewards.json';

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
