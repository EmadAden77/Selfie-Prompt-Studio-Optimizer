import { ANGLES, FRAMINGS } from '../data/studioData';
import type { AutoCameraPlan, AutoSceneDirectorPlan, BuildInput, Opt } from '../types/studio';

export type AutoCameraContext = Pick<
  BuildInput,
  'loc' | 'carModel' | 'cloth' | 'pose' | 'aspect' | 'phone' | 'light' | 'storyline' | 'tint'
> & {
  directorPlan?: AutoSceneDirectorPlan;
};

const fallback = (id: string, ar: string, en: string): Opt => ({ id, ar, en });

function findOption(options: Opt[], id: string, fallbackValue: Opt): Opt {
  return options.find(option => option.id === id) ?? fallbackValue;
}

/**
 * Chooses one physically plausible selfie camera plan from the structured scene.
 *
 * The UI no longer asks users to reason about cinematic shot names or focal
 * lengths. Those values remain explicit in the generated prompt so downstream
 * image models receive one coherent camera decision.
 */
export function resolveAutoCameraPlan(scene: AutoCameraContext): AutoCameraPlan {
  const inside = scene.loc.zone === 'inside';
  const effectivePose = scene.directorPlan?.pose ?? scene.pose;
  const candidMovement = ['arm_out', 'involuntary_snap', 'outside_walk_candid', 'outside_adjust_sleeve'].includes(effectivePose.id);
  const wideAspect = scene.aspect.id === '169';

  let frameId: 'close_face' | 'half_body' | 'wide_outside';
  let angleId: 'eye_level' | 'high_45' | 'chest_low' | 'candid_side';
  let shotLabelAr: string;
  let shotLabelEn: string;
  let reasonAr: string;
  let reasonEn: string;
  let distanceCm: number;

  if (inside && effectivePose.id === 'hand_on_wheel') {
    frameId = 'close_face';
    angleId = 'eye_level';
    shotLabelAr = 'لقطة قريبة للوجه والصدر';
    shotLabelEn = 'close-up face-and-chest selfie';
    reasonAr = 'المقصورة ضيقة ويد حرة مرتبطة بالمقود؛ لذلك يحافظ النظام على الوجه كأولوية دون توسيع الكادر لإظهار تفاصيل لا يسمح بها المكان.';
    reasonEn = 'The cabin is compact and the free hand is tied to the steering wheel, so the director prioritizes the face without widening the frame beyond the available space.';
    distanceCm = 55;
  } else if (inside && effectivePose.id === 'adjust_collar') {
    frameId = 'half_body';
    angleId = 'eye_level';
    shotLabelAr = 'لقطة نصفية من الرأس إلى أعلى الجذع';
    shotLabelEn = 'natural half-body selfie';
    reasonAr = 'حركة تعديل الياقة تحتاج مساحة كافية للصدر واليد مع إبقاء المقصورة خلفية ثانوية.';
    reasonEn = 'The collar gesture needs enough room for the chest and free hand while keeping the cabin secondary.';
    distanceCm = 62;
  } else if (candidMovement) {
    frameId = inside ? 'half_body' : 'wide_outside';
    angleId = 'candid_side';
    shotLabelAr = inside ? 'لقطة نصفية عفوية جانبية' : 'لقطة واسعة عفوية تُظهر سياق المكان';
    shotLabelEn = inside ? 'candid half-body selfie' : 'wide contextual handheld selfie';
    reasonAr = inside
      ? 'الحركة العفوية تبرر انحرافاً جانبياً بسيطاً دون فرض زاوية حادة أو مدّ الذراع إلى أقصاه.'
      : 'الوقوف خارج السيارة والحركة العفوية يسمحان بإظهار جزء من البيئة دون تحويل الصورة إلى لقطة سيارة إعلانية.';
    reasonEn = inside
      ? 'The candid motion supports a slight off-axis view without forcing a steep angle or maximum arm reach.'
      : 'The exterior stance allows some environment to enter naturally without turning the image into an automotive commercial.';
    distanceCm = inside ? 62 : 65;
  } else if (!inside && wideAspect) {
    frameId = 'wide_outside';
    angleId = 'eye_level';
    shotLabelAr = 'لقطة واسعة سياقية';
    shotLabelEn = 'wide contextual selfie';
    reasonAr = 'نسبة العرض الواسعة تحتاج مساحة إضافية حول الشخص، مع بقاء الشخص في المقدمة وعدم تصغيره داخل المشهد.';
    reasonEn = 'The wide aspect ratio needs more space around the subject while keeping him foreground-dominant rather than distant.';
    distanceCm = 65;
  } else if (!inside) {
    frameId = 'half_body';
    angleId = 'eye_level';
    shotLabelAr = 'لقطة نصفية طبيعية';
    shotLabelEn = 'natural half-body selfie';
    reasonAr = 'المشهد الخارجي يسمح بإظهار الجذع وطبقة خلفية محدودة مع الحفاظ على أولوية الهوية.';
    reasonEn = 'The exterior scene allows the torso and a limited background layer to appear while preserving identity priority.';
    distanceCm = 62;
  } else {
    frameId = 'close_face';
    angleId = 'eye_level';
    shotLabelAr = 'لقطة قريبة طبيعية';
    shotLabelEn = 'natural close-up selfie';
    reasonAr = 'هندسة المقصورة وواقعية السيلفي بيد واحدة تجعل اللقطة القريبة بمستوى العين الخيار الأكثر اتساقاً.';
    reasonEn = 'Cabin geometry and one-handed selfie physics make a close eye-level view the most coherent choice.';
    distanceCm = 55;
  }

  const preferredFrameId = scene.directorPlan?.preferredFrameId;
  if (preferredFrameId === 'close_face' || preferredFrameId === 'half_body' || preferredFrameId === 'wide_outside') {
    if (inside ? preferredFrameId !== 'wide_outside' : true) frameId = preferredFrameId;
  }
  const preferredAngleId = scene.directorPlan?.preferredAngleId;
  if (preferredAngleId === 'eye_level' || preferredAngleId === 'high_45' || preferredAngleId === 'chest_low' || preferredAngleId === 'candid_side') {
    angleId = preferredAngleId;
  }
  if (scene.directorPlan?.distanceCm && Number.isFinite(scene.directorPlan.distanceCm)) {
    distanceCm = Math.min(inside ? 68 : 75, Math.max(45, Math.round(scene.directorPlan.distanceCm)));
  }
  if (scene.directorPlan?.reasonAr) {
    reasonAr = `${reasonAr} ${scene.directorPlan.reasonAr}`;
    reasonEn = `${reasonEn} ${scene.directorPlan.reasonEn}`;
  }

  const focalLengthEquivalent = scene.phone.id === 'xiaomi_15_ultra'
    ? (frameId === 'close_face' ? '21mm-equivalent wide front camera' : '24mm-equivalent wide front-camera crop')
    : (frameId === 'close_face' ? '24mm-equivalent wide front camera' : '24mm-equivalent wide front-camera view');

  const frame = findOption(
    FRAMINGS,
    frameId,
    fallback(frameId, shotLabelAr, shotLabelEn),
  );
  const angle = findOption(
    ANGLES,
    angleId,
    fallback(angleId, 'زاوية طبيعية بمستوى العين', 'natural eye-level handheld view'),
  );

  return {
    mode: 'auto',
    frame,
    angle,
    shotLabelAr,
    shotLabelEn,
    focalLengthEquivalent,
    distanceCm,
    reasonAr,
    reasonEn,
  };
}
