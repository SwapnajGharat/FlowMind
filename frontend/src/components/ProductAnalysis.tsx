import React, { useState } from 'react';
import { ProductAnalysisResult, ScreenView } from '../types';
import { CATEGORY_STANDARDS_MAP } from '../data/mockData';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  ShieldCheck, 
  ExternalLink, 
  FlaskConical,
  BookOpen
} from 'lucide-react';

interface ProductAnalysisProps {
  onNavigate: (screen: ScreenView) => void;
  onAuditInAssistant: (category: string, specText: string) => void;
}

export const ProductAnalysis: React.FC<ProductAnalysisProps> = ({
  onNavigate,
  onAuditInAssistant,
}) => {
  const [category, setCategory] = useState<string>('machinery');
  const [productTitle, setProductTitle] = useState<string>('Industrial Centrifugal & Sump Pump Series-X');
  const [specsText, setSpecsText] = useState<string>(
    'Casing Material: Cast Iron FG 200. Operating Pressure: 16 bar. Impeller: Bronze Grade LTB 2. Designed for heavy wastewater discharge, 2900 RPM continuous duty.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult>(
    CATEGORY_STANDARDS_MAP['machinery']
  );

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(CATEGORY_STANDARDS_MAP[category] || CATEGORY_STANDARDS_MAP['machinery']);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <main className="ml-0 md:ml-64 pt-16 min-h-screen bg-[#F9F9FE] flex flex-col justify-between select-none">
      <div className="p-6 lg:p-10 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#bb0013] uppercase tracking-wider font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>BIS Regulatory Certification Engine</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-[#001e40] tracking-tight mb-2">
            Product Analysis & Standards Guide
          </h1>
          <p className="text-base text-[#475569]">
            Determine applicable Indian Standards (IS), mandatory QCOs, and testing mandates for your product.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Form (Col 5) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <h3 className="text-xl font-medium text-[#001e40] mb-5 border-b border-[#E2E8F0] pb-3">
                Product Specification Input
              </h3>

              <form onSubmit={handleAnalyze} className="space-y-4">
                {/* Category Dropdown */}
                <div>
                  <label
                    htmlFor="product-cat"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#475569] mb-1.5 font-semibold"
                  >
                    Industry Sector / Category
                  </label>
                  <select
                    id="product-cat"
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategory(newCat);
                      setAnalysisResult(CATEGORY_STANDARDS_MAP[newCat]);
                    }}
                    className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2.5 text-sm text-[#0F172A] focus:border-[#003366] focus:ring-0 outline-none"
                  >
                    <option value="machinery">Rotodynamic & Industrial Pumps (IS 5120)</option>
                    <option value="electronics">IT & Electronics Equipment (IS 13252 / CRS)</option>
                    <option value="chemicals">Industrial Chemicals & Solvents (IS 10112)</option>
                    <option value="textiles">Protective Technical Clothing (IS 15748)</option>
                    <option value="medical">Medical Electrical Equipment (IS 13450)</option>
                  </select>
                </div>

                {/* Product Name */}
                <div>
                  <label
                    htmlFor="product-name"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#475569] mb-1.5 font-semibold"
                  >
                    Product Name / Model
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2.5 text-sm text-[#0F172A] focus:border-[#003366] focus:ring-0 outline-none"
                  />
                </div>

                {/* Specifications Textarea */}
                <div>
                  <label
                    htmlFor="product-specs"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#475569] mb-1.5 font-semibold"
                  >
                    Technical Specifications & Declared Parameters
                  </label>
                  <textarea
                    id="product-specs"
                    rows={4}
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    placeholder="Enter casing materials, pressures, test voltages, tolerances..."
                    className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2.5 text-sm text-[#0F172A] focus:border-[#003366] focus:ring-0 outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full bg-[#bb0013] hover:bg-[#93000d] text-white font-mono text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Cross-Referencing Standards...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Run Standards Compatibility Check</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Link into Assistant */}
            <div className="bg-[#001e40] text-white rounded-xl p-5 border border-blue-900/40">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-300 mt-1 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-white">Direct Spec Audit in Assistant</h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Have an official specification sheet? Send it directly to our AI Compliance Auditor to detect deviations against Clause requirements.
                  </p>
                  <button
                    onClick={() => onAuditInAssistant(category, specsText)}
                    className="mt-3 bg-white text-[#001e40] px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                  >
                    <span>Audit in Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Roadmaps (Col 7) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            {/* Primary Matched Standard Banner */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#001e40]" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#bb0013] uppercase tracking-wider">
                  Applicable Standard
                </span>
                <span className="bg-[#d5e3ff] text-[#001e40] font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded uppercase border border-[#a7c8ff]">
                  {analysisResult.scheme}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#001e40]">
                {analysisResult.matchedStandard}
              </h2>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {analysisResult.standardTitle}
              </p>

              <div className="mt-4 p-3 bg-red-50/70 border border-red-200 rounded text-xs flex items-center gap-2 text-red-900 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#bb0013] shrink-0" />
                <span>{analysisResult.mandatoryDeadline}</span>
              </div>
            </div>

            {/* Mandatory Testing Parameters Bento Grid */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4 border-b border-[#E2E8F0] pb-3">
                <h3 className="text-xl font-medium text-[#001e40] flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#001e40]" />
                  <span>Mandatory Laboratory Parameters</span>
                </h3>
                <button
                  onClick={() => onNavigate('lab_finder')}
                  className="text-xs font-mono text-[#001e40] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Find Test Labs</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.testingParameters.map((param, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#F7F9FB] border border-[#E2E8F0] hover:border-slate-300 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-semibold text-[#001e40]">{param.title}</h4>
                      <span className="font-mono text-[11px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                        {param.clause}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Certification Path Roadmap */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <h3 className="text-xl font-medium text-[#001e40] mb-4 border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#001e40]" />
                <span>Certification Roadmap (Scheme-I)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {analysisResult.regulatorySteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white flex gap-3 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#001e40] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-[#001e40]">{step.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  Official Portal: manakonline.in
                </span>
                <button
                  onClick={() => onNavigate('checklist')}
                  className="bg-[#001e40] hover:bg-[#003366] text-white font-mono text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded transition-colors flex items-center gap-1.5"
                >
                  <span>Track in Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center px-8 lg:px-16 py-4 w-full text-[#001e40] mt-16 text-xs font-mono">
        <span className="text-[#475569]">
          © 2024 Bureau of Indian Standards. All Rights Reserved.
        </span>
        <div className="flex gap-6 mt-3 md:mt-0 text-[#475569]">
          <a href="#standards" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            National Standards Repository
          </a>
          <a href="#gazette" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            Official Gazette QCO Orders
          </a>
          <a href="#helpdesk" onClick={(e) => e.preventDefault()} className="hover:text-[#001e40] underline">
            BIS Helpdesk
          </a>
        </div>
      </footer>
    </main>
  );
};
