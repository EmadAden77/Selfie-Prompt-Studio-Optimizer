import type { BuildInput, Opt } from '../types/studio';

/**
 * Resolve scene-dependent semantics AFTER the selected time and light have been
 * reconciled. This is a text-planning constraint, not a claim to reconstruct
 * precise camera rays or the exact geometry of every vehicle interior.
 */
export interface ContextualOptics {
  light: Opt;
  angle: Opt;
  pose: Opt;
  hair: Opt;
  accessory: Opt;
  notes: readonly string[];
}

const natural = (id: string, ar: string, en: string): Opt => ({ id, ar, en });
const solar = new Set(['harsh_noon', 'noon_sun', 'soft_morning', 'afternoon_diffuse', 'golden_hour', 'overcast_haze']);
const directMidday = new Set(['harsh_noon', 'noon_sun']);

export function resolveContextualOptics(scene: BuildInput): ContextualOptics {
  const inside = scene.loc.zone === 'inside';
  const close = scene.frame.id === 'close_face';
  const high = scene.angle.id === 'high_45';
  const tintIsHeavy = ['tint_extra_dark_05', 'tint_dark_10'].includes(scene.tint.id);
  const notes: string[] = [];
  let { light, angle, pose, hair, accessory } = scene;

  if (inside && directMidday.has(light.id)) {
    light = natural(light.id,
      'ضوء ظهيرة قوي يدخل أساساً من الزجاج الأمامي الشفاف أو الفتحات الزجاجية المعرضة للشمس. سقف السيارة يحجب الأشعة العمودية المباشرة؛ الظلال الداخلية تتبع اتجاه دخول الضوء الحقيقي، ولا تُفرض ظلال شمس عمودية على الوجه.',
      'Bright midday daylight entering primarily through the clear windshield and any genuinely sun-facing glass. The opaque vehicle roof blocks direct overhead rays; facial highlights and cabin shadows follow the actual window direction, never compulsory vertical outdoor sun shadows.');
    notes.push('roof_shades_overhead_sun');
  } else if (inside && solar.has(light.id)) {
    light = natural(light.id,
      'ضوء النهار المتاح يدخل المقصورة من الزجاج الأمامي والفتحات المعرضة لاتجاه السماء والشمس؛ يحجب السقف الضوء العمودي وتخفت الإضاءة عبر النوافذ المظللة فقط.',
      'Available daylight enters through the windshield and physically exposed windows; the opaque roof blocks overhead sun, and tinted side and rear glazing attenuate only light crossing those panes.');
    notes.push('cabin_daylight_window_path');
  }
  if (inside && tintIsHeavy && solar.has(light.id)) {
    // Complement, rather than override, the corrected daylight source.
    light = { ...light,
      ar: light.ar + ' التظليل الشديد لا يخفض الضوء القادم من الزجاج الأمامي الشفاف؛ لا سطوع داخلي مصطنع.',
      en: light.en + ' Heavy side/rear tint reduces only the light passing through those panes; the clear windshield remains an independent daylight path, without artificial cabin brightening.' };
  }

  if (inside && high) {
    angle = natural(angle.id,
      'سيلفي أمامي بزاوية مرتفعة قليلًا عن مستوى العين، ضمن الارتفاع الفعلي المتاح بين رأس الجالس وبطانة سقف السيارة، مع ذراع ومرفق طبيعيين؛ لا تُفرض زاوية 45 درجة إذا لم تسمح المساحة.',
      'Slightly elevated handheld front-camera selfie within the real clearance between the seated head and roof liner, with relaxed arm and elbow; do not force a 45-degree overhead angle where it cannot physically fit.');
    notes.push('cabin_roof_camera_clearance');
  }
  if (inside && scene.pose.id === 'hand_on_wheel') {
    pose = natural(pose.id,
      'يد السيلفي تحمل الهاتف واليد الحرة مستريحة بعفوية فوق المقود، وقد تبقى خارج الكادر إذا اقتصر التأطير على الوجه والصدر؛ لا تحريك للكاميرا فقط لإظهار اليد.',
      'The selfie hand holds the phone; the free hand rests naturally on the steering wheel, possibly outside the crop when only the face and upper chest are framed. Never widen or tilt the selfie merely to reveal the wheel.');
    notes.push('wheel_hand_visibility_conditional');
  }

  if (scene.hair.id === 'covered_traditional' && !['thobe_shmagh','thobe_ghutra'].includes(scene.cloth.id)) {
    hair = natural(scene.hair.id,
      'الشعر وخط الجبهة مطابقان للصورة المرجعية بدون إضافة غطاء رأس غير موجود ضمن الملابس المختارة.',
      'Hair, visible hairline and density follow the reference; no headwear unless the selected outfit includes it.');
    notes.push('hair_headwear_clothing_conflict');
  }
  if (accessory.id === 'sunglasses_collar') {
    if (['thobe_shmagh','thobe_ghutra'].includes(scene.cloth.id) && close) {
      accessory = natural(accessory.id,
        'نظارة شمسية معلقة على ياقة الثوب فقط إذا ظهرت الياقة ولم يغطها الشماغ أو الغترة.',
        'Sunglasses may hang from the thobe collar only if that collar remains visible and uncovered by the headwear.');
    } else {
      accessory = natural(accessory.id,
        'نظارة شمسية متدلية بعفوية على ياقة القميص أو فتحة الثوب الظاهرة، دون اختراع غطاء رأس.',
        'Sunglasses casually hooked onto the visible shirt neckline or thobe collar, without adding headwear.');
    }
  }

  // No assumed iris colour, added wrinkles, follicle-level reconstruction,
  // unseen body parts or studio lighting is inserted here.
  return { light, angle, pose, hair, accessory, notes };
}
