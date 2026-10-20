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
