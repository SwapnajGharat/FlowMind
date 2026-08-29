import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AuditDeviation } from '../types';
import { 
  Bot, 
  Send, 
  Paperclip, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Info,
  Sparkles,
  Download
} from 'lucide-react';

interface AssistantChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onViewClause: (deviation: AuditDeviation) => void;
  onGenerateReport: () => void;
  onDraftActionPlan: () => void;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({
  messages,
  onSendMessage,
  onViewClause,
  onGenerateReport,
  onDraftActionPlan,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const samplePrompts = [
    'Audit cement batch against IS 1489 (Part 1)',
    'Explain ISI Mark mandatory dimensions',
    'How do I file for CRS under IS 13252?',
  ];

  return (
    <main className="flex-1 ml-0 md:ml-64 flex flex-col h-[calc(100vh-64px)] mt-16 bg-[#F9F9FE] relative overflow-hidden">
      {/* Chat History Canvas */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-4xl mx-auto w-full pb-44">
        {/* Session Timestamp Pill */}
        <div className="flex justify-center mb-8">
          <span className="bg-[#f4f3f8] text-[#475569] px-4 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border border-[#E2E8F0] shadow-2xs">
            SESSION STARTED: OCT 24, 2024 - 10:42 AM
          </span>
        </div>

        {/* Message Stream */}
        <div className="space-y-6">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex gap-4 justify-end">
                  <div className="bg-[#001e40] text-white rounded-2xl rounded-tr-xs p-4 max-w-[85%] md:max-w-[75%] shadow-xs">
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            }

            // Assistant Audit Report or Response
            return (
              <div key={msg.id} className="flex gap-3.5 items-start">
                {/* Bot Icon */}
                <div className="w-8 h-8 rounded bg-[#003366] flex-shrink-0 flex items-center justify-center mt-1 text-white shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>

                {/* Content Box */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-xs p-5 md:p-6 max-w-[92%] md:max-w-[85%] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  {/* Header if Audit Report */}
                  {msg.isAuditReport && (
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E2E8F0] pb-3.5">
                      <FileText className="w-5 h-5 text-[#bb0013]" />
                      <h3 className="text-xl font-bold text-[#001e40]">
                        Compliance Audit Report
                      </h3>
                      {msg.standardRef && (
                        <span className="ml-auto bg-[#e2e2e7] text-[#475569] px-2.5 py-0.5 rounded text-[11px] font-mono font-medium">
                          Ref: {msg.standardRef}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Prose */}
                  {msg.text && (
                    <p className="text-[15px] text-[#0F172A] mb-6 leading-relaxed">
                      {msg.text.includes('2 Critical Deviations') ? (
                        <>
                          I have reviewed the provided technical specifications for the industrial pump series. The analysis indicates{' '}
                          <strong className="text-[#bb0013] font-semibold">2 Critical Deviations</strong> that require immediate attention prior to certification submission.
                        </>
                      ) : (
                        msg.text
                      )}
                    </p>
                  )}

                  {/* Bento Grid Deviations */}
                  {msg.deviations && msg.deviations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {msg.deviations.map((dev, idx) => {
                        const isPass = dev.status === 'pass';
                        const isFail = dev.status === 'fail';
                        const isWarning = dev.status === 'warning';

                        return (
                          <div
                            key={idx}
                            className={`rounded-lg p-4 border relative overflow-hidden transition-all ${
                              isPass
                                ? 'bg-[#F7F9FB] border-[#E2E8F0]'
                                : 'bg-[#ffdad6]/20 border-[#ba1a1a]/30'
                            }`}
                          >
                            {/* Color Accent Bar */}
                            <div
                              className={`absolute top-0 left-0 w-1 h-full ${
                                isPass ? 'bg-[#10B981]' : 'bg-[#bb0013]'
                              }`}
                            />

                            <div className="flex items-start justify-between mb-2 pl-1">
                              <span
                                className={`font-mono text-[11px] uppercase tracking-wider font-semibold ${
                                  isPass ? 'text-[#475569]' : 'text-[#bb0013]'
                                }`}
                              >
                                {dev.section}
                              </span>
                              {isPass ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                              ) : isWarning ? (
                                <AlertTriangle className="w-4 h-4 text-[#bb0013]" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-[#bb0013]" />
                              )}
                            </div>

                            <p className="text-sm text-[#0F172A] font-medium pl-1 leading-snug">
                              {dev.description}
                            </p>

                            {/* View Clause Link */}
                            {dev.clauseRef && (
                              <button
                                onClick={() => onViewClause(dev)}
                                className={`mt-3 text-xs font-medium hover:underline flex items-center gap-1 pl-1 ${
                                  isPass ? 'text-[#001e40]' : 'text-[#bb0013]'
                                }`}
                              >
                                <span>View specific clause</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Prompt Callout */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="bg-[#f4f3f8] rounded-lg p-4 border border-[#E2E8F0] flex items-start gap-3">
                      <Info className="w-4 h-4 text-[#475569] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-[#0F172A]">
                          Would you like me to generate a formal deviation report or help draft the corrective action plan?
                        </p>
                        <div className="flex flex-wrap gap-2.5 mt-3">
                          <button
                            onClick={onGenerateReport}
                            className="bg-[#e2e2e7] hover:bg-[#d8dadc] text-[#0F172A] px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-colors border border-[#E2E8F0] flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Generate Report</span>
                          </button>
                          <button
                            onClick={onDraftActionPlan}
                            className="bg-[#003366] hover:bg-[#001e40] text-white px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                            <span>Draft Action Plan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom Floating Input Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#F9F9FE] via-[#F9F9FE] to-transparent pt-6 pb-4 px-4 md:px-8 z-20">
        <div className="max-w-4xl mx-auto relative">
          {/* Quick Prompts Suggestions */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1 scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(p)}
                className="whitespace-nowrap bg-white/80 hover:bg-white text-[#475569] hover:text-[#001e40] text-[11px] font-mono px-3 py-1 rounded-full border border-[#E2E8F0] transition-colors shadow-2xs"
              >
                + {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] focus-within:border-[#003366] focus-within:shadow-[0_4px_20px_rgba(0,51,102,0.1)] transition-all overflow-hidden flex flex-col"
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask the compliance auditor..."
              rows={1}
              className="w-full bg-transparent border-none text-[#0F172A] placeholder-[#475569]/70 px-4 py-3.5 resize-none focus:ring-0 text-[15px] outline-none min-h-[56px] max-h-32"
            />

            <div className="flex justify-between items-center px-4 py-2 border-t border-[#E2E8F0]/50 bg-[#F7F9FB]/60">
              <div className="flex gap-1 text-[#475569]">
                <button
                  type="button"
                  onClick={() => alert('Document attachment: select technical spec PDF or DWG drawing.')}
                  className="p-1.5 rounded-md hover:bg-[#eeedf2] transition-colors"
                  title="Attach Document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Referencing Indian Standard: Selected IS 5120:1977.')}
                  className="p-1.5 rounded-md hover:bg-[#eeedf2] transition-colors"
                  title="Reference Standard"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                className="bg-[#ED1C24] hover:bg-[#bb0013] text-white w-8 h-8 rounded flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Send Audit Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-center mt-2">
            <span className="text-[10px] text-[#475569] font-mono uppercase tracking-wider">
              AI responses may require human verification against official BIS standards.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
