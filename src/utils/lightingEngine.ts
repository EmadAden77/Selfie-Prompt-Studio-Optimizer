import { LIGHTING_OPTIONS, LOCATIONS } from '../data/studioData';

export type TimeOfDay = 'auto' | 'night' | 'sunset' | 'day';

export interface LightRecommendation {
  id: string;
  nameAr: string;
  nameEn: string;
  tag: string;
  badgeColor: string;
  reasonAr: string;
  reasonEn: string;
  kelvin: string;
  lux: 'low' | 'medium' | 'high';
  physicsCuesAr: string;
  physicsCuesEn: string;
}

export interface LocationLightingAnalysis {
  locId: number;
  environmentNameAr: string;
  environmentNameEn: string;
  environmentCategory:
    | 'residential'
    | 'gas_station'
    | 'underground_parking'
    | 'coffee_drive_thru'
    | 'desert_highway'
    | 'mosque_parking'
    | 'car_wash'
    | 'rural_road'
    | 'commercial_strip'
    | 'urban_infrastructure'
    | 'coastal_open';
  primaryRecommendedLightId: string;
  recommendations: LightRecommendation[];
  sensorPhysicsNoteAr: string;
  sensorPhysicsNoteEn: string;
}

/**
 * Intelligent Night Lighting Engine
 * Automatically analyzes physical environment of selected location and computes
 * the 3 most physically plausible lighting configurations with natural light falloff,
 * correct Kelvin color temperature, specular highlights, and real sensor response.
 */
export function analyzeLocationLighting(
  locId: number,
  timeOfDay: TimeOfDay = 'auto'
): LocationLightingAnalysis {
  const loc = LOCATIONS.find(l => l.id === locId) || LOCATIONS[0];
  const isOutside = loc.zone === 'outside';

  // Environment categorization based on location ID
  let category: LocationLightingAnalysis['environmentCategory'] = 'residential';

  // 1. Gas Station
  if (locId === 7 || locId === 29) {
    category = 'gas_station';
  }
  // 2. Underground parking / basement
  else if (locId === 10) {
    category = 'underground_parking';
  }
  // 3. Coffee drive-thru
  else if (locId === 4) {
    category = 'coffee_drive_thru';
  }
  // 4. Car wash
  else if (locId === 9) {
    category = 'car_wash';
  }
  // 5. Desert highway / desert sands / dunes
  else if (locId === 6 || locId === 11 || locId === 18 || locId === 20 || locId === 22 || locId === 23 || locId === 30 || locId === 36) {
    category = 'desert_highway';
  }
  // 6. Mosque parking
  else if (locId === 13) {
    category = 'mosque_parking';
  }
  // 7. Rural agricultural road / palm farms
  else if (locId === 14 || locId === 33) {
    category = 'rural_road';
  }
  // 8. Commercial strip / shops / clinics / inspection
  else if (locId === 8 || locId === 17 || locId === 19 || locId === 27 || locId === 35 || locId === 39) {
    category = 'commercial_strip';
  }
  // 9. Urban infrastructure (flyover / bridge / service road / dead-end)
  else if (locId === 3 || locId === 15 || locId === 16 || locId === 26 || locId === 31 || locId === 40) {
    category = 'urban_infrastructure';
  }
  // 10. Coastal beach
  else if (locId === 38) {
    category = 'coastal_open';
  }
  // Default: Residential street / neighborhood
  else {
    category = 'residential';
  }

  const recommendations: LightRecommendation[] = [];

  switch (category) {
    case 'gas_station':
      recommendations.push(
        {
          id: 'station_canopy',
          nameAr: 'فلورسنت وسقف محطة الوقود الساطع المنتشر من الأعلى',
          nameEn: 'overhead canopy high-CRI white LED floodlights',
          tag: 'الخيار الأنسب للبيئة (Overhead Canopy)',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'إضاءة مضخات الوقود العلوية تغمر أعلى الكادر بضوء أبيض ناصع ذي شدة عالية يبرز ملامح الوجه وأكتاف المرجع مع انعكاسات ناعمة على كبوت وزجاج السيارة.',
          reasonEn: 'Intense overhead LED canopy lights wash down directly, creating crisp skin highlights and realistic hood reflections without harsh flash dropoff.',
          kelvin: '5000K–5500K (أبيض نقي ناصع)',
          lux: 'high',
          physicsCuesAr: 'انعكاس متطاول على زجاج النافذة وزوايا الأكتاف العريضة مع ظل طبيعي خافت تحت الذقن.',
          physicsCuesEn: 'diffuse overhead canopy highlights on broad shoulders and hair, natural soft chin occlusion'
        },
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'contemporary municipal cold white LED streetlights',
          tag: 'خيار واقعي جانبي',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'تحاكي أعمدة الإنارة المحيطة بالمحطة والمداخل بضوء أبيض متوازن وزاوية جانبية 45 درجة.',
          reasonEn: 'Simulates peripheral perimeter poles illuminating side entry lanes with neutral white balance.',
          kelvin: '4500K (أبيض متوازن)',
          lux: 'medium',
          physicsCuesAr: 'تدرج ضوئي مائل من جانب الكادر مع انحسار واقعي باتجاه خلفية المقصورة أو الرصيف.',
          physicsCuesEn: 'directional 45-degree key light with natural distance decay'
        },
        {
          id: 'direct_flash',
          nameAr: 'فلاش الهاتف المباشر في مكان معتم',
          nameEn: 'raw direct smartphone flash',
          tag: 'لقطة سيلفي عفوية سريعة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'فلاش عدسة الهاتف المباشر يعكس لمعة طبيعية فورية على ملامح الوجه والشارب مع عتمة تدريجية في محيط المحطة خلف الشخص.',
          reasonEn: 'On-axis flash delivers instantaneous facial illumination with specular skin sheen and rapid background falloff.',
          kelvin: '6000K (فلاش أزرق خفيف)',
          lux: 'high',
          physicsCuesAr: 'وهج فلاش مركزي على تفاصيل البشرة الحقيقية وانخفاض تدريجي ملحوظ للإضاءة في العمق (Inverse Square Law).',
          physicsCuesEn: 'sharp high-contrast selfie flash with inverse-square light decay into pump background'
        }
      );
      break;

    case 'underground_parking':
      recommendations.push(
        {
          id: 'basement_tubes',
          nameAr: 'أنابيب فلورسنت بيضاء طويلة في قبو مواقف مغلق',
          nameEn: 'industrial dual white fluorescent ceiling strip tubes',
          tag: 'الخيار القياسي للأقبية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'أنابيب السقف الفلورسنت المتوازية في القبو السكني تمنح إضاءة نيون طولية مميزة وانعكاسات خطية بيضاء على زجاج ومعدن السيارة.',
          reasonEn: 'Parallel linear ceiling fluorescent fixtures cast distinct tubular reflections across car roof and realistic ambient fill.',
          kelvin: '4000K–5000K (فلورسنت مكتبي/قبو)',
          lux: 'medium',
          physicsCuesAr: 'انعكاس شريطي طولي على السقف وزجاج السائق مع نويز رقمي خفيف في الزوايا المعتمة.',
          physicsCuesEn: 'linear specular strip highlights across vehicle pillars, clean low-lux cabin ambience'
        },
        {
          id: 'dash_screens_glow',
          nameAr: 'وهج شاشات المقصورة والكونسول الملون في عتمة الليل',
          nameEn: 'ambient digital cluster & infotainment screen glow',
          tag: 'أجواء عفوية عميقة داخل القبو',
          badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
          reasonAr: 'في أركان القبو المعتمة، يبرز وهج شاشة العدادات والملاحة بلون سماوي ناعم ينعكس على جانب الفك واليد الممسكة بالهاتف.',
          reasonEn: 'In dim subterranean corners, dashboard display glow casts soft cyan-blue fill onto jawline and phone grip.',
          kelvin: '6500K (شاشات LED زرقاء)',
          lux: 'low',
          physicsCuesAr: 'إضاءة محيطية باردة ناعمة من أسفل الكادر مع بقاء مسام الجلد وشعر اللحية واضحاً.',
          physicsCuesEn: 'upward subtle display cast onto lower face with authentic ISO grain in shadow recesses'
        },
        {
          id: 'direct_flash',
          nameAr: 'فلاش الهاتف المباشر في مكان معتم',
          nameEn: 'raw smartphone flash in dim garage',
          tag: 'سيلفي توثيقي مباشر',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'فلاش سيلفي حقيقي يبرز ملامح المرجع كاملة ويجعل أعمدة القبو وأرقام المواقف في الخلفية باهتة العتمة بشكل طبيعي.',
          reasonEn: 'Direct camera flash isolates subject with authentic specular cheek reflections against darkened concrete columns.',
          kelvin: '6000K (فلاش هاتف)',
          lux: 'high',
          physicsCuesAr: 'حدة عالية في ملامح الوجه ولون التيشيرت الأسود مع تلاشي سريع للضوء عند أعمدة المواقف الخلفية.',
          physicsCuesEn: 'direct light striking 193cm frame, rapid shadow cutoff on rear concrete walls'
        }
      );
      break;

    case 'coffee_drive_thru':
      recommendations.push(
        {
          id: 'ambient_drive_thru',
          nameAr: 'أضواء لوحة طلبات الدرايف ثرو المضيئة المتوهجة على جانب الوجه',
          nameEn: 'backlit drive-thru menu board glow',
          tag: 'إضاءة مسار الكافيه المميزة',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'لوحة الطلبات المضيئة والنافذة ترسلان توهجاً ضوئياً دافئاً مائلاً على جهة السائق، يحاكي أجواء انتظار القهوة اليومية بدقة فائقة.',
          reasonEn: 'Illuminated order kiosk and service window cast soft asymmetric warm signage glow across driver profile.',
          kelvin: '3500K–4200K (وهج إعلاني دافئ)',
          lux: 'medium',
          physicsCuesAr: 'إضاءة جانبية درامية ناعمة (Split Key) تعكس لمحة عفوية على تفاصيل اللحية وكتف التيشيرت الأسود.',
          physicsCuesEn: 'soft directional side key light with warm falloff across beard cheekline and car window sill'
        },
        {
          id: 'sodium_street',
          nameAr: 'أعمدة إنارة الشوارع الصوديوم الكلاسيكية (إضاءة صفراء دافئة)',
          nameEn: 'warm ambient sodium streetlight overhead',
          tag: 'إنارة شارع خارجية محيطة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'تختلط إنارة الشارع الصفراء المحيطة بالمسار لتمنح عمقاً واقعياً للقطة دون مبالغة بصرية.',
          reasonEn: 'Blends warm commercial ambient roadway tone over vehicle roof and hood.',
          kelvin: '2200K (صوديوم عنبري)',
          lux: 'medium',
          physicsCuesAr: 'دفء عنبري على شعر الرأس الطبيعي وتفاصيل مسند الرأس خلف الرقبة.',
          physicsCuesEn: 'golden-amber edge rim along signature hair strands and headrest contour'
        },
        {
          id: 'dash_screens_glow',
          nameAr: 'وهج شاشات المقصورة والكونسول الملون في عتمة الليل',
          nameEn: 'subtle dashboard & cup holder LED glow',
          tag: 'تناغم داخلي مقصورة',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'يعزز واقعية مشهد السائق الممسك بكوب القهوة مع انعكاس رقيق لأنوار شاشة الطبلون المزدوجة.',
          reasonEn: 'Complements the relaxed coffee-stop narrative with authentic console screen rim light.',
          kelvin: '6000K',
          lux: 'low',
          physicsCuesAr: 'تفاعل ضوئي خافت مع كوب القهوة وأطراف الأصابع الطويلة على الدركسون.',
          physicsCuesEn: 'subtle cabin ambient bounce with natural condensation droplets on cold coffee cup'
        }
      );
      break;

    case 'desert_highway':
      recommendations.push(
        {
          id: 'headlights_bounce',
          nameAr: 'أضواء سيارة قادمة من بعيد ترتد بنعومة عبر الزجاج',
          nameEn: 'distant oncoming vehicle headlights wash',
          tag: 'أفضل إضاءة ليلية صحراوية واقعية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'في ظلام الطرق الصحراوية والنفود، الضوء الحقيقي الوحيد الممكن هو ارتداد أضواء السيارات العابرة على جانب المركبة أو كشافاتها، مما يمنع اختراع ضوء استوديو خيالي.',
          reasonEn: 'In dark desert terrain, ambient light is sparse; distant automotive headlight beam creates authentic believable glancing light.',
          kelvin: '4200K–5000K (زينون/هالوجين مائل)',
          lux: 'low',
          physicsCuesAr: 'حزمة ضوئية مائلة ناعمة عبر الزجاج مع عتمة ليلية حقيقية ونويز مستشعر كاميرا الهاتف العفوي.',
          physicsCuesEn: 'directional beam slice cutting across shoulder, authentic smartphone low-light ISO texture'
        },
        {
          id: 'direct_flash',
          nameAr: 'فلاش الهاتف المباشر في مكان معتم',
          nameEn: 'direct smartphone flash in open desert night',
          tag: 'سيلفي كشتة/طريق معتم',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'فلاش السيلفي المباشر يضيء وجه المرجع وأكتافه العريضة بنسبة 100% مع غرق رمال النفود أو سواد الطريق السريع في خلفية طبيعية غير متكلفة.',
          reasonEn: 'Direct phone flash sharply illuminates subject while allowing vast desert darkness to fall off naturally.',
          kelvin: '6000K (فلاش هاتف ساطع)',
          lux: 'high',
          physicsCuesAr: 'إبراز دقيق لملامح عظام الفك والشعر المبعثر بعفوية وتراجع الضوء الفوري بعد مترين.',
          physicsCuesEn: 'crisp frontal facial fidelity with dramatic rapid light falloff beyond two meters'
        },
        {
          id: 'golden_hour',
          nameAr: 'الساعة الذهبية (أشعة شمس برتقالية دافئة مائلة)',
          nameEn: 'low-angle desert golden hour sunlight',
          tag: 'خيار الغروب الصحراوي الخلاب',
          badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          reasonAr: 'إذا كانت اللقطة في وقت الغروب في النفود، تمنح أشعة الشمس الذهبية المنخفضة دفئاً خلاباً على بشرة المرجع الحنطية بدون أي اصطناع.',
          reasonEn: 'Low desert sun casts horizontal amber glow across jawline, cheekbones, and distant sand dunes.',
          kelvin: '2800K–3200K (ذهبي دافئ غامر)',
          lux: 'high',
          physicsCuesAr: 'ظلال طويلة مائلة ولمعة ذهبية دافئة على خط الشعر والكتفين العريضين.',
          physicsCuesEn: 'long horizontal shadows, warm specular rim highlights across natural skin texture'
        }
      );
      break;

    case 'mosque_parking':
      recommendations.push(
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'crisp municipal LED courtyard floodlights',
          tag: 'الإنارة الأكثر شيوعاً لمواقف المساجد',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'أعمدة إنارة مواقف المسجد الحديثة توفر إضاءة علوية بيضاء نقية تتخلل أوراق أشجار النيم المحيطة وتلقي ظلالاً رقيقة متكسرة على السيارة والوجه.',
          reasonEn: 'Clean high-pole LED lights filter through neem trees, casting gentle dappled ambient light across vehicle and subject.',
          kelvin: '4500K–5000K (أبيض نقي هادئ)',
          lux: 'medium',
          physicsCuesAr: 'توزيع ضوئي علوي هادئ مع تفاصيل واضحة لثوب أو تيشيرت المرجع وتجاعيد القماش الطبيعية.',
          physicsCuesEn: 'soft overhead ambient distribution with natural cloth drape shadows and clean cheekline definition'
        },
        {
          id: 'sodium_street',
          nameAr: 'أعمدة إنارة الشوارع الصوديوم الكلاسيكية (إضاءة صفراء دافئة)',
          nameEn: 'warm sodium streetlights along mosque perimeter',
          tag: 'أجواء صلاة العشاء الهادئة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'إنارة الشوارع المحيطة بأسوار المسجد تضفي جواً دافئاً مريحاً يعكس سكينة وقت ما بعد الصلاة.',
          reasonEn: 'Warm sodium glow from peripheral neighborhood lamps complements the serene evening prayer mood.',
          kelvin: '2200K (صوديوم عنبري دافئ)',
          lux: 'medium',
          physicsCuesAr: 'لون عنبري هادئ مع انعكاس لطيف على زجاج النافذة الجانبي.',
          physicsCuesEn: 'golden amber side warmth with subtle glass refraction'
        },
        {
          id: 'soft_morning',
          nameAr: 'صباح باكر بضوء ناعم نقي ومنعش بدون تباين حاد',
          nameEn: 'fresh dawn morning light after Fajr prayer',
          tag: 'خيار الفجر والصباح الباكر',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'يحاكي خروج المرجع بعد صلاة الفجر بضوء صباحي هادئ منعش وتباين منخفض يحافظ على ملامح العينين والابتسامة الدافئة.',
          reasonEn: 'Simulates quiet post-dawn atmosphere with ultra-soft diffuse fill and pure natural facial skin tones.',
          kelvin: '5200K (ضوء صباحي نقي)',
          lux: 'medium',
          physicsCuesAr: 'نعومة كاملة في الظلال بدون حدة فلاش أو عتمة شديدة مع تدرج لوني طبيعي.',
          physicsCuesEn: 'zero harsh shadows, soft wraparound facial daylight, authentic morning clarity'
        }
      );
      break;

    case 'car_wash':
      recommendations.push(
        {
          id: 'station_canopy',
          nameAr: 'فلورسنت وسقف محطة الوقود الساطع المنتشر من الأعلى',
          nameEn: 'overhead industrial car wash fluorescent canopy fixtures',
          tag: 'إنارة مغاسل السيارات الساطعة',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'كشافات السقف الصناعية للمغسلة تلقي ضوءاً علوياً ساطعاً ينعكس على أرضية الإسمنت المبللة وجسم السيارة النظيف بعد الغسيل.',
          reasonEn: 'Overhead utilitarian fixtures reflect intensely off damp concrete floor and newly washed vehicle bodywork.',
          kelvin: '5000K (أبيض ناصع)',
          lux: 'high',
          physicsCuesAr: 'انعكاسات مائية رطبة على كبوت السيارة مع لمعان ضوئي حقيقي ونظيف على بشرة الوجه.',
          physicsCuesEn: 'crisp wet specular bounce from wet pavement and gloss car finish onto subject contours'
        },
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'white commercial perimeter LED lights',
          tag: 'إنارة الساحة الخارجية للمغسلة',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'توزيع ضوئي محايد يظهر تفاصيل السيارة وتصفيف الشعر العفوي بعد انتهاء الغسيل.',
          reasonEn: 'Balanced perimeter lighting revealing clean vehicular gloss and relaxed post-wash posture.',
          kelvin: '4500K',
          lux: 'medium',
          physicsCuesAr: 'إضاءة محايدة متوازنة تُبرز قوام القامة الفارهة (193 سم) وتناسق الأكتاف العريضة.',
          physicsCuesEn: 'clean full-spectrum neutral illumination across 193cm physique and broad shoulders'
        },
        {
          id: 'direct_flash',
          nameAr: 'فلاش الهاتف المباشر في مكان معتم',
          nameEn: 'direct smartphone flash with water droplets bounce',
          tag: 'سيلفي توثيق نظافة السيارة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'فلاش مباشر يُظهر بريق قطرات الماء العفوية ولمعان السيارة مع ثبات ملامح الوجه ولون التيشيرت الأسود الفحمي.',
          reasonEn: 'Flash catches authentic water micro-droplets and gives crisp focus to charcoal black shirt and facial features.',
          kelvin: '6000K',
          lux: 'high',
          physicsCuesAr: 'بريق فلاش ساطع على قطرات الماء وزجاج السيارة مع بقاء المرجع مسيطراً على 80% من الكادر.',
          physicsCuesEn: 'specular water bead reflections, subject strictly dominating 80% frame'
        }
      );
      break;

    case 'rural_road':
      recommendations.push(
        {
          id: 'single_distant_lamp',
          nameAr: 'مصباح جداري وحيد خافت على بعد أمتار في ليل ساكن',
          nameEn: 'faint solitary exterior incandescent farm lamp',
          tag: 'الإنارة الطبيعية للمزارع والاستراحات',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'مصباح سور المزرعة المتدلي الخافت يوفر إضاءة دافئة غير متناظرة تحاكي الأجواء الريفية الهادئة بدون أي ضوء استوديو مصطنع.',
          reasonEn: 'Single rural wall sconce emits authentic dim incandescent warmth with dramatic gentle falloff.',
          kelvin: '2700K (تنجستن دافئ)',
          lux: 'low',
          physicsCuesAr: 'تدرج ضوئي مائل من جهة واحدة وظلال ناعمة عميقة في الجانب الآخر تضفي واقعية تصويرية.',
          physicsCuesEn: 'asymmetric directional key light with rich natural shadows and authentic dark rural background'
        },
        {
          id: 'headlights_bounce',
          nameAr: 'أضواء سيارة قادمة من بعيد ترتد بنعومة عبر الزجاج',
          nameEn: 'indirect vehicle headlight bounce across palm trunks',
          tag: 'إنارة متحركة واقعية في الظلام',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'أضواء سيارة أخرى عابرة في المسار الزراعي الضيق ترتد بنعومة على المرجع وسور النخيل.',
          reasonEn: 'Passing car headlights provide believable fleeting illumination cutting through dark palm trunks.',
          kelvin: '4200K',
          lux: 'low',
          physicsCuesAr: 'حزمة ضوء أرضية مائلة تبرز أطراف الثوب أو التيشيرت الأسود وعظام الفك.',
          physicsCuesEn: 'low grazing angle light tracing jawline and natural cotton fabric drape'
        },
        {
          id: 'golden_hour',
          nameAr: 'الساعة الذهبية (أشعة شمس برتقالية دافئة مائلة)',
          nameEn: 'golden hour sunset through palm fronds',
          tag: 'أفضل وقت نهاري للمزارع الريفية',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'أشعة شمس الغروب المتخللة لسعف النخيل في المزرعة تمنح تفاصيل ساحرة وإشراقة عيون هادئة ودافئة.',
          reasonEn: 'Golden rays filtering through date palm leaves cast beautiful organic light patterns across facial features.',
          kelvin: '3000K (ذهبي دافئ غامر)',
          lux: 'high',
          physicsCuesAr: 'خيوط شمسية برتقالية ناعمة مع انعكاس دافئ على العينين والشارب المتصل.',
          physicsCuesEn: 'warm organic rim lighting on hair texture and authentic amber catchlight in eyes'
        }
      );
      break;

    case 'commercial_strip':
      recommendations.push(
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'contemporary commercial street LED illumination',
          tag: 'الإنارة الأساسية للشوارع التجارية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'أعمدة الإنارة المرتفعة على طول الشارع التجاري تمنح توزيعاً ضوئياً واسعاً وواضحاً يُظهر تفاصيل المرجع والسيارة باحترافية.',
          reasonEn: 'High municipal LED luminaires create broad, reliable coverage along commercial strips with neutral color rendition.',
          kelvin: '4500K–5000K (أبيض تجاري نقي)',
          lux: 'high',
          physicsCuesAr: 'إضاءة محيطية عالية توفر وضوحاً كاملاً لمسام البشرة وشعر اللحية الطبيعي دون تشويش بصري.',
          physicsCuesEn: 'clean high-CRI fill revealing authentic skin texture, facial contours, and natural beard hair strands'
        },
        {
          id: 'sodium_street',
          nameAr: 'أعمدة إنارة الشوارع الصوديوم الكلاسيكية (إضاءة صفراء دافئة)',
          nameEn: 'vintage sodium streetlamps along shopfronts',
          tag: 'أجواء الشوارع التقليدية الدافئة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'تضفي ألوان الصوديوم الصفراء الكلاسيكية طابعاً أصيلاً مألوفاً للشوارع المحلية مع وهج ناعم على كبوت السيارة.',
          reasonEn: 'Classic amber-orange glow brings a familiar local nighttime warmth with soft hood highlights.',
          kelvin: '2200K (عنبري دافئ)',
          lux: 'medium',
          physicsCuesAr: 'انعكاس عنبري متناسق على زوايا الكتف العريض ومرآة السيارة الجانبية.',
          physicsCuesEn: 'warm monochromatic side wash with authentic soft shadow gradients'
        },
        {
          id: 'single_distant_lamp',
          nameAr: 'مصباح جداري وحيد خافت على بعد أمتار في ليل ساكن',
          nameEn: 'shopfront canopy or pharmacy entrance lamp',
          tag: 'إضاءة واجهات المحلات الليلية',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'يحاكي وقوف السيارة أمام بقالة أو صيدلية مضاءة بإنارة مدخل دافئة تركز الضوء على مقدمة الكادر.',
          reasonEn: 'Simulates parked position near neighborhood grocery or pharmacy entrance with directional store light.',
          kelvin: '3200K',
          lux: 'medium',
          physicsCuesAr: 'ضوء غير متناظر يُعطي عمقاً طبيعياً ثلاثي الأبعاد لملامح الوجه والأنف والفك.',
          physicsCuesEn: 'asymmetric shopfront spill providing 3D depth to facial features and collarbone'
        }
      );
      break;

    case 'urban_infrastructure':
      recommendations.push(
        {
          id: 'tunnel_tungsten',
          nameAr: 'إضاءة نفق صفراء تنجستن دائرية متكررة',
          nameEn: 'highway flyover underpass tungsten & amber utility lights',
          tag: 'الخيار الأنسب للجسور والأنفاق',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'الوقوف تحت كوبري خرساني ضخم أو نفق يتميز بمصابيح تنجستن صناعية قوية مثبتة في السقف الخرساني تلقي ضوءاً دافئاً حاداً وظلالاً معمارية.',
          reasonEn: 'Underpass ceiling-mounted fixtures cast distinct warm overhead industrial light contrasting with massive concrete columns.',
          kelvin: '3000K–3500K (تنجستن صناعي دافئ)',
          lux: 'medium',
          physicsCuesAr: 'ظلال معمارية علوية حادة تحت السقف الخرساني مع انعكاسات قوية على سطح سقف السيارة.',
          physicsCuesEn: 'distinct angular overhead shadow cast beneath concrete soffit with crisp vehicle roof sheen'
        },
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'highway service road modern LED luminaires',
          tag: 'إنارة الطرق السريعة المعاصرة',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'أعمدة الإنارة الممتدة على طول مسار الخدمة بمحاذاة الطريق السريع تمنح ضوءاً أبيض بارداً متصلاً يحاكي نبض الحركة الحضرية.',
          reasonEn: 'Continuous LED highway lighting provides cold neutral illumination along outer express service lanes.',
          kelvin: '5000K (أبيض بارد)',
          lux: 'high',
          physicsCuesAr: 'انعكاسات أفقية مستمرة على خطوط هيكل السيارة وكتف التيشيرت الأسود.',
          physicsCuesEn: 'elongated horizon specular reflections along car shoulder creases'
        },
        {
          id: 'headlights_bounce',
          nameAr: 'أضواء سيارة قادمة من بعيد ترتد بنعومة عبر الزجاج',
          nameEn: 'passing vehicle headlight sweeps',
          tag: 'حركة مرورية حقيقية',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'حركة السيارات المارة على الطريق السريع أو تحت الجسر ترسل ومضات ضوئية متحركة وواقعية جداً على زجاج الكابينة.',
          reasonEn: 'Dynamic passing headlights generate realistic transient reflections cutting across glass and driver side.',
          kelvin: '4200K',
          lux: 'medium',
          physicsCuesAr: 'تأثير إضاءة ديناميكي عابر مع بقاء ملامح الوجه ثابتة بنسبة 100%.',
          physicsCuesEn: 'transient glancing vehicle beam with stable facial identity preservation'
        }
      );
      break;

    case 'coastal_open':
      recommendations.push(
        {
          id: 'sunset_glow',
          nameAr: 'وهج مغرب قرمزي وبرتقالي غامق يلف الأفق والوجه',
          nameEn: 'dramatic coastal dusk crimson-orange horizon afterglow',
          tag: 'أفضل إضاءة شاطئية وبحرية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'وهج ما بعد الغروب على الشاطئ يعكس درجات قرمذية وبرتقالية ساحرة ترتد من مياه البحر والرمل المبلل على بشرة المرجع بلطف.',
          reasonEn: 'Post-sunset oceanic horizon casts deep warm crimson hues reflecting softly off hard-packed wet sand.',
          kelvin: '2400K–2800K (غروب قرمزي عميق)',
          lux: 'medium',
          physicsCuesAr: 'ارتداد ضوئي ناعم من رمال الشاطئ الرطبة إلى أسفل الفك والرقبة مع سماء ملونة في الخلفية.',
          physicsCuesEn: 'warm ground bounce from wet sand onto jawline with subtle maritime horizon gradient'
        },
        {
          id: 'golden_hour',
          nameAr: 'الساعة الذهبية (أشعة شمس برتقالية دافئة مائلة)',
          nameEn: 'low maritime golden hour sun over water',
          tag: 'الشمس الذهبية المائلة قبل الغروب',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'أشعة شمس الساحل الذهبية المائلة تعطي لمعاناً دافئاً غنياً لشعر ولحية المرجع وتفاصيل السيارة.',
          reasonEn: 'Low seaside sun delivers horizontal amber highlights across broad shoulders and facial bone structure.',
          kelvin: '3200K',
          lux: 'high',
          physicsCuesAr: 'إشراقة عنبرية متوهجة في العينين وخط اللحية دون أي حروق ضوئية في المستشعر.',
          physicsCuesEn: 'horizontal amber rim on hair strands, natural catchlight in eyes without clipped highlights'
        },
        {
          id: 'blue_hour',
          nameAr: 'الساعة الزرقاء الباردة بعد الغروب مباشرة',
          nameEn: 'cinematic seaside blue hour ambient twilight',
          tag: 'أجواء ليلية بحرية باردة',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'الساعة الزرقاء على الشاطئ تضفي طابعاً سينمائياً هادئاً بضوء سماوي بارد وظلال متدرجة ناعمة تحاكي هواء البحر العليل.',
          reasonEn: 'Deep cyan twilight envelops the beach with serene cinematic tones and minimal shadow contrast.',
          kelvin: '7500K (أزرق سماوي بارد)',
          lux: 'low',
          physicsCuesAr: 'تدرج سماوي ناعم في الظلال مع نويز هاتف طبيعي يحافظ على نقاء البشرة الحنطية.',
          physicsCuesEn: 'gentle cyan ambient fill with authentic smartphone twilight grain'
        }
      );
      break;

    case 'residential':
    default:
      recommendations.push(
        {
          id: 'sodium_street',
          nameAr: 'أعمدة إنارة الشوارع الصوديوم الكلاسيكية (إضاءة صفراء برتقالية دافئة)',
          nameEn: 'warm amber-orange high-pressure sodium streetlights',
          tag: 'الخيار الكلاسيكي الأوثق للأحياء السكنية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          reasonAr: 'أعمدة إنارة الصوديوم التقليدية هي الإضاءة الأكثر واقعية وأصالة داخل الأحياء السكنية، تلقي وهجاً برتقالياً دافئاً بزاوية 45 درجة من الأعلى وتنعكس على كبوت السيارة وجانب الوجه بدفء مألوف.',
          reasonEn: 'High-pressure sodium lighting is the iconic, authentic residential street signature; casts overhead 45-degree warm amber glow with rich skin warmth.',
          kelvin: '2200K (صوديوم عنبري دافئ)',
          lux: 'medium',
          physicsCuesAr: 'وهج عنبري ناعم يبرز خط الفك والشعر المصفف بعفوية مع ظل طبيعي خافت تحت الأنف والذقن.',
          physicsCuesEn: 'warm amber wash across 193cm frame, natural 45-degree facial shadow, authentic neighborhood night ambience'
        },
        {
          id: 'led_modern_street',
          nameAr: 'أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)',
          nameEn: 'contemporary municipal cool-white LED streetlights',
          tag: 'إنارة الأحياء السكنية الحديثة',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          reasonAr: 'تحاكي أعمدة الإنارة البلدية البيضاء الجديدة المركبة في المخططات والأحياء الحديثة، وتمنح ضوءاً نقياً محايداً يُظهر تفاصيل المرجع بوضوح فائق.',
          reasonEn: 'Modern residential LED fixtures deliver clean neutral illumination with high color fidelity for natural skin and clothing tones.',
          kelvin: '4500K–5000K (أبيض نقي متوازن)',
          lux: 'medium',
          physicsCuesAr: 'توزيع ضوئي متوازن ومحايد يبرز ملامح عظام الوجه وتفاصيل التيشيرت الأسود الفحمي.',
          physicsCuesEn: 'clean neutral key light revealing facial anatomy, hair texture, and charcoal crewneck fabric'
        },
        {
          id: 'single_distant_lamp',
          nameAr: 'مصباح جداري وحيد خافت على بعد أمتار في ليل ساكن',
          nameEn: 'soft residential villa exterior wall or porch sconce',
          tag: 'إضاءة أسوار الفلل الهادئة',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          reasonAr: 'مصباح سور فيلا أو كراج جانبي خافت يلقي إضاءة جانبية حميمية وغير متكلفة تتناغم مع هدوء الشارع السكني.',
          reasonEn: 'Solitary villa perimeter sconce provides realistic asymmetric side light fitting the quiet residential street setting.',
          kelvin: '2800K (تنجستن دافئ)',
          lux: 'low',
          physicsCuesAr: 'إضاءة جانبية لطيفة مع تلاشي طبيعي سريع يحافظ على عفوية لقطة السيلفي الليلية.',
          physicsCuesEn: 'gentle asymmetric side lighting with authentic low-light phone sensor texture'
        }
      );
      break;
  }

  const primaryRecommendedLightId = recommendations[0]?.id || 'sodium_street';

  const sensorPhysicsNoteAr = isOutside
    ? 'اللقطة خارج السيارة: يعتمد المستشعر على الإضاءة المحيطة المباشرة بارتفاع زاوية السيلفي الممسوكة باليد (Handheld Perspective) مع تراجع واقعي للضوء في الخلفية وفق قانون التربيع العكسي الفيزيائي وتجنب أي ضوء استوديو صناعي.'
    : 'اللقطة داخل المقصورة: يتفاعل الضوء الخارجي مع زجاج النوافذ والتظليل مع ارتدادات رقيقة من شاشات الطبلون، محققاً عمقاً بصرياً واقعياً دون أي ضوء خيالي مفرط.';

  const sensorPhysicsNoteEn = isOutside
    ? 'Exterior handheld smartphone capture: physical inverse-square light decay, authentic specular skin reflections, and natural street ambience with no artificial studio illumination.'
    : 'Interior cabin selfie: authentic light refraction through tinted glass with subtle bounce from dashboard displays, strictly preventing impossible bright interior moonlight.';

  return {
    locId,
    environmentNameAr: loc.ar,
    environmentNameEn: loc.en,
    environmentCategory: category,
    primaryRecommendedLightId,
    recommendations,
    sensorPhysicsNoteAr,
    sensorPhysicsNoteEn,
  };
}
