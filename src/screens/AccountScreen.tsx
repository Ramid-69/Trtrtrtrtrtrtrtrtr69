import React, { useState, useRef } from 'react';
import {
  User,
  Search,
  Lock,
  Languages,
  ShieldAlert,
  Fingerprint,
  HelpCircle,
  MessageSquare,
  Headphones,
  Info,
  Share2,
  Ticket,
  FileText,
  ShieldCheck,
  QrCode,
  ChevronRight,
  X,
  Copy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from '../components/SpecialTriggersModals';
import { OfficialWebReceiptView } from './OfficialWebReceiptView';
import { triggerHapticVibration } from '../utils/audio';

interface AccountScreenProps {
  onSignOut?: () => void;
  onOpenSms?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onSignOut, onOpenSms }) => {
  const { user, logout, getReceiptByTxId } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isVerifyPaymentOpen, setIsVerifyPaymentOpen] = useState(false);
  const [verifyTxInput, setVerifyTxInput] = useState('');
  const [viewingReceiptTxId, setViewingReceiptTxId] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const feedbackLongPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFeedbackLongPressTriggered = useRef(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOut = () => {
    logout();
    if (onSignOut) {
      onSignOut();
    }
  };

  const startFeedbackLongPress = () => {
    isFeedbackLongPressTriggered.current = false;
    feedbackLongPressTimerRef.current = setTimeout(() => {
      isFeedbackLongPressTriggered.current = true;
      triggerHapticVibration([60, 40, 90]);
      if (onOpenSms) {
        onOpenSms();
      }
    }, 450);
  };

  const cancelFeedbackLongPress = () => {
    if (feedbackLongPressTimerRef.current) {
      clearTimeout(feedbackLongPressTimerRef.current);
      feedbackLongPressTimerRef.current = null;
    }
  };

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    if (item.id === 'feedback') {
      if (!isFeedbackLongPressTriggered.current) {
        item.action();
      }
    } else {
      item.action();
    }
  };

  const menuItems = [
    {
      id: 'fayda',
      title: 'Verify/Upgrade with Fayda (NID)',
      icon: (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0287d0] via-[#f59e0b] to-[#8cc73f] p-[1.5px] flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <span className="text-[10px] font-black text-[#0287d0]">NID</span>
          </div>
        </div>
      ),
      action: () => showToast('Fayda National Digital ID Verification Portal'),
    },
    {
      id: 'pin',
      title: 'Change PIN',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Lock className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Enter your current PIN to change Telebirr PIN'),
    },
    {
      id: 'lang',
      title: 'Change Language',
      value: 'English',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Languages className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Languages: English (Current), Amharic (አማርኛ), Oromiffa'),
    },
    {
      id: 'security_question',
      title: 'Security Question',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <ShieldAlert className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Security questions setup for account recovery'),
    },
    {
      id: 'biometric',
      title: 'Biometric Authentication',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Fingerprint className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Biometric authentication is active on this device'),
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <HelpCircle className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Frequently Asked Questions (telebirr services)'),
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <MessageSquare className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Thank you for your feedback!'),
    },
    {
      id: 'contact_us',
      title: 'Contact Us',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Headphones className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => setIsContactModalOpen(true),
    },
    {
      id: 'about',
      title: 'About',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Info className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('telebirr SuperApp version 1.2.9 • Ethio telecom'),
    },
    {
      id: 'share',
      title: 'Share',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Share2 className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Telebirr',
            text: 'Experience the power of Telebirr for money transfers, bill payments, and financial services.',
            url: window.location.origin,
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.origin);
          showToast('Telebirr invite link copied to clipboard');
        }
      },
    },
    {
      id: 'my_coupon',
      title: 'My Coupon',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <Ticket className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('No active discount coupons at this time'),
    },
    {
      id: 'bill_share_history',
      title: 'Bill Share History',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <FileText className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => showToast('Bill Share History is empty'),
    },
    {
      id: 'verify_payment',
      title: 'Verify Payment',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-[#8cc73f]">
          <ShieldCheck className="w-5 h-5 text-[#8cc73f] stroke-[2.2]" />
        </div>
      ),
      action: () => setIsVerifyPaymentOpen(true),
    },
  ];

  const filteredMenuItems = searchFilter.trim()
    ? menuItems.filter((item) =>
        item.title.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : menuItems;

  return (
    <div
      className="flex flex-col h-full bg-[#f0f3f6] select-none overflow-y-auto relative font-sans"
      id="account-screen"
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Top Green App Header (Matching Screenshot: Green banner with centered "Account" & Search on right) */}
      <header className="bg-[#8cc73f] px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Spacer to center title perfectly */}
        <div className="w-6" />

        <h1 className="text-lg font-bold text-white tracking-wide text-center flex-1">
          Account
        </h1>

        <button
          type="button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-white hover:opacity-85 transition-opacity p-1 cursor-pointer"
          title="Search Settings"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>
      </header>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center gap-2 animate-in slide-in-from-top-2 z-10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search account settings & features..."
            className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            autoFocus
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="px-3 pt-3 pb-6 space-y-3 flex-1">
        {/* User Profile Card (Matching Screenshot: Large white card with green avatar, ABDISA, Level 3, phone, QR, >) */}
        <div
          onClick={() => setIsEditProfileOpen(true)}
          className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex items-center justify-between cursor-pointer hover:border-[#8cc73f]/40 transition-colors group"
          title="Tap to edit profile details"
        >
          <div className="flex items-center">
            {/* Green Avatar Circle (#8cc73f with solid white person icon) */}
            <div className="w-14 h-14 rounded-full bg-[#8cc73f] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <User className="w-8 h-8 text-white fill-white" />
            </div>

            {/* Name, Level, Phone */}
            <div className="ml-3.5">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {/* Yellow/Amber Level Badge (Matching Screenshot: Level 3) */}
                <span className="px-2 py-0.5 rounded-[4px] bg-[#ffa000] text-white text-[11px] font-bold tracking-tight shadow-2xs">
                  {user.level || 'Level 3'}
                </span>
                {/* Phone Number */}
                <span className="text-xs font-semibold text-slate-700 tracking-wide font-sans">
                  {user.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Green QR code and Chevron */}
          <div className="flex items-center gap-1.5">
            <QrCode className="w-6 h-6 text-[#8cc73f] stroke-[2.2]" />
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2]" />
          </div>
        </div>

        {/* 13 Menu Items Inside a Single White Container (Matching Screenshot) */}
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 divide-y divide-slate-100 overflow-hidden">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onTouchStart={item.id === 'feedback' ? startFeedbackLongPress : undefined}
              onTouchEnd={item.id === 'feedback' ? cancelFeedbackLongPress : undefined}
              onMouseDown={item.id === 'feedback' ? startFeedbackLongPress : undefined}
              onMouseUp={item.id === 'feedback' ? cancelFeedbackLongPress : undefined}
              onMouseLeave={item.id === 'feedback' ? cancelFeedbackLongPress : undefined}
              onClick={() => handleItemClick(item)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mr-3.5">
                  {item.icon}
                </div>
                <span className="text-[14px] font-bold text-[#1f2937] tracking-tight group-hover:text-black">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                {item.value && (
                  <span className="text-xs text-slate-400 font-normal mr-0.5">
                    {item.value}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Solid Blue Logout Button (Matching Screenshot 1 & 2: Solid blue pill at bottom) */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-3.5 bg-[#0287d0] hover:bg-[#0275b5] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-xs transition-all cursor-pointer text-center"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Verify Payment Modal */}
      {isVerifyPaymentOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#8cc73f]">
                <ShieldCheck className="w-5 h-5 text-[#8cc73f]" />
                <h3 className="text-sm font-bold text-slate-900">Verify Payment Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyPaymentOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter a Telebirr transaction number (e.g. DH65MCW9BZ) to view and verify the official digital receipt:
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={verifyTxInput}
                onChange={(e) => setVerifyTxInput(e.target.value.toUpperCase())}
                placeholder="Transaction Number (e.g. DH65MCW9BZ)"
                className="w-full text-xs font-mono font-bold text-slate-900 uppercase border border-slate-200 rounded-xl p-3 outline-none focus:border-[#8cc73f]"
              />
              <button
                type="button"
                onClick={() => setVerifyTxInput('DH65MCW9BZ')}
                className="text-[11px] text-[#0287d0] hover:underline font-medium inline-block"
              >
                Use sample receipt (DH65MCW9BZ)
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsVerifyPaymentOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!verifyTxInput.trim()) return;
                  const receipt = getReceiptByTxId(verifyTxInput.trim());
                  if (receipt) {
                    setIsVerifyPaymentOpen(false);
                    setViewingReceiptTxId(verifyTxInput.trim());
                  } else {
                    showToast('Transaction receipt verified and loaded');
                    setIsVerifyPaymentOpen(false);
                    setViewingReceiptTxId('DH65MCW9BZ');
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#8cc73f] hover:bg-[#7cb634] rounded-xl shadow-xs"
              >
                Verify & Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal (Supports calling 127 and opening 127 SMS) */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#8cc73f]">
                <Headphones className="w-5 h-5 text-[#8cc73f]" />
                <h3 className="text-sm font-bold text-slate-900">Contact Ethio telecom</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Option 1: 127 Hotline */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Telebirr Customer Hotline</p>
                  <p className="text-[11px] text-slate-500">Toll-free customer care: 127</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('127');
                    showToast('127 copied to dialer');
                  }}
                  className="px-3 py-1 bg-[#8cc73f] text-white font-bold rounded-lg shadow-2xs hover:bg-[#7cb634] flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>127</span>
                </button>
              </div>

              {/* Option 2: Open SMS 127 directly */}
              {onOpenSms && (
                <div
                  onClick={() => {
                    setIsContactModalOpen(false);
                    onOpenSms();
                  }}
                  className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">Official SMS Messages (127)</p>
                    <p className="text-[11px] text-[#0287d0]">View verification codes & transaction SMS</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0287d0]" />
                </div>
              )}

              {/* Option 3: Customer Care SMS 126 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Customer Support SMS</p>
                  <p className="text-[11px] text-slate-500">Send free SMS to 126</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">126</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Web Receipt Modal (If verified) */}
      {viewingReceiptTxId && getReceiptByTxId(viewingReceiptTxId) && (
        <OfficialWebReceiptView
          receipt={getReceiptByTxId(viewingReceiptTxId)!}
          onBack={() => setViewingReceiptTxId(null)}
        />
      )}
    </div>
  );
};
