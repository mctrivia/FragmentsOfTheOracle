import React from 'react';
import type { Level, Passage } from '../../types';
import type {
  ReconstructionConfig,
  ContextMatchConfig,
  GenreConfig,
  GeographyConfig,
  TimelineConfig,
  TranslationConfig,
  InvestigationConfig,
  ProphecyCheckConfig,
} from '../../types';

import { ReconstructionPuzzle } from './ReconstructionPuzzle';
import { ContextMatchPuzzle } from './ContextMatchPuzzle';
import { GenrePuzzle } from './GenrePuzzle';
import { GeographyPuzzle } from './GeographyPuzzle';
import { TimelinePuzzle } from './TimelinePuzzle';
import { TranslationPuzzle } from './TranslationPuzzle';
import { InvestigationPuzzle } from './InvestigationPuzzle';
import { ProphecyCheckPuzzle } from './ProphecyCheckPuzzle';

interface PuzzleProps {
  level: Level;
  passage: Passage;
  onComplete: () => void;
}

export function renderPuzzle({ level, passage, onComplete }: PuzzleProps) {
  switch (level.puzzleType) {
    case 'reconstruction':
      return (
        <ReconstructionPuzzle
          config={level.config as ReconstructionConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    case 'context_match':
      return (
        <ContextMatchPuzzle
          config={level.config as ContextMatchConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    case 'genre':
      return (
        <GenrePuzzle
          config={level.config as GenreConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    case 'geography':
      return (
        <GeographyPuzzle
          config={level.config as GeographyConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    case 'timeline':
      return (
        <TimelinePuzzle
          config={level.config as TimelineConfig}
          onComplete={onComplete}
        />
      );
    case 'translation':
      return (
        <TranslationPuzzle
          config={level.config as TranslationConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    case 'investigation':
      return (
        <InvestigationPuzzle
          config={level.config as InvestigationConfig}
          onComplete={onComplete}
        />
      );
    case 'prophecy_check':
      return (
        <ProphecyCheckPuzzle
          config={level.config as ProphecyCheckConfig}
          passage={passage}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}
