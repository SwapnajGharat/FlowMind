import React, { useState } from 'react';
import { LabFacility } from '../types';
import { X, Calendar, Clock, FlaskConical, CheckCircle2 } from 'lucide-react';

interface ScheduleModalProps {
  testTitle: string;
  labs: LabFacility[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: { testTitle: string; labId: string; date: string; time: string }) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  testTitle,
  labs,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedLabId, setSelectedLabId] = useState(labs[0]?.id || '');
  const [testDate, setTestDate] = useState('2024-11-15');
  const [testTime, setTestTime] = useState('10:00 AM');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm({ testTitle, labId: selectedLabId, date: testDate, time: testTime });
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const selectedLab = labs.find((l) => l.id === selectedLabId) || labs[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#001e40]">Testing Slot Requested</h3>
            <p className="text-sm text-slate-600 mt-2">
              Appointment token sent to <strong>{selectedLab?.name}</strong>.
            </p>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Token ID: BIS-LAB-{Math.floor(100000 + Math.random() * 900000)}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-[#001e40]" />
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                Accredited Lab Test Dispatch
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#001e40] border-b border-slate-100 pb-3 mb-4">
              Schedule {testTitle}
            </h3>

            <form onSubmit={handleBooking} className="space-y-4 text-sm">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                  Select BIS Recognized Laboratory
                </label>
                <select
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                  className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#003366]"
                >
                  {labs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.distance}) - {l.disciplines.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                    Preferred Sample Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2 text-xs text-[#0F172A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                    Time Window
                  </label>
                  <select
                    value={testTime}
                    onChange={(e) => setTestTime(e.target.value)}
                    className="w-full bg-[#F7F9FB] border border-[#E2E8F0] rounded p-2 text-xs text-[#0F172A] outline-none"
                  >
                    <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
                <p>• <strong>Location:</strong> {selectedLab?.address}</p>
                <p>• <strong>Contact:</strong> {selectedLab?.phone}</p>
                <p>• <strong>Lead Time:</strong> ~{selectedLab?.leadTimeDays} business days upon sample submission</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded text-xs font-mono uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#bb0013] hover:bg-[#93000d] text-white px-4 py-2 rounded text-xs font-mono uppercase font-semibold transition-colors"
                >
                  Confirm Lab Slot
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
