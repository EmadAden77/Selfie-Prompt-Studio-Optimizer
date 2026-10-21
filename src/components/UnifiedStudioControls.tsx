import React, { useState, useMemo } from 'react';
import { Opt, Cloth, Loc } from '../types/studio';
import type { AutoCameraPlan, CameraMode } from '../types/studio';
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
import { analyzeLocationLighting, TimeOfDay } from '../utils/lightingEngine';
import { optionLockReason, OptionGroup } from '../utils/optionCompatibility';

interface UnifiedStudioControlsProps {
  itemBg: string;
  borderTone: string;
  darkMode: boolean;

  // 1. Location & Vehicle
  locId: number;
  setLocId: (id: number) => void;
  carModelId: string;
  setCarModelId: (id: string) => void;
  carColorId: string;
  setCarColorId: (id: string) => void;
  tintId: string;
  setTintId: (id: string) => void;

  // 2. Smart Lighting
  lightId: string;
  setLightId: (id: string) => void;
  autoLighting: boolean;
  setAutoLighting: (auto: boolean) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;

  // 3. Reference & Identity
  hairId: string;
  setHairId: (id: string) => void;
  beardId: string;
  setBeardId: (id: string) => void;
  anatomicalExprId: string;
  setAnatomicalExprId: (id: string) => void;
  heightCueId: string;
  setHeightCueId: (id: string) => void;
  tallErgonomicIds: string[];
  setTallErgonomicIds: React.Dispatch<React.SetStateAction<string[]>>;

  // 4. Framing & Camera
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  cameraPlan: AutoCameraPlan;
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

  // 5. Appearance & Storyline
  clothId: string;
  setClothId: (id: string) => void;
  accessoryId: string;
  setAccessoryId: (id: string) => void;
  storylineId: string;
  setStorylineId: (id: string) => void;

  // 6. Realism & Advanced Physics
  skinNuanceIds: string[];
  setSkinNuanceIds: React.Dispatch<React.SetStateAction<string[]>>;
  opticalIds: string[];
  setOpticalIds: React.Dispatch<React.SetStateAction<string[]>>;
  thermalIds: string[];
  setThermalIds: React.Dispatch<React.SetStateAction<string[]>>;
  screenCastIds: string[];
  setScreenCastIds: React.Dispatch<React.SetStateAction<string[]>>;
  gripMotionIds: string[];
  setGripMotionIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Expandable Advanced Physics
  subsurfaceIds: string[];
  setSubsurfaceIds: React.Dispatch<React.SetStateAction<string[]>>;
  fabricIds: string[];
  setFabricIds: React.Dispatch<React.SetStateAction<string[]>>;
  appUiIds: string[];
  setAppUiIds: React.Dispatch<React.SetStateAction<string[]>>;
  dashUiIds: string[];
  setDashUiIds: React.Dispatch<React.SetStateAction<string[]>>;
  clutterIds: string[];
  setClutterIds: React.Dispatch<React.SetStateAction<string[]>>;
  cabinIds: string[];
  setCabinIds: React.Dispatch<React.SetStateAction<string[]>>;
  cabinArtifactIds: string[];
  setCabinArtifactIds: React.Dispatch<React.SetStateAction<string[]>>;
  airflowIds: string[];
  setAirflowIds: React.Dispatch<React.SetStateAction<string[]>>;
  inAppArtifactIds: string[];
  setInAppArtifactIds: React.Dispatch<React.SetStateAction<string[]>>;
  microWeatherIds: string[];
  setMicroWeatherIds: React.Dispatch<React.SetStateAction<string[]>>;

  toggle: (id: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
}

export const UnifiedStudioControls: React.FC<UnifiedStudioControlsProps> = ({
  itemBg,
  borderTone,
  darkMode,

  locId,
  setLocId,
  carModelId,
  setCarModelId,
  carColorId,
  setCarColorId,
  tintId,
  setTintId,

  lightId,
  setLightId,
  autoLighting,
  setAutoLighting,
  timeOfDay,
  setTimeOfDay,

  hairId,
  setHairId,
  beardId,
  setBeardId,
  anatomicalExprId,
  setAnatomicalExprId,
  heightCueId,
  setHeightCueId,
  tallErgonomicIds,
  setTallErgonomicIds,

  cameraMode,
  setCameraMode,
  cameraPlan,
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

  clothId,
  setClothId,
  accessoryId,
  setAccessoryId,
  storylineId,
  setStorylineId,

  skinNuanceIds,
  setSkinNuanceIds,
  opticalIds,
  setOpticalIds,
  thermalIds,
  setThermalIds,
  screenCastIds,
  setScreenCastIds,
  gripMotionIds,
  setGripMotionIds,

  subsurfaceIds,
  setSubsurfaceIds,
  fabricIds,
  setFabricIds,
  appUiIds,
  setAppUiIds,
  dashUiIds,
  setDashUiIds,
  clutterIds,
  setClutterIds,
  cabinIds,
  setCabinIds,
  cabinArtifactIds,
  setCabinArtifactIds,
  airflowIds,
  setAirflowIds,
  inAppArtifactIds,
  setInAppArtifactIds,
  microWeatherIds,
  setMicroWeatherIds,

  toggle,
}) => {
  // Local UI filters and collapsibility states
  const [locSearch, setLocSearch] = useState('');
  const [locZoneFilter, setLocZoneFilter] = useState<'all' | 'inside' | 'outside'>('all');
  const [showVehicleCustomizer, setShowVehicleCustomizer] = useState(false);
  const [showAllLightingOptions, setShowAllLightingOptions] = useState(false);
  const [showAdvancedPhysics, setShowAdvancedPhysics] = useState(false);

  // Analyze location lighting with intelligent engine
  const lightingAnalysis = useMemo(
    () => analyzeLocationLighting(locId, timeOfDay),
    [locId, timeOfDay]
  );

  // Selected location details
  const selectedLocation = useMemo(
    () => LOCATIONS.find(l => l.id === locId) || LOCATIONS[0],
    [locId]
  );

  // Filtered locations (search and inside/outside zone)
  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(l => {
      const matchZone = locZoneFilter === 'all' || l.zone === locZoneFilter;
      const matchSearch =
        !locSearch.trim() ||
        l.ar.toLowerCase().includes(locSearch.toLowerCase()) ||
        l.en.toLowerCase().includes(locSearch.toLowerCase());
      return matchZone && matchSearch;
    });
  }, [locZoneFilter, locSearch]);

  const isOutside = selectedLocation.zone === 'outside';
  const lockReason = (group: OptionGroup, id: string) => optionLockReason(group, id, {
    zone: selectedLocation.zone,
    time: timeOfDay,
    lightingId: lightId,
    poseId,
    frameId,
    selectedCabinIds: cabinIds,
    clothId,
    selectedAirflowIds: airflowIds,
    selectedErgonomicIds: tallErgonomicIds,
  });
  const lockProps = (group: OptionGroup, id: string) => {
    const reason = lockReason(group, id);
    return { disabled: Boolean(reason), title: reason ?? undefined };
  };


  const cardClass = darkMode
    ? 'bg-zinc-900/90 border-zinc-800 backdrop-blur-md'
    : 'bg-white border-zinc-200/90 shadow-sm';

  return (
    <div className="space-y-4 [&_button:disabled]:opacity-35 [&_button:disabled]:cursor-not-allowed [&_button:disabled]:grayscale">
      {/* ============================================================== */}
      {/* 1. LOCATION & VEHICLE SECTION (All 40 Locations Searchable)    */}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              📍
            </span>
            <div>
              <h2 className="text-xs md:text-sm font-extrabold text-white">
                1. الموقع المحيط والسيارة (40 مكاناً سعودياً عفوياً)
              </h2>
              <span className="text-[10px] text-zinc-400">
                {selectedLocation.zone === 'inside' ? '🚗 داخل مقصورة السيارة' : '🚶‍♂️ خارج السيارة بجانبها'} • {selectedLocation.ar}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowVehicleCustomizer(!showVehicleCustomizer)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition flex items-center gap-1 border border-zinc-700/60 font-semibold"
          >
            <span>🚘</span>
            <span>{showVehicleCustomizer ? 'إخفاء طراز ولون السيارة' : 'تخصيص طراز ولون السيارة'}</span>
          </button>
        </div>

        {/* Location Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={locSearch}
              onChange={e => setLocSearch(e.target.value)}
              placeholder={`🔍 ابحث في ${LOCATIONS.length} موقعًا (مواقف، حي، صحراوي، مقهى، محطة)...`}
              className={`w-full ${itemBg} border ${borderTone} rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500`}
            />
            {locSearch && (
              <button
                type="button"
                onClick={() => setLocSearch('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setLocZoneFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                locZoneFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              الكل ({LOCATIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setLocZoneFilter('inside')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] flex items-center gap-1 ${
                locZoneFilter === 'inside'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🚗</span>
              <span>داخل ({LOCATIONS.filter(l => l.zone === 'inside').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setLocZoneFilter('outside')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] flex items-center gap-1 ${
                locZoneFilter === 'outside'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🚶‍♂️</span>
              <span>خارج ({LOCATIONS.filter(l => l.zone === 'outside').length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable / Compact Grid of Locations */}
        <div className="max-h-56 overflow-y-auto pr-0.5 space-y-1.5 border border-zinc-800/80 p-2 rounded-xl bg-black/20">
          {filteredLocations.map(l => {
            const isSelected = locId === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLocId(l.id);
                  if (autoLighting) {
                    const newAnalysis = analyzeLocationLighting(l.id, timeOfDay);
                    setLightId(newAnalysis.primaryRecommendedLightId);
                  }
                }}
                className={`w-full text-right p-2.5 rounded-xl text-xs transition border flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500/80 text-white font-bold shadow-md'
                    : `${itemBg} border-transparent text-zinc-300 hover:border-zinc-700`
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs shrink-0 mt-0.5">
                    {l.zone === 'inside' ? '🚗' : '🚶‍♂️'}
                  </span>
                  <div>
                    <span className="leading-snug block">{l.ar}</span>
                    <span className="text-[10px] text-zinc-400 opacity-80 block truncate font-mono mt-0.5">
                      {l.en}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    l.zone === 'inside'
                      ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {l.zone === 'inside' ? 'Inside' : 'Outside'}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Collapsible Vehicle Customizer */}
        {showVehicleCustomizer && (
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3 animate-fadeIn">
            <div className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <span>🚘</span>
              <span>طراز ولون سيارة الخلفية الثانوية (تظهر عفوياً حسب زاوية اليد):</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CAR_MODELS.map(car => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => setCarModelId(car.id)}
                  className={`p-2 rounded-lg text-[11px] text-right border transition ${
                    carModelId === car.id
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {car.ar}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 items-center pt-1 border-t border-zinc-800/80">
              <span className="text-[11px] text-zinc-400 ml-1">لون الهيكل:</span>
              {CAR_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCarColorId(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border transition ${
                    carColorId === c.id
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : `${itemBg} border-zinc-800 text-zinc-300`
                  }`}
                >
                  {c.ar}
                </button>
              ))}

              <span className="text-[11px] text-zinc-400 mr-2 ml-1">تظليل الزجاج:</span>
              {WINDOW_TINTS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTintId(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border transition ${
                    tintId === t.id
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : `${itemBg} border-zinc-800 text-zinc-300`
                  }`}
                >
                  {t.ar}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* High-priority vehicle realism without opening advanced options */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/70">
          <div className="text-[11px] font-bold text-zinc-300">🕶️ تظليل الزجاج الجانبي والخلفي</div>
          <div className="flex flex-wrap gap-1.5">
            {WINDOW_TINTS.filter(t => ['tint_extra_dark_05', 'tint_dark_10', 'tint_medium_02', 'no_tint_clear'].includes(t.id)).map(t => (
              <button
                key={t.id}
                {...lockProps('tints', t.id)}
                type="button"
                onClick={() => setTintId(t.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] border ${tintId === t.id ? 'bg-sky-700 border-sky-500 text-white' : `${itemBg} border-zinc-800 text-zinc-300`}`}
              >{t.ar}</button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500">التظليل يطبق على النوافذ الجانبية والخلفية فقط، ويقلّل الضوء الداخل من تلك النوافذ؛ لا يغيّر لون الوجه خارج السيارة.</p>
          {selectedLocation.zone === 'inside' && (
            <>
              <div className="text-[11px] font-bold text-zinc-300">📻 فوضى واقعية اختيارية داخل السيارة</div>
              <div className="flex flex-wrap gap-1.5">
                {DAILY_LIFE_CLUTTER.filter(item => ['rugged_military_radio','folded_parking_receipts','cabin_tissue_pack','loose_charging_cable','folded_paper_map'].includes(item.id)).map(item => (
                  <button
                    key={item.id}
                    {...lockProps('clutters', item.id)}
                    type="button"
                    onClick={() => toggle(item.id, clutterIds, setClutterIds)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] border ${clutterIds.includes(item.id) ? 'bg-indigo-700 border-indigo-500 text-white' : `${itemBg} border-zinc-800 text-zinc-300`}`}
                  >{item.ar}</button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500">يستخدم المحرك عنصرين ثانويين كحد أقصى، ويستبعد أي مقتنيات خارج الكادر القريب.</p>
            </>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INTELLIGENT NIGHT LIGHTING ENGINE SECTION                   */}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
              💡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs md:text-sm font-extrabold text-white">
                  2. محرك الإنارة الليلية الذكي (Intelligent Night Lighting)
                </h2>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  Physics-Based
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                تحليل تلقائي لمصادر الضوء الفعلية، درجات حرارة كلفن، وتلاشي الضوء الطبيعي
              </span>
            </div>
          </div>

          {/* Auto Lighting Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextState = !autoLighting;
                setAutoLighting(nextState);
                if (nextState) {
                  setLightId(lightingAnalysis.primaryRecommendedLightId);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
                autoLighting
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-extrabold'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              <span>{autoLighting ? '⚡ التوزيع التلقائي الذكي: مفعّل' : '🖐️ اختيار يدوي: مفعّل'}</span>
            </button>
          </div>
        </div>

        {/* Time of Day Selector */}
        <div className="flex items-center justify-between gap-2 bg-zinc-950/60 p-2 rounded-xl border border-zinc-800 flex-wrap">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
            <span>⏱️</span>
            <span>وقت اللقطة والتوقيت الطبيعي:</span>
          </span>

          <div className="flex gap-1 text-xs">
            {[
              { id: 'night', label: '🌙 ليلي معتم', icon: '🌙' },
              { id: 'sunset', label: '🌅 غروب / مغرب', icon: '🌅' },
              { id: 'day', label: '☀️ نهار / شمس', icon: '☀️' },
              { id: 'auto', label: '⚡ تلقائي حسب الموقع', icon: '⚡' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTimeOfDay(t.id as TimeOfDay);
                  if (autoLighting) {
                    const newAnalysis = analyzeLocationLighting(locId, t.id as TimeOfDay);
                    setLightId(newAnalysis.primaryRecommendedLightId);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  timeOfDay === t.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Location-Aware Physical Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <span>🎯</span>
              <span>الإضاءات الموصى بها فيزيائياً لهذا الموقع ({lightingAnalysis.environmentNameAr}):</span>
            </span>
            <span className="text-[10px] text-zinc-400">أعلى 3 توليفات واقعية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {lightingAnalysis.recommendations.map((rec, idx) => {
              const isSelected = lightId === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    setLightId(rec.id);
                    if (idx > 0) setAutoLighting(false);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between space-y-2 relative ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-950/20'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${rec.badgeColor}`}>
                        {rec.tag}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {rec.kelvin}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-white leading-snug">
                      {rec.nameAr}
                    </h3>

                    <p className="text-[11px] text-zinc-300/90 leading-relaxed">
                      {rec.reasonAr}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-amber-300/80 font-mono">
                      {rec.physicsCuesAr}
                    </span>
                    <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>
                      {isSelected ? '✓ نشط' : 'اختيار'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical Optics Sensor Note */}
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-2">
          <span className="text-amber-400 shrink-0 mt-0.5">🔬</span>
          <div>
            <span className="text-zinc-300 font-bold ml-1">قاعدة المستشعر والضوء:</span>
            <span>{lightingAnalysis.sensorPhysicsNoteAr}</span>
          </div>
        </div>

        {/* Manual Lighting Override Dropdown */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAllLightingOptions(!showAllLightingOptions)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>{showAllLightingOptions ? '▼ إخفاء القائمة الكاملة للإضاءات' : '▶ تصفح كافة خيارات الإضاءة الـ 19 يدوياً'}</span>
          </button>

          {showAllLightingOptions && (
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 animate-fadeIn">
              {LIGHTING_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  {...lockProps("lighting", opt.id)}
                  type="button"
                  onClick={() => {
                    setLightId(opt.id);
                    setAutoLighting(false);
                  }}
                  className={`p-2 rounded-lg text-right text-xs border transition ${
                    lightId === opt.id
                      ? 'bg-amber-600 text-white font-bold border-amber-500 shadow'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  <span className="block font-semibold">{opt.ar}</span>
                  <span className="text-[10px] text-zinc-400 font-mono block truncate mt-0.5">{opt.en}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. REFERENCE & IDENTITY LOCK SECTION (193cm, 83kg, Beard/Hair)*/}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              👤
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs md:text-sm font-extrabold text-white">
                  3. هوية وبنية الشخص المرجعي (Reference Identity Lock)
                </h2>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  100% Locked
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                بطل الصورة وهيمنة الكادر (75%–85%) • قفل ملامح الوجه وعظام الرأس وكثافة الشعر واللحية
              </span>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
            193cm • 83kg • Lean Athletic
          </span>
        </div>

        {/* Biometric Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block">القامة والبنية:</span>
            <span className="font-extrabold text-emerald-400 text-xs">193 سم / 83 كجم</span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">بنية رياضية وأكتاف عريضة</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block">شعر الرأس وخط الجبين:</span>
            <span className="font-bold text-zinc-200 text-xs">نفس الكثافة والخط الأصلي</span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">خصلات طبيعية غير متصلبة</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block">اللحية والشارب المتصل:</span>
            <span className="font-bold text-zinc-200 text-xs">كثافة مطابقة للمرجع 1:1</span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">تحديد طبيعي غير ليزري</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block">بشرة الوجه والعيون:</span>
            <span className="font-bold text-zinc-200 text-xs">طبيعية بنمش ومسام حية</span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">حظر أي فلاتر تنعيم ناعمة</span>
          </div>
        </div>

        {/* Hair Styling (Same Density Strict) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 block">
            💇‍♂️ تصفيف شعر الرأس (مع القفل الصارم لكثافة وخط شعر المرجع):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {HAIR_STYLES.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHairId(h.id)}
                className={`p-2.5 rounded-xl text-right text-xs border transition ${
                  hairId === h.id
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow'
                    : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                }`}
              >
                {h.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Beard Styling (Same Density Strict) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 block">
            🧔 تنسيق اللحية الأصلية (نفس كثافة ومسار الصورة المرجعية):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {BEARD_STYLES.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBeardId(b.id)}
                className={`p-2.5 rounded-xl text-right text-xs border transition ${
                  beardId === b.id
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow'
                    : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                }`}
              >
                {b.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Facial Expression & Posture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              🎭 تعبير الوجه العضلي العفوي:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {ANATOMICAL_EXPRESSIONS.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setAnatomicalExprId(e.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    anatomicalExprId === e.id
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {e.ar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              📏 إشارات القامة الفارهة في الكادر (193 سم):
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {HEIGHT_CUES.map(hc => (
                <button
                  key={hc.id}
                  {...lockProps('heightCue', hc.id)}
                type="button"
                  onClick={() => setHeightCueId(hc.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    heightCueId === hc.id
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {hc.ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FRAMING & CAMERA SECTION (Angle, Pose, Phone, Aspect Ratio) */}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
              📐
            </span>
            <div>
              <h2 className="text-xs md:text-sm font-extrabold text-white">
                4. تأطير الكادر ومحاكاة زاوية السيلفي باليد (Framing & Camera)
              </h2>
              <span className="text-[10px] text-zinc-400">
                الشخص يملأ 80% من الكادر • زوايا طبيعية لذراع سيلفي ممسوك باليد بطول 193 سم
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCameraMode(cameraMode === 'auto' ? 'manual' : 'auto')}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700/60 transition font-semibold"
          >
            {cameraMode === 'auto' ? '⚙️ تحكم يدوي متقدم' : '✨ تفعيل المخرج التلقائي'}
          </button>
        </div>

        {/* Framing & Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            {cameraMode === 'auto'} ? (
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sky-200 text-xs font-extrabold">
                  <span>✨</span>
                  <span>المخرج الذكي يحدد التكوين تلقائياً</span>
                </div>
                <div className="text-sm font-bold text-white">{cameraPlan.shotLabelAr}</div>
                <div className="text-[11px] text-sky-100/80 leading-relaxed">{cameraPlan.reasonAr}</div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded-full bg-black/20 border border-sky-400/20 px-2 py-1 text-sky-100">
                    {cameraPlan.focalLengthEquivalent}
                  </span>
                  <span className="rounded-full bg-black/20 border border-sky-400/20 px-2 py-1 text-sky-100">
                    مسافة الهاتف: {cameraPlan.distanceCm} سم
                  </span>
                </div>
              </div>
            ) : (
              <>
                <label className="text-xs font-bold text-zinc-300 block">
                  🎯 أولوية التأطير اليدوي:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {FRAMINGS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrameId(f.id)}
                      className={frameId === f.id ? 'p-2 rounded-xl text-right text-xs border transition bg-sky-600 text-white font-bold border-sky-500 shadow' : itemBg + ' border-zinc-800 text-zinc-300 hover:border-zinc-700'}
                    >
                      {f.ar}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              📱 أبعاد الكادر (Aspect Ratio) ونوع الهاتف:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ASPECTS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAspectId(a.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    aspectId === a.id
                      ? 'bg-sky-600 text-white border-sky-500 shadow'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {a.ar}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {PHONES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPhoneId(p.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    phoneId === p.id
                      ? 'bg-sky-600 text-white font-bold border-sky-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {p.ar}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pose and Angle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-800/80">
          <div className="space-y-1.5">
            {cameraMode === 'auto'} ? (
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 min-h-[88px]">
                <div className="text-xs font-bold text-sky-200 mb-1">📐 زاوية التصوير التلقائية</div>
                <div className="text-xs text-white font-semibold">{cameraPlan.angle.ar}</div>
                <div className="text-[10px] text-sky-100/70 mt-1">يُراجعها محرك الواقعية مع هندسة المكان وارتفاع السقف.</div>
              </div>
            ) : (
              <>
                <label className="text-xs font-bold text-zinc-300 block">
                  📸 زاوية التقاط السيلفي اليدوية:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {ANGLES.map(ang => (
                    <button
                      key={ang.id}
                      type="button"
                      onClick={() => setAngleId(ang.id)}
                      className={angleId === ang.id ? 'p-2 rounded-xl text-right text-xs border transition bg-sky-600 text-white font-bold border-sky-500' : itemBg + ' border-zinc-800 text-zinc-300 hover:border-zinc-700'}
                    >
                      {ang.ar}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              🤳 وضعية اليدين والجسد (متناسقة مع {isOutside ? 'خارج السيارة' : 'داخل المقصورة'}):
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {POSES.map(p => (
                <button
                  key={p.id}
                  {...lockProps("poses", p.id)}
                  type="button"
                  onClick={() => setPoseId(p.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    poseId === p.id
                      ? 'bg-sky-600 text-white font-bold border-sky-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {p.ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. APPEARANCE, ATTIRE & STORYLINE                             */}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
              👔
            </span>
            <div>
              <h2 className="text-xs md:text-sm font-extrabold text-white">
                5. المظهر، الملابس، وسياق القصة (Appearance & Storyline)
              </h2>
              <span className="text-[10px] text-zinc-400">
                أزياء واقعية تحاكي المرجع • إكسسوارات وسيناريو عفوي من الحياة اليومية
              </span>
            </div>
          </div>
        </div>

        {/* Clothes Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 block">
            👕 الزي والملابس:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {CLOTHES.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setClothId(c.id)}
                className={`p-2.5 rounded-xl text-right text-xs border transition ${
                  clothId === c.id
                    ? 'bg-teal-600 text-white font-bold border-teal-500 shadow'
                    : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                }`}
              >
                <span className="block font-semibold">{c.ar}</span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{c.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessories and Storyline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              🕶️ الإكسسوارات العفوية:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {ACCESSORIES.map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccessoryId(acc.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    accessoryId === acc.id
                      ? 'bg-teal-600 text-white font-bold border-teal-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {acc.ar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              📖 سيناريو القصة العفوي (Storyline Context):
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {STORYLINES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStorylineId(s.id)}
                  className={`p-2 rounded-xl text-right text-xs border transition ${
                    storylineId === s.id
                      ? 'bg-teal-600 text-white font-bold border-teal-500'
                      : `${itemBg} border-zinc-800 text-zinc-300 hover:border-zinc-700`
                  }`}
                >
                  {s.ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. ESSENTIAL & ADVANCED PHYSICS (One Expandable Section)       */}
      {/* ============================================================== */}
      <section className={`${cardClass} border rounded-2xl p-3.5 md:p-5 space-y-3`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              🔬
            </span>
            <div>
              <h2 className="text-xs md:text-sm font-extrabold text-white">
                6. تفاصيل الواقعية الفيزيائية (Physical Realism Settings)
              </h2>
              <span className="text-[10px] text-zinc-400">
                مسام البشرة، تفاعل الضوء مع النوافذ، وعوامل كسر المظهر المصطنع (Anti-AI Slop)
              </span>
            </div>
          </div>
        </div>

        {/* Essential Physics Controls */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 block">
            ✨ المؤثرات الفيزيائية الأساسية المفعّلة:
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
                      ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-sm'
                      : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                  }`}
                >
                  {item.ar}
                </button>
              );
            })}

            {OPTICAL_IMPERFECTIONS.map(item => {
              const on = opticalIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id, opticalIds, setOpticalIds)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                    on
                      ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-sm'
                      : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                  }`}
                >
                  {item.ar}
                </button>
              );
            })}

            {THERMAL_CLIMATE_PHYSICS.map(item => {
              const on = thermalIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  {...lockProps('thermals', item.id)}
                  type="button"
                  onClick={() => toggle(item.id, thermalIds, setThermalIds)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                    on
                      ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-sm'
                      : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                  }`}
                >
                  {item.ar}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expandable Advanced Physics Section */}
        <div className="pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setShowAdvancedPhysics(!showAdvancedPhysics)}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 font-bold text-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>⚙️</span>
              <span>الفيزياء المتقدمة وتفاصيل السناب شات (Advanced Physics)</span>
            </div>
            <span className="text-xs text-indigo-400">
              {showAdvancedPhysics ? 'إغلاق القسم ▲' : 'فتح الإعدادات التفصيلية ▼'}
            </span>
          </button>

          {showAdvancedPhysics && (
            <div className="mt-3 space-y-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 animate-fadeIn">
              {/* Subsurface Scattering */}
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
                        {...lockProps('subsurfaces', item.id)}
                        type="button"
                        onClick={() => toggle(item.id, subsurfaceIds, setSubsurfaceIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Physics */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  🧵 فيزياء وتجاعيد القماش الطبيعية:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FABRIC_PHYSICS.map(item => {
                    const on = fabricIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        {...lockProps('fabrics', item.id)}
                  type="button"
                        onClick={() => toggle(item.id, fabricIds, setFabricIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Snapchat UI and compression */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  📱 عوامل ضغط وفلاتر سناب شات العفوية:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {APP_UI_ELEMENTS.map(item => {
                    const on = appUiIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggle(item.id, appUiIds, setAppUiIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cabin Clutter & Details (Inside only notice) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    🚘 تفاصيل وأدوات المقصورة (تطبق تلقائياً عند التواجد داخل السيارة):
                  </label>
                  {isOutside && (
                    <span className="text-[10px] text-amber-400 font-mono">
                      (معزولة تلقائياً لأن الكادر خارجي)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CABIN_DETAILS.map(item => {
                    const on = cabinIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        {...lockProps("cabins", item.id)}
                  type="button"
                        onClick={() => toggle(item.id, cabinIds, setCabinIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}

                  {CABIN_ARTIFACTS.map(item => {
                    const on = cabinArtifactIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        {...lockProps("cabinArtifacts", item.id)}
                  type="button"
                        onClick={() => toggle(item.id, cabinArtifactIds, setCabinArtifactIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}

                  {DAILY_LIFE_CLUTTER.map(item => {
                    const on = clutterIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        {...lockProps("clutters", item.id)}
                  type="button"
                        onClick={() => toggle(item.id, clutterIds, setClutterIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                            : `${itemBg} border-transparent text-zinc-400 hover:text-zinc-200`
                        }`}
                      >
                        {item.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Micro-Weather */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  🌧️ عوامل الطقس الموضعي اللحظي:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MICRO_WEATHER.map(item => {
                    const on = microWeatherIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        {...lockProps('microWeather', item.id)}
                        type="button"
                        onClick={() => toggle(item.id, microWeatherIds, setMicroWeatherIds)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition border ${
                          on
                            ? 'bg-indigo-600 text-white font-bold border-indigo-500'
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
      </section>
    </div>
  );
};
