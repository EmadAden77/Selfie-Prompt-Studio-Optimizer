import { Loc, Opt, Cloth, PresetMood, BuildInput, SUBJECT_HEIGHT_CM, SUBJECT_WEIGHT_KG } from '../types/studio';

/* =================== 60 مكاناً سعودياً عفوياً (بدون معالم وبدون ربط بالإضاءة) =================== */
export const LOCATIONS: Loc[] = [
  // 🚗 داخل مقصورة السيارة (20 مكاناً)
  { id: 1, zone: "inside", ar: "مواقف سكنية مظللة بشنابر خرسانية ومظلات قماشية", en: "shaded residential carport with concrete pillars and standard cloth canopy" },
  { id: 2, zone: "inside", ar: "شارع فرعي هادئ داخل حي سكني أمام سور فيلا بيج عادي", en: "quiet residential side street parked beside an ordinary beige villa boundary wall" },
  { id: 3, zone: "inside", ar: "مسار خدمة بطيء بمحاذاة طريق سريع مفتوح بدون مبانٍ", en: "slow service road lane running parallel to an open highway without buildings" },
  { id: 4, zone: "inside", ar: "مسار سيارات (درايف ثرو) ضيق لمقهى محلي بسيط", en: "narrow drive-thru order lane of a simple local coffee kiosk" },
  { id: 5, zone: "inside", ar: "مواقف مكشوفة أمام مجمع سكني بسيط بأرصفة متبادلة", en: "open parking lot in front of an ordinary residential complex with interlocking curb pavers" },
  { id: 6, zone: "inside", ar: "مواقف رملية ترابية شاسعة مفتوحة خلف مخطط سكني جديد", en: "wide open dirt gravel lot behind a newly zoned residential development" },
  { id: 7, zone: "inside", ar: "داخل مسار محطة وقود عادية بين مضخات التعبئة", en: "inside a standard highway fuel station lane positioned between pump islands" },
  { id: 8, zone: "inside", ar: "شارع تجاري محلي بسيط أمام واجهات محلات وبقالة بدون لوحات بارزة", en: "local community strip in front of ordinary shopfronts and a small neighborhood grocery" },
  { id: 9, zone: "inside", ar: "مواقف مغسلة سيارات يدوية بأرضية مبللة بالإسمنت", en: "manual car wash bay parking with concrete floor" },
  { id: 10, zone: "inside", ar: "مواقف سفلية (قبو سرداب) لمبنى سكني بأعمدة مرقمة", en: "underground basement parking lot of an apartment building with numbered pillars" },
  { id: 11, zone: "inside", ar: "مسار كتف الطريق الصحراوي الممهد بمحاذاة خط السفر", en: "paved desert highway shoulder shoulder stop off an open intercity route" },
  { id: 12, zone: "inside", ar: "شارع قديم بجدران ستوكو عادية وأسلاك علوية متدلية", en: "older neighborhood residential street with textured stucco walls and overhead cables" },
  { id: 13, zone: "inside", ar: "مواقف مسجد حي هادئ محاط بأشجار النيم والكونوكاربس", en: "quiet local neighborhood mosque parking surrounded by neem and trimmed hedge trees" },
  { id: 14, zone: "inside", ar: "طريق زراعي فرعي ضيق محاط بأسوار مزارع نخيل قديمة", en: "narrow rural agricultural side lane bordered by old private palm farm fences" },
  { id: 15, zone: "inside", ar: "مواقف مجمع دوائر حكومية بسيط بأعمدة مظلات حديدية كيربي", en: "plain public service branch parking lot with corrugated steel sheet canopies" },
  { id: 16, zone: "inside", ar: "مسار دائري هادئ في نهاية شارع مسدود (Cul-de-sac) داخل حي راقٍ", en: "quiet turnaround circle at the end of a dead-end street in a residential district" },
  { id: 17, zone: "inside", ar: "مواقف محطة فحص دوري أو منطقة صناعية خفيفة خالية", en: "empty asphalt yard near light vehicle inspection workshops" },
  { id: 18, zone: "inside", ar: "طريق صخري جبلي غير ممهد ومفتوح الأفق", en: "unpaved rocky plateau trail with distant open horizon" },
  { id: 19, zone: "inside", ar: "مواقف مجمع عيادات أو صيدلية عادية على زاوية شارع", en: "ordinary street-corner parking lot outside a local neighborhood clinic and pharmacy" },
  { id: 20, zone: "inside", ar: "طريق ردمية ترابي ناعم يتوغل بين نفود رملية خفيفة", en: "smooth compacted dirt desert trail cutting through low sand dunes" },

  // 🚶‍♂️ خارج السيارة بجانبها أو متكئاً عليها (20 مكاناً)
  { id: 21, zone: "outside", ar: "واقف بجانب باب السائق في شارع سكني هادئ بأرصفة متداخلة", en: "standing beside driver door on an ordinary quiet residential street with paver sidewalks" },
  { id: 22, zone: "outside", ar: "متكئ على رفرف أو كبوت السيارة في ساحة نفود رملية مفتوحة", en: "leaning casually against the front hood/fender in an open desert sand area" },
  { id: 23, zone: "outside", ar: "بجانب السيارة في موقف أرضي ترابي مستوٍ بجوار شجيرات صحراوية", en: "beside the vehicle on flat dirt ground beside sparse native wild desert shrubs" },
  { id: 24, zone: "outside", ar: "خلف السيارة والصندوق الخلفي مفتوح في حوش أو كراج منزلي", en: "behind the car with tailgate open inside a spacious private paved home courtyard" },
  { id: 25, zone: "outside", ar: "بجانب السيارة على ممشى خرساني بسيط بجوار سور حديقة حي عادية", en: "beside the car alongside a concrete public walkway bordering a neighborhood park wall" },
  { id: 26, zone: "outside", ar: "بجانب السيارة تحت كوبري خرساني ضخم على جانب طريق عريض", en: "standing beside car beneath a massive wide concrete flyover bridge underpass" },
  { id: 27, zone: "outside", ar: "بجانب السيارة في ساحة مواقف أسفلتية واسعة ومفتوحة تماماً", en: "beside car in a vast empty open commercial asphalt parking apron" },
  { id: 28, zone: "outside", ar: "متكئ على باب السائق المفتوح أمام بوابة حديدية بتصميم هندسي بسيط", en: "leaning on the open driver door in front of a plain geometric wrought-iron residential gate" },
  { id: 29, zone: "outside", ar: "بجانب السيارة على رصيف محطة وقود استراحة سفر نائية", en: "standing beside vehicle on raised curb of a remote highway travel stop" },
  { id: 30, zone: "outside", ar: "بجانب مقدمة السيارة على حافة أرض صخرية مرتفعة مطلة على فضاء مفتوح", en: "standing near vehicle front bumper at the edge of an elevated rocky plateau overlook" },
  { id: 31, zone: "outside", ar: "بجانب السيارة في شارع حي حديث بمبانٍ قيد التشطيب ومخلفات بناء نظيفة", en: "beside car on a modern suburban street with newly plastered villa facades" },
  { id: 32, zone: "outside", ar: "بجانب باب السيارة المفتوح أمام مدخل بيت شعبي قديم بأبواب خشبية", en: "beside the open vehicle door outside a traditional plain mudbrick building frontage" },
  { id: 33, zone: "outside", ar: "بجانب السيارة بين أحواض نخيل وساقية ماء في مزرعة ريفية هادئة", en: "beside vehicle among irrigated date palm basins inside a tranquil rural estate" },
  { id: 34, zone: "outside", ar: "بجانب السيارة في موقف خارجي ترابي لميدان هجن أو فروسية محلي", en: "beside the car in an unpaved open field parking area near a local equestrian track" },
  { id: 35, zone: "outside", ar: "متكئ على السيارة في ساحة تفريغ مواقف شاحنات هادئة", en: "leaning against vehicle in a quiet gravel truck rest apron off an industrial corridor" },
  { id: 36, zone: "outside", ar: "بجانب السيارة على طرف مسار بري محاط بسياج شبكي أمني بسيط", en: "beside car along an unpaved border trail bordered by standard chain-link fence" },
  { id: 37, zone: "outside", ar: "واقف عند فتحة باب الراكب المفتوح في موقف مظلل بمبنى تجاري", en: "standing at open passenger door in an open-air shaded commercial ground slot" },
  { id: 38, zone: "outside", ar: "بجانب السيارة على شاطئ بحري هادئ بأرضية رملية مبللة وصلبة", en: "beside car parked on hard-packed coastal sand shoreline flat" },
  { id: 39, zone: "outside", ar: "بجانب السيارة في شارع مستودعات هادئ بهياكل حديدية وبوابات منزلقة", en: "beside car on a wide quiet logistics warehouse service street" },
  { id: 40, zone: "outside", ar: "بجانب السيارة على رصيف عريض مفروش ببلاط إنترلوك أمام سور مدرسة حي", en: "beside car on a wide interlocking paved sidewalk along a neighborhood school wall" },

  // More ordinary, physically grounded Saudi locations: photographed from inside the vehicle
  { id: 41, zone: "inside", ar: "السيارة متوقفة في مواقف زوار عمارة سكنية بجانب أعمدة خرسانية وأبواب مداخل", en: "parked in an apartment visitor bay beside plain concrete pillars and a small entrance lobby" },
  { id: 42, zone: "inside", ar: "داخل سيارة متوقفة بجانب مستودعات توزيع محلية بواجهات صاج وبوابات تحميل مغلقة", en: "parked along a quiet local distribution warehouse frontage with corrugated shutters and closed loading doors" },
  { id: 43, zone: "inside", ar: "سيارة متوقفة أمام صيدلية حي عادية على شارع فرعي مع رصيف قصير", en: "parked on a side-street bay outside an ordinary neighborhood pharmacy with a short concrete sidewalk" },
  { id: 44, zone: "inside", ar: "مواقف بقالة كبيرة أو سوبرماركت حي مع عربات تسوق قليلة قرب المدخل", en: "parked in a modest neighborhood supermarket lot with a few shopping carts near the entrance" },
  { id: 45, zone: "inside", ar: "موقف زوار لعيادات طبية صغيرة مع مسار دخول واضح دون عرقلة المرور", en: "parked in a marked visitor space outside a small clinic, away from the entrance driveway" },
  { id: 46, zone: "inside", ar: "داخل سيارة في طابق مواقف متعدد الطوابق مفتوح الجوانب بأعمدة وخطوط مواقف", en: "inside a parked car on an open-sided multistorey parking level with painted bays and concrete columns" },
  { id: 47, zone: "inside", ar: "السيارة متوقفة في استراحة طريق صغيرة بجوار كافتيريا بسيطة وطاولات متفرقة", en: "parked in a small roadside rest stop beside a plain snack kiosk and a few outdoor tables" },
  { id: 48, zone: "inside", ar: "موقف سيارات بجانب مبنى محلات خدمات حي أمام مغسلة ملابس ومخبز", en: "parked in a neighborhood service-shop lot beside an ordinary laundry and bakery storefront" },
  { id: 49, zone: "inside", ar: "سيارة متوقفة تحت سقيفة معدنية قرب ورشة إطارات ومحل قطع غيار", en: "parked beneath a simple metal shade outside a neighborhood tire and spare-parts shop" },
  { id: 50, zone: "inside", ar: "سيارة متوقفة على جانب طريق ساحلي مع حاجز خرساني ومواقف محددة", en: "parked in a marked paved pull-off along a coastal road with a low concrete barrier" },

  // Additional locations where the subject stands beside a safely parked car
  { id: 51, zone: "outside", ar: "بجانب سيارة متوقفة في ساحة انتظار مغسلة سيارات يدوية والأرضية مبللة موضعيًا", en: "standing next to a parked car in a hand-car-wash waiting bay with locally wet concrete pavement" },
  { id: 52, zone: "outside", ar: "بجانب السيارة في موقف حي صغير قرب عامود إنارة وأشجار مزروعة حديثًا", en: "beside a parked vehicle in a small neighborhood lot near an ordinary lamp post and young roadside trees" },
  { id: 53, zone: "outside", ar: "واقف بجانب السيارة في ساحة مبنى محلات تجارية بسيطة مع باب تحميل خلفي مغلق", en: "standing beside a parked car outside a modest shop building with a closed rear delivery shutter" },
  { id: 54, zone: "outside", ar: "بجانب سيارة متوقفة في خليج توقف نظامي قرب موقف حافلات محلي بسيط", en: "beside a car in a designated roadside parking bay near a modest neighborhood bus stop" },
  { id: 55, zone: "outside", ar: "بجانب السيارة على موقف أسفل رصيف طريق ساحلي ممهد بحاجز منخفض", en: "standing beside a parked car on a paved coastal parking strip bordered by a low sea-facing barrier" },
  { id: 56, zone: "outside", ar: "واقف بجانب سيارته في مواقف مبنى تدريبي صغير بسور عادي وأشجار ظل", en: "standing beside a parked car in a small training-center car park with a plain boundary wall and shade trees" },
  { id: 57, zone: "outside", ar: "بجانب سيارة متوقفة عند طرف ساحة صناعية خفيفة بعيدة عن حركة الشاحنات", en: "standing beside a parked vehicle at the edge of a light-industrial service yard away from moving trucks" },
  { id: 58, zone: "outside", ar: "بجانب السيارة في مواقف ملعب حي صغير بأرضية أسفلت وحاجز شبكي", en: "beside a parked car in an ordinary neighborhood sports-ground lot with asphalt paving and chain-link fence" },
  { id: 59, zone: "outside", ar: "بجانب السيارة في موقف ترابي مستوٍ قرب مزرعة نخيل وسور بلوك بسيط", en: "beside a parked car on a level gravel layby near a palm farm and plain blockwork wall" },
  { id: 60, zone: "outside", ar: "واقف بجانب السيارة على ساحة مسفلتة خارج عمارة سكنية عادية أمام بوابة جانبية", en: "standing next to a parked car in an apartment building's paved side parking apron beside a plain gate" },
];

/* =================== قسم مستقل بالكامل للإضاءة والإنارة (19 خياراً) =================== */
export const LIGHTING_OPTIONS: Opt[] = [
  // ☀️ إضاءات النهار الطبيعية
  { id: "harsh_noon", ar: "شمس ظهيرة نجدية ساطعة وظلال عمودية حادة تحت الأنف والفك", en: "harsh overhead direct noon sun casting sharp vertical shadows under nose, brow, and chin" },
  { id: "golden_hour", ar: "الساعة الذهبية (أشعة شمس برتقالية دافئة مائلة من نافذة السائق)", en: "warm golden hour low-angle sunlight cutting horizontally across cheek and cabin" },
  { id: "soft_morning", ar: "صباح باكر بضوء ناعم نقي ومنعش بدون تباين حاد", en: "crisp early morning soft natural daylight, gentle low-contrast facial illumination" },
  { id: "afternoon_diffuse", ar: "عصر دافئ مع ضوء شمس مائل معتدل الدفء", en: "warm late-afternoon natural ambient light with gentle directional amber tone" },
  { id: "sunset_glow", ar: "وهج مغرب قرمزي وبرتقالي غامق يلف الأفق والوجه", en: "dramatic dusk crimson-orange horizon afterglow illuminating side of face" },
  { id: "blue_hour", ar: "الساعة الزرقاء الباردة بعد الغروب مباشرة", en: "cool cinematic blue hour atmospheric ambient lighting with subtle deep cyan shadows" },
  { id: "overcast_haze", ar: "نهار غائم جزئياً أو سماء مغبرة بضوء رمادي مشتت فائق النعومة", en: "diffused overcast or dusty hazy daylight producing ultra-soft wrap-around skin shadows" },

  // 💡 إضاءات ليلية واصطناعية
  { id: "sodium_street", ar: "أعمدة إنارة الشوارع الصوديوم الكلاسيكية (إضاءة صفراء برتقالية دافئة)", en: "vintage high-pressure sodium street lamps casting authentic warm orange-amber overhead glow" },
  { id: "led_modern_street", ar: "أعمدة إنارة بيضاء باردة حديثة (LED شوارع بيضاء)", en: "contemporary municipal cold white LED streetlights with clean neutral luminance" },
  { id: "direct_flash", ar: "فلاش الهاتف المباشر في مكان معتم (سيلفي فلاش عالي التباين ولمعة بشرة حقيقية)", en: "raw harsh on-axis direct smartphone camera flash in dark environment with authentic specular shine" },
  { id: "station_canopy", ar: "فلورسنت وسقف محطة الوقود الساطع المنتشر من الأعلى", en: "intense white overhead commercial canopy fluorescent floodlighting of a fuel station" },
  { id: "dash_screens_glow", ar: "وهج شاشات المقصورة والكونسول الملون في عتمة الليل التامة", en: "subtle cool blue-cyan ambient glow emitted solely by digital instrument cluster and infotainment" },
  { id: "tunnel_tungsten", ar: "إضاءة نفق صفراء تنجستن دائرية متكررة", en: "warm artificial tungsten and amber overhead tunnel utility lamps illuminating interior" },
  { id: "single_distant_lamp", ar: "مصباح جداري وحيد خافت على بعد أمتار في ليل ساكن", en: "faint solitary exterior incandescent porch bulb casting moody asymmetric side light" },
  { id: "ambient_drive_thru", ar: "أضواء لوحة طلبات الدرايف ثرو المضيئة المتوهجة على جانب الوجه", en: "colorful vibrant backlit menu board signage casting side glow onto subject's face" },
  { id: "headlights_bounce", ar: "أضواء سيارة قادمة من بعيد ترتد بنعومة عبر الزجاج", en: "gentle indirect wash from distant passing car headlights cutting across driver side" },
  { id: "pure_moonlight", ar: "ضوء قمر صحراوي بارد وفضي في مكان مظلم تماماً", en: "dim ethereal cool silver moonlight illuminating facial contours against pitch-black surroundings" },
  { id: "warm_car_cabin_dome", ar: "لمبة سقف السيارة الداخلية الصفراء الخافتة فوق المرآة", en: "warm yellow interior car dome ceiling bulb casting soft intimate overhead cabin glow" },
  { id: "basement_tubes", ar: "أنابيب فلورسنت بيضاء طويلة في قبو مواقف مغلق", en: "industrial dual white fluorescent ceiling strip tubes reflecting off car roof and glass" },
];
export const LIGHTING = LIGHTING_OPTIONS;

export const HAIR_STYLES: Opt[] = [
  {
    id: "ref_signature_tousled",
    ar: "تسريحة المرجع الأصلية (نفس الكثافة الطبيعية، تصفيف جانبي خفيف بأطراف الأصابع)",
    en: "hair silhouette and hairline anchored to the reference; relaxed natural side styling only within its visible length, density and color"
  },
  {
    id: "ref_brush_back_natural",
    ar: "مسحوب للخلف بالأصابع بحجم طبيعي (نفس الكثافة الأصلية بدون جل)",
    en: "hair brushed casually backward using fingers, keeping the EXACT same natural hair density and strand thickness as reference, un-gelled matte finish, accentuating the natural brow line"
  },
  {
    id: "ref_soft_side_sweep",
    ar: "تصفيف جانبي ناعم مع حركة الشعر الطبيعية (نفس الكثافة والطول)",
    en: "casual soft side sweep following natural hair growth direction, identical density and hair volume as reference photo, softly resting across top without changing hair length or thickness"
  },
  {
    id: "ref_forward_casual_crop",
    ar: "خصلات مبعثرة للأمام بعفوية فوق الجبين (نفس الكثافة والسمك)",
    en: "casual forward textured fringe with relaxed strands at the upper forehead, retaining the reference hairline, natural density, texture and visible color"
  },
  {
    id: "ref_windblown_postgym",
    ar: "حركة عفوية متأثرة بهواء التكييف (نفس الكثافة الأصلية وخصلات حرة)",
    en: "slightly wind-moved hair only where plausible air reaches it, preserving reference density, growth direction and visible color"
  },
  {
    id: "covered_traditional",
    ar: "مغطى بشماغ أحمر أو غترة بيضاء (مع إبقاء خط اللحية والفك الأصلي)",
    en: "wearing traditional Saudi headwear (shemagh/ghutra), preserving the exact facial contours and identical beard density around jawline"
  }
];

export const BEARD_STYLES: Opt[] = [
  {
    id: "ref_signature_beard",
    ar: "لحية الصورة المرجعية الأصلية (نفس الكثافة، الطول، والشارب المتصل والخط الطبيعي)",
    en: "preserve beard and moustache as visible in the reference: same density, uneven growth boundaries, visible length and neck outline without forced grooming"
  },
  {
    id: "ref_fresh_trimmed_neat",
    ar: "نفس لحية المرجع مع تحديد طبيعي ونظيف للحواف (نفس الكثافة الكاملة)",
    en: "reference beard with freshly cleaned and sharpened natural cheekline, preserving 100% of the original beard density, thickness, and mustache proportions from the reference photo"
  },
  {
    id: "ref_rugged_unlined",
    ar: "نفس لحية المرجع بنمط كاجوال عفوي (شعيرات متناثرة ناعمة عند الرقبة)",
    en: "reference beard left in its natural state with the same visibly supported cheek and neck edges, growth gaps, density and color; no invented individual follicles"
  }
];

export const ANATOMICAL_EXPRESSIONS: Opt[] = [
  { 
    id: "ref_warm_smile", 
    ar: "نفس ابتسامة المرجع الدافئة العفوية (إشراقة عيون هادئة وشفاه متلامسة برقة)", 
    en: "a relaxed small candid smile only through natural lip-corner movement; eye color and skin creases remain as visible in the reference" 
  },
  { 
    id: "sun_squint_lines", 
    ar: "تضيّق تشريحي للجفون مع تجاعيد الضحك الطبيعية حول العين (Squint / Crow's Feet)", 
    en: "slight squint against sun glare, natural micro-creases and crow's feet wrinkles around orbicularis oculi muscles, zero tension" 
  },
  { 
    id: "relaxed_jaw_unclenched", 
    ar: "فك مسترخٍ طبيعي غير مشدود والشفتان متلامستان بعفوية تامة", 
    en: "relaxed natural jaw and mouth, with lips resting comfortably together and no forced expression" 
  },
  { 
    id: "asymmetric_micro_smirk", 
    ar: "ابتسامة خفيفة غير متماثلة (ارتفاع طفيف في زاوية فم واحدة)", 
    en: "subtle asymmetric micro-smirk with unilateral corner of mouth slightly lifted naturally, authentic human facial asymmetry" 
  },
  { 
    id: "raised_eyebrow_candid", 
    ar: "حاجب واحد مرفوع بمليمترات بتعبير تساؤلي عفوي وشبابي", 
    en: "a casually questioning gaze with slightly raised eyebrow and natural skin movement, without added permanent lines" 
  },
  { 
    id: "road_focused_glance", 
    ar: "نظرة متأملة مسروقة للشارع مع تركيز بؤبؤ العين بعيداً عن العدسة", 
    en: "candid off-camera gaze focused on distance, authentic eye convergence, relaxed natural eyelids catching ambient light" 
  },
];

export const HEIGHT_CUES: Opt[] = [
  { id: "headrest_max", ar: "مسند الرأس مرفوع لأعلى نقطة (ملاءمة طول 193 سم)", en: "car seat headrest visibly extended to its highest setting behind the tall neck" },
  { id: "auto_scale", ar: "المقعد مرجع للخلف لاستيعاب الساقين الطويلتين", en: "driver seat naturally pushed back to accommodate tall 193cm frame, natural broad shoulder span" },
  { id: "tall_roofline", ar: "الرأس قريب نسبياً من بطانة سقف السيارة بالداخل", en: "head clearly positioned near the vehicle roof-liner emphasizing tall 193cm stature" },
  { id: "long_arm_reach", ar: "امتداد ذراع سيلفي طويل يعطي زاوية رؤية واسعة للكابينة", en: "extended long-reach arm selfie creating wider visual perspective inside cabin" },
  { id: "seatbelt_geometry", ar: "حزام الأمان ممتد بزاوية حادة من القائم ليغطي الصدر العريض", en: "seatbelt pulling taut at a distinct downward acute angle from high B-pillar mount across broad chest" },
  { id: "elbow_door_rest", ar: "الساعد الطويل مستند بارتياح على بطانة الباب العلوية", en: "tall athletic forearm and elbow resting naturally on the padded top window ledge of driver door" },
];

export const SKIN_NUANCES: Opt[] = [
  { id: "ref_freckles_moles", ar: "نمش المرجع الخفيف ونقاط الجلد الطبيعية بالوجنتين والأنف", en: "subtle organic sun freckles and micro-skin texture across cheeks and bridge of nose exactly matching reference photo" },
  { id: "t_zone_sheen", ar: "لمعة طبيعية خفيفة من دفء الجو على الأنف والجبين", en: "natural subtle T-zone skin hydration sheen on forehead and nose bridge from warm ambient air" },
  { id: "stray_beard_hairs", ar: "شعيرات لحية طبيعية غير مقصوصة بمسطرة ليزر على الرقبة", en: "natural organic stray beard hairs along the lower neck and jawline matching reference un-lasered beard contour" },
  { id: "wrist_vein_athletic", ar: "أوردة يد ومعصم رياضية خفيفة مع مسكة الجوال (83 كجم)", en: "subtle athletic vascularity and wrist sinew definition on selfie hand matching lean 83kg physique" },
];

export const SUBSURFACE_PHYSICS: Opt[] = [
  { id: "ear_cartilage_glow", ar: "توهج أحمر ياقوتي في غضروف الأذن عند نفاذ الضوء", en: "subtle ear translucency only when a real light source is physically behind the ear" },
  { id: "thobe_jaw_bounce", ar: "ارتداد ضوئي ناعم من بياض قماش الثوب يضيء أسفل الذقن والفك", en: "soft diffuse white ambient bounce light reflecting off the bright cotton thobe onto the underside of the jawline and neck" },
  { id: "beard_follicle_shadow", ar: "تدرج رمادي خافت تحت الجلد في مناطق منبت شعر اللحية", en: "micro-tonal subdermal cool grey desaturation beneath the skin around exact reference beard follicle roots" },
];

export const FABRIC_PHYSICS: Opt[] = [
  { id: "seat_hip_creases", ar: "كسرات جلوس حقيقية على جانبي الحوض لقماش الثوب (قامة 193 سم)", en: "organic horizontal tension creases and micro-folds radiating across hips and lap suited for 193cm seated posture" },
  { id: "collar_tilt_tension", ar: "انحناء خفيف للياقة القلاب المشدودة مع حركة الرقبة أو الحزام", en: "slight organic asymmetric tilt of thobe turnover collar responding naturally to neck rotation and seatbelt tension" },
  { id: "fabric_weave_macro", ar: "ظهور خيوط نسيج التيترون أو السلك الياباني المنسوج بنعومة فائقة", en: "subtle realistic thobe fabric weave visible only at camera-resolvable scale" },
];

export const THERMAL_CLIMATE_PHYSICS: Opt[] = [
  { id: "cup_sweat_droplets", ar: "قطرات ماء متصببة من برودة كوب القهوة الباردة بالكونسول", en: "fine cold drink condensation beads rolling down iced specialty takeaway cup resting in console holder" },
  { id: "window_ac_fog_spot", ar: "بقعة ضباب دائرية ناعمة على زجاج النافذة من برودة المكيف", en: "faint exterior circular moisture condensation haze on side window caused by cold AC vent hitting outside air" },
  { id: "engine_heat_mirage", ar: "تموجات سراب حراري طفيفة منبعثة من فتحات كبوت السيارة", en: "faint optical heat shimmer distortion rising off the warm engine hood surface" },
];

export const DAILY_LIFE_CLUTTER: Opt[] = [
  { id: "rugged_military_radio", ar: "جهاز لاسلكي ميداني عسكري الشكل حقيقي البنية، جسم مطاطي متين وهوائي قصير ومقبض صوت ومشبك، مستقر على حافة مقعد الراكب دون تشغيل أو شعار وحدة", en: "realistic rugged military-spec handheld two-way field radio with rubberized body, short flexible antenna, volume knob and belt clip, safely resting on the passenger seat edge; no invented unit insignia or active transmission" },
  { id: "folded_parking_receipts", ar: "قصاصات إيصالات مواقف مطوية في الجيب العلوي لباب الراكب", en: "two folded ordinary parking receipts tucked into the upper passenger-side door pocket" },
  { id: "cabin_tissue_pack", ar: "علبة مناديل صغيرة مستعملة على طرف مقعد الراكب بعيدًا عن ذراع التصوير", en: "partially used small tissue packet lying safely on passenger seat edge, away from camera arm" },
  { id: "loose_charging_cable", ar: "سلك شحن هاتف متراخٍ على جانب الكونسول دون عرقلة القير أو عجلة القيادة", en: "loose phone-charging cable draped along passenger-side center console edge, clear of the gear lever and steering controls" },
  { id: "folded_paper_map", ar: "ورقة إرشادات طريق مطوية جزئيًا على مقعد الراكب", en: "half-folded local road directions sheet lying on the passenger seat, with no readable private information" },

  { id: "charger_12v_glow", ar: "رأس شاحن في مقبس الولاعة بنقطة LED زرقاء خافتة", en: "tiny subtle blue LED glow dot from 12V fast charger plugged into lower center console port" },
  { id: "rearview_parking_tag", ar: "بطاقة تصريح مواقف بيضاء معلقة بمرآة الرؤية الخلفية", en: "white residential RFID parking permit pass tag hanging from the center rearview mirror stalk" },
  { id: "door_pocket_keys", ar: "مفاتيح بيت عادية موضوعة بإهمال في جيب الباب السفلي", en: "standard house brass keys and fob resting casually in lower interior door storage pocket" },
];

// 1. حركة الهواء وديناميكية التكييف
export const AIRFLOW_OPTIONS: Opt[] = [
  { id: "ac_gentle_breeze", ar: "هواء مكيف ناعم يداعب خصلات الجبين بخفة (نفس الكثافة)", en: "soft direct cabin AC airflow gently fluttering fine tips of forehead hair strands while maintaining original thickness and volume" },
  { id: "window_quarter_drift", ar: "نافذة السائق مفتوحة ربع نزلة مع نسيم حركة لطيف على ياقة الثوب", en: "driver window lowered one quarter creating subtle organic breeze that gently ripples thobe collar fabric and side hair" },
  { id: "cabin_dead_calm", ar: "سكون داخلي تام واستقرار للخصلات والياقة مع تكييف هادئ", en: "dead-calm interior cabin air with completely settled hair strands and undisturbed collar resting naturally" },
];

// 2. انعكاس وهج شاشات الملاحة والهاتف
export const SCREEN_CAST_LIGHTING: Opt[] = [
  { id: "carplay_dark_glow", ar: "طيف سماوي/أخضر خافت منعكس من شاشة الملاحة الداكنة على الفك", en: "subtle soft cyan-green light wash emitted from dark-mode Apple CarPlay navigation map illuminating lower jawline and thobe shoulder" },
  { id: "phone_screen_catchlight", ar: "ارتداد نور شاشة الجوال البيضاء على بؤبؤ العينين والوجنتين", en: "direct soft white ambient screen bounce reflecting delicately inside irises and highlighting cheekbone apex" },
  { id: "amber_indicator_pulse", ar: "وميض إشارة الانعطاف البرتقالية الخاطف المرتد عبر زجاج النافذة", en: "intermittent warm amber turn-signal reflection pulsing softly along side window glass and outer ear" },
];

// 3. مقتنيات الكابينة اليومية الحقيقية
export const CABIN_ARTIFACTS: Opt[] = [
  { id: "laundry_bag_rear", ar: "ثوب آخر معلق في المقعد الخلفي بكيس نايلون شفاف من المغسلة", en: "freshly pressed secondary thobe encased in clear dry-cleaner plastic bag hanging from rear passenger grab handle" },
  { id: "magsafe_ac_mount", ar: "قاعدة تثبيت جوال مغناطيسية سوداء (MagSafe) في شفرات فتحة المكيف", en: "minimalist black MagSafe magnetic car mount clamped onto center AC louvers with a thin braided black cable" },
  { id: "fresh_miswak_console", ar: "سواك أراك طازج برأس مقشور مستقر في حامل الأكواب", en: "freshly peeled natural miswak stick resting casually beside cup holder in center console" },
  { id: "sunroof_glass_pocket", ar: "نظارة شمسية مستقرة في الحافظة العلوية ببطانة السقف بجوار لمبة القراءة", en: "designer sunglasses nestled inside flip-down ceiling sunglass compartment near interior map lights" },
];

// 4. لغة جسد القامة الفارهة 193 سم
export const TALL_ERGONOMICS: Opt[] = [
  { id: "head_tilt_inward", ar: "إمالة عفوية للرأس للداخل لتفادي إطار الباب العلوي ووضع الوجه بالمركز", en: "subtle natural inward tilt of tall head and neck fitting comfortably under roofline curve, centering face in frame" },
  { id: "forearm_span_wheel", ar: "الساعد الرياضي الطويل مستقر بعرض مقود السيارة مع بروز تفاصيل الساعة", en: "long athletic vascular forearm resting flat across top curve of steering wheel showcasing steel sports watch" },
  { id: "roof_handle_grip", ar: "يد يسارية مستندة بارتياح على مقبض السقف العلوي والأخرى تلتقط السيلفي", en: "left hand gripping upper ceiling grab handle in relaxed stretch suited for 193cm frame while right hand holds phone" },
];

// 5. عيوب ومعالجة كاميرا السناب شات
export const IN_APP_ARTIFACTS: Opt[] = [
  { id: "snap_night_grain", ar: "تحبب ناعم وحقيقي ناتج عن معالجة مستشعر سناب شات في الإضاءة المنخفضة", en: "authentic high-ISO luminance grain characteristic of Snapchat in-app camera processing in low-light conditions" },
  { id: "front_screen_flash_burst", ar: "إضاءة شاشة الجوال الأمامية المؤقتة (فلاش الشاشة) بلمعة واضحة وخلفية معتمة", en: "soft diffused front-facing screen flash burst illuminating face evenly against a naturally darker cabin background" },
  { id: "instant_snap_bokeh", ar: "عزل ناعم فوري وطبيعي جداً للمقعد الخلفي وباب السيارة مع حدة فائقة على العينين", en: "natural wide-aperture shallow depth of field rendering crisp detail on eyes and beard with gentle soft focus on rear car seat" },
];

// 6. الطقس الموضعي اللحظي
export const MICRO_WEATHER: Opt[] = [
  { id: "raindrop_streak_window", ar: "رذاذ مطر خفيف جداً على زجاج النافذة مع أثر مسحة المساحات بالخلف", en: "isolated crisp micro-raindrops clinging to side glass with soft blurry windshield wiper sweep in background" },
  { id: "travel_dust_corner", ar: "خط غبار سفر ناعم جداً متجمع في زاوية مثلث النافذة بعد مسكة خط", en: "fine desert highway dust powder settled along the lower rubber window weatherstripping seam" },
  { id: "winter_breath_fade", ar: "تكثف بخار هواء دافئ متلاشٍ جداً قرب الشفاه في صباح شتوي بارد", en: "barely visible fading breath condensation plume in crisp cold winter morning air" },
];

export const APP_UI_ELEMENTS: Opt[] = [
  { id: "snap_timestamp", ar: "ساعة السناب الكلاسيكية البيضاء مطبوعة بزاوية الشاشة", en: "Snapchat digital white timestamp overlay faintly visible in upper corner" },
  { id: "snap_temp_sticker", ar: "ملصق درجة الحرارة (مثل: 42°C أو 18°C) بالخط الأبيض", en: "subtle white weather temperature sticker overlay showing authentic local temperature reading" },
  { id: "app_compression_filter", ar: "معالجة مستشعر سناب شات الطبيعية (ضغط ألوان الكاميرا داخل التطبيق)", en: "subtle app-level tone mapping and social-media compression, separate from sensor noise" },
];

export const WINDOW_TINTS: Opt[] = [
  { id: "tint_extra_dark_05", ar: "تظليل شديد جدًا للزجاج الجانبي والخلفي (نفاذ ضوء تقريبي 5%)", en: "very dark near-black side and rear passenger window tint, approximately 5% visible light transmission; windshield remains clear, side-window daylight and cabin visibility markedly reduced" },
  { id: "tint_dark_10", ar: "تظليل داكن قوي للزجاج الجانبي والخلفي (نفاذ ضوء تقريبي 10%)", en: "strong dark charcoal side and rear window tint, approximately 10% visible light transmission; windshield remains clear, side-window illumination noticeably reduced" },

  { id: "tint_medium_02", ar: "تظليل كتم وسط (درجة 02) مع دخول الضوء من الزجاج الأمامي", en: "medium 35% charcoal window tint on side glasses, creating moody contrast with un-tinted windshield light" },
  { id: "tint_light_01", ar: "تظليل حراري نانوي خفيف (درجة 01) بمسحة زرقاء خافتة", en: "light 50% legal nano-ceramic tint giving subtle cool blue-green hue to interior shadows" },
  { id: "no_tint_clear", ar: "زجاج شفاف وكالة بدون تظليل (إضاءة كاملة للمقصورة)", en: "clear factory windows allowing transmission of whatever real daylight or nearby practical lighting actually exists" },
];

export const GRIP_MOTION_NUANCES: Opt[] = [
  { id: "natural_arm_stretch", ar: "أكتاف مائلة طبيعياً مع امتداد ذراع السيلفي الطويل (193 سم)", en: "relaxed shoulder and naturally bent elbow at comfortable selfie distance, independent of body height" },
  { id: "stray_finger_corner", ar: "طرف خفيف جداً من حافة إصبع السبابة أو كفر الجوال بزاوية الكادر", en: "subtle accidental tip of index finger or matte phone case edge intruding slightly in bottom corner" },
  { id: "steering_hand_microblur", ar: "اهتزاز حركة بطيء خفيف على اليد الممسكة بالمقود", en: "slight candid micro-motion blur on the off-hand resting on steering wheel while selfie hand stays sharp" },
];

export const DASH_UI_DETAILS: Opt[] = [
  { id: "ac_dual_temp", ar: "أرقام حرارة التكييف الرقمية (مثل: 20.5°C) مضيئة بالطبلون", en: "glowing digital dual-zone AC climate control numbers illuminated on dashboard console" },
  { id: "carplay_navigation", ar: "شاشة الكونسول تعرض تطبيق خرائط الملاحة بوضع داكن", en: "in-car infotainment screen displaying subtle blurred dark-mode GPS navigation route" },
];

export const OPTICAL_IMPERFECTIONS: Opt[] = [
  { id: "catchlight_reflection", ar: "انعكاس وهج شاشة الجوال/السيارة في بؤبؤ العينين العسليتين", en: "organic specular eye catchlight reflecting phone screen and interior cabin dashboard inside warm brown iris" },
  { id: "oily_lens_glow", ar: "توهج دهني ناعم حول مصادر الضوء (مسحة العدسة بالثوب)", en: "subtle blooming oily lens flare around bright light sources typical of uncleaned phone lenses" },
  { id: "wide_barrel_distort", ar: "تمدد منظوري خفيف بالأطراف ناتج عن عدسة 24mm العريضة", en: "authentic wide-angle smartphone barrel distortion slightly elongating edges and forearms" },
  { id: "chroma_shadow_noise", ar: "حبيبات ضوضاء مستشعر الجوال في مناطق الظلال العميقة", en: "subtle smartphone CMOS sensor chroma noise grain in deep cabin shadow zones under steering column" },
];

export const CABIN_DETAILS: Opt[] = [
  { id: "large_hand_gear", ar: "يد كبيرة تحتضن مقبض القير بعفوية تتناسب مع طول 193 سم", en: "large hand resting naturally on center leather gear shifter suited for 193cm stature" },
  { id: "tissue_box_console", ar: "علبة مناديل مربعة مستقرة على الكونسول الوسطي", en: "square tissue box casually placed near center console cup holders" },
  { id: "loose_usb_cable", ar: "كابل شاحن أصلي ملفوف بعفوية قرب فتحات المكيف", en: "loose USB braided charging cable casually snaking near AC air vents" },
];

export const CLOTHES: Cloth[] = [
  { id: "thobe_white", cat: "تقليدي", ar: "ثوب أبيض مفصل لقامة طويلة (ياقة قلاب)", en: "custom tailored crisp white Saudi thobe fitted for tall broad frame, turnover collar, no headwear" },
  { id: "thobe_shmagh", cat: "تقليدي", ar: "ثوب أبيض + شماغ أحمر بترسيمة كاجوال + عقال", en: "white tailored thobe + red shemagh casually draped over broad shoulders + black agal" },
  { id: "thobe_ghutra", cat: "تقليدي", ar: "ثوب أبيض + غترة بيضاء خفيفة + عقال", en: "white tailored thobe + pure white ghutra + agal" },
  { id: "tee_black_ref", cat: "كاجوال", ar: "تيشيرت أسود فحمي ناعم (مطابق للصورة المرجعية)", en: "washed charcoal black crewneck t-shirt identical to reference photo, fitting lean athletic frame" },
  { id: "linen_beige", cat: "كاجوال", ar: "قميص كتان بيج صيفي مريح", en: "relaxed beige linen button-down shirt" },
  { id: "shirt_white_rolled", cat: "كاجوال", ar: "قميص أبيض كاجوال بأكمام مطوية وساعة معصم", en: "white casual shirt with rolled up sleeves showing athletic forearms" },
  { id: "sport_athletic", cat: "رياضي", ar: "طقم تدريب رياضي أسود عملي", en: "matte black athletic gym shirt fitting tall athletic torso" },
  { id: "hoodie_gray", cat: "كاجوال", ar: "هودي رمادي فاتح فضفاض", en: "relaxed light heather gray hoodie" },
];

export const STORYLINES: Opt[] = [
  { id: "traffic_light_stop", ar: "واقف عند إشارة حمراء وزهقان (ابتسامة المرجع الهادئة)", en: "waiting casually at a red traffic light, slight idle boredom, authentic subtle gentle smile matching reference expression" },
  { id: "fresh_haircut", ar: "ثوب مغسول جديد ومظهر مهندم بنفس شعر ولحية المرجع", en: "crisp clean tailored thobe, sharp clean collar, confident relaxed candid vibe, identical reference hair and facial features" },
  { id: "family_waiting_idle", ar: "منتظر مشوار بالسيارة والمكيف شغال والمقعد مائل للخلف", en: "waiting parked inside an idling car with AC on, driver seat adjusted comfortably for the specified 193cm height" },
  { id: "late_night_cruising", ar: "سرية خط ليلية ومسكة طريق مفتوح مع فنجان شاي سفري", en: "late night highway cruising, quiet roads, dashboard ambient glow, cup of warm tea on console" },
  { id: "post_gym_parking", ar: "توه مخلص تمرين في مواقف النادي بعد المغرب", en: "sitting in parking lot right after gym workout, gym outfit, post-training calm fatigue" },
  { id: "friday_after_prayer", ar: "موقف هادئ بعد صلاة الجمعة وثوب ناصع", en: "right after Friday midday prayer, pristine traditional attire, serene atmosphere" },
];

export const FRAMINGS: Opt[] = [
  { id: "close_face", ar: "سيلفي شخصي قريب جداً (الوجه والصدر يملآن 80% من الكادر)", en: "intimate front-camera selfie: face, neck and upper chest fill most of the frame; only the physically visible cabin edges appear" },
  { id: "half_body", ar: "سيلفي نصفي طبيعي (الرأس والأكتاف بالمركز، والسيارة كخلفية ثانوية)", en: "classic handheld selfie showing head, neck, and upper torso as central subject; car interior/exterior strictly secondary background" },
  { id: "wide_outside", ar: "سيلفي ممتد بذراع كامل (الشخص في الصدارة والخلفية تبعاً للزاوية)", en: "arm-extended handheld selfie keeping tall subject in prominent foreground, surroundings captured organically behind without recentering" },
];

export const ASPECTS: Opt[] = [
  { id: "916", ar: "9:16 ستوري (Snap / Insta / TikTok)", en: "9:16 vertical story format" },
  { id: "45", ar: "4:5 بوست إنستقرام عمودي", en: "4:5 vertical portrait feed" },
  { id: "11", ar: "1:1 مربع كلاسيكي", en: "1:1 square" },
  { id: "169", ar: "16:9 لقطة أفقية عريضة", en: "16:9 cinematic wide selfie" },
];

export const PHONES: Opt[] = [
  { id: "iphone_16_pro", ar: "iPhone 16 Pro Max (ألوان طبيعية وHDR متوازن)", en: "iPhone 16 Pro Max front camera, natural smart HDR" },
  { id: "snapchat_cam", ar: "كاميرا سناب شات مباشرة (معالجة التطبيق العادية)", en: "raw front-camera capture inside Snapchat, with moderate in-app processing and realistic compression" },
  { id: "xiaomi_15_ultra", ar: "Xiaomi 15 Ultra (نغمات لايكا الطبيعية)", en: "Xiaomi 15 Ultra front cam, Leica authentic tone" },
  { id: "samsung_s24u", ar: "Samsung S24 Ultra (حدة تفاصيل عالية)", en: "Samsung S24 Ultra front camera" },
];

export const ANGLES: Opt[] = [
  { id: "eye_level", ar: "مستوى العين المباشر (مثل زاوية الصورة المرجعية)", en: "natural handheld eye-level view appropriate to current scene, using reference only for identity" },
  { id: "high_45", ar: "زاوية علوية 45° سيلفي شبابي تقليدي", en: "high handheld selfie angle when real arm reach and overhead clearance permit" },
  { id: "chest_low", ar: "منخفضة من الصدر مع ظهور سقف السيارة", en: "low angle from chest height looking slightly up" },
  { id: "candid_side", ar: "زاوية عفوية جانبية كأن الجوال باليد السفلى", en: "candid off-axis angle from relaxed hand position" },
];

export const CAR_MODELS: Opt[] = [
  { id: "landcruiser_lc300", ar: "تويوتا لاندكروزر LC300", en: "Toyota Land Cruiser LC300" },
  { id: "patrol_y62", ar: "نيسان باترول بطل الدروب Y62", en: "Nissan Patrol Y62" },
  { id: "rr_sport_2017", ar: "Range Rover Sport 2017", en: "2017 Range Rover Sport" },
  { id: "yukon_denali", ar: "جي إم سي يوكن دينالي", en: "GMC Yukon Denali" },
  { id: "camry_v6", ar: "تويوتا كامري بيضاء", en: "white Toyota Camry" },
];

export const CAR_COLORS: Opt[] = [
  { id: "white", ar: "أبيض لؤلؤي", en: "pearl white" },
  { id: "black", ar: "أسود ميتاليك", en: "metallic black" },
  { id: "silver", ar: "فضي كلاسيكي", en: "classic silver" },
  { id: "gray", ar: "رمادي ناردو", en: "cement nardo gray" },
];

export const ACCESSORIES: Opt[] = [
  { id: "none", ar: "بدون إكسسوارات", en: "" },
  { id: "sunglasses_collar", ar: "نظارة شمسية معلقة على ياقة الثوب أو التيشيرت", en: "sunglasses hanging naturally from a visible shirt neckline or thobe collar" },
  { id: "specialty_cup", ar: "كوب ورقي لمقهى مختص باليد", en: "paper takeaway cup from a specialty coffee shop in hand" },
  { id: "car_key", ar: "مفتاح السيارة معلق بيده أو على الطبلون", en: "car key fob held casually in hand or resting on console" },
  { id: "luxury_watch", ar: "ساعة يد ستيل فضية بارزة بمعصم السيلفي", en: "steel sports watch visible on selfie wrist" },
];

export const POSES: Opt[] = [
  { id: "hand_on_wheel", ar: "يد على المقود والأخرى تلتقط السيلفي", en: "one hand holding the selfie phone, free hand comfortably resting on the steering wheel if permitted by framing" },
  { id: "arm_out", ar: "سيلفي يد واحدة ممدودة للأمام بعفوية (ذراع طويل)", en: "one long arm extended forward holding phone naturally, wide candid view" },
  { id: "adjust_collar", ar: "يد تعدل ياقة الثوب بعفوية والأخرى تصور", en: "one hand casually adjusting collar fold, other snapping candid selfie" },
  { id: "involuntary_snap", ar: "لقطة خاطفة عفوية أثناء الالتفات لنافذة السيارة", en: "involuntary mid-motion candid snap turning toward car window, authentic unposed feel" },
];

export const ANTI_AI_BLOCKLIST = [
  "cinematic lighting", "studio lighting", "professional photoshoot", "magazine cover",
  "8k resolution", "unreal engine", "octane render", "airbrushed skin", "plastic skin",
  "perfect porcelain face", "symmetrical face", "model posing", "clean asphalt",
  "changing facial features", "altering hair density", "altering beard density",
  "thicker beard than reference", "fuller beard than reference", "patchy beard",
  "shaved beard", "buzz cut", "curly afro hair", "long hair", "anime style", "illustration",
  "wide angle landscape showing whole car", "car commercial framing", "full vehicle centered",
  "subject pushed to background", "distorted face proportions"
];

export const PRESET_MOODS: PresetMood[] = [
  {
    id: "ref_authentic_car",
    title: "مود المرجع الأساسي بالسيارة",
    badge: "⭐ مطابق 100%",
    icon: "👤",
    desc: "مطابقة تامة لوجه المرجع وتيشيرته الأسود داخل السيارة كخلفية ثانوية مع إنارة أعمدة الصوديوم الدافئة.",
    data: {
      locId: 2, carModelId: "landcruiser_lc300", carColorId: "white",
      clothId: "tee_black_ref", accessoryId: "sunglasses_collar", poseId: "hand_on_wheel",
      lightId: "sodium_street",
      storylineId: "traffic_light_stop", tintId: "tint_medium_02",
      anatomicalExprId: "ref_warm_smile", heightCueId: "headrest_max",
      hairId: "ref_signature_tousled", beardId: "ref_signature_beard",
      subsurfaceIds: ["ear_cartilage_glow", "beard_follicle_shadow"],
      fabricIds: ["seat_hip_creases"],
      thermalIds: ["cup_sweat_droplets"],
      clutterIds: ["charger_12v_glow"],
      appUiIds: ["app_compression_filter"],
      gripMotionIds: ["natural_arm_stretch"],
      dashUiIds: ["ac_dual_temp"],
      opticalIds: ["catchlight_reflection"],
      cabinIds: ["tissue_box_console", "large_hand_gear"],
      skinNuanceIds: ["ref_freckles_moles", "stray_beard_hairs"],
      airflowIds: ["ac_gentle_breeze"],
      screenCastIds: ["phone_screen_catchlight"],
      cabinArtifactIds: ["magsafe_ac_mount"],
      tallErgonomicIds: ["head_tilt_inward"],
      inAppArtifactIds: ["snap_night_grain"],
      microWeatherIds: [],
    }
  },
  {
    id: "subsurface_noon_snap",
    title: "سيلفي الظهيرة وفيزياء الحرارة",
    badge: "☀️ صيف نجد",
    icon: "🔥",
    desc: "ثوب أبيض ناصع مع شمس ظهيرة حادة وارتداد ضوئي على الفك وتوهج غضروف الأذن والسيارة محيط عفوي.",
    data: {
      locId: 5, carModelId: "landcruiser_lc300", carColorId: "white",
      clothId: "thobe_white", accessoryId: "sunglasses_collar", poseId: "hand_on_wheel",
      lightId: "harsh_noon",
      storylineId: "family_waiting_idle", tintId: "tint_medium_02",
      anatomicalExprId: "sun_squint_lines", heightCueId: "headrest_max",
      hairId: "ref_signature_tousled", beardId: "ref_signature_beard",
      subsurfaceIds: ["ear_cartilage_glow", "thobe_jaw_bounce", "beard_follicle_shadow"],
      fabricIds: ["seat_hip_creases", "collar_tilt_tension", "fabric_weave_macro"],
      thermalIds: ["cup_sweat_droplets", "engine_heat_mirage"],
      clutterIds: ["charger_12v_glow", "rearview_parking_tag"],
      appUiIds: ["snap_temp_sticker", "app_compression_filter"],
      gripMotionIds: ["natural_arm_stretch"],
      dashUiIds: ["ac_dual_temp"],
      opticalIds: ["catchlight_reflection", "chroma_shadow_noise"],
      cabinIds: ["tissue_box_console", "large_hand_gear"],
      skinNuanceIds: ["t_zone_sheen", "wrist_vein_athletic", "ref_freckles_moles"],
      airflowIds: ["ac_gentle_breeze"],
      screenCastIds: ["carplay_dark_glow"],
      cabinArtifactIds: ["fresh_miswak_console"],
      tallErgonomicIds: ["forearm_span_wheel"],
      inAppArtifactIds: ["instant_snap_bokeh"],
      microWeatherIds: ["travel_dust_corner"],
    }
  },
  {
    id: "friday_formal",
    title: "كشخة الجمعة وسكينة الصباح",
    badge: "🕌 ثوب وشماغ",
    icon: "✨",
    desc: "تركيز كامل على الوجه المبتسم والشماغ المكوي بدقة وشمس الصباح الذهبية الناعمة.",
    data: {
      locId: 13, carModelId: "landcruiser_lc300", carColorId: "black",
      clothId: "thobe_shmagh", accessoryId: "luxury_watch", poseId: "adjust_collar",
      lightId: "soft_morning",
      storylineId: "friday_after_prayer", tintId: "tint_light_01",
      anatomicalExprId: "ref_warm_smile", heightCueId: "tall_roofline",
      hairId: "covered_traditional", beardId: "ref_fresh_trimmed_neat",
      subsurfaceIds: ["thobe_jaw_bounce"],
      fabricIds: ["fabric_weave_macro"],
      thermalIds: [],
      clutterIds: ["rearview_parking_tag"],
      appUiIds: [],
      gripMotionIds: ["natural_arm_stretch"],
      dashUiIds: [],
      opticalIds: ["catchlight_reflection", "wide_barrel_distort"],
      cabinIds: ["large_hand_gear"],
      skinNuanceIds: ["stray_beard_hairs", "ref_freckles_moles"],
      airflowIds: ["cabin_dead_calm"],
      screenCastIds: [],
      cabinArtifactIds: ["laundry_bag_rear"],
      tallErgonomicIds: ["head_tilt_inward"],
      inAppArtifactIds: ["instant_snap_bokeh"],
      microWeatherIds: [],
    }
  }
];

export function joinAr(list: Opt[], fallback = "طبيعي"): string {
  return list.length ? list.map(o => o.ar).join("، ") : fallback;
}

export function joinEn(list: Opt[], fallback = "none"): string {
  return list.length ? list.map(o => o.en).join(", ") : fallback;
}

export function buildPrompt(i: BuildInput): { ar: string; en: string } {
  // The caller supplies a physics-sanitized scene. No additional invented details.
  const inside = i.loc.zone === 'inside';
  const close = i.frame.id === 'close_face';
    const extras = (a: Opt[], language: 'ar' | 'en') =>
    [...new Set(a.map(x => x[language].trim()).filter(x =>
      x && !/^(none|natural|n\/a|لا يوجد|طبيعي)$/i.test(x)
    ))].join(language === 'ar' ? '، ' : '; ');
  const normalized = (value: string) => value
    .replace(/\b(?:Preserve\s+){2,}/gi, 'Preserve ')
    .replace(/\s+\./g, '.').replace(/\n{3,}/g, '\n\n').trim();
  const build = (lang: 'ar' | 'en') => {
    const ar = lang === 'ar';
    const sections: string[] = [];
    const append = (title: string, entries: (string | undefined)[]) => {
      const unique = [...new Set(entries.filter((x): x is string => Boolean(x?.trim())).map(x => x.trim()))];
      if (unique.length) sections.push(title + '\n' + unique.join('\n'));
    };
    const pick = (o: Pick<Loc, 'ar' | 'en'>) => o[lang];
    const optional = (name: string, arr: Opt[]) => {
      const v = extras(arr, lang);
      return v ? name + v : undefined;
    };
    const accessory = ['none', 'natural', 'no_accessory'].includes(i.accessory.id) ? undefined : pick(i.accessory);
    const beard = i.beard.id === 'ref_fresh_trimmed_neat'
      ? (ar ? 'احتفظ بلحية الصورة المرجعية وحدودها الطبيعية دون تشذيب أو إعادة رسم' : 'Preserve the beard, natural cheekline, neckline, mustache and growth gaps as actually visible; no added grooming')
      : pick(i.beard);
    const expr = i.anatomicalExpr.id === 'sun_squint_lines' && !['harsh_noon','noon_sun','golden_hour'].includes(i.light.id)
      ? (ar ? 'تعبير محايد طبيعي دون تجاعيد مخترعة' : 'Natural neutral eyelids; no fabricated squint or wrinkles')
      : pick(i.anatomicalExpr);
    append(ar ? 'الهوية والشخص' : 'SUBJECT AND IDENTITY', [
      ar ? 'استعمل الوجه في الصورة المرجعية مصدرًا وحيدًا للهوية؛ حافظ على البنية واللون وخط الشعر واللحية والعمر واللاتناظر المرئي دون إضافة سمات غير مؤكدة.' :
        'Use the attached reference as the only facial identity source. Preserve visible face geometry, skin tone, age, asymmetry, hairline, beard density and boundaries; do not invent unseen traits.',
      ar ? `الطول ${SUBJECT_HEIGHT_CM} سم، الوزن ${SUBJECT_WEIGHT_KG} كجم، بنية رياضية نحيلة.` :
        `Height ${SUBJECT_HEIGHT_CM}cm, weight ${SUBJECT_WEIGHT_KG}kg, lean athletic build.`,
      pick(i.hair), beard, expr
    ]);
    append(ar ? 'الكاميرا والتكوين' : 'CAMERA AND COMPOSITION', [
      ar ? 'سيلفي حقيقي بيد واحدة؛ الشخص العنصر الرئيسي، والخلفية لا تظهر إلا إن سمحت زاوية عدسة الهاتف. لا يُفرض امتداد الذراع الأقصى.' :
        'Authentic one-handed front-camera selfie. The person dominates naturally; background appears only within the physical phone field of view. Relaxed elbow, never forced maximum reach.',
      pick(i.aspect), pick(i.frame), pick(i.phone), pick(i.angle),
      optional(ar ? 'بصريات: ' : 'Optics: ', i.opticals),
      optional(ar ? 'إحساس الكاميرا: ' : 'Camera rendering: ', i.inAppArtifacts),
      optional(ar ? 'ملصقات ومعالجة التطبيق: ' : 'App overlays and processing: ', i.appUis)
    ]);
    append(ar ? 'الوضعية والملابس' : 'POSTURE AND CLOTHING', [
      pick(i.pose), pick(i.cloth), accessory,
      optional(ar ? 'سلوك القماش: ' : 'Fabric response: ', close ? i.fabrics.filter(x => x.id !== 'seat_hip_creases') : i.fabrics),
      optional(ar ? 'الحركة: ' : 'Motion: ', i.gripMotions.filter(x => x.id !== 'natural_arm_stretch'))
    ]);
    append(ar ? 'المكان والضوء الفيزيائي' : 'SCENE AND PHYSICAL LIGHTING', [
      inside
        ? (ar ? `موقع توقف السيارة (سياق فقط، لا تُفرض تفاصيل خارج النوافذ): ${pick(i.loc)}.`
              : `Parking location context, not a mandatory visible background: ${pick(i.loc)}.`)
        : pick(i.loc),
      inside
        ? (ar ? `جالس على مقعد سائق ${pick(i.carModel)}، ولا يُفرض لون الهيكل الخارجي في صورة من داخل المقصورة.`
              : `Seated in the driver seat of a ${pick(i.carModel)}; exterior body paint need not be visible in this interior selfie.`)
        : (ar ? `واقف خارج ${pick(i.carModel)} بلون ${pick(i.carColor)}.`
              : `Standing outside beside a ${pick(i.carColor)} ${pick(i.carModel)}.`),
      pick(i.light),
      i.tint.en.trim() ? pick(i.tint) : undefined,
      ar ? 'كل ظل وانعكاس ولمعة عين مرتبط بمصدر موجود واتجاه وشدة منطقية؛ لا إضاءة تعبئة أو ارتداد أبيض بلا مصدر، والثوب يعكس الضوء فقط.' :
        'Every shadow, catchlight and reflection must originate from a physically plausible light source, direction and intensity. White clothing reflects existing light; no invented fill.',
      optional(ar ? 'تفاصيل مكانية مرئية: ' : 'Visible environment: ', close ? [] : i.cabins),
      optional(ar ? 'تفاصيل ثانوية: ' : 'Secondary items: ', close ? [] : i.cabinArtifacts),
      optional(ar ? 'سطوح خلفية: ' : 'Background: ', close ? [] : i.clutters),
      optional(ar ? 'شاشات ظاهرة: ' : 'Visible screens: ', close ? [] : i.dashUis),
      optional(ar ? 'جو محلي: ' : 'Local atmosphere: ', i.microWeathers)
    ]);
    append(ar ? 'ضوابط واقعية نهائية' : 'FINAL REALISM CHECK', [
      ar ? 'لا أيدٍ إضافية، لا تفاصيل خارج مجال الكاميرا، لا تجميل للهوية أو وهج غير مبرر، ولا تأطير إعلاني للسيارة.' :
        'No extra hands, off-frame details, identity retouching, unmotivated glow or automotive-commercial framing.'
    ]);
    return normalized(sections.join('\n\n'));
  };
  return { ar: build('ar'), en: build('en') };
}
