export enum AppScreen {
  SPLASH = 'SPLASH',
  ERA_SELECTION = 'ERA_SELECTION',
  CAMERA = 'CAMERA',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}

export enum EraId {
  TAHRIR = 'tahrir',
  NILE = 'nile',
  DOWNTOWN = 'downtown',
  TOWER = 'tower',
}

export interface EraData {
  id: EraId;
  name: string;
  nameAr: string;
  description: string;
  promptInstructions: string;
}

export interface PropData {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  icon: string;
  prompt: string;
}

export interface FaceDetectionResult {
  maleCount: number;
  femaleCount: number;
  childCount: number;
  totalPeople: number;
}