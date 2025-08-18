export interface URLInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export interface PersonalityAnalysis {
  personalityType: string;
  vibeDescription: string;
  targetCustomer: string;
  musicPlaylist: string[];
  brandEssence: string;
  scores: {
    trustReliability: number;
    creativityInnovation: number;
    professionalism: number;
  };
}

export interface ScrapedData {
  url: string;
  title: string;
  headline: string;
  textSample: string;
  metaDescription: string;
  dominantColors: string[];
}

export interface AnalysisResult {
  success: boolean;
  data?: PersonalityAnalysis;
  error?: string;
}

export interface LoadingState {
  isAnalyzing: boolean;
  currentStep: string;
  progress: number;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
}
