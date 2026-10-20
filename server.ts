import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side client with mandatory User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Quick Flash Generator (direct prompt generation)
app.post('/api/gemini/quick-generate', async (req, res) => {
  try {
    const { loc, car, light, cloth, customNote, customApiKey } = req.body;

    const systemInstruction = `You are an elite Prompt Engineer specializing in Midjourney and ChatGPT photorealistic selfies.
Rules:
The subject MUST dominate 75-85% of the vertical 9:16 frame as an arm's length handheld smartphone selfie.
Subject metrics: 193 cm (6'4"), 83 kg, lean athletic build, identical facial bone structure, warm amber eyes, nose freckles, natural hair density/texture, exact beard and mustache grooming without alteration.
Logical consistency is mandatory:
If inside car, NEVER place him outside or leaning on the hood.
If wearing a t-shirt, NEVER mention thobe reflections.
Keep the output concise, vivid, and photorealistic. No repetitive fluff or lists of banned words. Output ONLY the English prompt.`;

    const zoneText = loc?.zone === 'inside' ? 'sitting in driver seat inside' : 'standing outside beside';
    const userPrompt = `Generate a realistic selfie prompt:
Zone & Setting: ${loc?.en || 'shaded residential parking'} (${zoneText} ${car?.en || 'pearl white Toyota Land Cruiser LC300'})
Lighting: ${light?.en || 'warm amber sodium streetlights'}
Outfit: ${cloth?.en || 'charcoal dark crewneck t-shirt identical to reference'}
Mood / Story: ${customNote || 'candid quiet moment'}`;

    const clientToUse = customApiKey && typeof customApiKey === 'string' && customApiKey.trim().length > 5
      ? new GoogleGenAI({
          apiKey: customApiKey.trim(),
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        })
      : ai;

    const response = await clientToUse.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || '';
    res.json({ success: true, text: text.trim() });
  } catch (error: any) {
    console.error('Quick generate error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'فشل توليد البرومبت عبر Gemini',
    });
  }
});

// Endpoint: Direct Gemini Flash Co-Pilot Action (Optimize or Scenario)
app.post('/api/gemini/call-flash', async (req, res) => {
  try {
    const { action, promptEn } = req.body;

    let systemInstruction = '';
    let userPrompt = '';

    if (action === 'optimize') {
      systemInstruction = `أنت كبير مهندسي الأوامر (Prompt Engineering Director) وخبير تصوير سيلفي واقعي في السعودية.
مهمتك: مراجعة البرومبت المدخل، وتدقيقه لضمان:
1. الشخص المرجعي (193 سم، 83 كجم، بنية رياضية ممشوقة) يسيطر على 75-85% من الكادر كسيلفي هاتف أصيل ممسوك باليد.
2. حظر أي تغيير لكثافة شعر الرأس أو شكل اللحية الأصلية.
3. التخلص من أي مفردات دعائية مصطنعة (Anti-AI Slop).
4. إضافة تفاصيل فيزيائية واقعية جداً تحاكي تفاعل الضوء مع البشرة السعودية في البيئة المحددة.
قدّم النتيجة بشكل موجز ومباشر باللغتين مع شرح سطرين لأهم الإضافات التي تزيد الواقعية بنسبة 100%.`;
      userPrompt = `قم بفحص وتحسين هذا البرومبت ليكون بأعلى درجات الواقعية المفرطة:\n\n${promptEn || ''}`;
    } else {
      systemInstruction = `أنت خبير تصوير ومبتكر سيناريوهات سيلفي عفوية في السعودية.
مهمتك: اقتراح سيناريو سيلفي عفوي ومبتكر من قلب الحياة اليومية للشباب السعودي لشاب فارع الطول (193 سم / 83 كجم) بنفس شعر ولحية المرجع.
السيناريو يجب أن يكون غير متكلف (مثل: انتظار بالمواقف، سرية ليلية، وقفة عند بقالة، بعد تمرين، أو كشتة).
اكتب السيناريو بأسلوب بصري دقيق مع الصياغة الإنجليزية الجاهزة للاستخدام في Midjourney/ChatGPT.`;
      userPrompt = `اقترح لي سيناريو سيلفي جديد وعفوي جداً ومختلف عن السائد داخل أو بجانب السيارة.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || '';
    res.json({ success: true, text });
  } catch (error: any) {
    console.error('Gemini Flash call error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to communicate with Gemini Flash',
    });
  }
});

// Endpoint: Generate creative candid scenario using Gemini 3.8 Flash
app.post('/api/gemini/generate-scenario', async (req, res) => {
  try {
    const { userVibe } = req.body;
    const promptText = `أنت خبير تصوير سيلفي واقعي عالي الدقة ومحترف في كتابة أوامر الذكاء الاصطناعي (Midjourney / Stable Diffusion).
المطلوب اقتراح سيناريو سيلفي واقعي وطبيعي جداً لشاب سعودي طوله 193 سم ووزنه 83 كجم ذو بنية رياضية ممشوقة ولحية وشعر طبيعي أصلي متوسط الكثافة.
${userVibe ? `الفكرة المطلوبة من المستخدم: "${userVibe}"` : 'اقترح لقطة عفوية مميزة من الحياة اليومية بالسيارة أو خارجها في السعودية (مثل: وقفة إشارة العصر، طريق سريع بالليل، مشوار العائلة الظهر، أو موقف هادئ).' }

يجب أن تلتزم بالقاعدة الصارمة:
1. الشخص المرجعي هو بطل الصورة الرئيسي ويسيطر على 75-85% من الكادر كسيلفي قريب ممسوك باليد.
2. السيارة أو المكان هو خلفية ثانوية تظهر بعفوية حسب زاوية اليد فقط.
3. تفاصيل حية بدون تكلف: لمعة بشرة خفيفة، ارتداد ضوء، قطرات برودة على كوب، أو شاحن سيارة.

أعد الرد بتنسيق JSON صالح حصرياً بالشكل التالي:
{
  "title": "عنوان السيناريو بالعربية (3-5 كلمات)",
  "vibe": "وصف شعور اللقطة بجملة واحدة",
  "storyline": "سياق القصة العفوي",
  "suggestedHair": "تسريحة الشعر الطبيعية",
  "suggestedCloth": "الملابس المقترحة",
  "suggestedCar": "طراز السيارة في الخلفية",
  "suggestedLight": "طبيعة الإضاءة والوقت",
  "suggestedPromptSnippetEn": "A concise naturalistic English prompt snippet focusing strictly on 193cm tall subject dominating 75-85% frame at arm's length selfie perspective with incidental background"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    res.json({ success: true, scenario: data });
  } catch (error: any) {
    console.error('Gemini scenario error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate scenario with Gemini',
    });
  }
});

// Endpoint: Optimize and enrich prompt text with micro-dermal and optical realism
app.post('/api/gemini/optimize-prompt', async (req, res) => {
  try {
    const { currentPromptEn, currentPromptAr } = req.body;

    const instruction = `You are a master generative AI photography prompt engineer specialized in breaking AI-generated look (anti-AI slop) and enforcing strict Subject-First smartphone selfie optics.

Review the following prompt:
English:
"""
${currentPromptEn || ''}
"""

Arabic context:
"""
${currentPromptAr || ''}
"""

Rules:
1. Maintain 100% of the subject's exact identity and bone structure (193cm / 6'4", 83kg lean athletic Saudi man, exact medium natural hair volume, exact natural beard density and un-lasered neck contour).
2. The subject must unequivocally occupy 75-85% of the frame as an arm's length handheld selfie.
3. Add subtle authentic imperfections (dermal subsurface translucency, organic catchlight, uncleaned smartphone lens bloom, seatbelt angle across broad chest, AC vent temperature, subtle motion micro-blur).
4. Strictly eliminate any commercial automotive framing, cinematic studio lighting, or plastic skin terms.

Return a JSON object:
{
  "improvedPromptEn": "Enriched complete English prompt ready for Midjourney/ChatGPT",
  "improvedPromptAr": "الأمر المعزز بالعربية بدقة وفصاحة",
  "enhancementsSummary": ["نقطة التحسين 1", "نقطة التحسين 2", "نقطة التحسين 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: instruction,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    res.json({ success: true, optimized: data });
  } catch (error: any) {
    console.error('Gemini optimize error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to optimize prompt with Gemini',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Dev vs Prod Vite Integration
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Selfie Prompt Studio running at http://localhost:${PORT}`);
  });
}

startServer();
