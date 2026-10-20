import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

/* =================== القوائم الأساسية =================== */
type Zone = 'inside' | 'outside';
interface Loc { id: number; zone: Zone; ar: string; en: string; }
interface Opt { id: string; ar: string; en: string; }

export const LOCATIONS: Loc[] = [
  // داخل السيارة
  { id: 1, zone: 'inside', ar: 'مواقف سكنية مظللة', en: 'shaded residential parking' },
  { id: 2, zone: 'inside', ar: 'شارع حي هادئ', en: 'quiet neighborhood street' },
  { id: 3, zone: 'inside', ar: 'مسار خدمة بطيء بمحاذاة طريق سريع', en: 'slow service road lane parallel to highway' },
  { id: 4, zone: 'inside', ar: 'مسار طلبات درايف ثرو', en: 'coffee drive-thru queue' },
  { id: 5, zone: 'inside', ar: 'مواقف قبو سفلية لمبنى سكني', en: 'underground basement parking lot' },
  { id: 6, zone: 'inside', ar: 'كتف طريق صحراوي مفتوح', en: 'desert highway shoulder stop' },
  { id: 7, zone: 'inside', ar: 'مسار محطة وقود بين المضخات', en: 'fuel station pump lane' },
  { id: 8, zone: 'inside', ar: 'شارع تجاري محلي هادئ', en: 'quiet local commercial street' },
  // خارج السيارة
  { id: 21, zone: 'outside', ar: 'بجانب باب السائق في شارع سكني', en: 'standing beside driver door on residential street' },
  { id: 22, zone: 'outside', ar: 'متكئ على كبوت السيارة في ساحة نفود رملية', en: 'leaning casually against front hood in desert sands' },
  { id: 23, zone: 'outside', ar: 'بجانب السيارة في أرض ترابية مفتوحة', en: 'beside vehicle on open dirt ground' },
  { id: 24, zone: 'outside', ar: 'خلف السيارة والصندوق الخلفي مفتوح', en: 'standing behind car with open tailgate' },
  { id: 25, zone: 'outside', ar: 'بجانب السيارة تحت كوبري خرساني', en: 'beside vehicle beneath concrete flyover' },
  { id: 26, zone: 'outside', ar: 'بجانب السيارة في ساحة مواقف واسعة', en: 'beside car in wide empty asphalt lot' },
];

export const LIGHTING_OPTIONS: Opt[] = [
  { id: 'night_cabin_glow', ar: 'وهج الطبلون وأنوار المرور الليلية', en: 'night traffic ambient with dashboard display glow' },
  { id: 'sodium_street', ar: 'إنارة أعمدة الشوارع الصفراء (صوديوم)', en: 'warm amber sodium streetlights' },
  { id: 'direct_flash', ar: 'فلاش الكاميرا المباشر في العتمة', en: 'raw direct smartphone flash with natural reflections' },
  { id: 'noon_sun', ar: 'شمس ظهيرة ساطعة وظلال طبيعية', en: 'bright midday sun with sharp natural shadows' },
  { id: 'golden_hour', ar: 'الساعة الذهبية قبل الغروب', en: 'warm golden-hour low directional sunlight' },
  { id: 'station_led', ar: 'إضاءة سقف محطة الوقود البيضاء', en: 'bright overhead canopy LED lights' },
];

export const CLOTHES: Opt[] = [
  { id: 'tee_black_ref', ar: 'تيشيرت أسود فحمي سادة (مطابق للمرجع)', en: 'charcoal dark crewneck t-shirt identical to reference' },
  { id: 'thobe_white', ar: 'ثوب أبيض سعودي كلاسيكي بدون شماغ', en: 'clean crisp tailored white Saudi thobe, no headwear' },
  { id: 'thobe_shmagh', ar: 'ثوب أبيض مع شماغ أحمر كاجوال', en: 'white thobe with casually draped red shemagh' },
  { id: 'sport_dark', ar: 'تيشيرت رياضي كحلي مريح', en: 'dark athletic gym t-shirt' },
];

export const CAR_MODELS: Opt[] = [
  { id: 'landcruiser', ar: 'تويوتا لاندكروزر LC300 أبيض', en: 'pearl white Toyota Land Cruiser LC300' },
  { id: 'patrol', ar: 'نيسان باترول بطل الدروب', en: 'Nissan Patrol Y62' },
  { id: 'rr_sport', ar: 'رنج روفر سبورت رمادي', en: 'Range Rover Sport in cement gray' },
  { id: 'yukon', ar: 'جي إم سي يوكن دينالي أسود', en: 'black GMC Yukon Denali' },
];

export interface FlashPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  locId: number;
  lightId: string;
  clothId: string;
  carId: string;
  customNote: string;
}

const QUICK_FLASH_PRESETS: FlashPreset[] = [
  {
    id: 'night_drive_thru',
    nameAr: '☕ درايف ثرو القهوة الليلي',
    nameEn: 'Coffee Drive-thru Night',
    icon: '☕',
    locId: 4,
    lightId: 'night_cabin_glow',
    clothId: 'tee_black_ref',
    carId: 'patrol',
    customNote: 'في طابور طلبات درايف ثرو بالليل، مبتسم بهدوء ومسترخي بانتظار القهوة',
  },
  {
    id: 'desert_hood_lean',
    nameAr: '🏜️ وقفة النفود متكئاً على الكبوت',
    nameEn: 'Desert Sunset Hood Lean',
    icon: '🏜️',
    locId: 22,
    lightId: 'golden_hour',
    clothId: 'thobe_white',
    carId: 'landcruiser',
    customNote: 'متكئ بعفوية على كبوت لاندكروزر بالنفود، شمس ذهبية مائلة ورياح لطيفة',
  },
  {
    id: 'direct_flash_snap',
    nameAr: '⚡ فلاش مباشر عالي التباين',
    nameEn: 'Raw Direct Flash Selfie',
    icon: '⚡',
    locId: 2,
    lightId: 'direct_flash',
    clothId: 'tee_black_ref',
    carId: 'rr_sport',
    customNote: 'سيلفي فلاش مباشر في عتمة الحي الهادئ، ملامح المرجع دقيقة ولمعة بشرة طبيعية',
  },
  {
    id: 'highway_station_rest',
    nameAr: '⛽ محطة وقود الطريق السريع',
    nameEn: 'Highway Fuel Station Stop',
    icon: '⛽',
    locId: 7,
    lightId: 'station_led',
    clothId: 'thobe_shmagh',
    carId: 'yukon',
    customNote: 'استراحة مسافر بمحطة وقود ليلاً بين المضخات، كوب كرك دافئ وراحة خط',
  },
  {
    id: 'sodium_street_evening',
    nameAr: '💡 أنوار الصوديوم العنبرية بالحي',
    nameEn: 'Warm Sodium Streetlights',
    icon: '💡',
    locId: 2,
    lightId: 'sodium_street',
    clothId: 'tee_black_ref',
    carId: 'landcruiser',
    customNote: 'واقف عند إشارة حمراء وزهقان، يبتسم بهدوء مع وهج أعمدة الصوديوم الدافئة',
  },
];

interface QuickFlashGeneratorProps {
  onApplyToStudio?: (data: {
    locId: number;
    lightId: string;
    clothId: string;
    carModelId: string;
    promptText: string;
  }) => void;
  onOpenPromptEditor?: (promptText: string) => void;
  hasSnapshot?: boolean;
  onRestoreStudioSnapshot?: () => void;
}

export const QuickFlashGenerator: React.FC<QuickFlashGeneratorProps> = ({
  onApplyToStudio,
  onOpenPromptEditor,
  hasSnapshot,
  onRestoreStudioSnapshot,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [zoneFilter, setZoneFilter] = useState<'all' | 'inside' | 'outside'>('all');
  const [locId, setLocId] = useState(2);
  const [lightId, setLightId] = useState('sodium_street');
  const [clothId, setClothId] = useState('tee_black_ref');
  const [carId, setCarId] = useState('landcruiser');
  const [customNote, setCustomNote] = useState('واقف عند إشارة حمراء وزهقان، يبتسم بهدوء');

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loc = LOCATIONS.find(l => l.id === locId) || LOCATIONS[0];
  const light = LIGHTING_OPTIONS.find(l => l.id === lightId) || LIGHTING_OPTIONS[0];
  const cloth = CLOTHES.find(c => c.id === clothId) || CLOTHES[0];
  const car = CAR_MODELS.find(c => c.id === carId) || CAR_MODELS[0];

  const filteredLocations = LOCATIONS.filter(l => {
    if (zoneFilter === 'all') return true;
    return l.zone === zoneFilter;
  });

  // Deterministic local generator ensuring immediate high-fidelity output anytime
  const buildDeterministicPrompt = () => {
    const isInside = loc.zone === 'inside';
    const vehicleContext = isInside
      ? `sitting in driver seat inside (${car.en}), cabin details visible organically around broad shoulders`
      : `standing outside casually beside (${car.en}) in background`;

    return `👑 MASTER COMPOSITION MANDATE: SUBJECT-FIRST SELFIE HIERARCHY
The reference person is the ABSOLUTE PRIMARY SUBJECT dominating 80% of the vertical 9:16 frame as a handheld smartphone selfie held at arm's length (natural ~75cm extension).
Incidental Background: ${loc.en} (${vehicleContext}). The vehicle is strictly secondary background.

🔒 STRICT IDENTITY & BIOMETRIC DENSITY LOCK:
- Use the attached reference as the only identity source; preserve only visible facial geometry, skin tone, age cues, natural asymmetry, hairline, hair density, beard boundaries and beard growth pattern.
- Do not invent eye color, freckles, wrinkles, ethnicity, hair, or beard traits that are not visible in the reference.
- Keep the reference appearance natural, without smoothing, airbrushing, or artificial beautification.

👤 Dominant Subject Parameters:
- Physique: 193 cm (6'4"), 83 kg, lean athletic build, broad shoulders anchoring lower frame.
- Outfit: ${cloth.en}.
- Mood / Story Context: ${customNote}.

💡 Optical & Lighting Profile:
- Illumination: ${light.en}.
- Lens & Capture: Shot on front camera, 24mm equivalent wide selfie perspective with subtle natural barrel distortion, authentic CMOS luminance grain in shadow zones, no studio lights.

🚫 FORBIDDEN: studio lighting, unreal engine, airbrushing, car commercial framing, full vehicle centered, changing facial identity, altering beard density.
📐 Target Aspect: 9:16 vertical smartphone format.`;
  };

  // Generate through the server-side Gemini proxy, then fall back to the deterministic local engine
  const handleGenerate = async (customNoteOverride?: string) => {
    setIsLoading(true);
    const activeNote = customNoteOverride || customNote;

    try {
      // 1. Send to server proxy route
      const res = await fetch('/api/gemini/quick-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loc,
          car,
          light,
          cloth,
          customNote: activeNote,
          customApiKey: apiKey.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.success && data.text) {
          setGeneratedPrompt(data.text.trim());
          showToast('✓ تم توليد البرومبت الفائق عبر Gemini Flash');
          return;
        }
      }

      // Fallback: Local instant high-fidelity deterministic engine
      const localPrompt = buildDeterministicPrompt();
      setGeneratedPrompt(localPrompt);
      showToast('✓ تم إنشاء البرومبت فائق الواقعية بنجاح');
    } catch {
      // Deterministic fallback ensures user is never blocked
      const localPrompt = buildDeterministicPrompt();
      setGeneratedPrompt(localPrompt);
      showToast('✓ تم إنشاء البرومبت فائق الواقعية بنجاح');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPrompt = async () => {
    if (!generatedPrompt) return;
    const ok = await copyToClipboard(generatedPrompt);
    if (ok) {
      showToast('✓ تم نسخ البرومبت بنجاح إلى الحافظة');
    } else {
      showToast('⚠️ تعذر النسخ، يرجى تحديده يدوياً');
    }
  };

  const handleApplyPreset = (preset: FlashPreset) => {
    setLocId(preset.locId);
    setLightId(preset.lightId);
    setClothId(preset.clothId);
    setCarId(preset.carId);
    setCustomNote(preset.customNote);
    showToast(`✓ تم تطبيق قالب: ${preset.nameAr}`);
  };

  const handleApplyToStudio = () => {
    if (!generatedPrompt) return;
    const carModelMap: Record<string, string> = {
      landcruiser: 'landcruiser_lc300',
      patrol: 'patrol_y62',
      rr_sport: 'rr_sport_2017',
      yukon: 'yukon_denali',
    };
    onApplyToStudio?.({
      locId,
      lightId,
      clothId,
      carModelId: carModelMap[carId] || 'landcruiser_lc300',
      promptText: generatedPrompt,
    });
  };

  return (
    <div className="space-y-5 text-zinc-100" dir="rtl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs md:text-sm px-5 py-2.5 rounded-full shadow-2xl font-bold flex items-center gap-2 border border-emerald-400/40 animate-bounce">
          <span>⚡</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90 border border-emerald-500/30 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base md:text-lg text-white">
                  وضع الفلاش السريع (Quick Flash Mode)
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  Gemini 3.8 Flash
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full font-mono">
                  193cm • 83kg • 80% Frame
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                توليد فوري ذكي لسيلفي متناسق فيزيائياً بدون تناقضات، مع إمكانية التنقل الحر والرجوع لإعدادات الاستوديو السابقة بضغطة واحدة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {hasSnapshot && onRestoreStudioSnapshot && (
              <button
                onClick={onRestoreStudioSnapshot}
                className="px-3.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 text-xs font-bold border border-amber-500/40 transition flex items-center gap-1.5 shadow-sm"
                title="استعادة حالة الاستوديو قبل تفعيل وضع الفلاش"
              >
                <span>↩️</span>
                <span>استعادة الاستوديو</span>
              </button>
            )}

            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold border border-zinc-700/80 transition flex items-center gap-1.5"
            >
              <span>🔑</span>
              <span>{apiKey ? 'مفتاح مخصص' : 'المفتاح (تلقائي)'}</span>
            </button>
          </div>
        </div>

        {/* Coherent Quick Presets Carousel */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>⚡</span>
              <span>قوالب فلاش سريعة متناسقة 100% (Instant Coherent Presets):</span>
            </span>
            <span className="text-[10px] text-zinc-500">اختر قالباً للتعبئة والتوليد الفوري</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {QUICK_FLASH_PRESETS.map(preset => {
              const isActive = locId === preset.locId && lightId === preset.lightId && clothId === preset.clothId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-base mb-1">{preset.icon}</div>
                  <div className="font-bold text-xs line-clamp-1">{preset.nameAr}</div>
                  <div className="text-[9px] text-zinc-500 font-mono mt-0.5 line-clamp-1">{preset.nameEn}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: Setting & Location */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>📍</span>
                <span>المكان والمنطقة (Setting & Zone)</span>
              </label>

              {/* Zone Filter */}
              <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setZoneFilter('all')}
                  className={`px-2 py-0.5 rounded-md transition ${zoneFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  الكل ({LOCATIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setZoneFilter('inside')}
                  className={`px-2 py-0.5 rounded-md transition ${zoneFilter === 'inside' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  داخل ({LOCATIONS.filter(l => l.zone === 'inside').length})
                </button>
                <button
                  type="button"
                  onClick={() => setZoneFilter('outside')}
                  className={`px-2 py-0.5 rounded-md transition ${zoneFilter === 'outside' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  خارج ({LOCATIONS.filter(l => l.zone === 'outside').length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredLocations.map(l => {
                const isSelected = locId === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLocId(l.id)}
                    className={`text-right p-2.5 rounded-xl border transition flex flex-col justify-between text-xs ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold">{l.ar}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${l.zone === 'inside' ? 'bg-blue-900/40 text-blue-300' : 'bg-amber-900/40 text-amber-300'}`}>
                        {l.zone === 'inside' ? 'داخل' : 'خارج'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 line-clamp-1">{l.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Car Models */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="border-b border-zinc-800/80 pb-2">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>🚘</span>
                <span>طراز السيارة في الخلفية (Car Model)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAR_MODELS.map(c => {
                const isSelected = carId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCarId(c.id)}
                    className={`text-right p-3 rounded-xl border transition text-xs ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-zinc-100">{c.ar}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">{c.en}</div>
                  </button>
                );
              })}
            </div>

            {/* Logical Consistency Notice */}
            <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
              <span className="text-emerald-400">🛡️</span>
              <span>
                {loc.zone === 'inside'
                  ? 'منطق محكم: الجلوس بمقعد السائق داخل ' + car.ar
                  : 'منطق محكم: الوقوف بالخارج بجانب ' + car.ar}
              </span>
            </div>
          </div>

          {/* Section 3: Lighting Options */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="border-b border-zinc-800/80 pb-2">
              <label className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>بيئة الإضاءة وظروف التصوير (Lighting)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIGHTING_OPTIONS.map(l => {
                const isSelected = lightId === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLightId(l.id)}
                    className={`text-right p-2.5 rounded-xl border transition text-xs ${
                      isSelected
                        ? 'bg-yellow-950/40 border-yellow-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{l.ar}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{l.en}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Clothes & Attire */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="border-b border-zinc-800/80 pb-2">
              <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <span>👕</span>
                <span>الملابس والمظهر (Outfit)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CLOTHES.map(c => {
                const isSelected = clothId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setClothId(c.id)}
                    className={`text-right p-2.5 rounded-xl border transition text-xs ${
                      isSelected
                        ? 'bg-sky-950/50 border-sky-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{c.ar}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{c.en}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Mood & Story Note */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
          <label className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <span>🎭</span>
            <span>القصة والعفوية والمزاج (Mood / Story / Realism Note)</span>
          </label>
          <input
            type="text"
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            placeholder="مثال: واقف عند إشارة حمراء وزهقان، يبتسم بهدوء..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
            <span className="text-zinc-500 self-center text-[10px]">اقتراحات سريعة:</span>
            {[
              'واقف عند إشارة حمراء وزهقان، يبتسم بهدوء',
              'رشفة قهوة الصباح قبل الدوام ونظرة تركيز خفيفة',
              'بعد التمرين بالنادي ومسترخي ومبتسم عفوياً',
              'وقفة خط سريع في طريق سفر مع كوب كرك',
            ].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setCustomNote(s)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition text-[11px]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-indigo-950/60 border border-emerald-500/30 p-4 rounded-2xl">
          <div className="text-xs">
            <span className="font-bold text-white block">
              جاهز لتوليد البرومبت عبر Gemini 3.8 Flash
            </span>
            <span className="text-zinc-400 text-[11px]">
              صياغة فوتوغرافية احترافية بدون كلمات تسويقية زائفة مع نسبة 80% للبطل المرجعي (193 سم / 83 كجم)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin text-base">⏳</span>
                  <span>جاري التوليد عبر Flash...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>توليد البرومبت الآن</span>
                </>
              )}
            </button>

            {generatedPrompt && (
              <button
                onClick={() => handleGenerate(customNote + ' (تنويع بصري عفوي جديد)')}
                disabled={isLoading}
                className="px-3.5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition flex items-center gap-1.5"
                title="توليد تنويع جديد لنفس الإعدادات"
              >
                <span>🎲</span>
                <span>تنويع</span>
              </button>
            )}
          </div>
        </div>

        {/* Output Section */}
        {generatedPrompt && (
          <div className="bg-zinc-900/90 border border-emerald-500/40 rounded-2xl p-4 space-y-3.5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-base">✓</span>
                <h3 className="font-bold text-xs md:text-sm text-emerald-300">
                  البرومبت الناتج الجاهز لـ Midjourney و ChatGPT
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                9:16 Subject-First (80%)
              </span>
            </div>

            <div
              dir="ltr"
              className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-200 text-xs md:text-sm font-mono leading-relaxed select-all"
            >
              {generatedPrompt}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={copyPrompt}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>📋</span>
                  <span>نسخ الأمر الفوري</span>
                </button>

                {onOpenPromptEditor && (
                  <button
                    onClick={() => onOpenPromptEditor(generatedPrompt)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>✍️</span>
                    <span>تعديل في المحرر</span>
                  </button>
                )}
              </div>

              {onApplyToStudio && (
                <button
                  onClick={handleApplyToStudio}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <span>🔄</span>
                  <span>نقل الإعدادات والأمر للاستوديو الكامل</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-bold text-sm text-white">إعداد مفتاح Gemini API</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              يستخدم التطبيق مفتاح الخادم عند تشغيله خلف خادم Node. يمكنك إدخال مفتاحك الشخصي لهذه الجلسة فقط؛ لن يُحفظ في المتصفح ولن يُرسل مباشرة إلى Google من الواجهة:
            </p>

            <input
              type="password"
              value={tempKeyInput}
              onChange={e => setTempKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              autoComplete="off"
              dir="ltr"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
            />

            <div className="flex items-center justify-between pt-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey('');
                    setTempKeyInput('');
                    showToast('تمت إزالة المفتاح المخصص من الجلسة');
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  إزالة المفتاح
                </button>
              )}

              <div className="flex gap-2 mr-auto">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = tempKeyInput.trim();
                    if (trimmed) {
                      setApiKey(trimmed);
                      showToast('✓ تم حفظ المفتاح لهذه الجلسة فقط');
                    }
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
