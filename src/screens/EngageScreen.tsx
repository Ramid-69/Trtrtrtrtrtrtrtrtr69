import React, { useState } from 'react';
import { MessageSquare, Users, Gift, Split, BellRing, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EngageScreenProps {
  onOpenSms?: () => void;
}

export const EngageScreen: React.FC<EngageScreenProps> = ({ onOpenSms }) => {
  const { smsMessages } = useApp();
  const [activeView, setActiveView] = useState<'welcome' | 'chats'>('welcome');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] select-none overflow-y-auto relative" id="engage-screen">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-base font-bold text-slate-800">telebirr Engage</h1>
        {onOpenSms && (
          <button
            type="button"
            onClick={onOpenSms}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0082c9]/10 text-[#0082c9] text-xs font-bold hover:bg-[#0082c9]/20 transition-colors cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>SMS (127)</span>
            {smsMessages.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0082c9] text-white text-[9px] flex items-center justify-center font-bold">
                {smsMessages.length}
              </span>
            )}
          </button>
        )}
      </header>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {activeView === 'welcome' ? (
        /* Welcome to telebirr Engage (Screenshot 13) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {/* Colorful chat bubbles illustration */}
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <div className="absolute -top-2 -left-2 w-20 h-20 rounded-full bg-[#0287d0]/20 flex items-center justify-center animate-pulse">
              <MessageSquare className="w-9 h-9 text-[#0287d0]" />
            </div>
            <div className="absolute top-4 right-0 w-24 h-24 rounded-full bg-[#8cc73f]/25 flex items-center justify-center">
              <Users className="w-12 h-12 text-[#7ab034]" />
            </div>
            <div className="absolute -bottom-2 left-6 w-16 h-16 rounded-full bg-[#fbbb47]/25 flex items-center justify-center">
              <Gift className="w-8 h-8 text-[#d69316]" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Welcome to telebirr Engage
          </h2>

          <p className="text-xs text-slate-600 max-w-[280px] leading-relaxed mb-6">
            Engage with your friends and family and experience the power of telebirr!!
          </p>

          <div className="w-full max-w-xs space-y-2.5">
            <button
              type="button"
              id="btn-start-engaging"
              onClick={() => setActiveView('chats')}
              className="w-full py-3.5 px-6 bg-[#8cc73f] hover:bg-[#7cb634] active:scale-98 text-white font-bold rounded-xl shadow-md text-sm transition-all cursor-pointer"
            >
              Start Engaging
            </button>

            {onOpenSms && (
              <button
                type="button"
                onClick={onOpenSms}
                className="w-full py-3 px-6 bg-white border border-[#0082c9]/30 text-[#0082c9] hover:bg-blue-50 active:scale-98 font-bold rounded-xl shadow-xs text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#0082c9]" />
                <span>Open SMS Messages (127)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Active Engage View */
        <div className="p-4 space-y-4 flex-1">
          {/* Direct 127 SMS card */}
          {onOpenSms && (
            <div
              onClick={onOpenSms}
              className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 shadow-2xs hover:border-[#0082c9] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0082c9] text-white flex items-center justify-center shadow-xs font-bold text-sm">
                  127
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Telebirr SMS Messages (127)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-500">Official verification codes & receipts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0082c9]" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => showToast('Chat opened with contacts')}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-[#8cc73f] transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8cc73f]/15 text-[#7ab034] flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Peer Chat</h4>
              <p className="text-[10px] text-slate-400">Send money in conversation</p>
            </button>

            <button
              type="button"
              onClick={() => showToast('Split Bill calculator opened')}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-[#8cc73f] transition-all text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0287d0]/15 text-[#0287d0] flex items-center justify-center mb-2">
                <Split className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Split Bill</h4>
              <p className="text-[10px] text-slate-400">Divide group dinner or fees</p>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700">Recent Chats</h3>
              <button
                type="button"
                onClick={() => setActiveView('welcome')}
                className="text-xs text-[#0287d0] font-semibold"
              >
                Back to intro
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Ethio Telecom Support 127 chat */}
              <div
                onClick={onOpenSms || (() => showToast('Ethio Telecom Support 127'))}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-1 cursor-pointer bg-blue-50/40 -mx-1 px-2 rounded-xl mb-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0082c9] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    127
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Ethio Telecom (127)</p>
                    <p className="text-[11px] text-[#0082c9] font-medium line-clamp-1">
                      {smsMessages.length > 0 ? smsMessages[smsMessages.length - 1].bodyEn.split('\n')[0] : 'Verification & transaction alerts'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">
                    {smsMessages.length > 0 ? smsMessages[smsMessages.length - 1].timestamp : '1:14 am'}
                  </span>
                  <span className="block w-4 h-4 rounded-full bg-[#0082c9] text-white text-[9px] font-bold text-center leading-4 ml-auto mt-0.5">
                    {smsMessages.length}
                  </span>
                </div>
              </div>

              {[
                { name: 'FOZIA MOSSA MOHAMMED', msg: 'Thank you for the transfer!', time: '18:14', unread: 0 },
                { name: 'Ahmed & Friends Group', msg: 'Abebe paid 400 ETB for lunch.', time: 'Sep 10', unread: 2 },
              ].map((c, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`Opening chat with ${c.name}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{c.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{c.msg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                    {c.unread > 0 && (
                      <span className="block w-4 h-4 rounded-full bg-[#8cc73f] text-white text-[9px] font-bold text-center leading-4 ml-auto mt-0.5">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
