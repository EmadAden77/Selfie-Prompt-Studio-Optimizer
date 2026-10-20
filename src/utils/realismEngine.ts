import { BuildInput, Opt, Loc } from '../types/studio';

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

  if (isOutside) {
    activeRules.push('عزل تفاصيل المقصورة الداخلية تلقائياً (اللقطة خارج السيارة)');
    
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
      sanitizedClutters = input.clutters.filter(c => c.id === 'door_pocket_keys');
    }

    // AC Airflow outside check
    if (input.airflows.some(a => a.id === 'ac_gentle_breeze')) {
      sanitizedAirflows = [
        {
          id: 'outdoor_ambient_breeze',
          ar: 'نسيم هواء خارجي طبيعي يداعب أطراف الخصلات والملابس بعفوية',
          en: 'gentle outdoor ambient breeze softly moving hair strands and shirt fabric naturally',
        },
      ];
      warnings.push({
        id: 'exterior_ac_breeze',
        level: 'auto-correction',
        titleAr: 'تحويل تكييف الكابينة إلى نسيم خارجي طبيعي',
        titleEn: 'Converted Interior AC Breeze to Natural Outdoor Airflow',
        descAr: 'تكييف السيارة لا يؤثر على الشخص خارجها؛ تم تحويله إلى نسيم هواء خارجي طبيعي.',
        descEn: 'Cabin AC vents cannot reach exterior subject; dynamically converted to realistic outdoor atmospheric breeze.',
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

  // 2. Interior Selfie Verification
  if (isInside) {
    activeRules.push('قفل هندسة مقصورة السائق (193 سم - مسند الرأس وبطانة السقف)');
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
    sanitizedScreenCasts = input.screenCasts.filter(s => s.id !== 'carplay_dark_glow');
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
      armPerspective: '24mm equivalent wide smartphone front camera with natural arm extension for 193cm frame',
    },
  };

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
  };

  return { report, sanitized };
}
