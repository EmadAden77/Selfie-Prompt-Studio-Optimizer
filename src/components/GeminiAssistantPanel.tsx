import React, { useState } from 'react';
import { GeminiScenario, GeminiOptimized } from '../types/studio';

interface GeminiAssistantPanelProps {
  currentPromptEn: string;
  currentPromptAr: string;
  onApplyScenario: (scenario: GeminiScenario) => void;
  onApplyOptimizedPrompt: (optimized: GeminiOptimized) => void;
}

export const GeminiAssistantPanel: React.FC<GeminiAssistantPanelProps> = ({
  currentPromptEn,
  currentPromptAr,
  onApplyScenario,
  onApplyOptimizedPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'scenario' | 'optimizer'>('scenario');
  const [vibeInput, setVibeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedScenario, setGeneratedScenario] = useState<GeminiScenario | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<GeminiOptimized | null>(null);

  // Quick prompt ideas for Saudi candid scenes
  const quickIdeas = [
    'قهوة طريق سفر الفجر مع شروق ذهبي',
    'واقف عند إشارة العليا بالرياض العصر',
    'موقف هادئ بعد تمرين النادي بالليل',
    'مشوار العائلة وقت الظهيرة والمكيف شغال',
    'جلسة طعوس النفود عند الغروب متكئ على الكبوت'
  ];

  const handleGenerateScenario = async (customVibe?: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedScenario(null);

    const vibeToUse = customVibe !== undefined ? customVibe : vibeInput;

    try {
      const res = await fetch('/api/gemini/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userVibe: vibeToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر توليد السيناريو عبر Gemini');
      }

      setGeneratedScenario(data.scenario);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizePrompt = async () => {
    setIsLoading(true);
    setError(null);
    setOptimizedResult(null);

    try {
      const res = await fetch('/api/gemini/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPromptEn,
          currentPromptAr,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر تحسين البرومبت عبر Gemini');
      }

      setOptimizedResult(data.optimized);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-emerald-500/20">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-zinc-100">
                مساعد Gemini 3.8 Flash الذكي
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              توليد سيناريوهات عفوية مبتكرة وتحسين البرومبت بفيزياء مجهرية تكسر الذكاء الاصطناعي
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-zinc-800/80 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('scenario'); setError(null); }}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'scenario' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚡ توليد سيناريو جديد
          </button>
          <button
            onClick={() => { setActiveTab('optimizer'); setError(null); }}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'optimizer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🔬 تحسين البرومبت الحالي
          </button>
        </div>
      </div>

      {/* Tab 1: Generate Scenario */}
      {activeTab === 'scenario' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 block">
              اكتب فكرة أو شعور اللقطة (أو اختر من الأفكار السريعة بالأسفل):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vibeInput}
                onChange={e => setVibeInput(e.target.value)}
                placeholder="مثال: واقف عند إشارة التحلية عصراً والشمس على زاوية الوجه مع كوب قهوة..."
                className="flex-1 bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500"
                onKeyDown={e => e.key === 'Enter' && handleGenerateScenario()}
              />
              <button
                disabled={isLoading}
                onClick={() => handleGenerateScenario()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-emerald-700/20"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري التوليد...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>توليد بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Idea Pills */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className="text-[11px] text-zinc-500">اقتراحات سريعة:</span>
            {quickIdeas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setVibeInput(idea);
                  handleGenerateScenario(idea);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 hover:text-emerald-300 text-zinc-300 border border-zinc-700/50 transition"
              >
                {idea}
              </button>
            ))}
          </div>

          {/* Generated Scenario Result Card */}
          {generatedScenario && (
            <div className="mt-3 bg-zinc-950/70 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                    {generatedScenario.title}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                  Subject Dominant 80%
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {generatedScenario.vibe}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {generatedScenario.storyline && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">سياق المشهد:</span>
                    <span className="text-zinc-200">{generatedScenario.storyline}</span>
                  </div>
                )}
                {generatedScenario.suggestedCloth && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">الملابس المقترحة:</span>
                    <span className="text-zinc-200">{generatedScenario.suggestedCloth}</span>
                  </div>
                )}
                {generatedScenario.suggestedCar && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">السيارة والمكان:</span>
                    <span className="text-zinc-200">{generatedScenario.suggestedCar}</span>
                  </div>
                )}
                {generatedScenario.suggestedLight && (
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">الإضاءة والوقت:</span>
                    <span className="text-amber-300">{generatedScenario.suggestedLight}</span>
                  </div>
                )}
              </div>

              {generatedScenario.suggestedPromptSnippetEn && (
                <div className="bg-black/50 border border-zinc-800 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 leading-relaxed text-left" dir="ltr">
                  <span className="text-emerald-400 font-bold block mb-1 font-sans text-xs text-right" dir="rtl">مقتطف البرومبت الإنجليزي المقترح:</span>
                  {generatedScenario.suggestedPromptSnippetEn}
                </div>
              )}

              <button
                onClick={() => onApplyScenario(generatedScenario)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>تطبيق هذا السيناريو في الاستوديو</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Optimize Prompt */}
      {activeTab === 'optimizer' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-300 leading-relaxed">
            يقوم Gemini بفحص أمر السيلفي الحالي للتأكد من خلوه من أي مصطلحات مصطنعة أو إعلانية (Anti-AI Slop) مع إضافة فيزياء مجهرية حيوية (تشتت الضوء في غضروف الأذن، ارتداد ضوء الثوب على الذقن، تشوه العدسة العريضة، وشعيرات الرقبة الطبيعية).
          </p>

          <button
            disabled={isLoading}
            onClick={handleOptimizePrompt}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs md:text-sm font-bold shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري تحليل وتحسين الأوامر بفيزياء الواقعية...</span>
              </>
            ) : (
              <>
                <span>🔬</span>
                <span>فحص وتحسين البرومبت الآن (Gemini 3.8 Flash)</span>
              </>
            )}
          </button>

          {/* Optimized Result Card */}
          {optimizedResult && (
            <div className="mt-3 bg-zinc-950/70 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-xs font-bold text-emerald-400">
                  ✓ تم تحسين البرومبت بنجاح
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Anti-Slop Verified
                </span>
              </div>

              {optimizedResult.enhancementsSummary && optimizedResult.enhancementsSummary.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 block">التحسينات المضافة:</span>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    {optimizedResult.enhancementsSummary.map((enh, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs">✦</span>
                        <span>{enh}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {optimizedResult.improvedPromptAr && (
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">الأمر العربي المعزز:</span>
                  <pre className="whitespace-pre-wrap text-xs bg-black/40 border border-zinc-800 rounded-lg p-3 max-h-36 overflow-y-auto leading-relaxed text-zinc-300 font-mono">
                    {optimizedResult.improvedPromptAr}
                  </pre>
                </div>
              )}

              {optimizedResult.improvedPromptEn && (
                <div dir="ltr">
                  <span className="text-[11px] text-zinc-400 block mb-1 text-left font-mono">Enriched English Prompt:</span>
                  <pre className="whitespace-pre-wrap text-xs bg-black/40 border border-zinc-800 rounded-lg p-3 max-h-36 overflow-y-auto leading-relaxed text-zinc-300 font-mono text-left">
                    {optimizedResult.improvedPromptEn}
                  </pre>
                </div>
              )}

              <button
                onClick={() => onApplyOptimizedPrompt(optimizedResult)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>استبدال البرومبت في الاستوديو بالنسخة المحسنة</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
};
