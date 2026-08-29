import React from 'react';
import { AuditDeviation } from '../types';
import { X, BookOpen, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ClauseDetailModalProps {
  deviation: AuditDeviation | null;
  onClose: () => void;
  onAskAuditor: (query: string) => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({
  deviation,
  onClose,
  onAskAuditor,
}) => {
  if (!deviation) return null;

  const isPass = deviation.status === 'pass';
  const isFail = deviation.status === 'fail';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-[#001e40]" />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
            Indian Standard Clause Specification
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xl font-bold text-[#001e40]">{deviation.title}</h3>
          <span
            className={`font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
              isPass
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-[#bb0013]'
            }`}
          >
            {deviation.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Standard Clause Reference
            </p>
            <p className="font-semibold text-slate-900 font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
              {deviation.clauseRef || 'Clause Reference: IS 5120:1977'}
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Statutory Standard Requirement
            </p>
            <div className="p-3.5 bg-blue-50/70 border-l-4 border-[#001e40] rounded text-xs leading-relaxed font-serif text-slate-800">
              {deviation.clauseDetail ||
                'Every unit shall satisfy all safety and functional test procedures prescribed by the relevant sectional committee of the Bureau of Indian Standards.'}
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Audit Finding & Deviation Analysis
            </p>
            <div className={`p-3 rounded text-xs leading-relaxed ${
              isFail ? 'bg-red-50 border border-red-200 text-red-950' : 'bg-slate-50 text-slate-700'
            }`}>
              {deviation.description}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
          <button
            onClick={() => {
              onAskAuditor(`How can I rectify the deviation for "${deviation.title}" according to ${deviation.clauseRef || 'the standard'}?`);
              onClose();
            }}
            className="text-[#bb0013] font-mono text-xs font-semibold uppercase hover:underline flex items-center gap-1"
          >
            <span>Ask Auditor How to Fix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="bg-[#001e40] hover:bg-[#003366] text-white px-4 py-2 rounded text-xs font-mono uppercase font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
