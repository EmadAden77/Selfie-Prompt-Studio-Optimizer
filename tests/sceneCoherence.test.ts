import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAndSanitizePhysics } from '../src/utils/realismEngine';
import type { BuildInput, Opt } from '../src/types/studio';

const option = (id: string): Opt => ({ id, ar: id, en: id });

function fixture(zone: 'inside' | 'outside', lightId: string): BuildInput {
  return {
    loc: { id: zone === 'inside' ? 10 : 21, zone, ar: 'Location', en: 'Location' },
    light: option(lightId),
    carModel: option('car'), carColor: option('white'),
    cloth: { ...option('tee_black_ref'), cat: 'casual' },
    accessory: option('none'), pose: option('arm_out'),
    anatomicalExpr: option('neutral'), frame: option('half'), aspect: option('916'),
    phone: option('xm15'), angle: option('eye'), beard: option('ref'),
    hair: option('ref'), heightCue: option('headrest'),
    storyline: option('fresh'), tint: option('clear'),
    opticals: [], cabins: [option('tissue')], skinNuances: [],
    appUis: [], gripMotions: [], dashUis: [option('nav')],
    subsurfaces: [], fabrics: [], thermals: [], clutters: [],
    airflows: [], screenCasts: [option('carplay_dark_glow')],
    cabinArtifacts: [option('mag')], tallErgonomics: [],
    inAppArtifacts: [], microWeathers: [],
  };
}

test('outdoor scenes exclude cabin content and cabin light', () => {
  const { sanitized } = validateAndSanitizePhysics(fixture('outside', 'warm_car_cabin_dome'));
  assert.equal(sanitized.cabins.length, 0);
  assert.equal(sanitized.dashUis.length, 0);
  assert.equal(sanitized.screenCasts.length, 0);
  assert.equal(sanitized.cabinArtifacts.length, 0);
  assert.notEqual(sanitized.light.id, 'warm_car_cabin_dome');
  assert.notEqual(sanitized.heightCue.id, 'headrest');
});

test('basement does not receive direct noon sun', () => {
  const { sanitized } = validateAndSanitizePhysics(fixture('inside', 'harsh_noon'));
  assert.notEqual(sanitized.light.id, 'harsh_noon');
});

test('valid interior lighting remains selected', () => {
  const { sanitized } = validateAndSanitizePhysics(fixture('inside', 'basement_tubes'));
  assert.equal(sanitized.light.id, 'basement_tubes');
});

test('inside cabin does not duplicate free hand or airflow', () => {
  const scene = fixture('inside', 'basement_tubes');
  scene.pose = option('hand_on_wheel');
  scene.tallErgonomics = [option('forearm_span_wheel'), option('roof_handle_grip')];
  scene.airflows = [option('cabin_dead_calm'), option('window_quarter_drift')];
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.tallErgonomics.some(x => x.id === 'roof_handle_grip'), false);
  assert.deepEqual(sanitized.airflows.map(x => x.id), ['cabin_dead_calm']);
});

test('interior shirt without collar cannot adjust a thobe collar', () => {
  const scene = fixture('inside', 'basement_tubes');
  scene.pose = option('adjust_collar');
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.pose.id, 'arm_out');
});

test('selected direct flash excludes redundant screen flash', () => {
  const scene = fixture('inside', 'direct_flash');
  scene.inAppArtifacts = [option('front_screen_flash_burst'), option('snap_night_grain')];
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.deepEqual(sanitized.inAppArtifacts.map(x => x.id), ['snap_night_grain']);
});

test('interior headrest does not default to impossible highest setting', () => {
  const scene = fixture('inside', 'basement_tubes');
  scene.heightCue = option('headrest_max');
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.heightCue.id, 'headrest_adjusted');
});

test('external glass tint cannot alter outdoor face illumination', () => {
  const scene = fixture('outside', 'sodium_street');
  scene.tint = option('blackout');
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.tint.id, 'exterior_glass_only');
});

test('artificial bokeh and unverified face details are suppressed', () => {
  const scene = fixture('inside', 'basement_tubes');
  scene.inAppArtifacts = [option('instant_snap_bokeh'), option('snap_night_grain')];
  scene.skinNuances = [option('ref_freckles_moles')];
  scene.opticals = [option('fake_portrait_blur'), option('realistic_noise')];
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.deepEqual(sanitized.inAppArtifacts.map(x => x.id), ['snap_night_grain']);
  assert.deepEqual(sanitized.skinNuances, []);
  assert.deepEqual(sanitized.opticals.map(x => x.id), ['realistic_noise']);
});

test('exterior scene never leaks cabin clutter even if selected', () => {
  const scene = fixture('outside', 'sodium_street');
  scene.clutters = [option('door_pocket_keys'), option('rearview_parking_tag')];
  scene.airflows = [option('ac_gentle_breeze')];
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.deepEqual(sanitized.clutters, []);
  assert.deepEqual(sanitized.airflows, []);
});

test('gear and wheel are exclusive', () => { const x = fixture('inside', 'basement_tubes'); x.pose = option('hand_on_wheel'); x.cabins = [option('large_hand_gear')]; assert.equal(validateAndSanitizePhysics(x).sanitized.cabins.length, 0); });

test('exterior noon selfie removes cold breath and seatbelt tension', () => {
  const scene = fixture('outside', 'harsh_noon');
  scene.microWeathers = [option('winter_breath_fade')];
  scene.fabrics = [option('collar_tilt_tension'), option('seat_hip_creases')];
  scene.opticals = [option('catchlight_reflection')];
  scene.anatomicalExpr = option('sun_squint_lines');
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.microWeathers.length, 0);
  assert.equal(sanitized.fabrics.some(x => x.en.includes('seatbelt')), false);
  assert.equal(sanitized.fabrics.some(x => x.id === 'seat_hip_creases'), false);
  assert.equal(sanitized.opticals[0].en.includes('dashboard'), false);
  assert.equal(sanitized.opticals[0].en.includes('brown iris'), false);
  assert.equal(sanitized.anatomicalExpr.en.includes('crow'), false);
});

test('comfortable selfie reach never inherits height as arm distance', () => {
  const scene = fixture('outside','sodium_street');
  scene.gripMotions = [option('natural_arm_stretch')];
  scene.anatomicalExpr = option('sun_squint_lines');
  scene.subsurfaces = [option('ear_cartilage_glow'), option('thobe_jaw_bounce')];
  const { sanitized } = validateAndSanitizePhysics(scene);
  assert.match(sanitized.gripMotions[0].en, /Comfortable/);
  assert.doesNotMatch(sanitized.gripMotions[0].en, /maximum length|193cm reach/);
  assert.doesNotMatch(sanitized.anatomicalExpr.en, /sun glare/);
  assert.equal(sanitized.subsurfaces.some(x => x.id === 'thobe_jaw_bounce'), false);
  assert.match(sanitized.subsurfaces[0].en, /only if/);
});

test('shared scene policy drops restored cabin weather and motion outside', () => {
  const x = fixture('outside', 'harsh_noon');
  x.microWeathers = [option('raindrop_streak_window'), option('winter_breath_fade')];
  x.gripMotions = [option('steering_hand_microblur'), option('natural_arm_stretch')];
  const output = validateAndSanitizePhysics(x).sanitized;
  assert.deepEqual(output.microWeathers, []);
  assert.equal(output.gripMotions.some(y => y.id === 'steering_hand_microblur'), false);
  assert.equal(output.gripMotions.some(y => y.id === 'natural_arm_stretch'), true);
});

test('prompt policy drops white-cloth reflection for black t-shirt', () => {
  const x = fixture('inside', 'sodium_street');
  x.subsurfaces = [option('thobe_jaw_bounce'), option('beard_follicle_shadow')];
  const output = validateAndSanitizePhysics(x).sanitized;
  assert.deepEqual(output.subsurfaces.map(y => y.id), ['beard_follicle_shadow']);
});

test('all locations preserve zone constraints across frames and lighting', async () => {
  const { LOCATIONS, buildPrompt } = await import('../src/data/studioData');
  for (const loc of LOCATIONS) {
    for (const frame of ['close_face','half_body','wide_outside']) {
      for (const light of ['harsh_noon','sodium_street','direct_flash']) {
        const x = fixture(loc.zone,light);
        x.loc = loc;
        x.frame = option(frame);
        x.cabins = [option('large_hand_gear'), option('tissue_box_console')];
        x.clutters = [option('door_pocket_keys')];
        x.microWeathers = [option('winter_breath_fade'), option('travel_dust_corner')];
        x.fabrics = [option('seat_hip_creases'), option('collar_tilt_tension')];
        const {sanitized} = validateAndSanitizePhysics(x);
        const generated = buildPrompt(sanitized).en;
        assert.ok(generated.includes('Height 193cm'));
        assert.ok(!generated.includes('Preserve preserve'));
        if (loc.zone === 'outside') {
          assert.equal(sanitized.cabins.length,0);
          assert.equal(sanitized.clutters.length,0);
          assert.ok(!generated.includes('gear shifter'));
        }
        if (frame === 'close_face') {
          assert.equal(sanitized.cabins.some(o => o.id === 'large_hand_gear'),false);
          assert.equal(sanitized.fabrics.some(o => o.id === 'seat_hip_creases'),false);
        }
        if (['harsh_noon', 'noon_sun', 'golden_hour', 'afternoon_diffuse'].includes(sanitized.light.id)) {
          assert.equal(sanitized.microWeathers.some(o => o.id === 'winter_breath_fade'),false);
        }
      }
    }
  }
});


test('sixty grounded locations have unique numeric IDs and valid scene zones', async () => {
  const { LOCATIONS } = await import('../src/data/studioData');
  assert.equal(LOCATIONS.length, 60);
  assert.equal(new Set(LOCATIONS.map(x => x.id)).size, LOCATIONS.length);
  assert.equal(LOCATIONS.filter(x => x.zone === 'inside').length, 30);
  assert.equal(LOCATIONS.filter(x => x.zone === 'outside').length, 30);
  for (const loc of LOCATIONS) {
    assert.ok(loc.ar.trim().length > 20);
    assert.ok(loc.en.trim().length > 25);
  }
});

test('military-style handheld radio obeys exterior and close-frame constraints', async () => {
  const { DAILY_LIFE_CLUTTER, buildPrompt } = await import('../src/data/studioData');
  const radio = DAILY_LIFE_CLUTTER.find(x => x.id === 'rugged_military_radio');
  assert.ok(radio);
  const inside = fixture('inside', 'sodium_street');
  inside.frame = option('half_body');
  inside.clutters = [radio];
  const accepted = validateAndSanitizePhysics(inside).sanitized;
  assert.equal(accepted.clutters.some(x => x.id === radio.id), true);
  assert.match(buildPrompt(accepted).en, /handheld two-way field radio/);
  inside.frame = option('close_face');
  const close = validateAndSanitizePhysics(inside).sanitized;
  assert.equal(close.clutters.some(x => x.id === radio.id), false);
  assert.doesNotMatch(buildPrompt(close).en, /handheld two-way field radio/);
  inside.loc = { ...inside.loc, id: 51, zone: 'outside' };
  inside.frame = option('half_body');
  const outside = validateAndSanitizePhysics(inside).sanitized;
  assert.equal(outside.clutters.length, 0);
  assert.doesNotMatch(buildPrompt(outside).en, /handheld two-way field radio/);
});

test('heavy tint changes only the vehicle glass and survives prompt assembly', async () => {
  const { WINDOW_TINTS, buildPrompt } = await import('../src/data/studioData');
  for (const id of ['tint_extra_dark_05', 'tint_dark_10']) {
    const tint = WINDOW_TINTS.find(x => x.id === id);
    assert.ok(tint);
    const inside = fixture('inside', 'sodium_street');
    inside.tint = tint;
    const scene = validateAndSanitizePhysics(inside).sanitized;
    assert.match(buildPrompt(scene).en, /visible light transmission/);
    assert.match(buildPrompt(scene).en, /windshield remains clear/);
    const outside = fixture('outside', 'sodium_street');
    outside.tint = tint;
    outside.frame = option('half_body');
    const fromOutside = validateAndSanitizePhysics(outside).sanitized;
    assert.match(buildPrompt(fromOutside).en, /Only if the vehicle windows are visible/);
    assert.match(buildPrompt(fromOutside).en, /does not darken the face/);
    outside.frame = option('close_face');
    assert.doesNotMatch(buildPrompt(validateAndSanitizePhysics(outside).sanitized).en, /visible light transmission/);
  }
});

test('clutter remains incidental and physically bounded to two objects', async () => {
  const { DAILY_LIFE_CLUTTER } = await import('../src/data/studioData');
  const scene = fixture('inside', 'sodium_street');
  scene.frame = option('half_body');
  scene.clutters = DAILY_LIFE_CLUTTER.slice(0, 6);
  const { report, sanitized } = validateAndSanitizePhysics(scene);
  assert.equal(sanitized.clutters.length, 2);
  assert.ok(report.warnings.some(x => x.id === 'clutter_visibility_budget'));
});

test('new locations select compatible light for explicit daypart', async () => {
  const { LOCATIONS } = await import('../src/data/studioData');
  const { analyzeLocationLighting } = await import('../src/utils/lightingEngine');
  const { optionLockReason } = await import('../src/utils/optionCompatibility');
  for (const loc of LOCATIONS.filter(x => x.id >= 41)) {
    for (const time of ['day','night','sunset'] as const) {
      const lighting = analyzeLocationLighting(loc.id, time);
      const reason = optionLockReason('lighting', lighting.primaryRecommendedLightId, {
        zone: loc.zone, time, lightingId: lighting.primaryRecommendedLightId,
        poseId: 'arm_out', clothId: 'thobe', selectedAirflowIds: [], selectedErgonomicIds: []
      });
      assert.equal(reason, null, loc.id + ' ' + time + ' ' + lighting.primaryRecommendedLightId);
      assert.ok(lighting.recommendations.some(x => x.id === lighting.primaryRecommendedLightId));
    }
  }
});
