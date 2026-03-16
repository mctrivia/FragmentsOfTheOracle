import { useState, useCallback, useEffect } from 'react';
import type { SaveData } from '../types';
import { loadSave, persistSave, resetSave } from '../engine/save/SaveEngine';
import { getReward } from '../data';

let globalState: SaveData | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useGameStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  useEffect(() => {
    if (!globalState) {
      loadSave().then((data) => {
        globalState = data;
        notify();
      });
    }
  }, []);

  const save = globalState;

  const completeLevel = useCallback(
    async (levelId: string, rewardIds: string[], clueIds: string[]) => {
      if (!globalState) return;
      if (globalState.completedLevels.includes(levelId)) return;

      globalState = { ...globalState };
      globalState.completedLevels = [...globalState.completedLevels, levelId];

      for (const clueId of clueIds) {
        if (!globalState.unlockedClues.includes(clueId)) {
          globalState.unlockedClues = [...globalState.unlockedClues, clueId];
        }
      }

      for (const rid of rewardIds) {
        const reward = getReward(rid);
        if (!reward) continue;
        switch (reward.type) {
          case 'archive_key':
            globalState.archiveKeys += reward.amount;
            break;
          case 'scroll_fragment':
            globalState.scrollFragments += reward.amount;
            break;
          case 'scholar_note':
            if (!globalState.scholarNotes.includes(rid)) {
              globalState.scholarNotes = [...globalState.scholarNotes, rid];
            }
            break;
          case 'insight_points':
            globalState.insightPoints += reward.amount;
            break;
        }
      }

      await persistSave(globalState);
      notify();
    },
    [],
  );

  const addBoardConnection = useCallback(
    async (a: string, b: string) => {
      if (!globalState) return;
      const exists = globalState.boardConnections.some(
        ([x, y]) => (x === a && y === b) || (x === b && y === a),
      );
      if (exists) return;
      globalState = {
        ...globalState,
        boardConnections: [...globalState.boardConnections, [a, b]],
      };
      await persistSave(globalState);
      notify();
    },
    [],
  );

  const reset = useCallback(async () => {
    await resetSave();
    globalState = await loadSave();
    notify();
  }, []);

  return { save, completeLevel, addBoardConnection, reset };
}
