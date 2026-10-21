import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSceneScope, sceneScopeInstruction } from '../src/utils/sceneScope';

test('defaults missing or invalid scene scope to automatic mode', () => {
  assert.equal(normalizeSceneScope(undefined), 'auto');
  assert.equal(normalizeSceneScope('unexpected'), 'auto');
});

test('preserves explicit inside and outside selections', () => {
  assert.equal(normalizeSceneScope('inside'), 'inside');
  assert.equal(normalizeSceneScope('outside'), 'outside');
});

test('inside scope forbids outside poses', () => {
  const instruction = sceneScopeInstruction('inside');
  assert.match(instruction, /inside the vehicle cabin/i);
  assert.match(instruction, /do not place the subject standing outside/i);
});

test('outside scope requires a safely parked vehicle and forbids cabin placement', () => {
  const instruction = sceneScopeInstruction('outside');
  assert.match(instruction, /outside the vehicle/i);
  assert.match(instruction, /safely parked/i);
  assert.match(instruction, /do not place the subject in the driver seat/i);
});
