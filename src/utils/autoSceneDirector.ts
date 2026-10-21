import { POSES } from '../data/studioData';
import type { AutoSceneDirectorPlan, Cloth, Loc, Opt } from '../types/studio';

export interface AutoSceneDirectorContext {
  loc: Loc;
  carModel: Opt;
  cloth: Cloth;
  accessory: Opt;
  aspect: Opt;
  phone: Opt;
  light: Opt;
  storyline: Opt;
  tint: Opt;
  timeOfDay?: 'auto' | 'day' | 'sunset' | 'night';
}

const OUTSIDE_POSE_PREFIX = 'outside_';
const OUTSIDE_POSE_IDS = new Set([
  'outside_standing_relaxed',
  'outside_lean_vehicle',
  'outside_walk_candid',
  'outside_open_door_turn',
  'outside_sit_safe_edge',
  'outside_adjust_sleeve',
]);

const option = (id: string, ar: string, en: string): Opt => ({ id, ar, en });

const MOTIONS = {
  handOnWheel: option(
    'motion_hand_on_wheel',
    'يد ثابتة على المقود، والكتفان مرتاحان مع حركة طبيعية بسيطة',
    'one hand remains naturally on the steering wheel while the shoulders stay relaxed',
  ),
  casualPhone: option(
    'motion_casual_phone',
    'رفع الهاتف بيد واحدة مع تعديل بسيط للمعصم دون تمدد مبالغ',
    'hold the phone in one hand with a small natural wrist adjustment, never overstretched',
  ),
  collarAdjust: option(
    'motion_collar_adjust',
    'تعديل الياقة أو طرف الكم للحظة ثم العودة إلى وضع مريح',
    'briefly adjust the collar or sleeve, then return to a relaxed position',
  ),
  glance: option(
    'motion_glance',
    'التفاتة قصيرة نحو البيئة ثم عودة طبيعية للعدسة',
    'make a brief glance toward the environment and naturally return to the lens',
  ),
  walk: option(
    'motion_walk',
    'خطوة بطيئة واحدة مع توازن طبيعي وعدم تجميد الحركة',
    'take one slow balanced step without freezing the body into a staged pose',
  ),
  lean: option(
    'motion_lean',
    'اتكاء خفيف على السيارة مع إبقاء العمود الفقري والذراعين طبيعيين',
    'lean lightly against the safely parked vehicle while keeping the spine and arms natural',
  ),
  door: option(
    'motion_door',
    'الوقوف بجانب الباب المفتوح مع التفاتة قصيرة للكاميرا',
    'stand beside the open door and make a brief natural turn toward the camera',
  ),
  seated: option(
    'motion_seated',
    'جلوس مريح على سطح آمن ومنخفض مع بقاء الهاتف ضمن مسافة مريحة',
    'sit comfortably on a safe low surface while keeping the phone within a relaxed reach',
  ),
  sleeve: option(
    'motion_sleeve',
    'تعديل الكم أو الساعة بيد واحدة أثناء التقاط اللحظة',
    'adjust a sleeve or watch with the free hand while capturing the moment',
  ),
} as const;

const GAZES = {
  lens: option('gaze_lens', 'نظر مباشر طبيعي إلى العدسة دون تحديق مصطنع', 'natural direct gaze into the lens without an artificial stare'),
  road: option('gaze_road', 'نظرة قصيرة نحو الطريق مع بقاء الوجه قريبًا من اتجاه العدسة', 'a brief glance toward the road while keeping the face near the lens direction'),
  environment: option('gaze_environment', 'نظرة جانبية قصيرة إلى البيئة ثم التقاط العدسة', 'a brief side glance at the environment before catching the lens'),
  relaxed: option('gaze_relaxed', 'نظرة مرتاحة إلى العدسة مع عدم تماثل طبيعي في التعبير', 'a relaxed gaze toward the lens with natural facial asymmetry'),
} as const;

const SPONTANEITY = {
  candid: option('spontaneity_candid', 'لحظة عفوية غير مصطنعة، حركة صغيرة غير متزامنة تمامًا مع الالتقاط', 'an unposed candid moment with a small motion that is not perfectly synchronized with capture'),
  composed: option('spontaneity_composed', 'عفوية مضبوطة مع وضع واضح دون إحساس جلسة تصوير', 'controlled spontaneity with a clear pose that never feels like a photoshoot'),
  active: option('spontaneity_active', 'عفوية شبابية خفيفة، خطوة أو التفاتة قصيرة قابلة للتصديق', 'light youthful spontaneity with one believable step or brief turn'),
} as const;

function findPose(id: string | undefined, outside: boolean): Opt | undefined {
  if (!id) return undefined;
  const pose = POSES.find((candidate) => candidate.id === id);
  if (!pose) return undefined;
  const isOutsidePose = pose.id.startsWith(OUTSIDE_POSE_PREFIX);
  return outside === isOutsidePose ? pose : undefined;
}

function locationText(scene: AutoSceneDirectorContext): string {
  return [
    scene.loc.id,
    scene.loc.ar,
    scene.loc.en,
    scene.carModel.ar,
    scene.carModel.en,
    scene.storyline.ar,
    scene.storyline.en,
  ].join(' ').toLowerCase();
}

function stableChoice<T>(items: T[], seed: string): T {
  const numericSeed = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return items[Math.abs(numericSeed) % items.length];
}

function isCollaredGarment(cloth: Cloth): boolean {
  const text = [cloth.id, cloth.ar, cloth.en].join(' ').toLowerCase();
  return !/(tank|vest|bustier|كت|فانيلة|صدرية)/.test(text);
}

function buildPlan(
  scene: AutoSceneDirectorContext,
  pose: Opt,
  motion: Opt,
  gaze: Opt,
  spontaneity: Opt,
  preferredFrameId: string,
  preferredAngleId: string,
  distanceCm: number,
  reasonAr: string,
  reasonEn: string,
): AutoSceneDirectorPlan {
  return {
    source: 'local',
    pose,
    motion,
    gaze,
    spontaneity,
    preferredFrameId,
    preferredAngleId,
    distanceCm,
    reasonAr,
    reasonEn,
  };
}

export function resolveAutoSceneDirector(scene: AutoSceneDirectorContext): AutoSceneDirectorPlan {
  const outside = scene.loc.zone === 'outside';
  const text = locationText(scene);
  const collared = isCollaredGarment(scene.cloth);

  if (!outside) {
    let poseId = 'involuntary_snap';
    let motion = MOTIONS.casualPhone;
    let gaze = GAZES.lens;
    let spontaneity = SPONTANEITY.candid;
    let preferredFrameId = 'half_body';
    let preferredAngleId = 'candid_side';
    let distanceCm = 62;
    let reasonAr = 'اختيار تلقائي لوضعية سيلفي مريحة داخل السيارة مع حركة صغيرة قابلة للتصديق.';
    let reasonEn = 'Automatic relaxed in-car selfie direction with a small believable movement.';

    if (scene.storyline.id === 'traffic_light_stop' || /drive.?thru|مغسلة|محطة/.test(text)) {
      poseId = 'hand_on_wheel';
      motion = MOTIONS.handOnWheel;
      gaze = GAZES.road;
      spontaneity = SPONTANEITY.composed;
      preferredFrameId = 'half_body';
      preferredAngleId = 'eye_level';
      distanceCm = 58;
      reasonAr = 'المشهد مرتبط بالتوقف أو القيادة؛ اليد تبقى على المقود ولا توجد حركة خطرة.';
      reasonEn = 'The scene involves a stop or driving context, so one hand stays on the wheel and movement remains safe.';
    } else if (scene.light.id === 'direct_flash' || scene.timeOfDay === 'night') {
      poseId = 'arm_out';
      motion = MOTIONS.casualPhone;
      gaze = GAZES.lens;
      spontaneity = SPONTANEITY.candid;
      preferredFrameId = 'half_body';
      preferredAngleId = 'candid_side';
      distanceCm = 60;
      reasonAr = 'الإضاءة الليلية أو الفلاش يناسبان لقطة عفوية قريبة مع بقاء الهاتف ضمن طول ذراع واقعي.';
      reasonEn = 'Night or direct flash suits a close candid frame while keeping the phone within a realistic arm reach.';
    } else if (scene.storyline.id === 'friday_after_prayer' && collared) {
      poseId = 'adjust_collar';
      motion = MOTIONS.collarAdjust;
      gaze = GAZES.relaxed;
      spontaneity = SPONTANEITY.composed;
      preferredFrameId = 'half_body';
      preferredAngleId = 'eye_level';
      distanceCm = 62;
      reasonAr = 'الملابس الرسمية أو المناسبة الاجتماعية تدعم تعديل الياقة لحظةً دون مبالغة.';
      reasonEn = 'Formal clothing or a social occasion supports a brief collar adjustment without exaggeration.';
    }

    const pose = findPose(poseId, false) ?? POSES.find((candidate) => candidate.id === 'involuntary_snap') ?? POSES[0];
    return buildPlan(scene, pose, motion, gaze, spontaneity, preferredFrameId, preferredAngleId, distanceCm, reasonAr, reasonEn);
  }

  let poseId: string;
  let motion: Opt;
  let gaze: Opt;
  let spontaneity: Opt;
  let preferredFrameId = 'half_body';
  let preferredAngleId = 'candid_side';
  let distanceCm = 64;
  let reasonAr: string;
  let reasonEn: string;

  if (/door|باب|tailgate|الصندوق الخلفي|بوابة/.test(text)) {
    poseId = 'outside_open_door_turn';
    motion = MOTIONS.door;
    gaze = GAZES.lens;
    spontaneity = SPONTANEITY.candid;
    preferredAngleId = 'candid_side';
    reasonAr = 'وجود باب أو صندوق سيارة يجعل الوقوف بجانبه مع التفاتة قصيرة خيارًا عفويًا وممكنًا هندسيًا.';
    reasonEn = 'A door or tailgate context makes a brief turn beside the vehicle natural and geometrically plausible.';
  } else if (/hood|رفرف|كبوت|lean|متكئ|جانب السيارة/.test(text)) {
    poseId = 'outside_lean_vehicle';
    motion = MOTIONS.lean;
    gaze = GAZES.environment;
    spontaneity = SPONTANEITY.composed;
    preferredAngleId = 'candid_side';
    reasonAr = 'السياق يسمح باتكاء خفيف على السيارة مع الحفاظ على توازن الجسم وعدم اختراق الهيكل.';
    reasonEn = 'The context supports a light vehicle lean while preserving balance and avoiding impossible body geometry.';
  } else if (/sidewalk|bus stop|walkway|curb|رصيف|موقف حافلات|ممشى|مقعد/.test(text) && !/ثوب|thobe/.test(text)) {
    poseId = 'outside_sit_safe_edge';
    motion = MOTIONS.seated;
    gaze = GAZES.relaxed;
    spontaneity = SPONTANEITY.composed;
    preferredAngleId = 'eye_level';
    distanceCm = 60;
    reasonAr = 'وجود سطح عام منخفض قد يسمح بالجلوس، مع اشتراط أن يكون السطح آمنًا وموجودًا فعليًا.';
    reasonEn = 'A low public surface may support sitting, but only when that surface is visibly present and safe.';
  } else if (/coffee|cafe|مقهى|shop|محل|pharmacy|بقالة|commercial|تجاري/.test(text)) {
    poseId = 'outside_walk_candid';
    motion = MOTIONS.walk;
    gaze = GAZES.environment;
    spontaneity = SPONTANEITY.active;
    preferredFrameId = scene.aspect.id === '169' ? 'wide_outside' : 'half_body';
    distanceCm = 68;
    reasonAr = 'المكان التجاري أو المقهى يناسب خطوة بطيئة عفوية تُظهر البيئة دون تحويلها إلى جلسة تصوير.';
    reasonEn = 'A commercial or cafe setting suits one slow candid step that shows the environment without becoming a photoshoot.';
  } else {
    const candidates = /ثوب|thobe/.test(text)
      ? ['outside_standing_relaxed', 'outside_adjust_sleeve', 'outside_open_door_turn']
      : ['outside_standing_relaxed', 'outside_walk_candid', 'outside_adjust_sleeve'];
    poseId = stableChoice(candidates, scene.loc.id + scene.storyline.id);
    if (poseId === 'outside_walk_candid') {
      motion = MOTIONS.walk;
      gaze = GAZES.environment;
      spontaneity = SPONTANEITY.active;
      preferredFrameId = scene.aspect.id === '169' ? 'wide_outside' : 'half_body';
      distanceCm = 68;
      reasonAr = 'لا توجد إشارة لموضع ثابت؛ تم اختيار حركة شبابية خفيفة تُبقي المشهد طبيعيًا.';
      reasonEn = 'No fixed prop is implied, so a light youthful movement keeps the scene natural.';
    } else if (poseId === 'outside_adjust_sleeve') {
      motion = MOTIONS.sleeve;
      gaze = GAZES.lens;
      spontaneity = SPONTANEITY.candid;
      reasonAr = 'تم اختيار تعديل بسيط للكم أو الساعة كحركة عفوية منخفضة المخاطر.';
      reasonEn = 'A small sleeve or watch adjustment provides a low-risk candid movement.';
    } else {
      motion = MOTIONS.casualPhone;
      gaze = GAZES.lens;
      spontaneity = SPONTANEITY.composed;
      preferredAngleId = 'eye_level';
      reasonAr = 'تم اختيار وقوف شبابي هادئ ينسجم مع معظم المشاهد الخارجية دون افتراض حركة غير مبررة.';
      reasonEn = 'A relaxed youthful stance works across most outdoor scenes without inventing unsupported movement.';
    }
  }

  const pose = findPose(poseId, true)
    ?? POSES.find((candidate) => OUTSIDE_POSE_IDS.has(candidate.id))
    ?? POSES[0];

  return buildPlan(scene, pose, motion, gaze, spontaneity, preferredFrameId, preferredAngleId, distanceCm, reasonAr, reasonEn);
}

type RecordValue = Record<string, unknown>;

function asRecord(value: unknown): RecordValue | null {
  return value && typeof value === 'object' ? value as RecordValue : null;
}

function readString(record: RecordValue | null, keys: string[]): string | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function readNestedString(record: RecordValue | null, key: string, nestedKeys: string[]): string | undefined {
  const nested = asRecord(record?.[key]);
  return readString(nested, nestedKeys);
}

function boundedText(value: string | undefined, fallback: string): string {
  return (value?.trim() || fallback).slice(0, 320);
}

function validId(value: string | undefined, allowed: Set<string>): string | undefined {
  return value && allowed.has(value) ? value : undefined;
}

export function normalizeGeminiDirectorPlan(
  raw: unknown,
  scene: AutoSceneDirectorContext,
  fallback: AutoSceneDirectorPlan = resolveAutoSceneDirector(scene),
): AutoSceneDirectorPlan | null {
  const outer = asRecord(raw);
  const record = asRecord(outer?.director) ?? asRecord(outer?.plan) ?? asRecord(outer?.result) ?? outer;
  if (!record) return null;

  const outside = scene.loc.zone === 'outside';
  const validPoseIds = new Set(POSES
    .filter((candidate) => outside === candidate.id.startsWith(OUTSIDE_POSE_PREFIX))
    .map((candidate) => candidate.id));
  const validAngleIds = new Set(['eye_level', 'candid_side', 'high_45', 'chest_low']);
  const validFrameIds = new Set(outside ? ['close_face', 'half_body', 'wide_outside'] : ['close_face', 'half_body']);

  const nestedPose = asRecord(record.pose);
  const poseId = validId(
    readString(record, ['poseId', 'selectedPoseId']) ?? readString(nestedPose, ['id']),
    validPoseIds,
  );
  const preferredAngleId = validId(
    readString(record, ['preferredAngleId', 'angleId']),
    validAngleIds,
  );
  const preferredFrameId = validId(
    readString(record, ['preferredFrameId', 'frameId']),
    validFrameIds,
  );

  const motionAr = readString(record, ['motionAr']) ?? readNestedString(record, 'motion', ['ar']);
  const motionEn = readString(record, ['motionEn']) ?? readNestedString(record, 'motion', ['en']);
  const gazeAr = readString(record, ['gazeAr']) ?? readNestedString(record, 'gaze', ['ar']);
  const gazeEn = readString(record, ['gazeEn']) ?? readNestedString(record, 'gaze', ['en']);
  const spontaneityAr = readString(record, ['spontaneityAr']) ?? readNestedString(record, 'spontaneity', ['ar']);
  const spontaneityEn = readString(record, ['spontaneityEn']) ?? readNestedString(record, 'spontaneity', ['en']);
  const reasonAr = readString(record, ['reasonAr']) ?? fallback.reasonAr;
  const reasonEn = readString(record, ['reasonEn']) ?? fallback.reasonEn;
  const distanceRaw = record.distanceCm;
  const distanceCm = typeof distanceRaw === 'number' && Number.isFinite(distanceRaw)
    ? Math.min(outside ? 75 : 68, Math.max(45, Math.round(distanceRaw)))
    : fallback.distanceCm;

  if (!poseId && !preferredAngleId && !preferredFrameId && !motionAr && !motionEn) return null;

  const pose = (poseId ? POSES.find((candidate) => candidate.id === poseId) : undefined) ?? fallback.pose;
  return {
    source: 'gemini',
    pose,
    motion: option('gemini_motion', boundedText(motionAr, fallback.motion.ar), boundedText(motionEn, fallback.motion.en)),
    gaze: option('gemini_gaze', boundedText(gazeAr, fallback.gaze.ar), boundedText(gazeEn, fallback.gaze.en)),
    spontaneity: option('gemini_spontaneity', boundedText(spontaneityAr, fallback.spontaneity.ar), boundedText(spontaneityEn, fallback.spontaneity.en)),
    preferredFrameId: preferredFrameId ?? fallback.preferredFrameId,
    preferredAngleId: preferredAngleId ?? fallback.preferredAngleId,
    distanceCm,
    reasonAr: boundedText(reasonAr, fallback.reasonAr),
    reasonEn: boundedText(reasonEn, fallback.reasonEn),
  };
}
