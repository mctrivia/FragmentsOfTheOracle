import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SaveData } from '../../types';

const SAVE_KEY = '@fragments_save';

const defaultSave: SaveData = {
  completedLevels: [],
  unlockedClues: [],
  archiveKeys: 0,
  scrollFragments: 0,
  scholarNotes: [],
  insightPoints: 0,
  boardConnections: [],
};

export async function loadSave(): Promise<SaveData> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (raw) return { ...defaultSave, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultSave };
}

export async function persistSave(data: SaveData): Promise<void> {
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export async function resetSave(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY);
}
