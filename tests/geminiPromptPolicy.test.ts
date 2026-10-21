import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeGeminiPromptResult } from '../src/utils/geminiPromptPolicy';

const valid = {
  promptEn: 'Use the attached reference as the only identity source. Preserve visible facial geometry, original skin tone, natural asymmetry, hairline and beard boundaries. Keep the subject 193cm, 83kg, lean athletic. Show the selected car and clothing under the selected lighting in an ordinary Saudi residential parking area without landmarks. Use a physically plausible one-handed smartphone selfie, natural arm reach, coherent background, real shadows, restrained HDR, realistic noise and no invented fill light. No extra hands, no plastic skin, no commercial vehicle framing.',
  promptAr: 'استخدم الصورة المرجعية كمصدر وحيد للهوية. حافظ على هندسة الوجه ولون البشرة واللاتناظر وخط الشعر وحدود اللحية كما تظهر. الطول 193 سم والوزن 83 كجم والبنية رياضية نحيلة. أظهر السيارة والملابس والإضاءة المختارة في موقف سكني سعودي عادي بلا معالم، مع سيلفي واقعي بيد واحدة وهندسة ممكنة وظلال مرتبطة بمصدر ضوء حقيقي، دون إضاءة مخفية أو تشريح خاطئ.',
  locationEn: 'ordinary Saudi residential parking area',
  locationAr: 'موقف سكني سعودي عادي',
  backgroundEn: 'plain villa walls, parked cars and a normal street edge with no landmark',
  backgroundAr: 'جدران فلل عادية وسيارات متوقفة وحافة شارع بلا معالم',
  poseEn: 'relaxed standing beside the safely parked vehicle',
  poseAr: 'وقوف مريح بجانب السيارة المتوقفة بأمان',
  cameraEn: 'natural one-handed front-camera selfie at a relaxed arm distance',
  cameraAr: 'سيلفي طبيعي بيد واحدة من الكاميرا الأمامية على مسافة ذراع مريحة',
  lightingEn: 'the selected practical light only, with physically consistent shadows',
  lightingAr: 'الإضاءة العملية المختارة فقط مع ظلال متسقة فيزيائياً',
  reasonEn: 'The plan keeps the selected inputs authoritative and the scene physically coherent.',
  reasonAr: 'الخطة تبقي الاختيارات المحددة ثابتة وتحافظ على اتساق المشهد فيزيائياً.',
};

test('normalizes a complete strict Gemini result', () => {
  const result = normalizeGeminiPromptResult(valid);
  assert.ok(result);
  assert.equal(result?.locationEn, valid.locationEn);
});

test('rejects incomplete strict Gemini results', () => {
  const result = normalizeGeminiPromptResult({ ...valid, backgroundAr: '' });
  assert.equal(result, null);
});

test('rejects named landmarks even when the rest of the result is valid', () => {
  const result = normalizeGeminiPromptResult({
    ...valid,
    locationEn: 'ordinary Saudi street near Burj Khalifa',
  });
  assert.equal(result, null);
});
