import React, { useState } from 'react';
import { ChecklistItem, ScreenView } from '../types';
import { 
  Building2, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Thermometer, 
  Zap, 
  ArrowRight, 
  ExternalLink,
  RotateCcw,
  Check,
  Plus
} from 'lucide-react';

interface ComplianceChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onNavigate: (screen: ScreenView) => void;
  onScheduleLab: (testTitle: string) => void;
  onReviewFindings: (testTitle: string) => void;
}

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  items,
  onToggleItem,
  onNavigate,
  onScheduleLab,
  onReviewFindings,
}) => {
  // Compute progress based on completed items out of 20 mandatory items
  const completedCount = items.filter((i) => i.status === 'complete').length;
  // Let base count be 20 as in mockup
  const totalMandatory = 20;
  const progressPercent = Math.round((completedCount / totalMandatory) * 100);
  
  // Circumference for r=54
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.292
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const materialItems = items.filter((i) => i.section === 'Material Sourcing');
  const labItems = items.filter((i) => i.section === 'Laboratory Testing');

  return (
    <main className="ml-0 md:ml-[var(--sidebar-width)] pt-16 min-h-screen bg-[#F9F9FE] flex flex-col justify-between">
      <div className="p-6 lg:p-10 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold text-[#001e40] tracking-tight mb-2">
            Compliance Checklist
          </h1>
          <p className="text-base text-[#475569]">
            Tracking standards adherence and certification progress.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Progress Widget (Col 4) */}
          <div className="col-span-12 md:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col items-center justify-between">
            <h3 className="text-xl font-medium text-[#001e40] mb-8 self-start w-full border-b border-[#E2E8F0] pb-3">
              Overall Progress
            </h3>

            {/* Circular Progress Gauge */}
            <div className="relative w-48 h-48 my-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  className="text-[#e2e2e7] stroke-current"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r={radius}
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <circle
                  className="text-[#bb0013] stroke-current progress-ring__circle"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold text-[#001e40] tracking-tight">
                  {progressPercent}%
                </span>
                <span className="font-mono text-[11px] text-[#475569] uppercase tracking-widest mt-1 font-medium">
                  Complete
                </span>
              </div>
            </div>

            <div className="w-full text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-[#475569]">
                <strong className="text-[#001e40] font-semibold">{completedCount}</strong> of{' '}
                <strong className="text-[#001e40] font-semibold">{totalMandatory}</strong> mandatory checks verified.
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Click any checklist entry to toggle audit verification status
              </p>
            </div>
          </div>

          {/* Detailed Sections (Col 8) */}
          <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
            {/* Material Sourcing Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4 mb-4">
                <h3 className="text-xl font-medium text-[#001e40] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#001e40]" />
                  <span>Material Sourcing</span>
                </h3>
                <span className="bg-[#eeedf2] text-[#475569] font-mono text-[11px] px-2.5 py-1 rounded uppercase tracking-wider font-semibold">
                  Section 1
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {materialItems.map((item) => {
                  const isComplete = item.status === 'complete';
                  const isInProgress = item.status === 'in_progress';

                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`flex items-center justify-between p-3.5 rounded transition-all cursor-pointer select-none ${
                        isInProgress
                          ? 'bg-[#f4f3f8] border border-[#E2E8F0]'
                          : isComplete
                          ? 'hover:bg-[#f4f3f8] opacity-80'
                          : 'hover:bg-[#f4f3f8]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {isComplete ? (
                          <div className="w-5 h-5 rounded-full bg-[#001e40] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isInProgress ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#bb0013] border-t-transparent animate-spin-none flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#bb0013]"></div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                        )}
                        <div>
                          <p
                            className={`text-[15px] font-medium transition-all ${
                              isComplete ? 'line-through text-[#475569]' : 'text-[#0F172A]'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="font-mono text-[11px] text-[#475569] mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isComplete ? (
                          <span className="bg-[#d5e3ff] text-[#1f477b] font-mono text-[11px] font-medium px-3 py-1 rounded-full uppercase border border-[#a7c8ff]">
                            Complete
                          </span>
                        ) : isInProgress ? (
                          <span className="bg-[#ffdbca] text-[#723610] font-mono text-[11px] font-medium px-3 py-1 rounded-full uppercase border border-[#ffb690]">
                            In Progress
                          </span>
                        ) : (
                          <span className="bg-[#F7F9FB] border border-[#E2E8F0] text-[#475569] font-mono text-[11px] font-medium px-3 py-1 rounded-full uppercase">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Laboratory Testing Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4 mb-4">
                <h3 className="text-xl font-medium text-[#001e40] flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#001e40]" />
                  <span>Laboratory Testing</span>
                </h3>
                <span className="bg-[#eeedf2] text-[#475569] font-mono text-[11px] px-2.5 py-1 rounded uppercase tracking-wider font-semibold">
                  Section 2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thermal Stress Test */}
                <div className="border border-[#E2E8F0] p-4 rounded-lg flex flex-col justify-between bg-white hover:border-slate-300 transition-colors">
                  <div>
                    <div className="flex justify-between items-start">
                      <Thermometer className="w-5 h-5 text-[#001e40]" />
                      <span className="bg-[#F7F9FB] border border-[#E2E8F0] text-[#475569] font-mono text-[11px] px-2 py-0.5 rounded-full uppercase font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-[15px] font-medium text-[#0F172A] mt-2">
                      Thermal Stress Test
                    </p>
                    <p className="font-mono text-[11px] text-[#475569] mt-1">
                      Requires BIS recognized lab submission.
                    </p>
                  </div>
                  <button
                    onClick={() => onScheduleLab('Thermal Stress Test')}
                    className="mt-5 text-[#001e40] font-mono text-[11px] font-semibold uppercase hover:underline self-start flex items-center gap-1 group"
                  >
                    <span>Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Electrical Safety */}
                <div className="border border-[#E2E8F0] p-4 rounded-lg flex flex-col justify-between bg-white hover:border-red-200 transition-colors">
                  <div>
                    <div className="flex justify-between items-start">
                      <Zap className="w-5 h-5 text-[#bb0013]" />
                      <span className="bg-[#ffdad6] text-[#93000a] font-mono text-[11px] px-2 py-0.5 rounded-full uppercase border border-[#ba1a1a] font-semibold">
                        Urgent
                      </span>
                    </div>
                    <p className="text-[15px] font-medium text-[#0F172A] mt-2">
                      Electrical Safety
                    </p>
                    <p className="font-mono text-[11px] text-[#475569] mt-1">
                      IS 302-1 compliance testing pending review.
                    </p>
                  </div>
                  <button
                    onClick={() => onReviewFindings('Electrical Safety IS 302-1')}
                    className="mt-5 text-[#bb0013] font-mono text-[11px] font-semibold uppercase hover:underline self-start flex items-center gap-1 group"
                  >
                    <span>Review Findings</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center px-8 lg:px-16 py-4 w-full text-[#001e40] mt-16 transition-all text-xs font-mono">
        <span className="text-[#475569]">
          © 2024 Bureau of Indian Standards. All Rights Reserved.
        </span>
        <div className="flex gap-6 mt-3 md:mt-0 text-[#475569]">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            Terms of Service
          </a>
          <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            Accessibility
          </a>
          <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            Contact Us
          </a>
        </div>
      </footer>
    </main>
  );
};
