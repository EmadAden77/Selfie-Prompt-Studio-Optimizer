import React, { useState } from 'react';
import { Lang } from '../types/studio';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptAr: string;
  promptEn: string;
  onSaveCustom: (ar: string, en: string) => void;
  onResetToComputed: () => void;
  isCustomEdited: boolean;
  onCopy: (text: string, tag: string) => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  isOpen,
  onClose,
  promptAr,
  promptEn,
  onSaveCustom,
  onResetToComputed,
  isCustomEdited,
  onCopy,
}) => {
  const [activeLang, setActiveLang] = useState<Lang>('both');
  const [editedAr, setEditedAr] = useState(promptAr);
  const [editedEn, setEditedEn] = useState(promptEn);

  // Sync state if props change when opening
  React.useEffect(() => {
    setEditedAr(promptAr);
    setEditedEn(promptEn);
  }, [promptAr, promptEn, isOpen]);

  if (!isOpen) return null;

  const insertSnippet = (snippetEn: string, snippetAr: string) => {
    setEditedEn(prev => `${prev}\n- Additional Nuance: ${snippetEn}`);
    setEditedAr(prev => `${prev}\n- تفصيلة إضافية: ${snippetAr}`);
  };

  const handleApply = () => {
    onSaveCustom(editedAr, editedEn);
    onClose();
  };

  const handleReset = () => {
    onResetToComputed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-100">
                محرر الأوامر المباشر وتنسيق النصوص
              </h2>
              <p className="text-[11px] text-zinc-400">
                عدّل أي جزئية في الأمر باللغة العربية أو الإنجليزية مع الحفظ الفوري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang Segmented Toggle */}
            <div className="flex bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveLang('both')}
                className={`px-2.5 py-1 rounded transition ${activeLang === 'both' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
              >
                الاثنين
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded transition ${activeLang === 'en' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('ar')}
                className={`px-2.5 py-1 rounded transition ${activeLang === 'ar' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
              >
                عربي
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Insert Snippet Pills */}
        <div className="px-4 py-2 bg-zinc-950/40 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-zinc-500 whitespace-nowrap">إضافات سريعة:</span>
          <button
            onClick={() => insertSnippet('raw unedited Snapchat front camera sensor capture', 'التقاط خام غير معدل بمستشعر كاميرا سناب شات')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition"
          >
            + كاميرا سناب شات خام
          </button>
          <button
            onClick={() => insertSnippet('AC condensation haze on side window', 'ضباب تكييف بارد على زجاج النافذة')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition"
          >
            + ضباب تكييف السيارة
          </button>
          <button
            onClick={() => insertSnippet('subtle amber sunset edge rim lighting', 'إضاءة حافة ذهبية دافئة وقت الغروب')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition"
          >
            + حافة شمس الغروب
          </button>
          <button
            onClick={() => insertSnippet('tall 195cm broad chest pulling seatbelt taut', 'قامة 195 سم تشد حزام الأمان على الصدر العريض')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition"
          >
            + هندسة طول 195 سم
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(activeLang === 'ar' || activeLang === 'both') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">الأمر باللغة العربية (قابل للتعديل):</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {editedAr.length} حرف · {editedAr.split(/\s+/).filter(Boolean).length} كلمة
                </span>
              </div>
              <textarea
                value={editedAr}
                onChange={e => setEditedAr(e.target.value)}
                rows={activeLang === 'both' ? 7 : 14}
                className="w-full bg-black/50 border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-200 font-mono leading-relaxed outline-none focus:border-emerald-500 transition resize-y"
              />
            </div>
          )}

          {(activeLang === 'en' || activeLang === 'both') && (
            <div className="space-y-1.5" dir="ltr">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">English Prompt for Midjourney / ChatGPT (Editable):</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {editedEn.length} chars · {editedEn.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={editedEn}
                onChange={e => setEditedEn(e.target.value)}
                rows={activeLang === 'both' ? 7 : 14}
                className="w-full bg-black/50 border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-200 font-mono leading-relaxed outline-none focus:border-emerald-500 transition resize-y text-left"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isCustomEdited && (
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold transition"
              >
                ↺ استرجاع البرومبت التلقائي
              </button>
            )}
            <button
              onClick={() => onCopy(editedEn, 'en')}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition"
            >
              نسخ الإنجليزي المعدل
            </button>
            <button
              onClick={() => onCopy(`${editedAr}\n\n====================\n\n${editedEn}`, 'both')}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition"
            >
              نسخ كامل
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/30 transition flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>حفظ وتطبيق التعديل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
