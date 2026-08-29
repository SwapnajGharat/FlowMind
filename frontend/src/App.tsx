import React, { useState } from 'react';
import { ScreenView, ChecklistItem, ChatMessage, AuditDeviation, LabFacility } from './types';
import { 
  INITIAL_CHECKLIST, 
  LAB_FACILITIES, 
  INITIAL_CHAT_MESSAGES,
  CATEGORY_STANDARDS_MAP 
} from './data/mockData';

import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { LoginMinimalScreen } from './components/LoginMinimalScreen';
import { SignInCardScreen } from './components/SignInCardScreen';
import { ComplianceChecklist } from './components/ComplianceChecklist';
import { AssistantChat } from './components/AssistantChat';
import { LabFinder } from './components/LabFinder';
import { ProductAnalysis } from './components/ProductAnalysis';
import { ReportsScreen } from './components/ReportsScreen';
import { ClauseDetailModal } from './components/ClauseDetailModal';
import { ScheduleModal } from './components/ScheduleModal';

export default function App() {
  // Primary view state - defaults to checklist dashboard or can switch to any screen
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('checklist');

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Lab facilities state
  const [labs] = useState<LabFacility[]>(LAB_FACILITIES);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Modals state
  const [selectedDeviation, setSelectedDeviation] = useState<AuditDeviation | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [scheduleTestTitle, setScheduleTestTitle] = useState<string>('Thermal Stress Test');
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [supportModalOpen, setSupportModalOpen] = useState<boolean>(false);

  // Toggle checklist item status (Pending -> In Progress -> Complete -> Pending)
  const handleToggleItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let nextStatus: 'pending' | 'in_progress' | 'complete' = 'pending';
        if (item.status === 'pending') nextStatus = 'in_progress';
        else if (item.status === 'in_progress') nextStatus = 'complete';
        else nextStatus = 'pending';
        return { ...item, status: nextStatus };
      })
    );
  };

  // Chat message sending
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate context-aware AI auditor response
    setTimeout(() => {
      let replyText = '';
      let replyDeviations: AuditDeviation[] | undefined;
      let replyStandard: string | undefined;

      const lower = text.toLowerCase();

      if (lower.includes('cement') || lower.includes('1489')) {
        replyText = 'Auditing cement specification against IS 1489 (Part 1): 2015 (Portland Pozzolana Cement). Chemical and physical benchmarks verified:';
        replyStandard = 'IS 1489 (Part 1): 2015';
        replyDeviations = [
          {
            section: 'Cl. 7.1: Compressive Strength',
            title: '28-Day Strength Threshold',
            status: 'pass',
            description: 'Achieved 44.5 MPa vs minimum requirement of 33.0 MPa.',
            clauseRef: 'IS 1489 (Part 1) Table 2',
            clauseDetail: 'Compressive strength of standard mortar cubes shall not be less than 16 MPa at 3 days, 22 MPa at 7 days, and 33 MPa at 28 days.'
          },
          {
            section: 'Cl. 8.2: Pozzolana Content',
            title: 'Fly Ash Percentage Ratio',
            status: 'pass',
            description: 'Fly ash proportion declared at 28.5%, within statutory 15% to 35% range.',
            clauseRef: 'Clause 8.2 - Mineral Admixtures',
            clauseDetail: 'The addition of pozzolana shall not be less than 15 percent and not more than 35 percent by mass of Portland Pozzolana Cement.'
          },
          {
            section: 'Cl. 6.3: Insoluble Residue',
            title: 'Chemical Insoluble Residue Limit',
            status: 'warning',
            description: 'Sample showed 3.8% insoluble residue, approaching maximum ceiling of 4.0%.',
            clauseRef: 'Table 1 - Chemical Requirements',
            clauseDetail: 'Total insoluble residue by mass shall not exceed [X + (100 - X) / 100] percent where X is declared percentage of pozzolana.'
          }
        ];
      } else if (lower.includes('isi') || lower.includes('dimension') || lower.includes('mark')) {
        replyText = 'Under the BIS (Conformity Assessment) Regulations 2018, the Standard Mark consists of the BIS monogram accompanied by the relevant Indian Standard number (e.g. IS 5120) and unique License Number (CM/L-XXXXXXX). The height-to-width ratio of the gear wheel monogram must strictly conform to BIS Drawing No. HQ/MAR/101.';
        replyStandard = 'BIS Marking Guidelines';
      } else if (lower.includes('crs') || lower.includes('13252')) {
        replyText = 'Compulsory Registration Scheme (CRS) for electronics under IS 13252 (Part 1) requires testing at BIS-recognized NABL labs. Samples must undergo electric strength (3 kV AC), touch leakage (<3.5 mA), and flame retardancy tests. Once certified, affix the "Self Declaration - Conforming to IS 13252" tag with registration R-number.';
        replyStandard = 'IS 13252 (Part 1): 2010';
      } else {
        replyText = `Analysis logged for query: "${text}". Technical clauses cross-referenced against Bureau of Indian Standards standards repository. All manufacturing controls must comply with the approved Scheme of Testing and Inspection (STI).`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        standardRef: replyStandard,
        isAuditReport: Boolean(replyDeviations),
        deviations: replyDeviations,
        actions: replyDeviations
          ? [
              { label: 'Generate Report', action: 'generate_report', variant: 'secondary' },
              { label: 'Draft Action Plan', action: 'draft_action_plan', variant: 'primary' },
            ]
          : undefined,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // Draft Action Plan handler
  const handleDraftActionPlan = () => {
    const actionPlanMsg: ChatMessage = {
      id: `action-plan-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Corrective Action Plan Drafted for IS 5120:1977 Non-Conformities:\n\n1. Hydrostatic Test Rig Recalibration (Clause 5.2.1): Adjust test bench relief valves from 1.2x to 1.5x working pressure (24 bar minimum sustained for 15 minutes). Issue updated test certificate.\n\n2. Casting Drawing Revision (Clause 7.1): Update Drawing #PMP-REV-D to incorporate cast relief BIS monogram (30mm x 25mm) with licensee placeholder CM/L-XXXXXXX and rotational flow arrow.\n\n3. Schedule Re-audit: Submit amended QAP to BIS Northern Regional Office within 14 working days.',
    };
    setChatMessages((prev) => [...prev, actionPlanMsg]);
  };

  // Generate Report action
  const handleGenerateReport = () => {
    setCurrentScreen('reports');
  };

  // Schedule Lab handler
  const handleScheduleLab = (testTitle: string) => {
    setScheduleTestTitle(testTitle);
    setScheduleModalOpen(true);
  };

  // Review Findings handler from checklist
  const handleReviewFindings = (testTitle: string) => {
    setCurrentScreen('assistant');
  };

  // Audit in Assistant from Product Analysis
  const handleAuditInAssistant = (category: string, specText: string) => {
    setCurrentScreen('assistant');
    handleSendMessage(`Please audit the following specifications for category ${category}: ${specText}`);
  };

  // Is current screen a standalone login/signin view?
  const isAuthScreen = currentScreen === 'login_minimal' || currentScreen === 'signin_card';

  return (
    <div className="min-h-screen bg-[#F9F9FE] text-[#0F172A] font-body flex flex-col antialiased">
      {/* If not standalone auth screen, render TopNavBar and SideNavBar */}
      {!isAuthScreen && (
        <>
          <TopNavBar
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            searchQuery={globalSearch}
            onSearchChange={(q) => {
              setGlobalSearch(q);
              if (q && currentScreen !== 'lab_finder' && currentScreen !== 'product_analysis') {
                setCurrentScreen('lab_finder');
              }
            }}
          />

          <SideNavBar
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            onNewAnalysisClick={() => setCurrentScreen('product_analysis')}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenSupport={() => setSupportModalOpen(true)}
          />
        </>
      )}

      {/* Main View Router */}
      {currentScreen === 'login_minimal' && (
        <LoginMinimalScreen
          onLoginSuccess={() => setCurrentScreen('checklist')}
          onSwitchToCard={() => setCurrentScreen('signin_card')}
        />
      )}

      {currentScreen === 'signin_card' && (
        <SignInCardScreen
          onLoginSuccess={() => setCurrentScreen('checklist')}
          onSwitchToMinimal={() => setCurrentScreen('login_minimal')}
        />
      )}

      {currentScreen === 'checklist' && (
        <ComplianceChecklist
          items={checklistItems}
          onToggleItem={handleToggleItem}
          onNavigate={setCurrentScreen}
          onScheduleLab={handleScheduleLab}
          onReviewFindings={handleReviewFindings}
        />
      )}

      {currentScreen === 'assistant' && (
        <AssistantChat
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onViewClause={(dev) => setSelectedDeviation(dev)}
          onGenerateReport={handleGenerateReport}
          onDraftActionPlan={handleDraftActionPlan}
        />
      )}

      {currentScreen === 'lab_finder' && (
        <LabFinder
          labs={labs}
          initialSearch={globalSearch}
          onScheduleLab={handleScheduleLab}
        />
      )}

      {currentScreen === 'product_analysis' && (
        <ProductAnalysis
          onNavigate={setCurrentScreen}
          onAuditInAssistant={handleAuditInAssistant}
        />
      )}

      {currentScreen === 'reports' && <ReportsScreen />}

      {/* Clause Detail Modal */}
      {selectedDeviation && (
        <ClauseDetailModal
          deviation={selectedDeviation}
          onClose={() => setSelectedDeviation(null)}
          onAskAuditor={(query) => {
            setSelectedDeviation(null);
            handleSendMessage(query);
          }}
        />
      )}

      {/* Lab Slot Scheduling Modal */}
      {scheduleModalOpen && (
        <ScheduleModal
          testTitle={scheduleTestTitle}
          labs={labs}
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          onConfirm={(booking) => {
            // Update the corresponding checklist item status to 'in_progress'
            setChecklistItems((prev) =>
              prev.map((item) =>
                item.title.toLowerCase().includes('thermal') ||
                item.title.toLowerCase().includes('electrical')
                  ? { ...item, status: 'in_progress' }
                  : item
              )
            );
          }}
        />
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#001e40] mb-4">Portal Settings</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Standards Auto-Update Feed</span>
                <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active (Daily)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Assigned BIS Regional Office</span>
                <span className="font-mono text-slate-900">Northern Region (NRO)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Audit License ID</span>
                <span className="font-mono text-slate-900">CM/L-8941203</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="bg-[#001e40] text-white px-4 py-2 rounded text-xs font-mono uppercase hover:bg-[#003366]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#001e40] mb-2">BIS Help & Support Desk</h3>
            <p className="text-xs text-slate-600 mb-4">
              Direct technical assistance for manufacturers, certifying laboratories, and compliance auditors.
            </p>
            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded border border-slate-200 font-mono">
              <p>• Toll-Free Helpline: <strong>1800 11 4420</strong></p>
              <p>• Manakonline Desk: <strong>cmd3@bis.gov.in</strong></p>
              <p>• HQ Address: <strong>9 Bahadur Shah Zafar Marg, New Delhi 110002</strong></p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSupportModalOpen(false)}
                className="bg-[#001e40] text-white px-4 py-2 rounded text-xs font-mono uppercase hover:bg-[#003366]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
