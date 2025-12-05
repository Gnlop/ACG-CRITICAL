
export type Medium = 'VN' | 'Novel' | 'Manga' | 'Anime';
export type Language = 'zh' | 'en' | 'ja';

export interface LocalizedTitle {
  zh: string;
  en: string;
  ja: string;
}

export interface Scores {
  E: number;
  A: number;
  C: number;
  O: number;
  U: number;
  R: number;
}

export interface Indices {
  P: number;
  D: number;
  OI: number;
  CI: number;
  RI: number;
  S: number;
  S_adj: number;
}

export interface Highlight {
  tag: string;
  point: string;
}

export interface MediaAdvice {
  platform: string;
  version: string;
  prereq: string;
  season_mood: string;
}

export interface Recommendation {
  title: string;
  medium: string;
  similarity: number;
  priority: number;
  reason: string;
}

export interface PkComparator {
  title: string;
  medium: string;
  similarity: number;
  scores: Scores;
  diff: {
    dE: number;
    dA: number;
    dC: number;
    dO: number;
    dU: number;
    dR: number;
  };
  adv_component: number;
  weight: number;
}

export interface PkData {
  comparators: PkComparator[];
  pk_raw: number;
  pk_score: number;
  lambda: number;
  S_before: number;
  S_after: number;
}

export interface GenreProfile {
  detected: string;
  confidence: number;
}

export interface Coefficients {
  gp_multipliers: Scores;
  warm_rule: string;
  lambda: number;
}

export interface SourceAnalysis {
  local_confidence: number; // 0.0 - 1.0
  online_confidence: number; // 0.0 - 1.0
  blending_coefficient: number; // The Omega value used
  conflict_notes: string;
  // NEW FIELDS for ABBF (Adaptive Bayesian-Bandwagon Filtering)
  consensus_reliability: string; // "High" | "Medium" | "Low" (Polarizing)
  bandwagon_penalty_detected: boolean; // Is the online score suffering from review bombing?
  moral_controversy_factor: number; // 0.0 - 1.0 (How much taboo affects the score)
}

export interface TriviaData {
  studio: string;
  studio_status: string; // e.g. "Active", "Defunct", "Renamed"
  key_staff: string;
  production_trivia: string; // A short interesting fact
}

// --- NEW INTERMEDIATE TYPES ---

export interface LocalAnalysisResult {
  scores: Scores;
  indices: Indices; // Local perspective indices
  highlights: Highlight[];
  risks: string[]; // Subjective risks (boring, confusing)
  genre_profile: GenreProfile;
  verdict_basis_intuition: 'A' | 'B' | 'C' | null;
  deep_reasoning: string;
}

export interface OnlineAnalysisResult {
  scores: Scores; // Estimated consensus scores
  consensus_reception: string;
  controversy_level: number; // 0.0 to 1.0
  release_year: number;
  risks: string[]; // Objective risks (bugs, bad adaptation)
  grounding_urls: { title: string; uri: string }[];
}

// -----------------------------

export interface ReviewResult {
  verdict: 'IN' | 'OUT';
  verdict_basis: 'A' | 'B' | 'C' | null;
  one_line_reason?: string;
  title_localized: LocalizedTitle;
  scores: Scores;
  scores_local?: Scores;
  scores_online?: Scores;
  indices: Indices;
  highlights: Highlight[];
  risks: string[];
  media_advice: MediaAdvice;
  similar_recos: Recommendation[];
  pk: PkData;
  notes_needed_if_OUT: string[];
  data_warning: string | null;
  genre_profile: GenreProfile;
  coefficients: Coefficients;
  source_analysis: SourceAnalysis; // New field for hybrid weighting details
  grounding_urls?: { title: string; uri: string }[];
}
