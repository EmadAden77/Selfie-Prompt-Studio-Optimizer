/* sceneRules.js
   Keep existing option arrays and IDs unchanged.
   Pass the existing arrays as the catalog.
*/

const LIGHT_ALIASES = {
  drive_thru_sign: "drive_thru",
  headlights_bounce: "headlights",
  sunset_glow: "sunset",
  tunnel_tungsten: "tunnel",
  dust_line: "overcast",
};

const DAY = new Set([
  "harsh_noon", "golden_hour", "soft_morning",
  "afternoon", "sunset", "overcast"
]);

const NIGHT = new Set([
  "sodium_street", "led_white", "direct_flash",
  "dash_glow", "single_lamp", "drive_thru",
  "headlights", "moonlight", "neon_wash"
]);

const CABIN_ONLY = new Set(["dash_glow", "dome_lamp"]);
const INTERIOR_LISTS = [
  "cab", "dsh", "clt", "air", "scr", "art"
];

const SAFE_POSE = {
  inside: "armout",
  outside: "armout"
};

export function resolveScene(state, catalog) {
  const {
    LOCATIONS, LIGHTING, POSE, STORY
  } = catalog;

  const scene = {
    ...state,
    timeOfDay: state.timeOfDay ?? "night"
  };

  const warnings = [];
  const corrections = [];

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
    scene.poseId = SAFE_POSE[location.zone];
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
