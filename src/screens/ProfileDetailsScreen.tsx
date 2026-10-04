import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Edit3,
  QrCode,
  Phone,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  MessageSquare,
  Lock,
  ChevronRight,
  Share2,
  Download,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileDetailsScreenProps {
  onBack: () => void;
  onOpenSms: () => void;
}

export const ProfileDetailsScreen: React.FC<ProfileDetailsScreenProps> = ({
  onBack,
  onOpenSms,
}) => {
  const { user, updateUser, balance, smsMessages } = useApp();

  const [toast, setToast] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phoneNumber);
  const [editFayda, setEditFayda] = useState(user.faydaNumber || 'FAN-4829-1039-5820');
  const [editRegion, setEditRegion] = useState(user.region || 'Addis Ababa (አዲስ አበባ)');
  const [editSubcity, setEditSubcity] = useState(user.subcity || 'Bole Subcity, Woreda 03');
  const [editLevel, setEditLevel] = useState(user.level || 'Level 3');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && editPhone.trim()) {
      updateUser(editName, editPhone, {
        faydaNumber: editFayda,
        region: editRegion,
        subcity: editSubcity,
        level: editLevel,
      });
      showToast('Profile information updated successfully!');
      setIsEditModalOpen(false);
    }
  };

  const latestSms = smsMessages[smsMessages.length - 1];

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col h-full bg-[#f4f7fa] select-none overflow-y-auto animate-in fade-in"
      id="full-profile-screen"
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#8cc73f]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="bg-[#8cc73f] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Back to Others"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold tracking-wide leading-tight">Profile Details</h1>
            <p className="text-[10px] text-white/80 font-medium">የግል መረጃ እና የሒሳብ ዝርዝር</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="My QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phoneNumber);
              setEditFayda(user.faydaNumber || 'FAN-4829-1039-5820');
              setEditRegion(user.region || 'Addis Ababa (አዲስ አበባ)');
              setEditSubcity(user.subcity || 'Bole Subcity, Woreda 03');
              setEditLevel(user.level || 'Level 3');
              setIsEditModalOpen(true);
            }}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Edit Profile"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Profile Banner */}
      <div className="bg-[#8cc73f] text-white px-5 pt-2 pb-8 relative overflow-hidden">
        {/* Subtle background curved shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
            <circle cx="360" cy="40" r="110" stroke="white" strokeWidth="2" />
            <circle cx="360" cy="40" r="160" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with Verified Ring */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-white/25 border-3 border-white/60 flex items-center justify-center text-white shadow-lg backdrop-blur-xs">
              <User className="w-11 h-11 text-white" />
            </div>
            <div
              onClick={() => setIsQrModalOpen(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0287d0] border-2 border-white flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform"
              title="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Full Name */}
          <h2 className="text-lg font-black text-white tracking-wide flex items-center justify-center gap-1.5 drop-shadow-xs">
            <span>{user.name}</span>
            <ShieldCheck className="w-5 h-5 text-emerald-100 fill-white/30" />
          </h2>

          {/* Account Number & Copy */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-mono font-bold text-white/95 bg-black/20 px-2.5 py-0.5 rounded-full tracking-wider border border-white/20">
              {user.phoneNumber}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(user.phoneNumber, 'Phone number')}
              className="p-1 hover:bg-white/20 rounded text-white/90 cursor-pointer"
              title="Copy number"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Badges: Tier & KYC */}
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className="px-3 py-1 rounded-full bg-[#0287d0] text-white text-xs font-black shadow-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user.level || 'Level 3'} (Super Verified)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-800/40 text-emerald-100 text-xs font-bold border border-emerald-300/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span>KYC Verified • ንቁ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 -mt-4 relative z-20 flex-1 pb-10">
        {/* Transaction Limits Quick Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#8cc73f]" />
              <span>Transaction Limits (የገደብ ሁኔታ)</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Tier 3 Max
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Daily Limit</p>
              <p className="text-xs font-black text-slate-900 mt-1 font-mono">ETB 500,000</p>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Verified</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Monthly Limit</p>
              <p className="text-xs font-black text-slate-900 mt-1 font-mono">ETB 1,000,000</p>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Verified</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Single Limit</p>
              <p className="text-xs font-black text-slate-900 mt-1 font-mono">ETB 75,000</p>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Per Transfer</p>
            </div>
          </div>
        </div>

        {/* Dedicated 127 SMS Messages Banner (Direct Access for User) */}
        <div
          id="profile-sms-banner"
          onClick={onOpenSms}
          className="bg-gradient-to-r from-blue-600 to-[#0287d0] text-white rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all active:scale-99 border border-blue-400/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wide">127 SMS Messages</h3>
                <span className="bg-white text-[#0287d0] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {smsMessages.length} Messages
                </span>
              </div>
              <p className="text-[11px] text-blue-100 truncate mt-0.5">
                {latestSms
                  ? (latestSms.bodyEn || latestSms.bodyAm || 'View transfer and recharge SMS receipts').slice(0, 48) + '...'
                  : 'Official 127 receipts & notifications'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
        </div>

        {/* Personal & Identity Information */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#0287d0]" />
              <span>Personal Information (የግል መረጃ)</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-bold text-[#0287d0] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Full Legal Name */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Full Legal Name (ስም)</span>
              <span className="font-extrabold text-slate-900 font-sans text-right">{user.name}</span>
            </div>

            {/* Mobile Account No */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Mobile Account (የስልክ ቁጥር)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900">{user.phoneNumber}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(user.phoneNumber, 'Phone number')}
                  className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* National ID (Fayda / NID) */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium">Fayda National ID (ፋይዳ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900">
                  {user.faydaNumber || 'FAN-4829-1039-5820'}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>

            {/* KYC Status */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">KYC Verification</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Level 3 Verified</span>
              </span>
            </div>

            {/* Gender */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Gender (ጾታ)</span>
              <span className="font-bold text-slate-800">{user.gender || 'Male (ወንድ)'}</span>
            </div>

            {/* Registration Date */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Registration Date (የተመዘገበበት)</span>
              <span className="font-bold text-slate-800 font-mono">
                {user.registrationDate || '12/05/2021'}
              </span>
            </div>

            {/* Region / City */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">City / Region (ከተማ / ክልል)</span>
              <span className="font-bold text-slate-800 text-right">
                {user.region || 'Addis Ababa (አዲስ አበባ)'}
              </span>
            </div>

            {/* Subcity & Woreda */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Subcity / Woreda (ክፍለ ከተማ)</span>
              <span className="font-bold text-slate-800 text-right">
                {user.subcity || 'Bole Subcity, Woreda 03'}
              </span>
            </div>
          </div>
        </div>

        {/* Banking & Linked Financial Services */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#8cc73f]" />
              <span>Linked Banking & Wallet (የባንክ መረጃ)</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Telebirr Balance */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Telebirr Wallet Balance</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                ETB {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Primary Linked Bank */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Commercial Bank of Ethiopia (CBE)</p>
                <p className="text-[10px] text-slate-400 font-mono">Acc: 1000440979843</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#0287d0] rounded-md">
                Active
              </span>
            </div>

            {/* Secondary Linked Bank */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Dashen Bank (ዳሽን ባንክ)</p>
                <p className="text-[10px] text-slate-400 font-mono">Linked Amole Wallet</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                Linked
              </span>
            </div>
          </div>
        </div>

        {/* Account QR Code Action Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8cc73f]/15 text-[#7ab034] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">My Telebirr QR Code</p>
              <p className="text-[10px] text-slate-400">Show to receive money instantly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            View QR
          </button>
        </div>

        {/* Edit Profile Action Button */}
        <button
          type="button"
          onClick={() => {
            setEditName(user.name);
            setEditPhone(user.phoneNumber);
            setEditFayda(user.faydaNumber || 'FAN-4829-1039-5820');
            setEditRegion(user.region || 'Addis Ababa (አዲስ አበባ)');
            setEditSubcity(user.subcity || 'Bole Subcity, Woreda 03');
            setEditLevel(user.level || 'Level 3');
            setIsEditModalOpen(true);
          }}
          className="w-full py-3.5 bg-white border border-[#8cc73f] text-[#7ab034] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#8cc73f]/5 active:scale-99 transition-all cursor-pointer shadow-xs"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile Information</span>
        </button>
      </div>

      {/* Full QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl text-center border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* QR Card Header */}
            <div className="flex items-center justify-center gap-2 mb-2 mt-1">
              <img src="/images/ethio-logo.png" alt="Ethio" className="h-6 object-contain" />
              <span className="text-xs font-black text-slate-800">Telebirr QR</span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">Scan to pay or transfer money to:</p>

            {/* Generated clean SVG QR code visual */}
            <div className="w-48 h-48 mx-auto bg-slate-50 border-4 border-[#8cc73f] rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                {/* Simulated high fidelity QR Code pattern */}
                <rect x="5" y="5" width="28" height="28" fill="#1b2533" rx="2" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="1" />
                <rect x="13" y="13" width="12" height="12" fill="#1b2533" />

                <rect x="67" y="5" width="28" height="28" fill="#1b2533" rx="2" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="1" />
                <rect x="75" y="13" width="12" height="12" fill="#1b2533" />

                <rect x="5" y="67" width="28" height="28" fill="#1b2533" rx="2" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="1" />
                <rect x="13" y="75" width="12" height="12" fill="#1b2533" />

                {/* QR Matrix dots */}
                <rect x="38" y="10" width="8" height="8" fill="#1b2533" />
                <rect x="50" y="15" width="6" height="6" fill="#1b2533" />
                <rect x="38" y="24" width="8" height="8" fill="#1b2533" />
                <rect x="10" y="38" width="6" height="10" fill="#1b2533" />
                <rect x="22" y="44" width="8" height="8" fill="#1b2533" />
                <rect x="36" y="38" width="10" height="10" fill="#8cc73f" />
                <rect x="52" y="38" width="10" height="10" fill="#0287d0" />
                <rect x="68" y="38" width="8" height="8" fill="#1b2533" />
                <rect x="80" y="44" width="10" height="10" fill="#1b2533" />
                <rect x="38" y="54" width="8" height="12" fill="#1b2533" />
                <rect x="52" y="54" width="10" height="10" fill="#1b2533" />
                <rect x="68" y="54" width="6" height="6" fill="#1b2533" />
                <rect x="38" y="72" width="12" height="6" fill="#1b2533" />
                <rect x="54" y="72" width="8" height="16" fill="#1b2533" />
                <rect x="68" y="68" width="10" height="10" fill="#1b2533" />
                <rect x="82" y="75" width="8" height="8" fill="#1b2533" />
              </svg>

              {/* Center Telebirr Logo Badge */}
              <div className="absolute w-8 h-8 rounded-full bg-white border-2 border-[#8cc73f] flex items-center justify-center text-[#8cc73f] font-black text-xs shadow-md">
                tb
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">{user.name}</p>
              <p className="text-[11px] font-mono font-bold text-slate-500 mt-0.5">{user.phoneNumber}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  showToast('QR Code saved to gallery');
                  setIsQrModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('QR Code link shared');
                  setIsQrModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8cc73f]/20 text-[#7ab034] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Edit Profile Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name (ሙሉ ስም)</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f] focus:ring-1 focus:ring-[#8cc73f]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mobile Account Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full font-mono font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f] focus:ring-1 focus:ring-[#8cc73f]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Fayda National ID (FAN)</label>
                <input
                  type="text"
                  value={editFayda}
                  onChange={(e) => setEditFayda(e.target.value)}
                  className="w-full font-mono font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f] focus:ring-1 focus:ring-[#8cc73f]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Account Tier / Level</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f]"
                >
                  <option value="Level 3">Level 3 (Max ETB 500,000 / day)</option>
                  <option value="Level 2">Level 2 (Max ETB 100,000 / day)</option>
                  <option value="Level 1">Level 1 (Max ETB 10,000 / day)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Region / City</label>
                <input
                  type="text"
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                  className="w-full font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subcity / Woreda</label>
                <input
                  type="text"
                  value={editSubcity}
                  onChange={(e) => setEditSubcity(e.target.value)}
                  className="w-full font-bold border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:border-[#8cc73f]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8cc73f] hover:bg-[#7cb634] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
