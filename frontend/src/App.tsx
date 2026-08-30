import React, { useEffect, useState } from 'react';
import { ScreenView, ChecklistItem, ChatMessage, AuditDeviation, LabFacility } from './types';
import { 
  INITIAL_CHECKLIST, 
  LAB_FACILITIES,
} from './data/mockData';
import { api } from './api';

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
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  // Primary view state - defaults to checklist dashboard or can switch to any screen
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('checklist');

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Lab facilities state
  const [labs, setLabs] = useState<LabFacility[]>(LAB_FACILITIES);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Modals state
  const [selectedDeviation, setSelectedDeviation] = useState<AuditDeviation | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [scheduleTestTitle, setScheduleTestTitle] = useState<string>('Thermal Stress Test');
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [supportModalOpen, setSupportModalOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analysisKey, setAnalysisKey] = useState(0);

  const startFreshWorkspace = (screen: ScreenView = 'checklist') => {
    setSessionId(crypto.randomUUID());
    setChatMessages([]);
    setChecklistItems(INITIAL_CHECKLIST);
    setLabs(LAB_FACILITIES);
    setGlobalSearch('');
    setAnalysisKey((key) => key + 1);
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const category = globalSearch.trim();
    if (!category) return;
    api.findRagLabs(sessionId, category).then(({ labs: ragLabs }) => {
      setLabs(ragLabs.map((lab, index) => ({
        id: lab['Lab ID'] || `rag-lab-${index}`,
        name: lab['Facility Name'] || 'Recognized Testing Facility',
        distance: 'Contact facility', distanceNum: index + 1,
        address: lab.Location || 'Regional Standard Laboratory', pinCode: 'N/A',
        disciplines: [category], status: 'Active Accreditation',
        coordinates: { x: 25 + ((index * 23) % 55), y: 30 + ((index * 17) % 45) },
        phone: 'Contact facility', email: 'Not listed', incharge: 'Not listed', leadTimeDays: 7,
      })));
    }).catch((error) => console.error('Unable to search RAG labs:', error));
  }, [globalSearch, sessionId]);

  // Toggle checklist item status (Pending -> In Progress -> Complete -> Pending)
  const handleToggleItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let nextStatus: 'pending' | 'in_progress' | 'complete' = 'pending';
        if (item.status === 'pending') nextStatus = 'in_progress';
        else if (item.status === 'in_progress') nextStatus = 'complete';
        else nextStatus = 'pending';
        api.updateChecklist(sessionId, id, nextStatus).catch((error) => console.error('Unable to save checklist change:', error));
        return { ...item, status: nextStatus };
      })
    );
  };

  // Chat message sending
  const handleSendMessage = async (text: string) => {
    try {
      const { user, reply } = await api.sendChat(sessionId, text);
      setChatMessages((prev) => [...prev, user, reply]);
    } catch (error) {
      console.error('Unable to save chat message:', error);
    }
  };

  const handleVoiceUpload = async (audio: File) => {
    try {
      const { user, reply } = await api.sendVoice(sessionId, audio);
      setChatMessages((prev) => [...prev, user, reply]);
    } catch (error) {
      console.error('Unable to process voice query:', error);
    }
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
    api.recordActivity(sessionId, 'action_plan_drafted', { message: actionPlanMsg.text }).catch(console.error);
  };

  // Generate Report action
  const handleGenerateReport = () => {
    api.recordActivity(sessionId, 'report_viewed', {}).catch(console.error);
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
  const handleAuditInAssistant = async (category: string, specText: string) => {
    setCurrentScreen('assistant');
    const query = `Create a compliance checklist for ${category}: ${specText}`;
    try {
      const { data } = await api.runAudit(sessionId, query);
      setChatMessages((prev) => [...prev, {
        id: `audit-${Date.now()}`, sender: 'assistant', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: JSON.stringify(data, null, 2),
      }]);
    } catch (error) {
      console.error('Unable to generate RAG audit:', error);
    }
  };

  // Is current screen a standalone login/signin view?
  const isAuthScreen = currentScreen === 'login_minimal' || currentScreen === 'signin_card';

  return (
    <div className="min-h-screen bg-[#F9F9FE] text-[#0F172A] font-body flex flex-col antialiased" style={{ '--sidebar-width': sidebarCollapsed ? '4rem' : '16rem' } as React.CSSProperties}>
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
            onNewAnalysisClick={() => {
              setAnalysisKey((key) => key + 1);
              setCurrentScreen('product_analysis');
            }}
            onNewChatClick={() => startFreshWorkspace('assistant')}
            onResetWorkspace={() => startFreshWorkspace('checklist')}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenSupport={() => setSupportModalOpen(true)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
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
          onVoiceUpload={handleVoiceUpload}
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
          key={analysisKey}
          onNavigate={setCurrentScreen}
          onAuditInAssistant={handleAuditInAssistant}
          onAnalysisComplete={(analysis) => api.saveProductAnalysis(sessionId, analysis).catch(console.error)}
          onRagLookup={(query) => api.productLookup(sessionId, query).then(({ details }) => details)}
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
          onConfirm={async (booking) => {
            try { await api.createBooking(sessionId, booking); } catch (error) { console.error('Unable to save booking:', error); }
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
