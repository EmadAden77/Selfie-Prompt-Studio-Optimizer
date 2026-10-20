import React from 'react';
import { StepCategory, Opt, Cloth, Loc } from '../types/studio';
import {
  LOCATIONS,
  LIGHTING_OPTIONS,
  HAIR_STYLES,
  BEARD_STYLES,
  ANATOMICAL_EXPRESSIONS,
  HEIGHT_CUES,
  SKIN_NUANCES,
  FRAMINGS,
  ASPECTS,
  PHONES,
  ANGLES,
  POSES,
  OPTICAL_IMPERFECTIONS,
  CLOTHES,
  STORYLINES,
  ACCESSORIES,
  CAR_MODELS,
  CAR_COLORS,
  WINDOW_TINTS,
  CABIN_DETAILS,
  DASH_UI_DETAILS,
  DAILY_LIFE_CLUTTER,
  SUBSURFACE_PHYSICS,
  APP_UI_ELEMENTS,
  FABRIC_PHYSICS,
  THERMAL_CLIMATE_PHYSICS,
  GRIP_MOTION_NUANCES,
  AIRFLOW_OPTIONS,
  SCREEN_CAST_LIGHTING,
  CABIN_ARTIFACTS,
  TALL_ERGONOMICS,
  IN_APP_ARTIFACTS,
  MICRO_WEATHER,
} from '../data/studioData';

interface StepSectionsProps {
  activeStep: StepCategory;
  itemBg: string;
  borderTone: string;

  // Location & Independent Lighting (Step 1)
  locId: number;
  setLocId: (id: number) => void;
  locZoneFilter: 'all' | 'inside' | 'outside';
  setLocZoneFilter: (f: 'all' | 'inside' | 'outside') => void;
  locSearch: string;
  setLocSearch: (s: string) => void;
  lightId: string;
  setLightId: (id: string) => void;
  carModelId: string;
  setCarModelId: (id: string) => void;
  carColorId: string;
  setCarColorId: (id: string) => void;
  tintId: string;
  setTintId: (id: string) => void;
  cabinIds: string[];
  setCabinIds: React.Dispatch<React.SetStateAction<string[]>>;
  screenCastIds: string[];
  setScreenCastIds: React.Dispatch<React.SetStateAction<string[]>>;
  cabinArtifactIds: string[];
  setCabinArtifactIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Reference Subject (Step 2)
  hairId: string;
  setHairId: (id: string) => void;
  beardId: string;
  setBeardId: (id: string) => void;
  anatomicalExprId: string;
  setAnatomicalExprId: (id: string) => void;
  heightCueId: string;
  setHeightCueId: (id: string) => void;
  skinNuanceIds: string[];
  setSkinNuanceIds: React.Dispatch<React.SetStateAction<string[]>>;
  tallErgonomicIds: string[];
  setTallErgonomicIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Framing & Optics (Step 3)
  frameId: string;
  setFrameId: (id: string) => void;
  phoneId: string;
  setPhoneId: (id: string) => void;
  angleId: string;
  setAngleId: (id: string) => void;
  poseId: string;
  setPoseId: (id: string) => void;
  aspectId: string;
  setAspectId: (id: string) => void;
  opticalIds: string[];
  setOpticalIds: React.Dispatch<React.SetStateAction<string[]>>;
  gripMotionIds: string[];
  setGripMotionIds: React.Dispatch<React.SetStateAction<string[]>>;
  inAppArtifactIds: string[];
  setInAppArtifactIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Attire & Storyline (Step 4)
  clothId: string;
  setClothId: (id: string) => void;
  accessoryId: string;
  setAccessoryId: (id: string) => void;
  storylineId: string;
  setStorylineId: (id: string) => void;
  airflowIds: string[];
  setAirflowIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Micro Physics (Step 5)
  subsurfaceIds: string[];
  setSubsurfaceIds: React.Dispatch<React.SetStateAction<string[]>>;
  fabricIds: string[];
  setFabricIds: React.Dispatch<React.SetStateAction<string[]>>;
  thermalIds: string[];
  setThermalIds: React.Dispatch<React.SetStateAction<string[]>>;
  appUiIds: string[];
  setAppUiIds: React.Dispatch<React.SetStateAction<string[]>>;
  dashUiIds: string[];
  setDashUiIds: React.Dispatch<React.SetStateAction<string[]>>;
  clutterIds: string[];
  setClutterIds: React.Dispatch<React.SetStateAction<string[]>>;
  microWeatherIds: string[];
  setMicroWeatherIds: React.Dispatch<React.SetStateAction<string[]>>;

  toggle: (id: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
}

export const StepSections: React.FC<StepSectionsProps> = ({
  activeStep,
  itemBg,
  borderTone,

  locId,
  setLocId,
  locZoneFilter,
  setLocZoneFilter,
  locSearch,
  setLocSearch,
  lightId,
  setLightId,
  carModelId,
  setCarModelId,
  carColorId,
  setCarColorId,
  tintId,
  setTintId,
  cabinIds,
  setCabinIds,
  screenCastIds,
  setScreenCastIds,
  cabinArtifactIds,
  setCabinArtifactIds,

  hairId,
  setHairId,
  beardId,
  setBeardId,
  anatomicalExprId,
  setAnatomicalExprId,
  heightCueId,
  setHeightCueId,
  skinNuanceIds,
  setSkinNuanceIds,
  tallErgonomicIds,
  setTallErgonomicIds,

  frameId,
  setFrameId,
  phoneId,
  setPhoneId,
  angleId,
  setAngleId,
  poseId,
  setPoseId,
  aspectId,
  setAspectId,
  opticalIds,
  setOpticalIds,
  gripMotionIds,
  setGripMotionIds,
  inAppArtifactIds,
  setInAppArtifactIds,

  clothId,
  setClothId,
  accessoryId,
  setAccessoryId,
  storylineId,
  setStorylineId,
  airflowIds,
  setAirflowIds,

  subsurfaceIds,
  setSubsurfaceIds,
  fabricIds,
  setFabricIds,
  thermalIds,
  setThermalIds,
  appUiIds,
  setAppUiIds,
  dashUiIds,
  setDashUiIds,
  clutterIds,
  setClutterIds,
  microWeatherIds,
  setMicroWeatherIds,

  toggle,
}) => {
  // Filter 40 locations by zone and live search
  const filteredLocs = LOCATIONS.filter(l => {
    const matchesZone = locZoneFilter === 'all' || l.zone === locZoneFilter;
    const matchesSearch =
      !locSearch ||
      l.ar.includes(locSearch) ||
      l.en.toLowerCase().includes(locSearch.toLowerCase());
    return matchesZone && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* الخطوة 1: الأماكن الـ 40 مع فصل تام للإنارة */}
      {activeStep === 'background' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                <span>📍</span> اختيار المكان السعودي (40 خياراً بدون أي معالم)
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                الأماكن نقية من أي تحديد زمني، ويتم ضبط الإضاءة بخيار مستقل تماماً أدناه.
              </p>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              40 Unique Locs
            </span>
          </div>

          {/* فلترة الأماكن وبحث فوري */}
          <div className="space-y-2">
            <div className="flex gap-1.5 text-xs">
              {[
                { id: 'all', label: 'الكل (40)' },
                { id: 'inside', label: '🚗 داخل السيارة (20)' },
                { id: 'outside', label: '🚶‍♂️ بجانب السيارة (20)' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setLocZoneFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition text-xs font-medium ${
                    locZoneFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : `${itemBg} opacity-80 hover:opacity-100`
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={locSearch}
              onChange={e => setLocSearch(e.target.value)}
              placeholder="ابحث في الأماكن الـ 40 (مثال: بر، شارع، مواقف، محطة، مزرعة)..."
              className={`w-full ${itemBg} border ${borderTone} rounded-xl px-3.5 py-2 text-xs outline-none text-zinc-200`}
            />

            {/* قائمة الأماكن */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1.5 border border-zinc-800/60 rounded-xl bg-black/20">
              {filteredLocs.map(l => (
                <div
                  key={l.id}
                  onClick={() => setLocId(l.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2 ${
                    locId === l.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md'
                      : `${itemBg} border-transparent hover:border-zinc-700`
                  }`}
                >
                  <span className="text-xs mt-0.5 opacity-60 font-mono">{l.id}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="leading-snug">{l.ar}</p>
                    <span className="text-[10px] opacity-70 block mt-1">
                      {l.zone === 'inside' ? '🚗 داخل الكابينة' : '🚶‍♂️ خارج بجانب السيارة'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* قسم الإضاءة والإنارة المستقل بالكامل (19 خياراً) */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>💡</span> نوع ومصدر الإضاءة والإنارة (خيار منفصل تماماً):
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">19 Standalone Lights</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1.5 border border-amber-500/20 rounded-xl bg-amber-950/10">
              {LIGHTING_OPTIONS.map(l => (
                <div
                  key={l.id}
                  onClick={() => setLightId(l.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    lightId === l.id
                      ? 'bg-amber-600 text-white border-amber-500 font-bold shadow-md'
                      : `${itemBg} border-transparent hover:border-zinc-700`
                  }`}
                >
                  <p className="leading-relaxed">{l.ar}</p>
                </div>
              ))}
            </div>
          </div>

          {/* السيارة والتظليل كخلفية ثانوية */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                🚙 طراز السيارة (بالخلفية):
              </label>
              <select
                value={carModelId}
                onChange={e => setCarModelId(e.target.value)}
                className={`w-full ${itemBg} border ${borderTone} rounded-xl p-2.5 text-xs outline-none text-zinc-200`}
              >
                {CAR_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.ar}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                🎨 لون السيارة:
              </label>
              <select
                value={carColorId}
                onChange={e => setCarColorId(e.target.value)}
                className={`w-full ${itemBg} border ${borderTone} rounded-xl p-2.5 text-xs outline-none text-zinc-200`}
              >
                {CAR_COLORS.map(c => (
                  <option key={c.id} value={c.id}>{c.ar}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                🕶️ تظليل النوافذ:
              </label>
              <select
                value={tintId}
                onChange={e => setTintId(e.target.value)}
                className={`w-full ${itemBg} border ${borderTone} rounded-xl p-2.5 text-xs outline-none text-zinc-200`}
              >
                {WINDOW_TINTS.map(t => (
                  <option key={t.id} value={t.id}>{t.ar}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              تفاصيل الكابينة والكونسول (خلفية ثانوية):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CABIN_DETAILS.map(item => {
                const on = cabinIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, cabinIds, setCabinIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📱 ارتداد أضواء الشاشات على الوجه والثوب (Screen Cast):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SCREEN_CAST_LIGHTING.map(item => {
                const on = screenCastIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, screenCastIds, setScreenCastIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🧺 مقتنيات الكابينة اليومية العفوية (Behind/Around):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CABIN_ARTIFACTS.map(item => {
                const on = cabinArtifactIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, cabinArtifactIds, setCabinArtifactIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 2: هوية بطل السيلفي */}
      {activeStep === 'subject' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2">
            <h2 className="text-sm md:text-base font-bold text-emerald-400">
              02. مواصفات بطل الصورة المرجعي (تثبيت الكثافة والملامح 100%)
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              يمنع منعاً باتاً تغيير سمك أو كثافة شعر الرأس أو اللحية الأصلية للمرجع أو اختراع ملامح غير موجودة.
            </p>
          </div>

          {/* Reference Subject Identity Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/40 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                  👤
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">بطل الصورة وهيمنة الكادر (75%–85%)</span>
                  <span className="text-[10px] text-zinc-400">قفل بيومتري مطابق للصورة المرجعية 1:1</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                193cm • 83kg • Lean Athletic
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-zinc-800">
              <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-[9px] text-zinc-400 block">شكل الوجه والعظام:</span>
                <span className="font-bold text-emerald-400">مطابق للمرجع 100%</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-[9px] text-zinc-400 block">كثافة الشعر وخطه:</span>
                <span className="font-bold text-zinc-200">مقفول طبيعياً</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-[9px] text-zinc-400 block">كثافة اللحية والشارب:</span>
                <span className="font-bold text-zinc-200">أصلية غير ليزرية</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-[9px] text-zinc-400 block">البشرة والعمر:</span>
                <span className="font-bold text-zinc-200">طبيعي بدون فلترة</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              💇‍♂️ تسريحة شعر الرأس (مع الحفاظ الصارم على نفس الكثافة وخط الشعر):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HAIR_STYLES.map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHairId(h.id)}
                  className={`p-3 rounded-xl text-xs text-right border transition ${
                    hairId === h.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-md'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {h.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🧔 تنسيق اللحية (نفس الكثافة الطبيعية والشكل الأصلي):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BEARD_STYLES.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBeardId(b.id)}
                  className={`p-3 rounded-xl text-xs text-right border transition ${
                    beardId === b.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-md'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {b.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🎭 التشريح الحركي وتعبير الوجه (عضلي عفوي غير متصلب):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ANATOMICAL_EXPRESSIONS.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setAnatomicalExprId(e.id)}
                  className={`p-2.5 rounded-xl text-xs text-right border transition ${
                    anatomicalExprId === e.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {e.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📏 تناسق القامة الفارهة (193 سم):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {HEIGHT_CUES.map(hc => (
                <button
                  key={hc.id}
                  type="button"
                  onClick={() => setHeightCueId(hc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    heightCueId === hc.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : `${itemBg} text-zinc-300`
                  }`}
                >
                  {hc.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📐 ديناميكية جسد القامة الفارهة (193 سم Ergonomics):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TALL_ERGONOMICS.map(item => {
                const on = tallErgonomicIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, tallErgonomicIds, setTallErgonomicIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              تفاصيل البشرة الحية ومسام الجلد:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SKIN_NUANCES.map(item => {
                const on = skinNuanceIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, skinNuanceIds, setSkinNuanceIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 3: الكادر والكاميرا */}
      {activeStep === 'framing' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2">
            <h2 className="text-sm md:text-base font-bold text-emerald-400">
              03. تأطير الكادر ومحاكاة السيلفي باليد
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              الشخص يملأ 80% من الكادر والمسافة الطبيعية لذراع السيلفي.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🎯 أولوية التأطير (الشخص المرجعي أولاً):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FRAMINGS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrameId(f.id)}
                  className={`p-3 rounded-xl text-xs text-right border transition ${
                    frameId === f.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {f.ar}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                📱 هاتف الالتقاط:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PHONES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPhoneId(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      phoneId === p.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : `${itemBg} text-zinc-300`
                    }`}
                  >
                    {p.ar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                📐 زاوية التصوير:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ANGLES.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAngleId(a.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      angleId === a.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : `${itemBg} text-zinc-300`
                    }`}
                  >
                    {a.ar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🤳 وضعية اليد وحركة السيلفي:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POSES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPoseId(p.id)}
                  className={`p-2.5 rounded-xl text-xs text-right border transition ${
                    poseId === p.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {p.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📐 نسبة أبعاد الصورة:
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAspectId(a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    aspectId === a.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : `${itemBg} text-zinc-300`
                  }`}
                >
                  {a.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📸 بصريات وعيوب العدسة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {OPTICAL_IMPERFECTIONS.map(item => {
                const on = opticalIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, opticalIds, setOpticalIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📸 معالجة وعيوب كاميرا السناب شات المباشرة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {IN_APP_ARTIFACTS.map(item => {
                const on = inAppArtifactIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, inAppArtifactIds, setInAppArtifactIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 4: المظهر والقصة */}
      {activeStep === 'attire' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2">
            <h2 className="text-sm md:text-base font-bold text-emerald-400">
              04. المظهر الخارجي وسياق اللقطة العفوي
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              الملابس وإكسسوارات الشخص والسبب العفوي لالتقاط السيلفي.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              👔 الملابس والمظهر:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CLOTHES.map(c => (
                <div
                  key={c.id}
                  onClick={() => setClothId(c.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    clothId === c.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow'
                      : `${itemBg} border-transparent hover:border-zinc-700`
                  }`}
                >
                  <span>{c.ar}</span>
                  <span className="text-[10px] opacity-70 px-2 py-0.5 rounded bg-black/30 font-medium">
                    {c.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              💨 حركة الهواء وديناميكية التكييف على الخصلات والقماش:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AIRFLOW_OPTIONS.map(item => {
                const on = airflowIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, airflowIds, setAirflowIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              📖 سياق القصة والسبب العفوي للسيلفي:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STORYLINES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStorylineId(s.id)}
                  className={`p-3 rounded-xl text-xs text-right border transition ${
                    storylineId === s.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow'
                      : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {s.ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              🕶️ إكسسوار شخصي:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ACCESSORIES.map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccessoryId(acc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    accessoryId === acc.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : `${itemBg} text-zinc-300`
                  }`}
                >
                  {acc.ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 5: الفيزياء المجهرية وسناب شات */}
      {activeStep === 'physics' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2">
            <h2 className="text-sm md:text-base font-bold text-emerald-400">
              05. تفاصيل الواقعية المجهرية ومحاكاة السناب
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              تفعيل العيوب والفيزياء البصرية الدقيقة لكسر الذكاء الاصطناعي 100%.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              🩸 تشتت الضوء تحت الجلد (Subsurface Scattering):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUBSURFACE_PHYSICS.map(item => {
                const on = subsurfaceIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, subsurfaceIds, setSubsurfaceIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              🌧️ تفاصيل الطقس الموضعي اللحظي (Micro-Weather):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MICRO_WEATHER.map(item => {
                const on = microWeatherIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, microWeatherIds, setMicroWeatherIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              📱 شاشة وتطبيقات التواصل (سناب شات):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {APP_UI_ELEMENTS.map(item => {
                const on = appUiIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, appUiIds, setAppUiIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              👕 فيزياء الأقمشة وكسرات الجلوس:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FABRIC_PHYSICS.map(item => {
                const on = fabricIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, fabricIds, setFabricIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              🌡️ فيزياء الطقس والمناخ المجهري:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {THERMAL_CLIMATE_PHYSICS.map(item => {
                const on = thermalIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, thermalIds, setThermalIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              🤳 عيوب مسكة اليد والاهتزاز العفوي:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GRIP_MOTION_NUANCES.map(item => {
                const on = gripMotionIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, gripMotionIds, setGripMotionIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              فوضى مقصورة السيارة المحيطة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DAILY_LIFE_CLUTTER.map(item => {
                const on = clutterIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id, clutterIds, setClutterIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                      on
                        ? 'bg-emerald-600 text-white font-semibold border-emerald-500 shadow-sm'
                        : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                    }`}
                  >
                    {item.ar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
