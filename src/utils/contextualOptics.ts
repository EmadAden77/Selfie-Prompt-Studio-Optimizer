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
const appendLight = (source: Opt, arAddition: string, enAddition: string): Opt => ({
  ...source,
  ar: [source.ar, arAddition].filter(Boolean).join(' ').trim(),
  en: [source.en, enAddition].filter(Boolean).join(' ').trim(),
});
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
    light = appendLight(light,
      'سقف السيارة المعتم يحجب الأشعة العمودية المباشرة؛ تتبع الإبرازات والظلال اتجاه الزجاج المعرض فعلياً للشمس ولا تُفرض ظلال شمس عمودية خارجية على الوجه.',
      'The opaque vehicle roof blocks direct overhead rays; a clear windshield is used only when it is the actual exposed path, while highlights and cabin shadows follow the selected source and real glazing, never compulsory outdoor vertical sun shadows.');
    notes.push('roof_shades_overhead_sun');
  } else if (inside && solar.has(light.id)) {
    light = appendLight(light,
      'داخل المقصورة يدخل ضوء النهار من الزجاج أو الفتحات المعرضة فعلياً فقط؛ يحجب السقف الضوء العمودي، وتبقى خصائص هذا المصدر من حيث اللون والنعومة والاتجاه محفوظة.',
      'Inside the cabin, daylight enters only through genuinely exposed glazing or openings, including a clear windshield only when it is the actual path; the roof blocks overhead sun while preserving this selected source\'s color, softness and direction.');
    notes.push('cabin_daylight_window_path');
  }
  if (inside && tintIsHeavy && solar.has(light.id)) {
    // Complement, rather than override, the selected daylight character.
    light = appendLight(light,
      'التظليل الشديد يخفف الضوء الذي يعبر الزجاج الجانبي والخلفي فقط؛ لا يضيف سطوعاً داخلياً مصطنعاً ولا يلغي لون واتجاه الإضاءة المختارة.',
      'Heavy tint attenuates only light crossing side and rear glazing; it adds no artificial cabin brightening and does not erase the selected light\'s color or direction.');
  }

  const outsideNightLights = new Set([
    'sodium_street', 'led_modern_street', 'single_distant_lamp',
    'headlights_bounce', 'pure_moonlight', 'ambient_drive_thru',
    'tunnel_tungsten',
  ]);
  if (inside && tintIsHeavy && outsideNightLights.has(light.id)) {
    // Preserve the selected night source while constraining its transmission path.
    light = appendLight(light,
      'مصدر الإضاءة الليلية المختار يبقى كما هو، لكن وصوله للمقصورة يمر عبر الزجاج المتاح؛ يضعف بشدة عبر الزجاج الجانبي والخلفي المظلل، مع ظلال عميقة وتعريض هاتف محدود دون إضاءة تعبئة مخفية.',
      'The selected night source remains unchanged, but its cabin transmission follows the available glazing, including a clear windshield only when it is the actual path; it is strongly attenuated through dark side and rear glass, with deep cabin shadows and limited phone exposure, never hidden studio fill.');
    notes.push('heavy_tint_night_transmission');
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

  // The free hand cannot simultaneously adjust the collar, grip the wheel,
  // and hold a cup or keys. Resolve accessories by occupied-hand geometry.
  const freeHandBusy = ['hand_on_wheel', 'adjust_collar'].includes(scene.pose.id) ||
    scene.tallErgonomics.some(x => ['roof_handle_grip', 'forearm_span_wheel'].includes(x.id));
  if (accessory.id === 'specialty_cup' && freeHandBusy) {
    accessory = inside && !close
      ? natural('specialty_cup', 'كوب قهوة ورقي موضوع في حامل الأكواب إذا دخل في مجال الرؤية، وليس بيد ثالثة',
        'A paper coffee cup resting in a cup holder only if that area is visible, never carried by a third hand')
      : natural('none', '', '');
    notes.push('cup_hand_conflict_resolved');
  }
  if (accessory.id === 'car_key' && freeHandBusy) {
    accessory = inside && !close
      ? natural('car_key', 'مفتاح السيارة موضوع على الكونسول فقط إذا كان ظاهرًا في الكادر',
        'A car key fob on the console only if actually within frame, not held by an additional hand')
      : natural('none', '', '');
    notes.push('key_hand_conflict_resolved');
  }
  if (accessory.id === 'luxury_watch') {
    accessory = natural('luxury_watch',
      'ساعة على معصم ذراع السيلفي فقط إذا كان المعصم داخل الكادر دون تمديد مصطنع للذراع',
      'A wristwatch on the selfie arm only if the actual wrist appears in the crop, without artificial arm extension');
  }

  // No assumed iris colour, added wrinkles, follicle-level reconstruction,
  // unseen body parts or studio lighting is inserted here.
  return { light, angle, pose, hair, accessory, notes };
}
