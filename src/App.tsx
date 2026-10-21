import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Tab, StepCategory, Lang, SavedSession, PresetMood, GeminiScenario, GeminiOptimized, Opt, CameraMode, AutoSceneDirectorPlan } from './types/studio';
import {
  HAIR_STYLES,
  BEARD_STYLES,
  ANATOMICAL_EXPRESSIONS,
  HEIGHT_CUES,
  SKIN_NUANCES,
  SUBSURFACE_PHYSICS,
  FABRIC_PHYSICS,
  THERMAL_CLIMATE_PHYSICS,
  DAILY_LIFE_CLUTTER,
  APP_UI_ELEMENTS,
  WINDOW_TINTS,
  GRIP_MOTION_NUANCES,
  DASH_UI_DETAILS,
  OPTICAL_IMPERFECTIONS,
  CABIN_DETAILS,
  CLOTHES,
  STORYLINES,
  FRAMINGS,
  ASPECTS,
  PHONES,
  ANGLES,
  LIGHTING,
  CAR_MODELS,
  CAR_COLORS,
  ACCESSORIES,
  POSES,
  LOCATIONS,
  PRESET_MOODS,
  buildPrompt,
  AIRFLOW_OPTIONS,
  SCREEN_CAST_LIGHTING,
  CABIN_ARTIFACTS,
  TALL_ERGONOMICS,
  IN_APP_ARTIFACTS,
  MICRO_WEATHER,
} from './data/studioData';
import { ViewfinderSimulator } from './components/ViewfinderSimulator';
import { PromptEditorModal } from './components/PromptEditorModal';
import { UnifiedStudioControls } from './components/UnifiedStudioControls';
import { QuickFlashGenerator } from './components/QuickFlashGenerator';
import { validateAndSanitizePhysics, PhysicalRealismReport } from './utils/realismEngine';
import { analyzeLocationLighting, TimeOfDay } from './utils/lightingEngine';
import { copyToClipboard } from './utils/clipboard';
import { geminiApiUrl } from './utils/geminiApi';
import { resolveAutoCameraPlan } from './utils/autoCameraDirector';
import { normalizeGeminiDirectorPlan, resolveAutoSceneDirector } from './utils/autoSceneDirector';
import { normalizeGeminiPromptResult, type GeminiPromptResult } from './utils/geminiPromptPolicy';

const STORAGE_KEY = 'selfie-prompt-studio-v11.0';

interface StoredState {
  locId?: number;
  carModelId?: string;
  carColorId?: string;
  clothId?: string;
  accessoryId?: string;
  poseId?: string;
  anatomicalExprId?: string;
  frameId?: string;
  aspectId?: string;
  phoneId?: string;
  angleId?: string;
  cameraMode?: CameraMode;
  lightId?: string;
  beardId?: string;
  hairId?: string;
  heightCueId?: string;
  storylineId?: string;
  tintId?: string;
  opticalIds?: string[];
  cabinIds?: string[];
  skinNuanceIds?: string[];
  appUiIds?: string[];
  gripMotionIds?: string[];
  dashUiIds?: string[];
  subsurfaceIds?: string[];
  fabricIds?: string[];
  thermalIds?: string[];
  clutterIds?: string[];
  airflowIds?: string[];
  screenCastIds?: string[];
  cabinArtifactIds?: string[];
  tallErgonomicIds?: string[];
  inAppArtifactIds?: string[];
  microWeatherIds?: string[];
  lang?: Lang;
  darkMode?: boolean;
  sessions?: SavedSession[];
  customPromptAr?: string;
  customPromptEn?: string;
  isCustomEdited?: boolean;
  autoLighting?: boolean;
  useGeminiAutoEngine?: boolean;
  timeOfDay?: TimeOfDay;
}

function loadInitialState(): StoredState {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || localStorage.getItem('selfie-prompt-studio-v10.0') : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStored(s: StoredState) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }
  } catch {}
}

export default function App() {
  const initial = useRef(loadInitialState()).current;

  const [tab, setTab] = useState<Tab>('gen');
  const [darkMode, setDarkMode] = useState(initial.darkMode ?? true);
  const [lang, setLang] = useState<Lang>(initial.lang ?? 'both');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // إعدادات المرجع الأساسية (مقفولة الكثافة)
  const [beardId, setBeardId] = useState(initial.beardId ?? 'ref_signature_beard');
  const [hairId, setHairId] = useState(initial.hairId ?? 'ref_signature_tousled');
  const [anatomicalExprId, setAnatomicalExprId] = useState(initial.anatomicalExprId ?? 'ref_warm_smile');
  const [heightCueId, setHeightCueId] = useState(initial.heightCueId ?? 'headrest_max');

  // الكاميرا والتأطير
  const initialCameraMode: CameraMode = initial.cameraMode ?? (initial.frameId || initial.angleId ? 'manual' : 'auto');
  const [cameraMode, setCameraMode] = useState<CameraMode>(initialCameraMode);
  const [frameId, setFrameId] = useState(initial.frameId ?? 'close_face');
  const [aspectId, setAspectId] = useState(initial.aspectId ?? '916');
  const [phoneId, setPhoneId] = useState(initial.phoneId ?? 'iphone_16_pro');
  const [angleId, setAngleId] = useState(initial.angleId ?? 'eye_level');
  const [poseId, setPoseId] = useState(initial.poseId ?? 'hand_on_wheel');

  // المظهر والسياق
  const [clothId, setClothId] = useState(initial.clothId ?? 'tee_black_ref');
  const [accessoryId, setAccessoryId] = useState(initial.accessoryId ?? 'sunglasses_collar');
  const [storylineId, setStorylineId] = useState(initial.storylineId ?? 'traffic_light_stop');

  // الخلفية المحيطة والسيارة (40 مكاناً + إنارة مستقلة)
  const [locId, setLocId] = useState<number>(initial.locId ?? 2);
  const [carModelId, setCarModelId] = useState(initial.carModelId ?? 'landcruiser_lc300');
  const [carColorId, setCarColorId] = useState(initial.carColorId ?? 'white');
  const [tintId, setTintId] = useState(initial.tintId ?? 'tint_medium_02');
  const [lightId, setLightId] = useState(initial.lightId ?? 'sodium_street');

  // محرك الإنارة الذكي v11
  const [autoLighting, setAutoLighting] = useState<boolean>(initial.autoLighting ?? true);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(initial.timeOfDay ?? 'auto');

  // الفيزياء الدقيقة
  const [skinNuanceIds, setSkinNuanceIds] = useState<string[]>(initial.skinNuanceIds ?? ['ref_freckles_moles', 'stray_beard_hairs']);
  const [subsurfaceIds, setSubsurfaceIds] = useState<string[]>(initial.subsurfaceIds ?? ['thobe_jaw_bounce', 'ear_cartilage_glow']);
  const [fabricIds, setFabricIds] = useState<string[]>(initial.fabricIds ?? ['seat_hip_creases']);
  const [thermalIds, setThermalIds] = useState<string[]>(initial.thermalIds ?? ['cup_sweat_droplets']);
  const [appUiIds, setAppUiIds] = useState<string[]>(initial.appUiIds ?? ['app_compression_filter']);
  const [gripMotionIds, setGripMotionIds] = useState<string[]>(initial.gripMotionIds ?? ['natural_arm_stretch']);
  const [opticalIds, setOpticalIds] = useState<string[]>(initial.opticalIds ?? ['catchlight_reflection']);
  const [cabinIds, setCabinIds] = useState<string[]>(initial.cabinIds ?? ['large_hand_gear', 'tissue_box_console']);
  const [dashUiIds, setDashUiIds] = useState<string[]>(initial.dashUiIds ?? ['ac_dual_temp']);
  const [clutterIds, setClutterIds] = useState<string[]>(initial.clutterIds ?? ['charger_12v_glow']);

  // الباقات الجديدة v10.0
  const [airflowIds, setAirflowIds] = useState<string[]>(initial.airflowIds ?? ['ac_gentle_breeze']);
  const [screenCastIds, setScreenCastIds] = useState<string[]>(initial.screenCastIds ?? ['phone_screen_catchlight']);
  const [cabinArtifactIds, setCabinArtifactIds] = useState<string[]>(initial.cabinArtifactIds ?? ['magsafe_ac_mount']);
  const [tallErgonomicIds, setTallErgonomicIds] = useState<string[]>(initial.tallErgonomicIds ?? ['head_tilt_inward']);
  const [inAppArtifactIds, setInAppArtifactIds] = useState<string[]>(initial.inAppArtifactIds ?? ['instant_snap_bokeh']);
  const [microWeatherIds, setMicroWeatherIds] = useState<string[]>(initial.microWeatherIds ?? []);

  // الجلسات والمحرر المخصص
  const [sessions, setSessions] = useState<SavedSession[]>(initial.sessions ?? []);
  const [sessionName, setSessionName] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCustomEdited, setIsCustomEdited] = useState(initial.isCustomEdited ?? false);
  const [customPromptAr, setCustomPromptAr] = useState(initial.customPromptAr ?? '');
  const [customPromptEn, setCustomPromptEn] = useState(initial.customPromptEn ?? '');

  // Gemini 3 Flash States
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiType, setGeminiType] = useState<'optimize' | 'scenario' | null>(null);
  const [geminiDirectorPlan, setGeminiDirectorPlan] = useState<AutoSceneDirectorPlan | null>(null);
  const [geminiDirectorKey, setGeminiDirectorKey] = useState('');
  const [directorStatus, setDirectorStatus] = useState<'local' | 'loading' | 'gemini' | 'fallback'>('local');
  const directorRequestRef = useRef(0);
  const [geminiAutoPrompt, setGeminiAutoPrompt] = useState<GeminiPromptResult | null>(null);
  const [geminiAutoPromptKey, setGeminiAutoPromptKey] = useState('');
  const [geminiAutoPromptStatus, setGeminiAutoPromptStatus] = useState<'idle' | 'loading' | 'ready' | 'fallback'>('idle');
  const [useGeminiAutoEngine, setUseGeminiAutoEngine] = useState(initial.useGeminiAutoEngine ?? true);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const geminiAutoPromptRequestRef = useRef(0);

  // Snapshot & Automatic Physical Realism Engine States
  const [studioSnapshot, setStudioSnapshot] = useState<StoredState | null>(null);
  const [showRealismModal, setShowRealismModal] = useState(false);

  const handleSetLocId = (id: number) => {
    setLocId(id);
  };

  // Re-evaluate physically plausible lighting whenever the location OR time changes.
  // Respect manually selected lighting when auto mode is off.
  useEffect(() => {
    if (!autoLighting) return;
    const analysis = analyzeLocationLighting(locId, timeOfDay);
    const knownIds = new Set((LIGHTING as Opt[]).map(option => option.id));
    const recommended = [
      analysis.primaryRecommendedLightId,
      ...analysis.recommendations.map(option => option.id),
    ].find(id => knownIds.has(id));
    if (recommended) {
      setLightId(previous => previous === recommended ? previous : recommended);
    }
  }, [locId, timeOfDay, autoLighting]);

  useEffect(() => {
    saveStored({
      locId, carModelId, carColorId, clothId, accessoryId, poseId,
      cameraMode, anatomicalExprId, frameId, aspectId, phoneId, angleId, lightId,
      beardId, hairId, heightCueId, storylineId, tintId,
      opticalIds, cabinIds, skinNuanceIds, appUiIds, gripMotionIds, dashUiIds,
      subsurfaceIds, fabricIds, thermalIds, clutterIds,
      airflowIds, screenCastIds, cabinArtifactIds, tallErgonomicIds, inAppArtifactIds, microWeatherIds,
      lang, darkMode, sessions,
      customPromptAr, customPromptEn, isCustomEdited,
      autoLighting, timeOfDay, useGeminiAutoEngine
    });
  }, [
    locId, carModelId, carColorId, clothId, accessoryId, poseId,
    cameraMode, anatomicalExprId, frameId, aspectId, phoneId, angleId, lightId,
    beardId, hairId, heightCueId, storylineId, tintId,
    opticalIds, cabinIds, skinNuanceIds, appUiIds, gripMotionIds, dashUiIds,
    subsurfaceIds, fabricIds, thermalIds, clutterIds,
    airflowIds, screenCastIds, cabinArtifactIds, tallErgonomicIds, inAppArtifactIds, microWeatherIds,
    lang, darkMode, sessions,
    customPromptAr, customPromptEn, isCustomEdited,
    autoLighting, timeOfDay, useGeminiAutoEngine
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const beard = BEARD_STYLES.find(b => b.id === beardId) ?? BEARD_STYLES[0];
  const hair = HAIR_STYLES.find(h => h.id === hairId) ?? HAIR_STYLES[0];
  const heightCue = HEIGHT_CUES.find(h => h.id === heightCueId) ?? HEIGHT_CUES[0];
  const anatomicalExpr = ANATOMICAL_EXPRESSIONS.find(e => e.id === anatomicalExprId) ?? ANATOMICAL_EXPRESSIONS[0];
  const storyline = STORYLINES.find(s => s.id === storylineId) ?? STORYLINES[0];
  const tint = WINDOW_TINTS.find(t => t.id === tintId) ?? WINDOW_TINTS[0];

  const loc = LOCATIONS.find(l => l.id === locId) ?? LOCATIONS[0];
  const carModel = CAR_MODELS.find(c => c.id === carModelId) ?? CAR_MODELS[0];
  const carColor = CAR_COLORS.find(c => c.id === carColorId) ?? CAR_COLORS[0];
  const cloth = CLOTHES.find(c => c.id === clothId) ?? CLOTHES[0];
  const accessory = ACCESSORIES.find(a => a.id === accessoryId) ?? ACCESSORIES[0];
  const pose = POSES.find(p => p.id === poseId) ?? POSES[0];
  const configuredFrame = FRAMINGS.find(f => f.id === frameId) ?? FRAMINGS[0];
  const aspect = ASPECTS.find(a => a.id === aspectId) ?? ASPECTS[0];
  const phone = PHONES.find(p => p.id === phoneId) ?? PHONES[0];
  const configuredAngle = ANGLES.find(a => a.id === angleId) ?? ANGLES[0];
  const light = (LIGHTING as Opt[]).find((l: Opt) => l.id === lightId) ?? (LIGHTING[0] as Opt);

  const directorContext = useMemo(
    () => ({ loc, carModel, cloth, accessory, aspect, phone, light, storyline, tint, timeOfDay }),
    [loc, carModel, cloth, accessory, aspect, phone, light, storyline, tint, timeOfDay]
  );
  const directorKey = useMemo(
    () => JSON.stringify({
      locId, carModelId, clothId, accessoryId, aspectId, phoneId, lightId, storylineId, tintId, timeOfDay,
    }),
    [locId, carModelId, clothId, accessoryId, aspectId, phoneId, lightId, storylineId, tintId, timeOfDay]
  );
  const localDirectorPlan = useMemo(
    () => resolveAutoSceneDirector(directorContext),
    [directorContext]
  );
  const activeDirectorPlan = geminiDirectorKey === directorKey && geminiDirectorPlan
    ? geminiDirectorPlan
    : localDirectorPlan;

  // Gemini proposes only the scene direction. The local plan remains active while
  // the request is pending or unavailable, so prompt generation never blocks.
  useEffect(() => {
    if (cameraMode !== 'auto') {
      setDirectorStatus('local');
      return;
    }

    const requestId = ++directorRequestRef.current;
    let cancelled = false;
    setDirectorStatus('loading');
    setGeminiDirectorPlan(null);
    setGeminiDirectorKey('');

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20_000);
      try {
        const describe = (value: Opt) => ({ id: value.id, ar: value.ar, en: value.en });
        const response = await fetch(geminiApiUrl('/api/gemini/call-flash'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            action: 'director',
            scene: {
              location: { id: loc.id, zone: loc.zone, ar: loc.ar, en: loc.en },
              carModel: describe(carModel),
              clothing: describe(cloth),
              accessory: describe(accessory),
              aspect: describe(aspect),
              phone: describe(phone),
              lighting: describe(light),
              storyline: describe(storyline),
              tint: describe(tint),
              timeOfDay,
              fallbackPlan: localDirectorPlan,
            },
          }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.success) throw new Error(data?.error || 'director_unavailable');
        const normalized = normalizeGeminiDirectorPlan(
          data.director ?? data,
          directorContext,
          localDirectorPlan,
        );
        if (!normalized) throw new Error('director_invalid_response');
        if (cancelled || requestId !== directorRequestRef.current) return;
        setGeminiDirectorPlan(normalized);
        setGeminiDirectorKey(directorKey);
        setDirectorStatus('gemini');
      } catch {
        if (cancelled || requestId !== directorRequestRef.current) return;
        setDirectorStatus('fallback');
      } finally {
        window.clearTimeout(timeoutId);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cameraMode, directorKey, directorContext, localDirectorPlan, loc, carModel, cloth, accessory, aspect, phone, light, storyline, tint, timeOfDay]);

  const automaticPromptKey = useMemo(
    () => JSON.stringify({ carModelId, carColorId, clothId, lightId }),
    [carModelId, carColorId, clothId, lightId]
  );
  const automaticPromptIsActive = useGeminiAutoEngine && geminiAutoPromptKey === automaticPromptKey && Boolean(geminiAutoPrompt);

  // Gemini owns the automatic prompt. Only car, lighting, and clothing are sent as
  // authoritative user choices; every other detail is selected under the strict policy.
  useEffect(() => {
    if (!useGeminiAutoEngine) {
      setGeminiAutoPromptStatus('idle');
      setGeminiAutoPrompt(null);
      setGeminiAutoPromptKey('');
      return;
    }

    const requestId = ++geminiAutoPromptRequestRef.current;
    let cancelled = false;
    setGeminiAutoPromptStatus('loading');
    setGeminiAutoPrompt(null);
    setGeminiAutoPromptKey('');

    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25_000);
      try {
        const describe = (value: Opt) => ({ id: value.id, ar: value.ar, en: value.en });
        const response = await fetch(geminiApiUrl('/api/gemini/generate-prompt'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            car: describe(carModel),
            carColor: describe(carColor),
            light: describe(light),
            cloth: describe(cloth),
          }),
        });
        const data = await response.json().catch(() => null);
        const normalized = data?.success
          ? normalizeGeminiPromptResult(data.prompt)
          : null;
        if (!response.ok || !normalized) {
          throw new Error(data?.error || 'automatic_prompt_unavailable');
        }
        if (cancelled || requestId !== geminiAutoPromptRequestRef.current) return;
        setGeminiAutoPrompt(normalized);
        setGeminiAutoPromptKey(automaticPromptKey);
        setGeminiAutoPromptStatus('ready');
      } catch {
        if (cancelled || requestId !== geminiAutoPromptRequestRef.current) return;
        setGeminiAutoPromptStatus('fallback');
      } finally {
        window.clearTimeout(timeoutId);
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [automaticPromptKey, carModel, carColor, cloth, light, useGeminiAutoEngine]);

  const autoCameraPlan = useMemo(
    () => resolveAutoCameraPlan({ loc, carModel, cloth, pose, aspect, phone, light, storyline, tint, directorPlan: activeDirectorPlan }),
    [loc, carModel, cloth, pose, aspect, phone, light, storyline, tint, activeDirectorPlan]
  );
  const frame = cameraMode === 'auto' ? autoCameraPlan.frame : configuredFrame;
  const angle = cameraMode === 'auto' ? autoCameraPlan.angle : configuredAngle;

  const opticals = OPTICAL_IMPERFECTIONS.filter(e => opticalIds.includes(e.id));
  const cabins = CABIN_DETAILS.filter(e => cabinIds.includes(e.id));
  const skinNuances = SKIN_NUANCES.filter(e => skinNuanceIds.includes(e.id));
  const appUis = APP_UI_ELEMENTS.filter(e => appUiIds.includes(e.id));
  const gripMotions = GRIP_MOTION_NUANCES.filter(e => gripMotionIds.includes(e.id));
  const dashUis = DASH_UI_DETAILS.filter(e => dashUiIds.includes(e.id));
  const subsurfaces = SUBSURFACE_PHYSICS.filter(s => subsurfaceIds.includes(s.id));
  const fabrics = FABRIC_PHYSICS.filter(f => fabricIds.includes(f.id));
  const thermals = THERMAL_CLIMATE_PHYSICS.filter(t => thermalIds.includes(t.id));
  const clutters = DAILY_LIFE_CLUTTER.filter(c => clutterIds.includes(c.id));

  const airflows = AIRFLOW_OPTIONS.filter(a => airflowIds.includes(a.id));
  const screenCasts = SCREEN_CAST_LIGHTING.filter(s => screenCastIds.includes(s.id));
  const cabinArtifacts = CABIN_ARTIFACTS.filter(c => cabinArtifactIds.includes(c.id));
  const tallErgonomics = TALL_ERGONOMICS.filter(t => tallErgonomicIds.includes(t.id));
  const inAppArtifacts = IN_APP_ARTIFACTS.filter(i => inAppArtifactIds.includes(i.id));
  const microWeathers = MICRO_WEATHER.filter(m => microWeatherIds.includes(m.id));

  const rawInput = useMemo(
    () => ({
      loc, carModel, carColor, cloth, accessory, pose,
      cameraMode,
      cameraPlan: cameraMode === 'auto' ? autoCameraPlan : undefined,
      directorPlan: cameraMode === 'auto' ? activeDirectorPlan : undefined,
      anatomicalExpr, frame, aspect, phone, angle, light,
      beard, hair, heightCue, storyline, tint,
      opticals, cabins, skinNuances, appUis, gripMotions, dashUis,
      subsurfaces, fabrics, thermals, clutters,
      airflows, screenCasts, cabinArtifacts, tallErgonomics, inAppArtifacts, microWeathers, timeOfDay
    }),
    [
      loc, carModel, carColor, cloth, accessory, pose,
      anatomicalExpr, frame, aspect, phone, angle, light,
      beard, hair, heightCue, storyline, tint,
      opticals, cabins, skinNuances, appUis, gripMotions, dashUis,
      subsurfaces, fabrics, thermals, clutters,
      airflows, screenCasts, cabinArtifacts, tallErgonomics, inAppArtifacts, microWeathers, timeOfDay,
      cameraMode, autoCameraPlan, activeDirectorPlan
    ]
  );

  // Automatic Physical Realism Engine Centralized Validation & Sanitization
  const { report: realismReport, sanitized: sanitizedInput } = useMemo(
    () => validateAndSanitizePhysics(rawInput),
    [rawInput]
  );

  const computedPrompt = useMemo(
    () => buildPrompt(sanitizedInput),
    [sanitizedInput]
  );

  // Invalidate custom text when the scene changes. The previous implementation
  // kept displaying and copying stale text after changing locations or outfits.
  const sceneFingerprint = JSON.stringify({
    locId, carModelId, carColorId, clothId, accessoryId, poseId,
    cameraMode, anatomicalExprId, frameId, aspectId, phoneId, angleId, lightId,
    beardId, hairId, heightCueId, storylineId, tintId,
    opticalIds, cabinIds, skinNuanceIds, appUiIds, gripMotionIds,
    dashUiIds, subsurfaceIds, fabricIds, thermalIds, clutterIds,
    airflowIds, screenCastIds, cabinArtifactIds, tallErgonomicIds,
    inAppArtifactIds, microWeatherIds, timeOfDay, autoLighting,
  });
  const lastSceneFingerprint = useRef(sceneFingerprint);
  useEffect(() => {
    if (lastSceneFingerprint.current !== sceneFingerprint) {
      lastSceneFingerprint.current = sceneFingerprint;
      setIsCustomEdited(false);
      setCustomPromptAr('');
      setCustomPromptEn('');
      setGeminiResult('');
      setGeminiError(null);
    }
  }, [sceneFingerprint]);

  const promptSource = isCustomEdited
    ? 'custom'
    : automaticPromptIsActive
      ? 'gemini'
      : 'local';
  const promptAr = isCustomEdited && customPromptAr
    ? customPromptAr
    : automaticPromptIsActive && geminiAutoPrompt
      ? geminiAutoPrompt.promptAr
      : computedPrompt.ar;
  const promptEn = isCustomEdited && customPromptEn
    ? customPromptEn
    : automaticPromptIsActive && geminiAutoPrompt
      ? geminiAutoPrompt.promptEn
      : computedPrompt.en;

  const toggle = (id: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    if (isCustomEdited) setIsCustomEdited(false);
  };

  const copy = async (text: string, tag: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(tag === 'ar' ? '✓ تم نسخ البرومبت بالعربية' : tag === 'en' ? '✓ Copied English Prompt' : tag === 'ai' ? '✓ تم نسخ نتيجة الذكاء الاصطناعي' : '✓ تم نسخ البرومبت الكامل');
    } else {
      showToast('⚠️ تعذر النسخ إلى الحافظة');
    }
  };

  // Snapshot Handlers for Quick Flash Mode Toggle & Restore
  const enterQuickFlashMode = () => {
    if (!studioSnapshot) {
      setStudioSnapshot({
        locId, carModelId, carColorId, clothId, accessoryId, poseId,
        cameraMode, anatomicalExprId, frameId, aspectId, phoneId, angleId, lightId,
        beardId, hairId, heightCueId, storylineId, tintId,
        opticalIds, cabinIds, skinNuanceIds, appUiIds, gripMotionIds, dashUiIds,
        subsurfaceIds, fabricIds, thermalIds, clutterIds,
        airflowIds, screenCastIds, cabinArtifactIds, tallErgonomicIds, inAppArtifactIds, microWeatherIds,
        lang, darkMode, sessions,
        customPromptAr, customPromptEn, isCustomEdited
      });
    }
    setTab('flash');
  };

  const restoreStudioSnapshot = () => {
    if (!studioSnapshot) return;
    if (studioSnapshot.locId) setLocId(studioSnapshot.locId);
    if (studioSnapshot.carModelId) setCarModelId(studioSnapshot.carModelId);
    if (studioSnapshot.carColorId) setCarColorId(studioSnapshot.carColorId);
    if (studioSnapshot.clothId) setClothId(studioSnapshot.clothId);
    if (studioSnapshot.accessoryId) setAccessoryId(studioSnapshot.accessoryId);
    if (studioSnapshot.poseId) setPoseId(studioSnapshot.poseId);
    if (studioSnapshot.anatomicalExprId) setAnatomicalExprId(studioSnapshot.anatomicalExprId);
    if (studioSnapshot.cameraMode) setCameraMode(studioSnapshot.cameraMode);
    if (studioSnapshot.frameId) setFrameId(studioSnapshot.frameId);
    if (studioSnapshot.aspectId) setAspectId(studioSnapshot.aspectId);
    if (studioSnapshot.phoneId) setPhoneId(studioSnapshot.phoneId);
    if (studioSnapshot.angleId) setAngleId(studioSnapshot.angleId);
    if (studioSnapshot.lightId) setLightId(studioSnapshot.lightId);
    if (studioSnapshot.beardId) setBeardId(studioSnapshot.beardId);
    if (studioSnapshot.hairId) setHairId(studioSnapshot.hairId);
    if (studioSnapshot.heightCueId) setHeightCueId(studioSnapshot.heightCueId);
    if (studioSnapshot.storylineId) setStorylineId(studioSnapshot.storylineId);
    if (studioSnapshot.tintId) setTintId(studioSnapshot.tintId);
    if (studioSnapshot.opticalIds) setOpticalIds(studioSnapshot.opticalIds);
    if (studioSnapshot.cabinIds) setCabinIds(studioSnapshot.cabinIds);
    if (studioSnapshot.skinNuanceIds) setSkinNuanceIds(studioSnapshot.skinNuanceIds);
    if (studioSnapshot.appUiIds) setAppUiIds(studioSnapshot.appUiIds);
    if (studioSnapshot.gripMotionIds) setGripMotionIds(studioSnapshot.gripMotionIds);
    if (studioSnapshot.dashUiIds) setDashUiIds(studioSnapshot.dashUiIds);
    if (studioSnapshot.subsurfaceIds) setSubsurfaceIds(studioSnapshot.subsurfaceIds);
    if (studioSnapshot.fabricIds) setFabricIds(studioSnapshot.fabricIds);
    if (studioSnapshot.thermalIds) setThermalIds(studioSnapshot.thermalIds);
    if (studioSnapshot.clutterIds) setClutterIds(studioSnapshot.clutterIds);
    if (studioSnapshot.airflowIds) setAirflowIds(studioSnapshot.airflowIds);
    if (studioSnapshot.screenCastIds) setScreenCastIds(studioSnapshot.screenCastIds);
    if (studioSnapshot.cabinArtifactIds) setCabinArtifactIds(studioSnapshot.cabinArtifactIds);
    if (studioSnapshot.tallErgonomicIds) setTallErgonomicIds(studioSnapshot.tallErgonomicIds);
    if (studioSnapshot.inAppArtifactIds) setInAppArtifactIds(studioSnapshot.inAppArtifactIds);
    if (studioSnapshot.microWeatherIds) setMicroWeatherIds(studioSnapshot.microWeatherIds);
    if (studioSnapshot.isCustomEdited !== undefined) setIsCustomEdited(studioSnapshot.isCustomEdited);
    if (studioSnapshot.customPromptAr) setCustomPromptAr(studioSnapshot.customPromptAr);
    if (studioSnapshot.customPromptEn) setCustomPromptEn(studioSnapshot.customPromptEn);
    setStudioSnapshot(null);
    setTab('gen');
    showToast('✓ تم استعادة إعدادات الاستوديو السابقة بنجاح');
  };

  // Secure Server-Side Gemini 3 Flash Call
  const callGeminiFlash = async (action: 'optimize' | 'scenario') => {
    setIsGeminiLoading(true);
    setGeminiType(action);
    setGeminiResult(null);
    setGeminiError(null);

    try {
      const response = await fetch(geminiApiUrl('/api/gemini/call-flash'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          promptEn,
          promptAr,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data?.success && data.text) {
        setGeminiResult(data.text);
        showToast(action === 'optimize' ? '✓ تم فحص وتحسين البرومبت عبر Gemini 3 Flash' : '✓ تم توليد سيناريو عفوي جديد عبر Gemini 3 Flash');
      } else {
        setGeminiError(
          response.status === 404
            ? 'خدمة Gemini غير متاحة في النشر الثابت. شغّل server.ts أو اربط خادم API خارجي.'
            : data?.error || 'عذراً، لم نتمكن من الحصول على استجابة فورية. يرجى إعادة المحاولة.'
        );
      }
    } catch {
      setGeminiError('حدث خطأ أثناء الاتصال بنموذج Gemini. تأكد من اتصال الخادم والإنترنت.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const applyGeminiResultToPrompt = () => {
    if (!geminiResult) return;
    setCustomPromptEn(`${promptEn}\n\n/* Gemini 3 Flash Enhancements */\n${geminiResult}`);
    setIsCustomEdited(true);
    showToast('✓ تم دمج تحسينات Gemini مع الأمر في الاستوديو');
  };

  const applyPreset = (preset: PresetMood) => {
    const d = preset.data;
    if (d.locId !== undefined) setLocId(d.locId);
    if (d.carModelId) setCarModelId(d.carModelId);
    if (d.carColorId) setCarColorId(d.carColorId);
    if (d.clothId) setClothId(d.clothId);
    if (d.accessoryId) setAccessoryId(d.accessoryId);
    if (d.poseId) setPoseId(d.poseId);
    if (d.lightId) setLightId(d.lightId);
    if (d.storylineId) setStorylineId(d.storylineId);
    if (d.tintId) setTintId(d.tintId);
    if (d.anatomicalExprId) setAnatomicalExprId(d.anatomicalExprId);
    if (d.heightCueId) setHeightCueId(d.heightCueId);
    if (d.hairId) setHairId(d.hairId);
    if (d.beardId) setBeardId(d.beardId);
    if (d.opticalIds) setOpticalIds(d.opticalIds);
    if (d.cabinIds) setCabinIds(d.cabinIds);
    if (d.skinNuanceIds) setSkinNuanceIds(d.skinNuanceIds);
    if (d.appUiIds) setAppUiIds(d.appUiIds);
    if (d.gripMotionIds) setGripMotionIds(d.gripMotionIds);
    if (d.dashUiIds) setDashUiIds(d.dashUiIds);
    if (d.subsurfaceIds) setSubsurfaceIds(d.subsurfaceIds);
    if (d.fabricIds) setFabricIds(d.fabricIds);
    if (d.thermalIds) setThermalIds(d.thermalIds);
    if (d.clutterIds) setClutterIds(d.clutterIds);
    if (d.airflowIds) setAirflowIds(d.airflowIds);
    if (d.screenCastIds) setScreenCastIds(d.screenCastIds);
    if (d.cabinArtifactIds) setCabinArtifactIds(d.cabinArtifactIds);
    if (d.tallErgonomicIds) setTallErgonomicIds(d.tallErgonomicIds);
    if (d.inAppArtifactIds) setInAppArtifactIds(d.inAppArtifactIds);
    if (d.microWeatherIds) setMicroWeatherIds(d.microWeatherIds);
    setIsCustomEdited(false);
    setTab('gen');
    showToast(`✓ تم تفعيل سيناريو: ${preset.title}`);
  };

  const saveSession = () => {
    const name = sessionName.trim() || `توليفة سيلفي — ${hair.ar.split(' ')[0]} (${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })})`;
    const s: SavedSession = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      fav: false,
      data: {
        locId, carModelId, carColorId, clothId, accessoryId, poseId,
        cameraMode, anatomicalExprId, frameId, aspectId, phoneId, angleId, lightId,
        beardId, hairId, heightCueId, storylineId, tintId,
        opticalIds, cabinIds, skinNuanceIds, appUiIds, gripMotionIds, dashUiIds,
        subsurfaceIds, fabricIds, thermalIds, clutterIds,
        airflowIds, screenCastIds, cabinArtifactIds, tallErgonomicIds, inAppArtifactIds, microWeatherIds
      },
      customPromptAr: isCustomEdited ? customPromptAr : undefined,
      customPromptEn: isCustomEdited ? customPromptEn : undefined,
    };
    setSessions(p => [s, ...p].slice(0, 30));
    setSessionName('');
    showToast('✓ تم حفظ الجلسة بنجاح');
  };

  const loadSession = (s: SavedSession) => {
    const d = s.data as Record<string, any>;
    if (d.locId !== undefined) setLocId(d.locId);
    if (d.carModelId) setCarModelId(d.carModelId);
    if (d.carColorId) setCarColorId(d.carColorId);
    if (d.clothId) setClothId(d.clothId);
    if (d.accessoryId) setAccessoryId(d.accessoryId);
    if (d.poseId) setPoseId(d.poseId);
    if (d.storylineId) setStorylineId(d.storylineId);
    if (d.tintId) setTintId(d.tintId);
    if (d.anatomicalExprId) setAnatomicalExprId(d.anatomicalExprId);
    if (d.cameraMode === 'auto' || d.cameraMode === 'manual') {
      setCameraMode(d.cameraMode);
    } else if (d.frameId || d.angleId) {
      // Legacy sessions encoded a deliberate camera choice without cameraMode.
      setCameraMode('manual');
    }
    if (d.frameId) setFrameId(d.frameId);
    if (d.aspectId) setAspectId(d.aspectId);
    if (d.phoneId) setPhoneId(d.phoneId);
    if (d.angleId) setAngleId(d.angleId);
    if (d.lightId) setLightId(d.lightId);
    if (d.beardId) setBeardId(d.beardId);
    if (d.hairId) setHairId(d.hairId);
    if (d.heightCueId) setHeightCueId(d.heightCueId);
    if (d.opticalIds) setOpticalIds(d.opticalIds);
    if (d.cabinIds) setCabinIds(d.cabinIds);
    if (d.skinNuanceIds) setSkinNuanceIds(d.skinNuanceIds);
    if (d.appUiIds) setAppUiIds(d.appUiIds);
    if (d.gripMotionIds) setGripMotionIds(d.gripMotionIds);
    if (d.dashUiIds) setDashUiIds(d.dashUiIds);
    if (d.subsurfaceIds) setSubsurfaceIds(d.subsurfaceIds);
    if (d.fabricIds) setFabricIds(d.fabricIds);
    if (d.thermalIds) setThermalIds(d.thermalIds);
    if (d.clutterIds) setClutterIds(d.clutterIds);
    if (d.airflowIds) setAirflowIds(d.airflowIds);
    if (d.screenCastIds) setScreenCastIds(d.screenCastIds);
    if (d.cabinArtifactIds) setCabinArtifactIds(d.cabinArtifactIds);
    if (d.tallErgonomicIds) setTallErgonomicIds(d.tallErgonomicIds);
    if (d.inAppArtifactIds) setInAppArtifactIds(d.inAppArtifactIds);
    if (d.microWeatherIds) setMicroWeatherIds(d.microWeatherIds);

    if (s.customPromptAr && s.customPromptEn) {
      setCustomPromptAr(s.customPromptAr);
      setCustomPromptEn(s.customPromptEn);
      setIsCustomEdited(true);
    } else {
      setIsCustomEdited(false);
    }

    setTab('gen');
    showToast(`✓ تم استرجاع: ${s.name}`);
  };

  const handleSaveCustom = (ar: string, en: string) => {
    setCustomPromptAr(ar);
    setCustomPromptEn(en);
    setIsCustomEdited(true);
    showToast('✓ تم حفظ التعديل المخصص للأمر');
  };

  const handleResetToComputed = () => {
    setIsCustomEdited(false);
    setCustomPromptAr('');
    setCustomPromptEn('');
    showToast('✓ تم استرجاع الأمر التلقائي المحسوب');
  };

  // Styling Tokens
  const bg = darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const card = darkMode ? 'bg-zinc-900/90 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200/90 shadow-sm';
  const itemBg = darkMode ? 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800';
  const borderTone = darkMode ? 'border-zinc-800' : 'border-zinc-200';

  return (
    <div className={`min-h-screen ${bg} font-sans antialiased pb-28`} dir="rtl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/30 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${borderTone} ${darkMode ? 'bg-zinc-950/90' : 'bg-white/90'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20 shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight">SELFIE PROMPT STUDIO</h1>
                <span className="text-[9px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  v11.0 الموحد
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden xs:block truncate">
                بطل السيلفي أولاً (80%) • 40 موقعاً سعودياً • إنارة ليلية ذكية • فيزياء متكاملة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Realism quick status */}
            <button
              onClick={() => setShowRealismModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 hover:border-emerald-500/40 transition"
              title="تقرير التناسق الفيزيائي"
            >
              <span className="text-xs">🛡️</span>
              <span>{realismReport.score}%</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition flex items-center gap-1"
            >
              <span>✍️</span>
              <span className="hidden sm:inline">محرر الأوامر</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-xl text-xs border ${borderTone} transition ${itemBg}`}
              title={darkMode ? 'الوضع الفاتح' : 'الوضع الليلي'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {[
            { id: 'gen', label: '🎯 الاستوديو الموحد (All-in-One)' },
            { id: 'flash', label: '⚡ Quick Flash Mode' },
            { id: 'presets', label: '🔥 سيناريوهات جاهزة' },
            { id: 'sessions', label: `💾 جلساتي (${sessions.length})` },
            { id: 'guide', label: '📖 قاعدة السيلفي الذهبية' },
            { id: 'about', label: 'ℹ️ مواصفات المرجع' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                if (t.id === 'flash') {
                  enterQuickFlashMode();
                } else {
                  setTab(t.id as Tab);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
                tab === t.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : `${itemBg} opacity-80 hover:opacity-100`
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 mt-4 space-y-4">
        {/* Tab 1: Studio */}
        {tab === 'gen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Primary Interactive Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Identity Rule Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-indigo-950/60 border border-emerald-500/30 p-3.5 md:p-4 text-xs shadow-lg">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-emerald-400 text-xs">القاعدة الذهبية الصارمة (Subject-First Hierarchy)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      193cm • 83kg Locked
                    </span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      75–85% Frame
                    </span>
                  </div>
                </div>
                <p className="opacity-80 text-[11px] leading-relaxed">
                  الشخص المرجعي بالصورة المرفقة هو بطل الكادر المطلق يملأ 80% من مساحة الصورة. ملامح الوجه وعظام الرأس وكثافة شعر الرأس واللحية الأصلية مقفولة بيومترياً بنسبة 100%، والسيارة والمكان خلفية ثانوية عفوية دون أي تكلف إعلاني.
                </p>
              </div>

              {/* أدوات Gemini 3 Flash التفاعلية في الاستوديو */}
              <div className={`${card} border border-indigo-500/30 rounded-2xl p-3 md:p-4 space-y-2.5 bg-gradient-to-b from-indigo-950/20 to-transparent`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 text-base">✨</span>
                    <h3 className="font-bold text-xs md:text-sm text-indigo-300">مساعد Gemini 3 Flash الحي (AI Co-Pilot)</h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Active Model: Flash Preview</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => callGeminiFlash('optimize')}
                    disabled={isGeminiLoading}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-900/30 disabled:opacity-50"
                  >
                    {isGeminiLoading && geminiType === 'optimize' ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <span>🔍</span>
                    )}
                    <span>فحص وتحسين البرومبت بالذكاء الاصطناعي</span>
                  </button>

                  <button
                    onClick={() => callGeminiFlash('scenario')}
                    disabled={isGeminiLoading}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-teal-900/30 disabled:opacity-50"
                  >
                    {isGeminiLoading && geminiType === 'scenario' ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <span>🎲</span>
                    )}
                    <span>توليد سيناريو عفوي مبتكر (Flash Idea)</span>
                  </button>

                  </div>

                {/* حالة خطأ Gemini */}
                {geminiError && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                    ⚠️ {geminiError}
                  </div>
                )}

                {/* صندوق نتائج Gemini */}
                {geminiResult && (
                  <div className="mt-3 p-3.5 rounded-xl bg-zinc-950/80 border border-indigo-500/30 space-y-2 animate-fadeIn text-xs leading-relaxed">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <span>💡</span>
                        {geminiType === 'optimize' ? 'نتيجة فحص وتدقيق البرومبت:' : 'السيناريو العفوي المقترح:'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={applyGeminiResultToPrompt}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                        >
                          اعتماد في الاستوديو
                        </button>
                        <button
                          onClick={() => copy(geminiResult, 'ai')}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                        >
                          نسخ نتيجة AI
                        </button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[11px] text-zinc-300 max-h-56 overflow-y-auto leading-relaxed bg-black/40 p-2.5 rounded-lg border border-zinc-800">
                      {geminiResult}
                    </pre>
                  </div>
                )}
              </div>

              <section className=\`${card} border rounded-2xl p-4 md:p-5 space-y-3\` aria-labelledby="gemini-auto-heading">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h2 id="gemini-auto-heading" className="font-extrabold text-sm">Gemini يكتب البرومبت تلقائياً</h2>
                    <p className="text-[11px] text-zinc-400 mt-1">أنت تختار 3 أشياء فقط، والباقي يحدده Gemini ضمن قواعد الواقعية.</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">3 مدخلات فقط</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-300">السيارة</span>
                    <select value={carModelId} onChange={e => setCarModelId(e.target.value)} className=\`w-full \${itemBg} border \${borderTone} rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50\`>
                      {CAR_MODELS.map(option => <option key={option.id} value={option.id}>{option.ar}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-300">لون السيارة</span>
                    <select value={carColorId} onChange={e => setCarColorId(e.target.value)} className=\`w-full \${itemBg} border \${borderTone} rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50\`>
                      {CAR_COLORS.map(option => <option key={option.id} value={option.id}>{option.ar}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-300">الإضاءة</span>
                    <select value={lightId} onChange={e => { setLightId(e.target.value); setAutoLighting(false); }} className=\`w-full \${itemBg} border \${borderTone} rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50\`>
                      {(LIGHTING as Opt[]).map(option => <option key={option.id} value={option.id}>{option.ar}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5 sm:col-span-3">
                    <span className="text-[11px] font-bold text-zinc-300">الملابس</span>
                    <select value={clothId} onChange={e => setClothId(e.target.value)} className=\`w-full \${itemBg} border \${borderTone} rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50\`>
                      {CLOTHES.map(option => <option key={option.id} value={option.id}>{option.ar}</option>)}
                    </select>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowAdvancedControls(value => !value)} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-bold text-zinc-200 transition">
                      {showAdvancedControls ? 'إخفاء الإعدادات المتقدمة' : 'إظهار الإعدادات المتقدمة'}
                    </button>
                    <button type="button" onClick={() => setUseGeminiAutoEngine(value => !value)} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-bold text-zinc-200 transition">
                      {useGeminiAutoEngine ? 'استخدام المحرك المحلي' : 'تفعيل Gemini تلقائياً'}
                    </button>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {useGeminiAutoEngine ? 'Gemini يختار الموقع والخلفية والوضعية والزاوية والتفاصيل.' : 'المحرك المحلي المتقدم هو النشط الآن.'}
                  </span>
                </div>
              </section>

              {showAdvancedControls && (
                <>
              {/* 🎯 Unified Studio Controls V11 (All 6 Sections on One Screen) */}
              <UnifiedStudioControls
                itemBg={itemBg}
                borderTone={borderTone}
                darkMode={darkMode}
                locId={locId}
                setLocId={handleSetLocId}
                carModelId={carModelId}
                setCarModelId={setCarModelId}
                carColorId={carColorId}
                setCarColorId={setCarColorId}
                tintId={tintId}
                setTintId={setTintId}
                lightId={lightId}
                setLightId={setLightId}
                autoLighting={autoLighting}
                setAutoLighting={setAutoLighting}
                timeOfDay={timeOfDay}
                setTimeOfDay={setTimeOfDay}
                hairId={hairId}
                setHairId={setHairId}
                beardId={beardId}
                setBeardId={setBeardId}
                anatomicalExprId={anatomicalExprId}
                setAnatomicalExprId={setAnatomicalExprId}
                heightCueId={heightCueId}
                setHeightCueId={setHeightCueId}
                tallErgonomicIds={tallErgonomicIds}
                setTallErgonomicIds={setTallErgonomicIds}
                cameraMode={cameraMode}
                setCameraMode={setCameraMode}
                cameraPlan={autoCameraPlan}
                directorPlan={activeDirectorPlan}
                directorStatus={cameraMode === 'manual' ? 'local' : directorStatus}
                frameId={frameId}
                setFrameId={setFrameId}
                phoneId={phoneId}
                setPhoneId={setPhoneId}
                angleId={angleId}
                setAngleId={setAngleId}
                poseId={poseId}
                setPoseId={setPoseId}
                aspectId={aspectId}
                setAspectId={setAspectId}
                clothId={clothId}
                setClothId={setClothId}
                accessoryId={accessoryId}
                setAccessoryId={setAccessoryId}
                storylineId={storylineId}
                setStorylineId={setStorylineId}
                skinNuanceIds={skinNuanceIds}
                setSkinNuanceIds={setSkinNuanceIds}
                opticalIds={opticalIds}
                setOpticalIds={setOpticalIds}
                thermalIds={thermalIds}
                setThermalIds={setThermalIds}
                screenCastIds={screenCastIds}
                setScreenCastIds={setScreenCastIds}
                gripMotionIds={gripMotionIds}
                setGripMotionIds={setGripMotionIds}
                subsurfaceIds={subsurfaceIds}
                setSubsurfaceIds={setSubsurfaceIds}
                fabricIds={fabricIds}
                setFabricIds={setFabricIds}
                appUiIds={appUiIds}
                setAppUiIds={setAppUiIds}
                dashUiIds={dashUiIds}
                setDashUiIds={setDashUiIds}
                clutterIds={clutterIds}
                setClutterIds={setClutterIds}
                cabinIds={cabinIds}
                setCabinIds={setCabinIds}
                cabinArtifactIds={cabinArtifactIds}
                setCabinArtifactIds={setCabinArtifactIds}
                airflowIds={airflowIds}
                setAirflowIds={setAirflowIds}
                inAppArtifactIds={inAppArtifactIds}
                setInAppArtifactIds={setInAppArtifactIds}
                microWeatherIds={microWeatherIds}
                setMicroWeatherIds={setMicroWeatherIds}
                toggle={toggle}
              />
                </>
              )}

              {/* Automatic Physical Realism Engine Status Banner */}
              <div className="rounded-2xl border p-3.5 bg-zinc-950/90 border-zinc-800 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${realismReport.isCoherent ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="font-bold text-xs text-zinc-200">
                      محرك التناسق الفيزيائي (Automatic Realism Engine):
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      realismReport.score >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {realismReport.score}% Coherence
                    </span>
                  </div>

                  <button
                    onClick={() => setShowRealismModal(true)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition flex items-center gap-1 font-semibold"
                  >
                    <span>🛡️</span>
                    <span>تقرير الفحص والفيزياء ({realismReport.activeRules.length} قواعد)</span>
                  </button>
                </div>

                {/* Auto-corrections and warnings banner */}
                {realismReport.warnings.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {realismReport.warnings.map(w => (
                      <div
                        key={w.id}
                        className={`text-[11px] p-2 rounded-xl flex items-start gap-2 ${
                          w.level === 'warning'
                            ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                            : 'bg-blue-950/30 border border-blue-500/30 text-blue-200'
                        }`}
                      >
                        <span className="text-xs">{w.level === 'warning' ? '⚠️' : '🛡️'}</span>
                        <div className="space-y-0.5">
                          <span className="font-bold block">{w.titleAr}</span>
                          <span className="text-[10px] opacity-80 block">{w.descAr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* صندوق عرض ونسخ البرومبت الذكي */}
              <div className={`${card} border rounded-2xl p-4 md:p-5 space-y-3`}>

                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold">
                      <span>✨</span>
                      <span>المحرك التلقائي عبر Gemini</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${geminiAutoPromptStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-300' : geminiAutoPromptStatus === 'loading' ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-300'}`}>
                      {promptSource === 'gemini' ? 'Gemini جاهز' : geminiAutoPromptStatus === 'loading' ? 'جارٍ التوليد' : geminiAutoPromptStatus === 'fallback' ? 'خطة محلية آمنة' : 'محرك محلي'}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-100/80 leading-relaxed">
                    أنت تختار السيارة والإضاءة والملابس فقط. يختار Gemini الموقع السعودي والخلفية والوضعية والزاوية وكل التفاصيل وفق قواعد الواقعية الصارمة.
                  </p>
                  {geminiAutoPrompt && automaticPromptIsActive && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-zinc-300">
                      <span><b className="text-indigo-200">الموقع:</b> {geminiAutoPrompt.locationAr}</span>
                      <span><b className="text-indigo-200">الخلفية:</b> {geminiAutoPrompt.backgroundAr}</span>
                      <span><b className="text-indigo-200">الوضعية:</b> {geminiAutoPrompt.poseAr}</span>
                      <span><b className="text-indigo-200">الكاميرا:</b> {geminiAutoPrompt.cameraAr}</span>
                    </div>
                  )}
                </div>                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧠</span>
                    <div>
                      <h3 className="font-bold text-sm">البرومبت الاحترافي المولد (Subject-Dominant)</h3>
                      {isCustomEdited && (
                        <span className="text-[10px] text-amber-400 font-semibold block">
                          (تم تعديله أو تعزيزه بواسطة المحرر / Gemini)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditorOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                    >
                      ✍️ تعديل
                    </button>
                    <div className="flex gap-1 bg-zinc-800/80 p-0.5 rounded-xl text-xs">
                      {(['ar', 'en', 'both'] as Lang[]).map(l => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className={`px-2.5 py-1 rounded-lg font-medium transition ${
                            lang === l ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {l === 'ar' ? 'عربي' : l === 'en' ? 'EN' : 'الاثنين'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(lang === 'ar' || lang === 'both') && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-400">الأمر بالعربية:</span>
                      <button
                        onClick={() => copy(promptAr, 'ar')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold transition"
                      >
                        نسخ العربي
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs bg-black/40 border border-zinc-800 rounded-xl p-3 max-h-48 overflow-y-auto leading-relaxed text-zinc-300 font-mono">
                      {promptAr}
                    </pre>
                  </div>
                )}

                {(lang === 'en' || lang === 'both') && (
                  <div dir="ltr">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-400">English Prompt (Ready for Midjourney / ChatGPT):</span>
                      <button
                        onClick={() => copy(promptEn, 'en')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold transition"
                      >
                        Copy English
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs bg-black/40 border border-zinc-800 rounded-xl p-3 max-h-48 overflow-y-auto leading-relaxed text-zinc-300 font-mono text-left">
                      {promptEn}
                    </pre>
                  </div>
                )}

                <button
                  onClick={() => copy(`${promptAr}\n\n====================\n\n${promptEn}`, 'both')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  <span>نسخ البرومبت الكامل (عربي + إنجليزي)</span>
                </button>
              </div>

              {/* حفظ الجلسة */}
              <div className={`${card} border rounded-2xl p-4 flex gap-2 items-center`}>
                <input
                  value={sessionName}
                  onChange={e => setSessionName(e.target.value)}
                  placeholder="تسمية مخصصة لحفظ هذه التوليفة..."
                  className={`flex-1 ${itemBg} border ${borderTone} rounded-xl px-3 py-2 text-xs outline-none`}
                />
                <button
                  onClick={saveSession}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition whitespace-nowrap"
                >
                  💾 حفظ التوليفة
                </button>
              </div>
            </div>

            {/* Visual Viewfinder Simulator & Biometric Lock (5 cols) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
              <ViewfinderSimulator
                frame={frame}
                aspect={aspect}
                phone={phone}
                angle={angle}
                light={light}
                cloth={cloth}
                loc={loc}
                carModel={carModel}
                carColor={carColor}
                hair={hair}
                beard={beard}
                appUis={appUis}
                tint={tint}
                subsurfaces={subsurfaces}
              />

              <div className={`${card} border rounded-2xl p-4 space-y-3`}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-bold text-zinc-200">
                    🔒 الهوية البيومترية المقفولة (بدون تشوه)
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Locked</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">القامة والبنية:</span>
                    <span className="font-bold text-emerald-400">193 سم / 83 كجم</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">كثافة الشعر:</span>
                    <span className="font-semibold text-zinc-200 truncate block">مقفلة طبيعياً</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">رسمة اللحية:</span>
                    <span className="font-semibold text-zinc-200 truncate block">طبيعية غير مشذبة</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">الوجه والعيون:</span>
                    <span className="font-semibold text-zinc-200 truncate block">نمش طبيعي وعيون دافئة</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                  تمنع هذه القيود أي انحراف في كثافة اللحية أو تغيير في ملامح الوجه عند إرسال الأمر إلى Midjourney أو ChatGPT.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1.5: Quick Flash Generator (Gemini Flash) */}
        {tab === 'flash' && (
          <QuickFlashGenerator
            hasSnapshot={!!studioSnapshot}
            onRestoreStudioSnapshot={restoreStudioSnapshot}
            onApplyToStudio={(data) => {
              setLocId(data.locId);
              setLightId(data.lightId);
              setClothId(data.clothId);
              setCarModelId(data.carModelId);
              setCustomPromptEn(data.promptText);
              setIsCustomEdited(true);
              setTab('gen');
              showToast('✓ تم نقل إعدادات وأمر فلاش إلى الاستوديو بنجاح');
            }}
            onOpenPromptEditor={(promptText) => {
              setCustomPromptEn(promptText);
              setIsCustomEdited(true);
              setIsEditorOpen(true);
            }}
          />
        )}

        {/* Tab 2: Presets */}
        {tab === 'presets' && (
          <div className="space-y-3">
            <div className="border-b border-zinc-800/80 pb-2">
              <h2 className="text-base font-bold text-zinc-100">⚡ سيناريوهات سريعة مطابقة للقاعدة الذهبية</h2>
              <p className="text-xs opacity-60">توليفات جاهزة تضمن سيطرة الشخص المرجعي (80%) وتناسق الإضاءة والخلفية بنقرة واحدة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_MOODS.map(m => (
                <div key={m.id} className={`${card} border rounded-2xl p-4 flex flex-col justify-between space-y-3`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                        {m.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-zinc-100">{m.title}</h3>
                    <p className="text-xs opacity-75 leading-relaxed">{m.desc}</p>
                  </div>
                  <button
                    onClick={() => applyPreset(m)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                  >
                    تطبيق وتوليد البرومبت ←
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Sessions */}
        {tab === 'sessions' && (
          <div className={`${card} border rounded-2xl p-4 md:p-5 space-y-3`}>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h2 className="text-sm font-bold text-zinc-100">💾 الجلسات والتوليفات المحفوظة ({sessions.length})</h2>
              {sessions.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('هل تريد مسح جميع الجلسات المحفوظة؟')) setSessions([]);
                  }}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  مسح الكل
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-10 opacity-60 text-xs">
                لا توجد توليفات محفوظة حتى الآن. يمكنك حفظ أي تركيبة من الاستوديو للرجوع إليها لاحقاً.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map(s => (
                  <div key={s.id} className={`${itemBg} border ${borderTone} rounded-xl p-3 flex items-center justify-between gap-3`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-zinc-200">{s.name}</p>
                      <p className="text-[10px] opacity-60">{new Date(s.createdAt).toLocaleString('ar-SA')}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => loadSession(s)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition"
                      >
                        تطبيق
                      </button>
                      <button
                        onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}
                        className="px-2 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs transition"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Guide */}
        {tab === 'guide' && (
          <div className={`${card} border rounded-2xl p-4 md:p-5 space-y-4 text-xs md:text-sm leading-relaxed opacity-90`}>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-2">
              <h3 className="font-bold text-emerald-400 text-sm">👑 ما هي القاعدة الذهبية الصارمة للسيلفي؟</h3>
              <p className="text-xs leading-relaxed opacity-90">
                الخطأ الأكبر في مولدات الذكاء الاصطناعي (مثل ChatGPT وMidjourney) أنه بمجرد ذكر السيارة أو الديكور، يقوم المحرك بإرجاع الكاميرا للخلف ليظهر السيارة كإعلان تجاري، مما يجعل الشخص يبدو كعارض أزياء في منتصف المشهد ويفقد الصورة طابع السيلفي الحقيقي.
              </p>
              <p className="text-xs leading-relaxed opacity-90 font-semibold text-emerald-300">
                الحل المطبق هنا: إلزام الذكاء الاصطناعي بأن الشخص المرجعي (الوجه، الأكتاف، ملامح العينين، والشارب) يملأ 80% من الكادر بمقدمة الصورة، وأن أي عنصر آخر يظهر فقط إذا سمحت زاوية اليد الطبيعية بذلك.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h4 className="font-bold text-amber-400 text-xs">🔒 قفل الكثافة 100%:</h4>
              <p className="text-xs opacity-80">
                تم تثبيت كثافة شعر الرأس وشكل اللحية والشارب في البرومبت بدقة بيومترية صارمة لمنع التكثيف أو الحلاقة، مع الحفاظ على تفاصيل النمش الطبيعي في وجه المرجع.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: About Spec */}
        {tab === 'about' && (
          <div className={`${card} border rounded-2xl p-4 md:p-5 space-y-3`}>
            <h3 className="font-bold text-sm text-zinc-100">👤 بطاقة الهوية البيومترية للمرجع</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className={`${itemBg} p-3 rounded-xl space-y-1`}>
                <span className="opacity-60 block text-[10px]">القامة والبنية:</span>
                <span className="font-bold text-emerald-400">193 سم / 83 كجم (بنية رياضية ممشوقة وأكتاف عريضة)</span>
              </div>
              <div className={`${itemBg} p-3 rounded-xl space-y-1`}>
                <span className="opacity-60 block text-[10px]">كثافة شعر الرأس:</span>
                <span className="font-bold text-zinc-200">مقفلة 100% (شعر أسود طبيعي متوسط الكثافة)</span>
              </div>
              <div className={`${itemBg} p-3 rounded-xl space-y-1`}>
                <span className="opacity-60 block text-[10px]">تنسيق اللحية:</span>
                <span className="font-bold text-zinc-200">مقفلة 100% (لحية متوسطة محددة عضوياً وشارب متصل)</span>
              </div>
              <div className={`${itemBg} p-3 rounded-xl space-y-1`}>
                <span className="opacity-60 block text-[10px]">ملامح الوجه:</span>
                <span className="font-bold text-zinc-200">نمش خفيف بالوجنتين والأنف وعيون عسلية دافئة</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Copy Bar */}
      {tab === 'gen' && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 border-t ${borderTone} ${darkMode ? 'bg-zinc-950/90' : 'bg-white/90'} backdrop-blur-md py-2.5 px-4 shadow-2xl`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 hidden md:block">
              <p className="text-[11px] font-bold truncate text-zinc-200">
                {hair.ar.split(' ')[0]} · {cloth.ar.split(' ')[0]} · {carModel.ar.split(' ')[0]}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono">جاهز للنسخ الفوري 193cm Locked</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition"
              >
                ✍️ محرر
              </button>
              <button
                onClick={() => copy(promptAr, 'ar')}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold transition"
              >
                نسخ عربي
              </button>
              <button
                onClick={() => copy(promptEn, 'en')}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold transition font-mono"
              >
                Copy EN
              </button>
              <button
                onClick={() => copy(`${promptAr}\n\n====================\n\n${promptEn}`, 'both')}
                className="flex-1 md:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-1.5"
              >
                <span>📋</span>
                <span>نسخ كامل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Prompt Editor Modal */}
      <PromptEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        promptAr={promptAr}
        promptEn={promptEn}
        onSaveCustom={handleSaveCustom}
        onResetToComputed={handleResetToComputed}
        isCustomEdited={isCustomEdited}
        onCopy={copy}
      />

      {/* Compact Sticky Bottom Action Bar for Mobile & Desktop */}
      <aside aria-label="شريط الإجراءات السريع" className={`fixed bottom-0 left-0 right-0 z-40 border-t ${borderTone} ${darkMode ? 'bg-zinc-950/95' : 'bg-white/95'} backdrop-blur-lg px-3 py-2 sm:py-2.5 shadow-2xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Realism status button */}
          <button
            type="button"
            onClick={() => setShowRealismModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono shrink-0 hover:border-emerald-500/50 transition"
            title="تقرير التناسق الفيزيائي"
          >
            <span className="text-xs">🛡️</span>
            <span className={`font-bold ${realismReport.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {realismReport.score}%
            </span>
            <span className="text-[10px] text-zinc-400 hidden xs:inline sm:inline">Coherence</span>
          </button>

          {/* Gemini AI optimize trigger */}
          <button
            type="button"
            onClick={() => callGeminiFlash('optimize')}
            disabled={isGeminiLoading}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            title="فحص وتحسين البرومبت بذكاء Gemini"
          >
            {isGeminiLoading && geminiType === 'optimize' ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <span className="text-xs">✨</span>
            )}
            <span className="hidden sm:inline">تحسين</span>
            <span>Gemini AI</span>
          </button>

          {/* Copy actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => copy(promptEn, 'en')}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-700/30 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>📋</span>
              <span>نسخ الإنجليزي</span>
            </button>

            <button
              type="button"
              onClick={() => copy(`${promptAr}\n\n====================\n\n${promptEn}`, 'both')}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition items-center gap-1 hidden md:flex"
            >
              <span>نسخ الكل</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold border border-zinc-700 transition"
              title="تعديل في محرر الأوامر"
            >
              ✍️
            </button>
          </div>
        </div>
      </aside>

      {/* Physical Realism Diagnostic Report Modal */}
      {showRealismModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full p-5 md:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-white">
                    تقرير محرك التناسق والواقعية الفيزيائية
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Automatic Physical Realism Engine v10.0
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowRealismModal(false)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Score & Profile Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400">درجة التناسق الفيزيائي:</span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-black text-emerald-400">{realismReport.score}%</span>
                  <span className="text-[10px] text-emerald-300">متناسق</span>
                </div>
                <span className="text-[10px] text-zinc-500">تم فحص 10 محاور فيزيائية</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400">التوزيع المكاني والكادر:</span>
                <span className="font-bold text-zinc-100 my-1 text-xs">
                  {loc.zone === 'inside' ? '🚗 داخل المقصورة' : '🚶‍♂️ خارج السيارة'} (80% بطل)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">24mm Wide Handheld</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400">طبيعة الإضاءة والحرارة:</span>
                <span className="font-bold text-amber-300 my-1 text-xs">
                  {realismReport.lightingProfile.ambientKelvin}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">{light.ar.split(' ')[0]}</span>
              </div>
            </div>

            {/* Auto-Corrections & Warnings */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-zinc-200 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>الفحوصات والتصحيحات التلقائية للكادر:</span>
              </h4>

              {realismReport.warnings.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <span>✓</span>
                  <span>جميع الإعدادات المختارة متناسقة فيزيائياً وبصرياً بنسبة 100% وبدون أي تناقض مكاني أو ضوئي!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {realismReport.warnings.map(w => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                          <span>{w.level === 'warning' ? '⚠️' : '🛡️'}</span>
                          <span>{w.titleAr}</span>
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                          Auto-Sanitized
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{w.descAr}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Physical Rules Enforced */}
            <div className="space-y-2 pt-1 border-t border-zinc-800">
              <h4 className="font-bold text-xs text-zinc-300 flex items-center gap-1.5">
                <span>📋</span>
                <span>القواعد الفيزيائية المفروضة في الأمر المولد:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {realismReport.activeRules.map((rule, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{rule}</span>
                  </div>
                ))}
                <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>قفل ملامح وهيكل وجه المرجع وكثافة شعره ولحيته 100%</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>حظر المصطلحات التسويقية الزائفة (Anti-AI Slop Enforcement)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRealismModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                فهمت، متابعة العمل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
