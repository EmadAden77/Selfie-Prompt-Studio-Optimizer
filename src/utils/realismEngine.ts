import { optionLockReason } from './optionCompatibility';
import { analyzeLocationLighting } from './lightingEngine';
import { LIGHTING_OPTIONS } from '../data/studioData';
import { BuildInput, Opt, Loc, SUBJECT_HEIGHT_CM } from '../types/studio';


export interface PhysicalWarning {
  id: string;
  level: 'warning' | 'info' | 'auto-correction';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  field: string;
}

export interface PhysicalRealismReport {
  score: number; // 0 - 100
  isCoherent: boolean;
  warnings: PhysicalWarning[];
  activeRules: string[];
  lightingProfile: {
    category: 'daylight' | 'golden_hour' | 'night' | 'artificial_indoor' | 'flash';
    ambientKelvin: string;
    lightFalloff: string;
    shadowBehavior: string;
  };
  spatialProfile: {
    zone: 'inside' | 'outside';
    subjectDominancePct: number; // 75 - 85%
    cameraDistanceCm: number;
    armPerspective: string;
  };
}

// Lighting category classifications
const DAYLIGHT_IDS = [
  'harsh_noon',
  'golden_hour',
  'soft_morning',
  'afternoon_diffuse',
  'sunset_glow',
  'blue_hour',
  'overcast_haze',
  'noon_sun',
];

const NIGHT_IDS = [
  'sodium_street',
  'led_modern_street',
  'direct_flash',
  'dash_screens_glow',
  'tunnel_tungsten',
  'single_distant_lamp',
  'ambient_drive_thru',
  'headlights_bounce',
  'pure_moonlight',
  'warm_car_cabin_dome',
  'basement_tubes',
  'neon_side_wash',
  'night_cabin_glow',
  'station_canopy',
  'station_led',
];

// Inside-only pose IDs
const INSIDE_ONLY_POSES = ['hand_on_wheel', 'elbow_door_rest'];

/**
 * Validates physical and optical realism across all selections, generates a detailed
 * coherence report, and returns a sanitized BuildInput for prompt generation
 * without mutating the user's persistent UI state.
 */
export function validateAndSanitizePhysics(input: BuildInput): {
  report: PhysicalRealismReport;
  sanitized: BuildInput;
} {
  const warnings: PhysicalWarning[] = [];
  const activeRules: string[] = [];
  let deduction = 0;

  const isOutside = input.loc.zone === 'outside';
  const isInside = input.loc.zone === 'inside';

  // 1. Zone & Cabin Details Coherence Rule
  let sanitizedCabins = [...input.cabins];
  let sanitizedDashUis = [...input.dashUis];
  let sanitizedCabinArtifacts = [...input.cabinArtifacts];
  let sanitizedClutters = [...input.clutters];
  let sanitizedAirflows = [...input.airflows];
  let sanitizedTallErgonomics = [...input.tallErgonomics];
  let sanitizedPose = { ...input.pose };
  let sanitizedSubsurfaces = [...input.subsurfaces];
  let sanitizedScreenCasts = [...input.screenCasts];
  let sanitizedLight = { ...input.light };
  let sanitizedHeightCue = { ...input.heightCue };
  let sanitizedThermals = [...input.thermals];
  let sanitizedMicroWeathers = [...input.microWeathers];
  let sanitizedFabrics = [...input.fabrics];
  let sanitizedInAppArtifacts = [...input.inAppArtifacts];
  let sanitizedHeightCueForClothing = { ...input.heightCue };

  if (isOutside) {
    activeRules.push('عزل تفاصيل المقصورة الداخلية تلقائياً (اللقطة خارج السيارة)');
    // A standing exterior subject must never inherit interior dashboard items.
    sanitizedCabins = [];
    sanitizedDashUis = [];
    sanitizedCabinArtifacts = [];
    sanitizedClutters = [];
    sanitizedScreenCasts = [];
    sanitizedAirflows = [];
    
    // Check if cabin details were selected while outside
    const hasCabinDetails =
      input.cabins.length > 0 ||
      input.dashUis.length > 0 ||
      input.cabinArtifacts.length > 0 ||
      input.clutters.some(c => c.id === 'charger_12v_glow' || c.id === 'rearview_parking_tag');

    if (hasCabinDetails) {
      deduction += 10;
      warnings.push({
        id: 'exterior_cabin_hidden',
        level: 'auto-correction',
        titleAr: 'عزل عناصر المقصورة من الكادر الخارجي',
        titleEn: 'Interior Cabin Elements Isolated for Exterior Selfie',
        descAr: 'تم تلقائياً إخفاء تفاصيل الكونسول وشاشات الطبلون من البرومبت لأن الشخص يقف خارج السيارة، للحفاظ على المنظور البصري الحقيقي.',
        descEn: 'Interior console and dashboard items were automatically omitted from exterior selfie prompt to maintain physical optical accuracy.',
        field: 'cabins',
      });

      // Filter out elements physically invisible from outside
      sanitizedCabins = [];
      sanitizedDashUis = [];
      sanitizedCabinArtifacts = [];
      sanitizedClutters = [];
    }

    // AC Airflow outside check
    if (input.airflows.some(a => a.id === 'ac_gentle_breeze')) {
      sanitizedAirflows = [];
      warnings.push({
        id: 'exterior_ac_breeze',
        level: 'auto-correction',
        titleAr: 'استبعاد هواء المكيف داخل المشهد الخارجي',
        titleEn: 'Excluded cabin AC airflow outside',
        descAr: 'تكييف السيارة لا يؤثر على الشخص خارجها؛ لم يتم افتراض وجود نسيم خارجي.',
        descEn: 'Cabin AC vents cannot reach an exterior subject; no outdoor breeze is invented.',
        field: 'airflows',
      });
    }

    // Pose compatibility for exterior
    if (INSIDE_ONLY_POSES.includes(input.pose.id)) {
      deduction += 12;
      warnings.push({
        id: 'outside_pose_mismatch',
        level: 'auto-correction',
        titleAr: 'تصحيح وضعية اليد خارج السيارة',
        titleEn: 'Adjusted Arm Pose for Exterior Setting',
        descAr: 'وضعية (يد على المقود) لا يمكن تنفيذها خارج السيارة؛ تم تكييفها تلقائياً إلى مسندة عفوية على باب السيارة أو الكبوت.',
        descEn: 'Steering wheel pose is physically impossible outdoors; auto-adapted to casual natural stance beside car body.',
        field: 'pose',
      });
      sanitizedPose = {
        id: 'outside_natural_lean',
        ar: 'يد مرتاحة على جانب السيارة والأخرى تلتقط السيلفي بعفوية بمد ذراع طويل',
        en: 'one arm extended holding selfie phone naturally at 193cm reach while other rests casually against vehicle body',
      };
    }

    // Headrest/seatbelt tall cues adjustment
    if (input.tallErgonomics.some(t => t.id === 'forearm_span_wheel' || t.id === 'roof_handle_grip')) {
      sanitizedTallErgonomics = input.tallErgonomics.filter(
        t => t.id !== 'forearm_span_wheel' && t.id !== 'roof_handle_grip'
      );
    }
  }

  // Remove cabin-only subject cues in an exterior image. Do not invent a
  // replacement source or make assumptions about the selected weather.
  if (isOutside) {
    sanitizedHeightCue = {
      id: 'exterior_stature',
      ar: 'القامة الطويلة بتناسق طبيعي دون مسند رأس أو سقف سيارة',
      en: 'natural tall stature without cabin headrest or roof-line cues',
    };
    sanitizedThermals = input.thermals.filter(item =>
      !['window_ac_fog', 'ac_window_fog', 'cabin_window_fog'].includes(item.id)
    );
    sanitizedMicroWeathers = input.microWeathers.filter(item =>
      !['cabin_condensation', 'interior_window_fog'].includes(item.id)
    );
  }

  // 2. Interior Selfie Verification
  if (isInside) {
    activeRules.push('قفل هندسة مقصورة السائق (193 سم - مسند الرأس وبطانة السقف)');
  }

  // Interior geometry is constrained by a single handheld phone and two hands.
  // Suppress mutually exclusive arm placements and unsupported cabin effects.
  if (isInside) {
    const usingSteeringWheel = input.pose.id === 'hand_on_wheel';
    const adjustingCollar = input.pose.id === 'adjust_collar';
    const garmentHasCollar = [
      'thobe', 'shirt', 'linen', 'collar'
    ].some(token => input.cloth.id.toLowerCase().includes(token));

    if (adjustingCollar && !garmentHasCollar) {
      sanitizedPose = {
        id: 'arm_out',
        ar: 'جالس بصورة طبيعية مع ذراع واحدة تحمل الهاتف والأخرى مسترخية دون تعديل ياقة غير موجودة',
        en: 'seated naturally with one hand holding the selfie phone and the other resting, without adjusting a nonexistent collar',
      };
      warnings.push({
        id: 'missing_collar_pose',
        level: 'auto-correction',
        titleAr: 'تصحيح وضعية تعديل الياقة',
        titleEn: 'Collar gesture corrected',
        descAr: 'أُزيلت حركة تعديل الياقة لأن الملابس المختارة لا تدعمها.',
        descEn: 'Collar-adjustment gesture removed for an outfit without that collar.',
        field: 'pose',
      });
    }

    const hasWheelForearm = input.tallErgonomics.some(x => x.id === 'forearm_span_wheel');
    const hasRoofGrip = input.tallErgonomics.some(x => x.id === 'roof_handle_grip');
    if (hasWheelForearm && hasRoofGrip) {
      sanitizedTallErgonomics = input.tallErgonomics.filter(x => x.id !== 'roof_handle_grip');
      warnings.push({
        id: 'conflicting_free_hand_positions',
        level: 'auto-correction',
        titleAr: 'منع تكرار اليد الحرة',
        titleEn: 'Impossible simultaneous hand placements removed',
        descAr: 'لا يمكن لليد الحرة الاستناد إلى المقود ومقبض السقف في الوقت نفسه.',
        descEn: 'The free hand cannot touch the wheel and roof handle simultaneously.',
        field: 'tallErgonomics',
      });
    }
    if (usingSteeringWheel) {
      sanitizedTallErgonomics = sanitizedTallErgonomics.filter(x => x.id !== 'roof_handle_grip');
    }

    const hasDeadCalm = input.airflows.some(x => x.id === 'cabin_dead_calm');
    if (hasDeadCalm && input.airflows.length > 1) {
      sanitizedAirflows = input.airflows.filter(x => x.id === 'cabin_dead_calm');
      warnings.push({
        id: 'conflicting_airflow',
        level: 'auto-correction',
        titleAr: 'تصحيح تدفق الهواء داخل المقصورة',
        titleEn: 'Conflicting cabin airflow removed',
        descAr: 'السكون التام لا يجتمع مع نسيم مكيف يحرك الشعر أو نافذة مفتوحة.',
        descEn: 'Still cabin air cannot simultaneously move hair or enter through an open window.',
        field: 'airflows',
      });
    }

    const screenFlash = input.inAppArtifacts.some(x => x.id === 'front_screen_flash_burst');
    const physicalFlash = input.light.id === 'direct_flash';
    if (screenFlash && physicalFlash) {
      sanitizedInAppArtifacts = input.inAppArtifacts.filter(x => x.id !== 'front_screen_flash_burst');
      warnings.push({
        id: 'flash_source_conflict',
        level: 'auto-correction',
        titleAr: 'منع مصدرَي فلاش متناقضين',
        titleEn: 'Conflicting flash sources resolved',
        descAr: 'تم الحفاظ على الفلاش الأساسي المختار دون إضافة فلاش شاشة ثانٍ.',
        descEn: 'Kept the selected primary flash without inventing a second screen-flash source.',
        field: 'inAppArtifacts',
      });
    }

    // A fixed seat position does not mean a universally high headrest.
    if (input.heightCue.id === 'headrest_max') {
      sanitizedHeightCueForClothing = {
        id: 'headrest_adjusted',
        ar: 'مسند الرأس مضبوط على ارتفاع مريح وخلف الرأس وفق هندسة المقعد الفعلية',
        en: 'head restraint adjusted to support the head according to the actual seat geometry, not forcibly at maximum height',
      };
    }
  }

  // 3. Clothing vs Subsurface Light Bounce Coherence
  const isDarkTee = input.cloth.id === 'tee_black_ref' || input.cloth.id === 'sport_athletic' || input.cloth.id === 'sport_dark';
  const hasThobeBounce = input.subsurfaces.some(s => s.id === 'thobe_jaw_bounce');

  if (isDarkTee && hasThobeBounce) {
    deduction += 8;
    warnings.push({
      id: 'thobe_bounce_black_tee_conflict',
      level: 'auto-correction',
      titleAr: 'تصحيح ارتداد الضوء (تيشيرت داكن مع بياض الثوب)',
      titleEn: 'Resolved Clothing Light Bounce Contradiction',
      descAr: 'تم تفعيل التيشيرت الأسود الفحمي، لذا تم إلغاء ارتداد بياض الثوب على الفك واستبداله بامتصاص الضوء الطبيعي للأقمشة الداكنة (Low Albedo Absorption).',
      descEn: 'Charcoal dark t-shirt cannot reflect bright white thobe bounce; auto-corrected to natural dark textile light absorption.',
      field: 'subsurfaces',
    });
    sanitizedSubsurfaces = input.subsurfaces.filter(s => s.id !== 'thobe_jaw_bounce');
  }

  // 4. Lighting Environment & Location Coherence
  const lightId = input.light.id;
  const isDaylight = DAYLIGHT_IDS.includes(lightId);
  const isNight = NIGHT_IDS.includes(lightId);
  const isBasement = input.loc.id === 10 || input.loc.id === 5;
  const isFuelStation = input.loc.id === 7 || input.loc.id === 29;

  // Harsh noon sun in underground basement lot
  if (input.loc.id === 10 && (lightId === 'harsh_noon' || lightId === 'noon_sun')) {
    deduction += 20;
    warnings.push({
      id: 'basement_noon_sun_conflict',
      level: 'warning',
      titleAr: 'تعارض فيزيائي: شمس الظهيرة داخل قبو مغلق!',
      titleEn: 'Physical Impossibility: Midday Sun in Underground Basement',
      descAr: 'مواقف القبو السفلية مغلقة خرسانياً تماماً؛ لا يمكن دخول أشعة الشمس العمودية الساطعة. يُنصح باختيار أنابيب الفلورسنت أو إضاءة الكابينة.',
      descEn: 'Underground enclosed basements lack direct sunlight. Recommend fluorescent tubes or cabin ambient glow.',
      field: 'light',
    });
  }

  // Dome light while standing in open desert outside
  if (isOutside && lightId === 'warm_car_cabin_dome') {
    deduction += 10;
    warnings.push({
      id: 'exterior_dome_light_weakness',
      level: 'info',
      titleAr: 'ملاحظة ضوئية: لمبة سقف السيارة ضعيفة خارجها',
      titleEn: 'Optical Falloff: Interior Dome Light Outside Vehicle',
      descAr: 'لمبة سقف السيارة الداخلية محصورة بالداخل وتتلاشى بشدة قبل أن تضيء شخصاً يقف خارج السيارة. تم تعزيز ارتداد الإنارة المحيطة الخارجية.',
      descEn: 'Interior ceiling bulb exhibits rapid 1/r² falloff through tinted glass; external ambient fill emphasized.',
      field: 'light',
    });
  }

  // Fuel station lighting outside fuel station
  if (!isFuelStation && (lightId === 'station_canopy' || lightId === 'station_led')) {
    warnings.push({
      id: 'station_light_elsewhere',
      level: 'info',
      titleAr: 'إنارة مظلة الوقود البيضاء',
      titleEn: 'Overhead Canopy Lighting Active',
      descAr: 'تم تفعيل إنارة سقف محطة الوقود عالية الشدة كضوء علوي غامر.',
      descEn: 'Industrial high-intensity overhead floodlighting applied to facial contours.',
      field: 'light',
    });
  }

  // Direct flash physics
  if (lightId === 'direct_flash') {
    activeRules.push('فيزياء فلاش الكاميرا المباشر: تباين حاد، لمعة T-Zone دقيقة، وانحسار ضوئي في الخلفية');
  }

  // Sodium street light physics
  if (lightId === 'sodium_street') {
    activeRules.push('إنارة الصوديوم الدافئة 2200K: وهج برتقالي عنبري مع ظلال عميقة تحت الفك');
  }

  // Screen cast light outside vehicle
  if (isOutside && input.screenCasts.some(s => s.id === 'carplay_dark_glow')) {
    sanitizedScreenCasts = [];
    warnings.push({
      id: 'exterior_carplay_cast',
      level: 'auto-correction',
      titleAr: 'إخفاء انعكاس شاشة الملاحة للواقف خارج السيارة',
      titleEn: 'CarPlay Screen Glow Excluded for Exterior Subject',
      descAr: 'وهج شاشة الكونسول الداخلية لا يصل لوجه الشخص الواقف خارج السيارة، تم استبعاده تلقائياً.',
      descEn: 'Dashboard infotainment glow cannot illuminate exterior subject; automatically excluded.',
      field: 'screenCasts',
    });
  }

  // Unavailable lamps must not be silently treated as actual physical sources.
  if (isOutside && ['warm_car_cabin_dome', 'dash_screens_glow', 'night_cabin_glow'].includes(lightId)) {
    sanitizedLight = {
      id: 'exterior_light_unresolved',
      ar: 'إنارة الموقع الخارجية المتاحة فقط، دون افتراض مصدر غير مرئي',
      en: 'available outdoor practical illumination only; no invented light source',
    };
    deduction += 15;
    warnings.push({
      id: 'outdoor_cabin_light_rejected',
      level: 'auto-correction',
      titleAr: 'استبعاد إنارة المقصورة من إضاءة الشخص الخارجي',
      titleEn: 'Exterior cabin lighting rejected',
      descAr: 'لا يمكن افتراض إضاءة الوجه خارج السيارة بواسطة شاشات أو لمبة المقصورة.',
      descEn: 'Cabin screens and dome lamps cannot be assumed to illuminate an outdoor face.',
      field: 'light',
    });
  }

  if (input.loc.id === 10 && ['harsh_noon', 'noon_sun'].includes(lightId)) {
    sanitizedLight = {
      id: 'basement_existing_lights',
      ar: 'إنارة القبو الموجودة فقط دون شمس مباشرة',
      en: 'existing basement practical lights only; no direct sunlight',
    };
    warnings.push({
      id: 'basement_light_corrected',
      level: 'auto-correction',
      titleAr: 'استبعاد الشمس المباشرة داخل القبو',
      titleEn: 'Direct sunlight removed inside basement',
      descAr: 'تم حذف الشمس المباشرة من وصف القبو المغلق.',
      descEn: 'Direct noon sunlight is not valid in an enclosed basement.',
      field: 'light',
    });
  }

  // Optical and camera consistency is resolved after all scene-specific rules.
  // A screen-flash / dashboard cast is a local weak emitter, not an invisible fill.
  const hasScreenOnly = input.inAppArtifacts.some(x => x.id === 'front_screen_flash_burst');
  if (hasScreenOnly && input.light.id !== 'direct_flash') {
    // Screen-based frontal fill and strong environmental face lighting are not interchangeable.
    activeRules.push('فلاش الشاشة مصدر قريب وضعيف مع تناقص الإضاءة في عمق المقصورة، دون ملء ضوئي صناعي');
  }

  // A driver cannot hold the phone, grip the wheel and roof handle at once.
  if (isInside && input.pose.id === 'hand_on_wheel') {
    sanitizedTallErgonomics = sanitizedTallErgonomics.filter(x => x.id !== 'roof_handle_grip');
  }

  // Optical artifacts are conditional on camera perspective, never fabricated per-pixel.
  // Optical consistency is resolved in the final cross-field pass.

  // Exterior selfies must not inherit tint physics as if the camera was behind the glass.
  const sanitizedTint = isOutside
    ? input.frame.id === 'close_face'
      ? { id: 'tint_not_visible', ar: '', en: '' }
      : {
          ...input.tint,
          ar: 'عند ظهور زجاج السيارة في طرف الكادر فقط: ' + input.tint.ar + '، من دون تعتيم الوجه خارج السيارة.',
          en: 'Only if the vehicle windows are visible near the frame edge: ' + input.tint.en + '; tint does not darken the face standing outside.',
        }
    : input.tint;

  // Facial detail comes solely from the attached reference. No fabricated freckles or scars.
  const sanitizedSkinNuances = input.skinNuances.filter(x =>
    !['ref_freckles_moles'].includes(x.id)
  );
  if (sanitizedSkinNuances.length !== input.skinNuances.length) {
    warnings.push({
      id: 'unverified_face_details',
      level: 'auto-correction',
      titleAr: 'منع اختراع تفاصيل هوية غير مثبتة',
      titleEn: 'Unverified facial details removed',
      descAr: 'أزيل فرض النمش؛ يجب أن يأتي فقط من الصورة المرجعية إذا كان ظاهرًا بالفعل.',
      descEn: 'No freckles can be mandated unless actually visible in the reference.',
      field: 'skinNuances',
    });
  }

  // Limit conflicting camera-app depth treatments.
  if (sanitizedInAppArtifacts.some(x => x.id === 'instant_snap_bokeh')) {
    sanitizedInAppArtifacts = sanitizedInAppArtifacts.filter(x => x.id !== 'instant_snap_bokeh');
    warnings.push({
      id: 'artificial_selfie_bokeh',
      level: 'auto-correction',
      titleAr: 'إزالة عزل خلفية اصطناعي',
      titleEn: 'Artificial portrait blur omitted',
      descAr: 'حدة الوجه والخلفية تتبع عمق المجال الحقيقي لكاميرا الهاتف، دون عزل اصطناعي مفترض.',
      descEn: 'Background defocus must follow the actual phone lens and distance.',
      field: 'inAppArtifacts',
    });
  }


  // One free hand can perform ONE action. The selfie hand remains on the phone.
  if (isInside && (input.pose.id === 'hand_on_wheel' || input.tallErgonomics.some(x => x.id === 'forearm_span_wheel' || x.id === 'roof_handle_grip'))) {
    const originalCount = sanitizedCabins.length;
    sanitizedCabins = sanitizedCabins.filter(x => x.id !== 'large_hand_gear');
    if (sanitizedCabins.length !== originalCount) {
      warnings.push({
        id: 'wheel_gear_hand_conflict', level: 'auto-correction',
        titleAr: 'اليد الحرة لا تمسك المقود والقير معًا',
        titleEn: 'Wheel and gear hand conflict',
        descAr: 'تم حذف وضع اليد على القير لصالح وضعية اليد الأخرى المختارة.',
        descEn: 'The gear-shifter hand action was removed to preserve one free hand.',
        field: 'cabins',
      });
    }
  }

  // Tight head-and-chest shots cannot physically reveal the lower console or lap.
  if (input.frame.id === 'close_face') {
    sanitizedCabins = sanitizedCabins.filter(x => !['large_hand_gear', 'tissue_box_console'].includes(x.id));
    sanitizedClutters = sanitizedClutters.filter(x => !['charger_12v_glow', 'door_pocket_keys'].includes(x.id));
    sanitizedCabinArtifacts = sanitizedCabinArtifacts.filter(x => !['fresh_miswak_console'].includes(x.id));
    sanitizedFabrics = input.fabrics.filter(x => x.id !== 'seat_hip_creases');
    sanitizedThermals = sanitizedThermals.filter(x => x.id !== 'cup_sweat_droplets');
    warnings.push({
      id: 'tight_frame_visibility', level: 'info',
      titleAr: 'استبعاد تفاصيل خارج الكادر القريب',
      titleEn: 'Lower-cabin details omitted in close selfie',
      descAr: 'تم استبعاد تفاصيل حجر الجالس والكونسول السفلي وحامل الأكواب والقير.',
      descEn: 'Lap, lower console, cup holder and gear details are outside a close upper-body frame.',
      field: 'frame',
    });
  }


  // Final cross-field resolution runs after zone-specific rules. Saved presets and
  // restored sessions pass through the same gate as visible UI selections.
  const warmWeatherIds = new Set(['harsh_noon','noon_sun','golden_hour','afternoon_diffuse']);
  const isDirectSun = ['harsh_noon','noon_sun','golden_hour'].includes(sanitizedLight.id);
  const closeFace = input.frame.id === 'close_face';
  const hasThobe = input.cloth.id.includes('thobe');

  // Climate: condensed breath requires sufficiently cold ambient air. Never
  // invent a cold winter morning under high/noon sun.
  sanitizedMicroWeathers = sanitizedMicroWeathers.filter(x =>
    x.id !== 'winter_breath_fade' || !warmWeatherIds.has(sanitizedLight.id)
  );

  // Car glass and cabin displays cannot be reflected on an exterior face
  // merely because a car is present. Eye colour is determined by the reference.
  // A catchlight is contingent on geometry and an actual emitter.
  const safeCatchlight = {
    id: 'catchlight_reflection',
    ar: 'انعكاس عين طبيعي من الشمس أو السماء أو شاشة الهاتف فقط إن سمح موضع المصدر واتجاه النظر، دون تغيير لون القزحية',
    en: 'Natural eye catchlights only from physically positioned sun, sky or phone screen where geometry permits; retain reference iris color',
  };
  const sanitizedOpticals = input.opticals
    .filter(x => !['fake_portrait_blur','artificial_bokeh','fake_8k_sharpness'].includes(x.id))
    .map(x => x.id === 'catchlight_reflection' ? safeCatchlight :
      x.id === 'chroma_shadow_noise' && isOutside
        ? { ...x, ar: 'ضوضاء مستشعر خفيفة فقط في الظلال المرئية داخل الكادر', en: 'Mild smartphone sensor noise only in visible shaded image regions' } : x);

  // Avoid measuring arm reach from total standing height.
  const sanitizedGripMotions = input.gripMotions.map(x => x.id === 'natural_arm_stretch'
    ? { ...x,
        ar: 'امتداد مريح لذراع السيلفي مع ثني طبيعي للمرفق واستجابة بسيطة للكتف',
        en: 'Comfortable one-handed selfie reach with natural elbow flexion and relaxed shoulder' }
    : x.id === 'steering_hand_microblur' && isOutside
      ? { ...x, ar: 'اهتزاز حركة يد عفوي فقط إن ظهر في الكادر', en: 'Subtle candid hand motion blur only if the free hand is visible' }
      : x);

  // Seatbelt and seated-lap effects belong to the cabin, not a standing shot.
  sanitizedFabrics = sanitizedFabrics
    .filter(x => !(isOutside && x.id === 'seat_hip_creases'))
    .map(x => x.id === 'collar_tilt_tension' && isOutside
      ? { ...x, ar: 'تغير طفيف في ثنيات الياقة بسبب حركة الرقبة والجسم بشكل طبيعي', en: 'Subtle collar movement from neck rotation and natural outdoor body movement' }
      : x);

  // Backlit cartilage translucency must be conditional; reflected light from
  // a white garment is only available when that garment is actually illuminated.
  sanitizedSubsurfaces = sanitizedSubsurfaces.filter(x =>
    x.id !== 'thobe_jaw_bounce' || hasThobe
  ).map(x => x.id === 'ear_cartilage_glow'
    ? { ...x, ar: 'شفافية أذن خفيفة فقط إذا مر ضوء فعلي خلف الأذن', en: 'Subtle ear translucency only if actual backlighting reaches the ear' }
    : x.id === 'thobe_jaw_bounce'
      ? { ...x, ar: 'انعكاس ضعيف من الثوب الأبيض فقط إذا سقط عليه ضوء حقيقي', en: 'Weak reflected light from white thobe only when a real light source illuminates the fabric' }
      : x);

  // An observed expression may involve normal lid narrowing, never newly
  // invented crow feet or assumptions of sun glare at night.
  const sanitizedAnatomicalExpr = input.anatomicalExpr.id === 'sun_squint_lines'
    ? { ...input.anatomicalExpr,
      ar: isDirectSun ? 'تضيّق طبيعي خفيف للجفون بسبب وهج الشمس دون إضافة تجاعيد جديدة' : 'جفون مرتاحة وتعبير عفوي دون ضوء شمس مفترض',
      en: isDirectSun ? 'Natural mild eyelid squint from direct sun, without invented wrinkles' : 'Relaxed candid eyelids without assumed direct sunlight' }
    : input.anatomicalExpr;

  // Prevent redundant off-frame descriptions from noise or UI modules.
  if (closeFace) {
    sanitizedThermals = sanitizedThermals.filter(x => x.id !== 'cup_sweat_droplets');
    sanitizedFabrics = sanitizedFabrics.filter(x => x.id !== 'seat_hip_creases');
  }

  // 5. Calculate Realism Coherence Score
  const score = Math.max(65, 100 - deduction);
  const isCoherent = score >= 80;

  // Lighting Profile
  let category: PhysicalRealismReport['lightingProfile']['category'] = 'night';
  let ambientKelvin = '2400K Amber';
  let lightFalloff = 'Natural inverse square law falloff';
  let shadowBehavior = 'Soft directional amber shadow beneath jawline';

  if (lightId === 'direct_flash') {
    category = 'flash';
    ambientKelvin = '5500K Clean White Flash';
    lightFalloff = 'Steep falloff into deep background darkness';
    shadowBehavior = 'Hard micro-shadows directly behind subject contours';
  } else if (lightId === 'harsh_noon' || lightId === 'noon_sun') {
    category = 'daylight';
    ambientKelvin = '5800K Midday Sun';
    lightFalloff = 'Direct vertical unattenuated sunlight';
    shadowBehavior = 'Sharp vertical cast shadows below brow, nose, and chin';
  } else if (lightId === 'golden_hour' || lightId === 'sunset_glow') {
    category = 'golden_hour';
    ambientKelvin = '3200K Golden Warmth';
    lightFalloff = 'Low-angle horizontal warm light penetration';
    shadowBehavior = 'Elongated warm-toned directional side shadows';
  } else if (lightId === 'station_canopy' || lightId === 'station_led' || lightId === 'basement_tubes') {
    category = 'artificial_indoor';
    ambientKelvin = '4500K Industrial Neutral White';
    lightFalloff = 'Broad diffuse overhead flood coverage';
    shadowBehavior = 'Even soft downward gradients';
  }

  const report: PhysicalRealismReport = {
    score,
    isCoherent,
    warnings,
    activeRules,
    lightingProfile: {
      category,
      ambientKelvin,
      lightFalloff,
      shadowBehavior,
    },
    spatialProfile: {
      zone: input.loc.zone,
      subjectDominancePct: 80, // strictly 75-85%
      cameraDistanceCm: isInside ? 65 : 75,
      armPerspective: '24mm equivalent wide smartphone front camera with natural arm extension for ${SUBJECT_HEIGHT_CM}cm frame',
    },
  };


  // Scene intelligence final pass: a single compatibility policy controls both
  // rendered options and persisted/loaded states before prompt assembly.
  const requestedTime = input.timeOfDay ?? 'auto';
  const lightingReason = optionLockReason('lighting', sanitizedLight.id, {
    zone: input.loc.zone, time: requestedTime, lightingId: sanitizedLight.id,
    poseId: sanitizedPose.id, frameId: input.frame.id, clothId: input.cloth.id,
    selectedCabinIds: sanitizedCabins.map(x => x.id),
    selectedAirflowIds: sanitizedAirflows.map(x => x.id),
    selectedErgonomicIds: sanitizedTallErgonomics.map(x => x.id),
  });
  if (lightingReason) {
    const suggestion = analyzeLocationLighting(input.loc.id, requestedTime);
    const substitute = LIGHTING_OPTIONS.find(x => x.id === suggestion.primaryRecommendedLightId);
    if (substitute && !optionLockReason('lighting', substitute.id, {
      zone: input.loc.zone, time: requestedTime, lightingId: substitute.id,
      poseId: sanitizedPose.id, clothId: input.cloth.id,
      selectedAirflowIds: [], selectedErgonomicIds: [],
    })) {
      sanitizedLight = { ...substitute };
      warnings.push({
        id: 'time_lighting_auto_repair', level: 'auto-correction',
        titleAr: 'تصحيح مصدر الإضاءة حسب الوقت', titleEn: 'Time and lighting reconciled',
        descAr: lightingReason, descEn: lightingReason, field: 'light',
      });
    }
  }
  const policyContext = {
    zone: input.loc.zone,
    time: requestedTime,
    lightingId: sanitizedLight.id,
    poseId: sanitizedPose.id,
    frameId: input.frame.id,
    clothId: input.cloth.id,
    selectedCabinIds: sanitizedCabins.map(x => x.id),
    selectedAirflowIds: sanitizedAirflows.map(x => x.id),
    selectedErgonomicIds: sanitizedTallErgonomics.map(x => x.id),
  };
  const gate = (group: import('./optionCompatibility').OptionGroup, items: Opt[]) =>
    items.filter(item => {
      const reason = optionLockReason(group, item.id, policyContext);
      if (reason) warnings.push({
        id: 'policy_' + group + '_' + item.id, level: 'auto-correction',
        titleAr: 'استبعاد خيار غير متوافق', titleEn: 'Incompatible option removed',
        descAr: reason, descEn: reason, field: group,
      });
      return !reason;
    });
  sanitizedCabins = gate('cabins', sanitizedCabins);
  sanitizedCabinArtifacts = gate('cabinArtifacts', sanitizedCabinArtifacts);
  sanitizedClutters = gate('clutters', sanitizedClutters);
  // Limit secondary objects to an incidental few; two distinct items are enough
  // to communicate lived-in clutter without taking attention away from the face.
  if (sanitizedClutters.length > 2) {
    sanitizedClutters = sanitizedClutters.slice(0, 2);
    warnings.push({
      id: 'clutter_visibility_budget', level: 'auto-correction',
      titleAr: 'تخفيف ازدحام المقصورة', titleEn: 'Cabin clutter reduced',
      descAr: 'اقتصر وصف العناصر الثانوية على عنصرين كي لا ينافسا الوجه أو يظهرا قسريًا.',
      descEn: 'Kept at most two incidental cabin objects to preserve face-first framing.',
      field: 'clutters',
    });
  }
  sanitizedDashUis = gate('dashUis', sanitizedDashUis);
  sanitizedAirflows = gate('airflows', sanitizedAirflows);
  sanitizedScreenCasts = gate('screenCasts', sanitizedScreenCasts);
  sanitizedTallErgonomics = gate('tallErgonomics', sanitizedTallErgonomics);
  sanitizedFabrics = gate('fabrics', sanitizedFabrics);
  sanitizedThermals = gate('thermals', sanitizedThermals);
  sanitizedInAppArtifacts = gate('inAppArtifacts', sanitizedInAppArtifacts);
  sanitizedMicroWeathers = gate('microWeather', sanitizedMicroWeathers);
  sanitizedSubsurfaces = gate('subsurfaces', sanitizedSubsurfaces);
  const safeGripMotions = gate('gripMotions', sanitizedGripMotions);

  const sanitized: BuildInput = {
    ...input,
    cabins: sanitizedCabins,
    dashUis: sanitizedDashUis,
    cabinArtifacts: sanitizedCabinArtifacts,
    clutters: sanitizedClutters,
    airflows: sanitizedAirflows,
    tallErgonomics: sanitizedTallErgonomics,
    pose: sanitizedPose,
    subsurfaces: sanitizedSubsurfaces,
    screenCasts: sanitizedScreenCasts,
    light: sanitizedLight,
    thermals: sanitizedThermals,
    microWeathers: sanitizedMicroWeathers,
    inAppArtifacts: sanitizedInAppArtifacts,
    opticals: sanitizedOpticals,
    gripMotions: safeGripMotions,
    anatomicalExpr: sanitizedAnatomicalExpr,
    tint: sanitizedTint,
    skinNuances: sanitizedSkinNuances,
    fabrics: sanitizedFabrics,
    heightCue: isInside ? sanitizedHeightCueForClothing : sanitizedHeightCue,
  };

  return { report, sanitized };
}
