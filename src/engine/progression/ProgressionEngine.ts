import type { SaveData, Level } from '../../types';
import { archiveRooms, levels, getLevelsForRoom } from '../../data';

export function isRoomUnlocked(roomId: string, save: SaveData): boolean {
  const room = archiveRooms.find((r) => r.id === roomId);
  if (!room) return false;

  // Interpretation wing: need all levels from the first 3 rooms completed
  if (roomId === 'interpretation_wing') {
    const prerequisiteRooms = ['hall_of_kings', 'prophets_gallery', 'exile_records'];
    const prereqLevels = prerequisiteRooms.flatMap(getLevelsForRoom);
    return prereqLevels.every((l) => save.completedLevels.includes(l.id));
  }

  // Messianic hall: need level 10 (first investigation board) completed
  if (roomId === 'messianic_hall') {
    return save.completedLevels.includes('level_010');
  }

  // Other rooms: key-gated
  return save.archiveKeys >= room.requiredKeys;
}

export function isLevelPlayable(level: Level, save: SaveData): boolean {
  // Room must be unlocked
  if (!isRoomUnlocked(level.roomId, save)) return false;

  // Already completed — still playable (replay)
  if (save.completedLevels.includes(level.id)) return true;

  // Final investigation board: needs all messianic_hall levels AND level_010
  if (level.id === 'level_016') {
    const messianicLevels = getLevelsForRoom('messianic_hall');
    return (
      save.completedLevels.includes('level_010') &&
      messianicLevels.every((l) => save.completedLevels.includes(l.id))
    );
  }

  // Investigation / capstone levels require all other levels in their room completed
  // (except level_010 which is the first investigation board and freely playable)
  if (level.puzzleType === 'investigation' && level.id !== 'level_010') {
    const roomLevels = getLevelsForRoom(level.roomId);
    const otherLevels = roomLevels.filter((l) => l.id !== level.id);
    return otherLevels.every((l) => save.completedLevels.includes(l.id));
  }

  // All other levels within an unlocked room: freely playable
  return true;
}

export function isLevelCompleted(levelId: string, save: SaveData): boolean {
  return save.completedLevels.includes(levelId);
}

export function getNextLevel(save: SaveData): Level | null {
  return (
    levels.find(
      (l) =>
        !save.completedLevels.includes(l.id) && isLevelPlayable(l, save),
    ) ?? null
  );
}
