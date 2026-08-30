import React from 'react';
import { ScreenView } from '../types';
import { 
  Bot, 
  FileText, 
  FlaskConical, 
  Award, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Plus,
  MessageSquarePlus,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SideNavBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onNewAnalysisClick: () => void;
  onNewChatClick: () => void;
  onResetWorkspace: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentScreen,
  onNavigate,
  onNewAnalysisClick,
  onNewChatClick,
  onResetWorkspace,
  onOpenSettings,
  onOpenSupport,
  isCollapsed,
  onToggleCollapsed,
}) => {
  const navItems = [
    {
      id: 'assistant' as ScreenView,
      label: 'Assistant',
      icon: Bot,
      active: currentScreen === 'assistant',
    },
    {
      id: 'checklist' as ScreenView,
      label: 'Standards',
      icon: FileText,
      active: currentScreen === 'checklist',
    },
    {
      id: 'lab_finder' as ScreenView,
      label: 'Lab Finder',
      icon: FlaskConical,
      active: currentScreen === 'lab_finder',
    },
    {
      id: 'product_analysis' as ScreenView,
      label: 'Certification Guide',
      icon: Award,
      active: currentScreen === 'product_analysis',
    },
    {
      id: 'reports' as ScreenView,
      label: 'Reports',
      icon: BarChart3,
      active: currentScreen === 'reports',
    },
  ];

  return (
    <aside className={`bg-[#F7F9FB] border-r border-[#E2E8F0] fixed left-0 top-16 h-[calc(100vh-64px)] ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col z-40 text-[#001e40] select-none transition-all duration-200`}>
      {/* Portal Header */}
      <div className={`${isCollapsed ? 'p-2' : 'p-6'} border-b border-[#E2E8F0]`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 mb-4'}`}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY0euhpPuqSL4YXg5pNrrwI-wgxiWrANXZd7Cix9rsvevmXzPKJCnIEP1ZOugAQbRmnOSd4zCD5F5giXvY9aTctlNHthaL0UI84PO_EUo0dGbMDjVT6S_LsinuKVKQ7pPW0_1qcJygtc3vOFjGyvi_SMIOCWk-9qqB_iQzExAP1I4kFijCYKv2oOZzHEt0WdIAFjrGR25LxRBiGIyjAkqQEc65xqVE7SEEg1FnTdvsuVET6znppf9KMw"
            alt="BIS Official Seal"
            className="w-12 h-12 object-contain"
          />
          {!isCollapsed && <div>
            <h2 className="text-xl font-black text-[#001e40] tracking-tight leading-tight">
              BIS Portal
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#475569]">
              Government of India
            </p>
          </div>}
        </div>

        <div className={`${isCollapsed ? 'mt-2 flex flex-col gap-2' : 'space-y-2'}`}>
        <button
          onClick={onNewChatClick}
          title="New chat"
          className={`bg-[#001e40] hover:bg-[#003366] text-white font-mono text-[13px] font-semibold py-2.5 ${isCollapsed ? 'w-full px-0' : 'w-full px-4'} rounded uppercase tracking-wider transition-all flex items-center justify-center gap-2`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
        <button
          onClick={onNewAnalysisClick}
          title="Start a new product analysis"
          className={`bg-[#bb0013] hover:bg-[#93000d] text-white font-mono text-[13px] font-semibold py-2.5 ${isCollapsed ? 'w-full px-0' : 'w-full px-4'} rounded uppercase tracking-wider transition-all shadow-[0_2px_6px_rgba(187,0,19,0.15)] flex items-center justify-center gap-2 active:scale-[0.98]`}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Analysis</span>}
        </button>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-4 px-6'} py-3.5 text-left font-mono text-[13px] uppercase tracking-wider transition-colors duration-150 ${
                  isActive
                    ? 'text-[#001e40] font-bold border-r-4 border-[#bb0013] bg-[#f4f3f8]'
                    : 'text-[#475569] font-medium hover:bg-[#eeedf2] hover:text-[#001e40]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#001e40] stroke-[2.2]' : 'text-[#475569]'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings / Support */}
      <div className="border-t border-[#E2E8F0] p-3">
        <nav className="flex flex-col gap-1">
          <button onClick={onToggleCollapsed} title={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'} className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-2 text-left text-[#475569] font-mono text-[11px] uppercase tracking-wider font-medium hover:bg-[#eeedf2] hover:text-[#001e40] rounded transition-colors duration-150`}>
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!isCollapsed && <span>Minimize</span>}
          </button>
          <button onClick={onResetWorkspace} title="Start a fresh workspace" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-2 text-left text-[#475569] font-mono text-[11px] uppercase tracking-wider font-medium hover:bg-[#eeedf2] hover:text-[#001e40] rounded transition-colors duration-150`}>
            <RefreshCw className="w-4 h-4" />
            {!isCollapsed && <span>Reset Workspace</span>}
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-2 text-left text-[#475569] font-mono text-[11px] uppercase tracking-wider font-medium hover:bg-[#eeedf2] hover:text-[#001e40] rounded transition-colors duration-150`}
          >
            <Settings className="w-4 h-4 text-[#475569]" />
            {!isCollapsed && <span>Settings</span>}
          </button>
          <button
            onClick={onOpenSupport}
            title="Support"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-2 text-left text-[#475569] font-mono text-[11px] uppercase tracking-wider font-medium hover:bg-[#eeedf2] hover:text-[#001e40] rounded transition-colors duration-150`}
          >
            <HelpCircle className="w-4 h-4 text-[#475569]" />
            {!isCollapsed && <span>Support</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
};
