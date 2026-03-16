// ---- Data types matching JSON schemas ----

export interface Passage {
  id: string;
  title: string;
  reference: string;
  sourceLabel: string;
  text: string;
  summary: string;
  genre: string;
  timelineDate: number;
  geographyTags: string[];
  ntClaim?: string;
}

export interface Clue {
  id: string;
  type: string;
  title: string;
  body: string;
}

export interface Interpretation {
  id: string;
  passageId: string;
  label: string;
  summary: string;
  category: 'original_context' | 'later_reinterpretation';
}

export interface Reward {
  id: string;
  type: 'scroll_fragment' | 'archive_key' | 'scholar_note' | 'insight_points';
  title: string;
  amount: number;
}

export interface Dialogue {
  id: string;
  speaker: string;
  text: string;
  mood: string;
}

export interface ArchiveRoom {
  id: string;
  title: string;
  description: string;
  requiredKeys: number;
  theme: string;
}

// ---- Puzzle config types ----

export interface ReconstructionConfig {
  fragmentCount: number;
  allowRotation: boolean;
  snapTolerance: number;
}

export interface ContextMatchConfig {
  prompt: string;
  choices: { id: string; label: string }[];
  correctChoiceId: string;
}

export interface GenreConfig {
  candidateGenres: string[];
  correctGenre: string;
}

export interface GeographyConfig {
  targetPlace: string;
  candidatePlaces: string[];
}

export interface TimelineConfig {
  events: string[];
  correctOrder: string[];
  showDateLabels: boolean;
}

export interface TranslationConfig {
  sourceWord: string;
  candidateTranslations: { id: string; label: string }[];
  correctTranslationId: string;
}

export interface InvestigationConnection {
  pair: [string, string];
  insight: string;
}

export interface InvestigationConfig {
  nodeIds: string[];
  validConnections: InvestigationConnection[];
}

export interface ProphecyCheckConfig {
  requirement: string;
  evidence: { id: string; text: string; category: 'supports' | 'contradicts' }[];
}

export type PuzzleConfig =
  | ReconstructionConfig
  | ContextMatchConfig
  | GenreConfig
  | GeographyConfig
  | TimelineConfig
  | TranslationConfig
  | InvestigationConfig
  | ProphecyCheckConfig;

export type PuzzleType =
  | 'reconstruction'
  | 'context_match'
  | 'genre'
  | 'geography'
  | 'timeline'
  | 'translation'
  | 'investigation'
  | 'prophecy_check';

export interface Level {
  id: string;
  title: string;
  roomId: string;
  puzzleType: PuzzleType;
  difficulty: number;
  passageIds: string[];
  clueRewardIds: string[];
  rewardIds: string[];
  introDialogueId: string;
  config: PuzzleConfig;
}

// ---- Save / progress types ----

export interface SaveData {
  completedLevels: string[];
  unlockedClues: string[];
  archiveKeys: number;
  scrollFragments: number;
  scholarNotes: string[];
  insightPoints: number;
  boardConnections: [string, string][];
}

// ---- Navigation ----

export type RootStackParamList = {
  Title: undefined;
  ArchiveMap: undefined;
  Puzzle: { levelId: string };
  Reward: { levelId: string };
  InvestigationBoard: undefined;
};
