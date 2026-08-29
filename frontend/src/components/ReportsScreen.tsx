import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  Search, 
  ExternalLink 
} from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  standard: string;
  applicant: string;
  date: string;
  status: 'Compliant' | 'Action Required' | 'Under Lab Review';
  deviationsCount: number;
  score: number;
}

export const ReportsScreen: React.FC = () => {
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [search, setSearch] = useState('');

  const reports: ReportItem[] = [
    {
      id: 'rep-1',
      title: 'Industrial Rotodynamic Pump Series-X Audit',
      standard: 'IS 5120:1977',
      applicant: 'Kirloskar Fluidics & Infra Ltd.',
      date: '24 Oct 2024',
      status: 'Action Required',
      deviationsCount: 2,
      score: 82,
    },
    {
      id: 'rep-2',
      title: 'IT Server SMPS Power Supply Evaluation',
      standard: 'IS 13252 (Part 1): 2010',
      applicant: 'Delta Electronics India Pvt Ltd',
      date: '18 Oct 2024',
      status: 'Compliant',
      deviationsCount: 0,
      score: 98,
    },
    {
      id: 'rep-3',
      title: 'Portland Slag Cement Production Batch #892',
      standard: 'IS 455:2015',
      applicant: 'UltraTech Cement Unit II',
      date: '10 Oct 2024',
      status: 'Compliant',
      deviationsCount: 0,
      score: 96,
    },
    {
      id: 'rep-4',
      title: 'Industrial High-Flame Protective Overalls',
      standard: 'IS 15748:2007',
      applicant: 'Arvind Advanced Textiles Ltd.',
      date: '02 Oct 2024',
      status: 'Under Lab Review',
      deviationsCount: 1,
      score: 89,
    },
  ];

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.standard.toLowerCase().includes(search.toLowerCase()) ||
      r.applicant.toLowerCase().includes(search.toLowerCase())
  );

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  return (
    <main className="ml-0 md:ml-64 pt-16 min-h-screen bg-[#F9F9FE] flex flex-col justify-between select-none">
      <div className="p-6 lg:p-10 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#bb0013] uppercase tracking-wider font-semibold mb-1">
              <FileText className="w-4 h-4" />
              <span>Audit Reports & Certificate Registry</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#001e40] tracking-tight">
              Statutory Compliance Reports
            </h1>
            <p className="text-base text-[#475569] mt-1">
              Archived technical audit findings, Scheme-I STI inspection reviews, and laboratory test summaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#001e40] px-4 py-2.5 rounded font-mono text-xs uppercase font-semibold flex items-center gap-2 transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Sheet</span>
            </button>
            <button
              onClick={() => alert('Exporting full audit docket with digital cryptographic signature...')}
              className="bg-[#bb0013] hover:bg-[#93000d] text-white px-4 py-2.5 rounded font-mono text-xs uppercase font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Dossier</span>
            </button>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Report List (Col 5) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit filings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded text-xs text-slate-800 outline-none focus:border-[#003366]"
              />
            </div>

            <div className="space-y-3">
              {filteredReports.map((rep) => {
                const isSelected = rep.id === selectedReportId;
                const isCompliant = rep.status === 'Compliant';

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#003366] shadow-[0_4px_16px_rgba(0,51,102,0.08)] bg-blue-50/20'
                        : 'border-[#E2E8F0] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[11px] font-bold text-[#001e40] bg-slate-100 px-2 py-0.5 rounded">
                        {rep.standard}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          isCompliant
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-[#bb0013]'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#001e40] mt-2 line-clamp-1">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{rep.applicant}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Date: {rep.date}</span>
                      <span>Compliance Score: <strong className="text-slate-800">{rep.score}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Document Preview (Col 7) */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs relative">
            {/* BIS Official Header Seal */}
            <div className="flex justify-between items-start border-b-2 border-[#001e40] pb-6 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY0euhpPuqSL4YXg5pNrrwI-wgxiWrANXZd7Cix9rsvevmXzPKJCnIEP1ZOugAQbRmnOSd4zCD5F5giXvY9aTctlNHthaL0UI84PO_EUo0dGbMDjVT6S_LsinuKVKQ7pPW0_1qcJygtc3vOFjGyvi_SMIOCWk-9qqB_iQzExAP1I4kFijCYKv2oOZzHEt0WdIAFjrGR25LxRBiGIyjAkqQEc65xqVE7SEEg1FnTdvsuVET6znppf9KMw"
                  alt="BIS Seal"
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#001e40] uppercase tracking-tight">
                    Bureau of Indian Standards
                  </h3>
                  <p className="text-xs text-slate-600 font-serif">
                    Central Marks Department (CMD-III) • Manak Bhavan, New Delhi
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                    Scheme-I Technical Audit Report
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-slate-700 block">
                  Report ID: {activeReport.id.toUpperCase()}-2024
                </span>
                <span className="font-mono text-[11px] text-slate-500 block">
                  Issue Date: {activeReport.date}
                </span>
                <span className="inline-block mt-2 font-mono text-[10px] bg-red-100 text-[#bb0013] px-2 py-0.5 rounded font-bold uppercase">
                  {activeReport.status}
                </span>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-6 text-sm text-slate-800">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded text-xs">
                <div>
                  <span className="text-slate-500 font-mono uppercase text-[10px] block">
                    Product Under Evaluation
                  </span>
                  <span className="font-bold text-[#001e40] text-sm">{activeReport.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase text-[10px] block">
                    Target Standard
                  </span>
                  <span className="font-bold text-[#001e40] text-sm">{activeReport.standard}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase text-[10px] block">
                    Applicant / Manufacturer
                  </span>
                  <span className="font-medium text-slate-800">{activeReport.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono uppercase text-[10px] block">
                    Mandatory Scheme
                  </span>
                  <span className="font-medium text-slate-800">ISI Standard Mark (Scheme-I)</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#001e40] uppercase tracking-wider font-mono mb-2">
                  Executive Summary & Assessment
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-serif">
                  The manufacturing plant and technical documentation were inspected for conformity against statutory Indian Standards requirements. While the overall material composition meets grade criteria, <strong>2 Critical Deviations</strong> were identified in hydrostatic containment thresholds (Clause 5.2.1) and ISI mark plate specifications (Clause 7.1). Corrective actions must be completed within 30 days.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#001e40] uppercase tracking-wider font-mono mb-2">
                  Key Clause Findings Table
                </h4>
                <div className="border border-slate-200 rounded overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-mono text-[11px]">
                      <tr>
                        <th className="p-2.5">Clause</th>
                        <th className="p-2.5">Parameter</th>
                        <th className="p-2.5">Requirement</th>
                        <th className="p-2.5">Finding</th>
                        <th className="p-2.5">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-mono">Cl. 4.1</td>
                        <td className="p-2.5 font-medium">Cast Iron Grade</td>
                        <td className="p-2.5">FG 200 min</td>
                        <td className="p-2.5">FG 215 MPa</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr className="bg-red-50/50">
                        <td className="p-2.5 font-mono text-red-900">Cl. 5.2</td>
                        <td className="p-2.5 font-medium text-red-900">Hydrostatic Test</td>
                        <td className="p-2.5 text-red-900">1.5x Working Press.</td>
                        <td className="p-2.5 text-red-900">1.2x Specified</td>
                        <td className="p-2.5 text-[#bb0013] font-bold">FAIL</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono">Cl. 6.3</td>
                        <td className="p-2.5 font-medium">Pump Efficiency</td>
                        <td className="p-2.5">Class B (-2.5%)</td>
                        <td className="p-2.5">-2.0% within limit</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr className="bg-red-50/50">
                        <td className="p-2.5 font-mono text-red-900">Cl. 7.1</td>
                        <td className="p-2.5 font-medium text-red-900">ISI Mark Dimensions</td>
                        <td className="p-2.5 text-red-900">Mandatory CM/L text</td>
                        <td className="p-2.5 text-red-900">Plate artwork missing</td>
                        <td className="p-2.5 text-[#bb0013] font-bold">WARNING</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                <div>
                  <div className="h-10 w-28 border-b border-slate-300 flex items-end">
                    <span className="font-serif italic text-xs text-slate-500">R. Sharma</span>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                    Dr. Rajeshwari Sharma
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Joint Director & Senior Auditor (BIS)
                  </p>
                </div>

                <div className="text-right">
                  <div className="w-16 h-16 border border-slate-300 p-1 bg-slate-50 flex items-center justify-center font-mono text-[9px] text-slate-400">
                    [QR VERIFIED]
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1">
                    Authentic Manakonline Stamp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
