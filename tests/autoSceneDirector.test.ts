import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACCESSORIES,
  ASPECTS,
  CLOTHES,
  LIGHTING_OPTIONS,
  LOCATIONS,
  PHONES,
  STORYLINES,
  WINDOW_TINTS,
} from '../src/data/studioData';
import {
  normalizeGeminiDirectorPlan,
  resolveAutoSceneDirector,
  type AutoSceneDirectorContext,
} from '../src/utils/autoSceneDirector';

function contextFor(zone: 'inside' | 'outside'): AutoSceneDirectorContext {
  const loc = LOCATIONS.find((candidate) => candidate.zone === zone);
  assert.ok(loc, 'the fixture must contain both location zones');
  return {
    loc,
    carModel: { id: 'test-car', ar: 'سيارة متوقفة بأمان', en: 'safely parked test car' },
    cloth: CLOTHES[0],
    accessory: ACCESSORIES[0],
    aspect: ASPECTS.find((item) => item.id === '916') ?? ASPECTS[0],
    phone: PHONES[0],
    light: LIGHTING_OPTIONS[0],
    storyline: STORYLINES[0],
    tint: WINDOW_TINTS[0],
    timeOfDay: 'auto',
  };
}

test('automatic director selects an outdoor-capable pose outside the car', () => {
  const plan = resolveAutoSceneDirector(contextFor('outside'));

  assert.match(plan.pose.id, /^outside_/);
  assert.ok(['close_face', 'half_body', 'wide_outside'].includes(plan.preferredFrameId ?? ''));
  assert.ok(['eye_level', 'high_45', 'chest_low', 'candid_side'].includes(plan.preferredAngleId ?? ''));
  assert.ok(plan.distanceCm >= 45 && plan.distanceCm <= 75);
});

test('automatic director never leaks outdoor poses into the cabin', () => {
  const plan = resolveAutoSceneDirector(contextFor('inside'));

  assert.equal(plan.pose.id.startsWith('outside_'), false);
  assert.notEqual(plan.preferredFrameId, 'wide_outside');
  assert.ok(plan.distanceCm >= 45 && plan.distanceCm <= 68);
});

test('invalid Gemini zone decisions are rejected and safely fall back', () => {
  const scene = contextFor('inside');
  const fallback = resolveAutoSceneDirector(scene);
  const normalized = normalizeGeminiDirectorPlan({
    poseId: 'outside_walk_candid',
    preferredFrameId: 'wide_outside',
    preferredAngleId: 'candid_side',
    motionEn: 'unsafe test motion',
  }, scene, fallback);

  assert.ok(normalized);
  assert.equal(normalized?.source, 'gemini');
  assert.equal(normalized?.pose.id, fallback.pose.id);
  assert.equal(normalized?.preferredFrameId, fallback.preferredFrameId);
  assert.equal(normalized?.preferredAngleId, 'candid_side');
});
