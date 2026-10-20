/* sceneRules.ts
   Keep existing option arrays and IDs unchanged.
   Pass the existing arrays as the catalog.
*/

import {
  LOCATIONS as ORIGINAL_LOCATIONS,
  LIGHTING_OPTIONS as ORIGINAL_LIGHTING,
  POSES as ORIGINAL_POSES,
  STORYLINES as ORIGINAL_STORYLINES,
} from '../data/studioData';
import { analyzeLocationLighting } from './lightingEngine';

export const LIGHT_ALIASES: Record<string, string> = {
  drive_thru_sign: "drive_thru",
  headlights_bounce: "headlights",
  sunset_glow: "sunset",
  tunnel_tungsten: "tunnel",
  dust_line: "overcast",
};

export const DAY = new Set([
  "harsh_noon", "golden_hour", "soft_morning",
  "afternoon", "sunset", "overcast"
]);

export const NIGHT = new Set([
  "sodium_street", "led_white", "direct_flash",
  "dash_glow", "single_lamp", "drive_thru",
  "headlights", "moonlight", "neon_wash"
]);

export const CABIN_ONLY = new Set(["dash_glow", "dome_lamp"]);
export const INTERIOR_LISTS = [
  "cab", "dsh", "clt", "air", "scr", "art"
];

export const SAFE_POSE = {
  inside: "armout",
  outside: "armout"
};

export interface SceneLocation {
  id: number;
  zone: "inside" | "outside";
  ar?: string;
  en?: string;
  lights?: string[];
}

export interface SceneLightingOption {
  id: string;
  ar?: string;
  en?: string;
}

export interface ScenePoseOption {
  id: string;
  ar?: string;
  en?: string;
  z?: ("inside" | "outside")[];
}

export interface SceneStoryOption {
  id: string;
  ar?: string;
  en?: string;
  zones?: ("inside" | "outside")[];
}

export interface SceneCatalog {
  LOCATIONS: SceneLocation[];
  LIGHTING: SceneLightingOption[];
  POSE: ScenePoseOption[];
  STORY: SceneStoryOption[];
}

export interface SceneState {
  locId: number;
  lightId: string;
  timeOfDay?: "night" | "day" | "sunset" | "auto";
  poseId: string;
  storyId?: string | null;
  autoLight?: boolean;
  cab?: string[];
  dsh?: string[];
  clt?: string[];
  air?: string[];
  scr?: string[];
  art?: string[];
  hcId?: string | null;
  erg?: string[];
  [key: string]: any;
}

export interface SceneResolutionResult {
  scene: SceneState;
  warnings: string[];
  corrections: string[];
  valid: boolean;
}

/**
 * Builds the canonical catalog passing the existing option arrays
 * while preserving all original IDs intact.
 */
export function buildSceneCatalog(): SceneCatalog {
  // 1. Pass LOCATIONS with their environment-recommended lights
  const LOCATIONS: SceneLocation[] = ORIGINAL_LOCATIONS.map(loc => {
    const analysis = analyzeLocationLighting(loc.id);
    const recommended = analysis.recommendations.map(r => r.id);
    const withAliases = recommended.flatMap(id => [id, LIGHT_ALIASES[id] ?? id]);
    return {
      id: loc.id,
      zone: loc.zone,
      ar: loc.ar,
      en: loc.en,
      lights: Array.from(new Set(withAliases)),
    };
  });

  // 2. Pass LIGHTING including existing options and canonical alias entries
  const canonicalLightEntries: SceneLightingOption[] = [
    { id: "led_white", ar: "أعمدة إنارة بيضاء باردة حديثة (LED)", en: "cool white modern LED streetlights" },
    { id: "headlights", ar: "أضواء سيارة عابرة ترتد بنعومة", en: "passing vehicle headlight reflection" },
    { id: "sunset", ar: "وهج مغرب قرمزي وبرتقالي", en: "sunset dusk crimson-orange horizon glow" },
    { id: "tunnel", ar: "إضاءة نفق صفراء تنجستن", en: "tunnel tungsten warm lamps" },
    { id: "overcast", ar: "ضوء نهار غائم مشتت", en: "diffuse overcast natural ambient" },
    { id: "drive_thru", ar: "أضواء لوحة طلبات الدرايف ثرو", en: "drive-thru order menu backlight glow" },
    { id: "dash_glow", ar: "وهج شاشات المقصورة والكونسول", en: "cabin dashboard cluster ambient glow" },
    { id: "single_lamp", ar: "مصباح جداري وحيد خافت", en: "single distant wall sconce bulb" },
    { id: "moonlight", ar: "ضوء قمر صحراوي بارد", en: "cool silver desert moonlight" },
    { id: "dome_lamp", ar: "لمبة سقف السيارة الصفراء", en: "interior warm car dome ceiling lamp" },
    { id: "neon_wash", ar: "وهج نيون جانبي ملون", en: "colorful neon sign wash" },
    { id: "afternoon", ar: "عصر دافئ معتدل", en: "warm late afternoon directional light" },
  ];

  const lightingMap = new Map<string, SceneLightingOption>();
  for (const opt of ORIGINAL_LIGHTING) {
    lightingMap.set(opt.id, { id: opt.id, ar: opt.ar, en: opt.en });
  }
  for (const opt of canonicalLightEntries) {
    if (!lightingMap.has(opt.id)) {
      lightingMap.set(opt.id, opt);
    }
  }
  const LIGHTING = Array.from(lightingMap.values());

  // 3. Pass POSE with zone compatibility constraints
  const POSE: ScenePoseOption[] = ORIGINAL_POSES.map(p => {
    let z: ("inside" | "outside")[] = ["inside", "outside"];
    if (p.id === "hand_on_wheel" || p.id === "involuntary_snap") {
      z = ["inside"];
    } else if (p.id === "arm_out") {
      z = ["inside", "outside"];
    }
    return {
      id: p.id,
      ar: p.ar,
      en: p.en,
      z,
    };
  });

  // Ensure "armout" alias is also available for SAFE_POSE lookup
  if (!POSE.some(p => p.id === "armout")) {
    POSE.push({
      id: "armout",
      ar: "سيلفي يد واحدة ممدودة للأمام بعفوية (ذراع طويل)",
      en: "one long arm extended forward holding phone naturally, wide candid view",
      z: ["inside", "outside"],
    });
  }

  // 4. Pass STORY with zone compatibility
  const STORY: SceneStoryOption[] = ORIGINAL_STORYLINES.map(s => {
    let zones: ("inside" | "outside")[] = ["inside", "outside"];
    if (s.id === "traffic_light_stop" || s.id === "family_waiting_idle" || s.id === "late_night_cruising") {
      zones = ["inside"];
    }
    return {
      id: s.id,
      ar: s.ar,
      en: s.en,
      zones,
    };
  });

  return { LOCATIONS, LIGHTING, POSE, STORY };
}

/**
 * Validates and resolves scene compatibility according to physical rules.
 */
export function resolveScene(state: SceneState, catalog: SceneCatalog): SceneResolutionResult {
  const {
    LOCATIONS, LIGHTING, POSE, STORY
  } = catalog;

  const scene: SceneState = {
    ...state,
    timeOfDay: state.timeOfDay ?? "night"
  };

  const warnings: string[] = [];
  const corrections: string[] = [];

  const location = LOCATIONS.find(
    x => x.id === scene.locId
  );

  if (!location) {
    return {
      scene,
      warnings: ["Invalid location"],
      corrections,
      valid: false
    };
  }

  const outside = location.zone === "outside";

  // Repair old lighting IDs.
  const canonicalLight =
    LIGHT_ALIASES[scene.lightId] ?? scene.lightId;

  if (canonicalLight !== scene.lightId) {
    scene.lightId = canonicalLight;
    corrections.push("Lighting ID migrated");
  }

  // Validate pose.
  const pose = POSE.find(x => x.id === scene.poseId);

  if (!pose || (pose.z && !pose.z.includes(location.zone))) {
    scene.poseId = (SAFE_POSE as Record<string, string>)[location.zone] ?? "armout";
    corrections.push("Incompatible pose corrected");
  }

  // Validate story.
  const story = STORY.find(x => x.id === scene.storyId);

  if (
    story?.zones &&
    !story.zones.includes(location.zone)
  ) {
    warnings.push(
      "Selected story conflicts with subject position"
    );
    scene.storyId = null;
  }

  // Remove cabin-only effects from output state.
  if (outside) {
    for (const key of INTERIOR_LISTS) {
      scene[key] = [];
    }

    scene.hcId = null;

    scene.erg = (scene.erg ?? []).filter(
      id => !["tilt", "forearm", "grab"].includes(id)
    );
  }

  // Resolve lighting.
  const candidates = (location.lights ?? [])
    .map(id => LIGHT_ALIASES[id] ?? id)
    .filter(id => LIGHTING.some(l => l.id === id))
    .filter(id => {
      if (outside && CABIN_ONLY.has(id)) return false;

      if (scene.timeOfDay === "day") {
        return !NIGHT.has(id);
      }

      if (scene.timeOfDay === "night") {
        return !DAY.has(id);
      }

      return true;
    });

  const selected = LIGHTING.find(
    l => l.id === scene.lightId
  );

  const badTime =
    (scene.timeOfDay === "day" &&
      NIGHT.has(scene.lightId)) ||
    (scene.timeOfDay === "night" &&
      DAY.has(scene.lightId));

  const badPosition =
    outside && CABIN_ONLY.has(scene.lightId);

  if (
    scene.autoLight ||
    !selected ||
    badTime ||
    badPosition
  ) {
    if (badTime || badPosition) {
      warnings.push("Incompatible lighting corrected");
    }

    const fallback =
      scene.timeOfDay === "day"
        ? "soft_morning"
        : scene.timeOfDay === "night"
          ? "led_white"
          : "blue_hour";

    const nextLight =
      candidates[0] ??
      (LIGHTING.some(l => l.id === fallback)
        ? fallback
        : null);

    if (nextLight) {
      scene.lightId = nextLight;
    } else {
      warnings.push("No valid lighting configuration");
    }
  }

  // Reject missing lighting instead of silently
  // compiling physically unsupported content.
  const valid = LIGHTING.some(
    l => l.id === scene.lightId
  ) && !(
    outside && CABIN_ONLY.has(scene.lightId)
  ) && !(
    scene.timeOfDay === "day" &&
    NIGHT.has(scene.lightId)
  ) && !(
    scene.timeOfDay === "night" &&
    DAY.has(scene.lightId)
  );

  return {
    scene,
    warnings,
    corrections,
    valid
  };
}
