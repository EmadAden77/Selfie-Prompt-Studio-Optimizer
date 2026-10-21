export type Tab = 'gen' | 'flash' | 'presets' | 'sessions' | 'guide' | 'about';
export type StepCategory = 'subject' | 'framing' | 'attire' | 'background' | 'physics';
export type Zone = 'inside' | 'outside';
export type Lang = 'ar' | 'en' | 'both';

export interface Opt {
  id: string;
  ar: string;
  en: string;
  desc?: string;
}

export type CameraMode = 'auto' | 'manual';

export interface AutoCameraPlan {
  mode: 'auto';
  frame: Opt;
  angle: Opt;
  shotLabelAr: string;
  shotLabelEn: string;
  focalLengthEquivalent: string;
  distanceCm: number;
  reasonAr: string;
  reasonEn: string;
}

export interface Loc {
  id: number;
  zone: Zone;
  ar: string;
  en: string;
}

export interface Cloth extends Opt {
  cat: string;
}

export interface SavedSession {
  id: string;
  name: string;
  createdAt: number;
  fav: boolean;
  data: Record<string, any>;
  customPromptAr?: string;
  customPromptEn?: string;
}

export interface PresetMood {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: string;
  data: Partial<{
    locId: number;
    carModelId: string;
    carColorId: string;
    clothId: string;
    accessoryId: string;
    poseId: string;
    anatomicalExprId: string;
    frameId: string;
    aspectId: string;
    phoneId: string;
    angleId: string;
    lightId: string;
    beardId: string;
    hairId: string;
    heightCueId: string;
    storylineId: string;
    tintId: string;
    opticalIds: string[];
    cabinIds: string[];
    skinNuanceIds: string[];
    appUiIds: string[];
    gripMotionIds: string[];
    dashUiIds: string[];
    subsurfaceIds: string[];
    fabricIds: string[];
    thermalIds: string[];
    clutterIds: string[];
    airflowIds: string[];
    screenCastIds: string[];
    cabinArtifactIds: string[];
    tallErgonomicIds: string[];
    inAppArtifactIds: string[];
    microWeatherIds: string[];
  }>;
}

export interface BuildInput {
  cameraMode?: CameraMode;
  cameraPlan?: AutoCameraPlan;
  timeOfDay?: 'auto' | 'day' | 'sunset' | 'night';
  loc: Loc;
  carModel: Opt;
  carColor: Opt;
  cloth: Cloth;
  accessory: Opt;
  pose: Opt;
  anatomicalExpr: Opt;
  frame: Opt;
  aspect: Opt;
  phone: Opt;
  angle: Opt;
  light: Opt;
  beard: Opt;
  hair: Opt;
  heightCue: Opt;
  storyline: Opt;
  tint: Opt;
  opticals: Opt[];
  cabins: Opt[];
  skinNuances: Opt[];
  appUis: Opt[];
  gripMotions: Opt[];
  dashUis: Opt[];
  subsurfaces: Opt[];
  fabrics: Opt[];
  thermals: Opt[];
  clutters: Opt[];
  airflows: Opt[];
  screenCasts: Opt[];
  cabinArtifacts: Opt[];
  tallErgonomics: Opt[];
  inAppArtifacts: Opt[];
  microWeathers: Opt[];
}

export interface GeminiScenario {
  title: string;
  vibe: string;
  storyline: string;
  suggestedHair?: string;
  suggestedCloth?: string;
  suggestedCar?: string;
  suggestedLight?: string;
  suggestedPromptSnippetEn?: string;
}

export interface GeminiOptimized {
  improvedPromptEn: string;
  improvedPromptAr: string;
  enhancementsSummary: string[];
}

export const SUBJECT_HEIGHT_CM = 193;
export const SUBJECT_WEIGHT_KG = 83;
