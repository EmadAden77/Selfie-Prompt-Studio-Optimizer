import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optionLockReason, type OptionContext } from '../src/utils/optionCompatibility';

const scene = (changes: Partial<OptionContext> = {}): OptionContext => ({
  zone: 'inside', time: 'night', lightingId: 'sodium_street',
  poseId: 'arm_out', clothId: 'tee_black_ref',
  selectedAirflowIds: [], selectedErgonomicIds: [], ...changes,
});

test('locks car-only choices outdoors but keeps exterior poses enabled', () => {
  const x = scene({ zone: 'outside' });
  for (const group of ['cabins','cabinArtifacts','clutters','dashUis','screenCasts','airflows'] as const) {
    assert.ok(optionLockReason(group, 'any', x));
  }
  assert.ok(optionLockReason('poses', 'hand_on_wheel', x));
  assert.ok(optionLockReason('lighting', 'warm_car_cabin_dome', x));
  assert.equal(optionLockReason('poses', 'arm_out', x), null);
});
test('locks implausible time/lighting combinations', () => {
  assert.ok(optionLockReason('lighting','harsh_noon',scene({time:'night'})));
  assert.ok(optionLockReason('lighting','sodium_street',scene({time:'day'})));
  assert.equal(optionLockReason('lighting','direct_flash',scene({time:'night'})), null);
});
test('locks conflicting physical actions and light sources', () => {
  assert.ok(optionLockReason('poses','adjust_collar',scene()));
  assert.ok(optionLockReason('airflows','window_quarter_drift',scene({selectedAirflowIds:['cabin_dead_calm']})));
  assert.ok(optionLockReason('tallErgonomics','roof_handle_grip',scene({poseId:'hand_on_wheel'})));
  assert.ok(optionLockReason('inAppArtifacts','front_screen_flash_burst',scene({lightingId:'direct_flash'})));
});
