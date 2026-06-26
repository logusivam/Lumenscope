export interface POURScores {
  perceivable: number;
  operable: number;
  understandable: number;
  robust: number;
}

export interface WCAGLevelCounts {
  A: number;
  AA: number;
  AAA: number;
}

export interface ScoreResult {
  score: number;
  pour: POURScores;
  wcag: WCAGLevelCounts;
}
