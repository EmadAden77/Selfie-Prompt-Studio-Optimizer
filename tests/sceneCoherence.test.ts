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
