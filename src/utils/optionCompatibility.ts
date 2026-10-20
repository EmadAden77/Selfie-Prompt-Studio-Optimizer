import type { Zone } from '../types/studio';

export type SceneTime = 'auto' | 'day' | 'sunset' | 'night';
export type OptionGroup = 'cabins' | 'cabinArtifacts' | 'clutters' | 'dashUis' | 'airflows' | 'screenCasts' | 'tallErgonomics' | 'poses' | 'lighting' | 'inAppArtifacts' | 'heightCue' | 'fabrics' | 'thermals';

export interface OptionContext {
  zone: Zone;
  time: SceneTime;
  lightingId: string;
  poseId: string;
  frameId?: string;
  selectedCabinIds?: readonly string[];
  clothId: string;
  selectedAirflowIds: readonly string[];
  selectedErgonomicIds: readonly string[];
}

const daylight = new Set(['harsh_noon', 'noon_sun', 'soft_morning', 'afternoon_diffuse', 'overcast_haze', 'golden_hour']);
const sunset = new Set(['golden_hour', 'sunset_glow', 'blue_hour']);
const night = new Set(['sodium_street', 'led_modern_street', 'single_distant_lamp', 'pure_moonlight', 'dash_screens_glow', 'warm_car_cabin_dome', 'night_cabin_glow', 'neon_side_wash', 'ambient_drive_thru', 'headlights_bounce', 'tunnel_tungsten']);
const cabinLights = new Set(['dash_screens_glow', 'warm_car_cabin_dome', 'night_cabin_glow']);
const stationaryInteriorOnly = new Set(['hand_on_wheel', 'elbow_door_rest']);
const garmentHasCollar = (id: string) => ['thobe', 'shirt', 'linen', 'collar'].some(token => id.toLowerCase().includes(token));

/** A single policy shared by visible options and prompt boundary checks. Null = selectable. */
export function optionLockReason(group: OptionGroup, id: string, context: OptionContext): string | null {
  if (context.zone === 'outside') {
    if (['cabins', 'cabinArtifacts', 'clutters', 'dashUis', 'screenCasts', 'airflows'].includes(group)) return 'هذا الخيار يخص مقصورة السيارة ولا يصلح للتصوير خارجها';
    if (group === 'tallErgonomics' && ['forearm_span_wheel', 'roof_handle_grip'].includes(id)) return 'هذه الحركة مرتبطة بمقعد السائق';
    if (group === 'poses' && stationaryInteriorOnly.has(id)) return 'الوضعية تتطلب الجلوس داخل السيارة';
    if (group === 'lighting' && cabinLights.has(id)) return 'مصدر الضوء داخل المقصورة ولا يضيء شخصًا خارج السيارة';
    if (group === 'heightCue' && ['headrest_max', 'auto_scale', 'tall_roofline', 'seatbelt_geometry', 'elbow_door_rest'].includes(id)) return 'هذه تفاصيل مرتبطة بمقعد السيارة';
  }
  if (group === 'cabins' && id === 'large_hand_gear' && (context.poseId === 'hand_on_wheel' || context.selectedErgonomicIds.includes('forearm_span_wheel') || context.selectedErgonomicIds.includes('roof_handle_grip'))) return 'Conflict with selected arm pose';
  if (group === 'poses' && id === 'hand_on_wheel' && context.selectedCabinIds?.includes('large_hand_gear')) return 'Gear hand already selected';
  if (context.frameId === 'close_face' && group === 'cabins' && ['large_hand_gear', 'tissue_box_console'].includes(id)) return 'Below close selfie framing';
  if (context.frameId === 'close_face' && group === 'cabinArtifacts' && id === 'fresh_miswak_console') return 'Cup holder outside close framing';
  if (context.frameId === 'close_face' && group === 'fabrics' && id === 'seat_hip_creases') return 'Off-frame lap';
  if (context.frameId === 'close_face' && group === 'thermals' && id === 'cup_sweat_droplets') return 'Off-frame cup';
  if (group === 'poses' && id === 'adjust_collar' && !garmentHasCollar(context.clothId)) return 'الملابس الحالية بلا ياقة يمكن تعديلها';
  if (group === 'airflows' && context.selectedAirflowIds.includes('cabin_dead_calm') && id !== 'cabin_dead_calm') return 'سكون الهواء لا يجتمع مع تيار يحرك الشعر';
  if (group === 'airflows' && id === 'cabin_dead_calm' && context.selectedAirflowIds.some(x => x !== 'cabin_dead_calm')) return 'اختر السكون أو تيار الهواء، وليس كليهما';
  if (group === 'tallErgonomics' && id === 'roof_handle_grip' && (context.poseId === 'hand_on_wheel' || context.selectedErgonomicIds.includes('forearm_span_wheel'))) return 'اليد الحرة لا يمكنها إمساك السقف والمقود معًا';
  if (group === 'tallErgonomics' && id === 'forearm_span_wheel' && context.selectedErgonomicIds.includes('roof_handle_grip')) return 'اليد الحرة مشغولة بمقبض السقف';
  if (group === 'inAppArtifacts' && id === 'front_screen_flash_burst' && context.lightingId === 'direct_flash') return 'الفلاش المباشر محدد، لا تضف فلاش شاشة ثانيًا';
  if (group === 'inAppArtifacts' && id === 'instant_snap_bokeh') return 'العزل الاصطناعي لا يطابق الواقعية البصرية المطلوبة';
  if (group === 'lighting' && id !== 'direct_flash' && context.time !== 'auto') {
    if (context.time === 'night' && (daylight.has(id) || sunset.has(id))) return 'إضاءة نهارية لا تناسب وقت الليل';
    if (context.time === 'day' && (night.has(id) || id === 'sunset_glow' || id === 'blue_hour')) return 'المصدر الليلي لا يوافق توقيت النهار';
    if (context.time === 'sunset' && (['harsh_noon', 'noon_sun', 'soft_morning'].includes(id))) return 'شمس الظهيرة أو الصباح لا تناسب الغروب';
  }
  return null;
}
