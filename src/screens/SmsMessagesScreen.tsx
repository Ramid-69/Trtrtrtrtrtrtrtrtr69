import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  User,
  MoreVertical,
  Search,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Camera,
  Plus,
  Smile,
  Send,
  X,
  Languages,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SmsMessage } from '../types';

interface SmsMessagesScreenProps {
  onBack: () => void;
  onOpenReceipt: (txId: string) => void;
}

export const SCREENSHOT_MESSAGES: SmsMessage[] = [
  {
    id: 'sms-1',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n397885 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n397885 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:08 am',
    fullDateTime: '06/09/2026 01:08:21',
    type: 'verification',
  },
  {
    id: 'sms-2',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n995030 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n995030 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:09 am',
    fullDateTime: '06/09/2026 01:09:44',
    type: 'verification',
  },
  {
    id: 'sms-3',
    sender: '127',
    simSlot: 1,
    bodyEn: `Dear Customer,\n989437 is your telebirr verification code, please don't share it with another person.\nThank you for using telebirr.\n\nEthio telecom. muUryKzPji+`,
    bodyAm: `ክቡር ደንበኛ፣\n989437 የቴሌብር ማረጋገጫ ኮድዎ ነው፤ እባክዎ ለማንም ሰው አያጋሩት።\nቴሌብርን ስለተጠቀሙ እናመሰግናለን።\n\nኢትዮ ቴሌኮም. muUryKzPji+`,
    timestamp: '1:11 am',
    fullDateTime: '06/09/2026 01:11:15',
    type: 'verification',
  },
  {
    id: 'sms-4',
    sender: '127',
    simSlot: 1,
    bodyEn: `Sorry, your PIN or password is incorrect. please check and try again.\nFor any support and information related to telebirr service\nSend SMS to 126 or Contact us via Telegram: https://t.me/telebirr\nFacebook: https://facebook.com/telebirr or\nVisit our website :https://www.ethiotelecom.et/telebirr/`,
    bodyAm: `ይቅርታ ያስገቡት ፒን ወይም የይለፍ ቃል ትክክል አይደለም። እባክዎ አረጋግጠው በድጋሚ ይሞክሩ።\nስለ ቴሌብር አገልግሎት መረጃ እና ድጋፍ ለማግኘት\nበ 126 አጭር የጽሁፍ መልእክት ይላኩ ወይም በቴሌግራም ያግኙን: https://t.me/telebirr\nፌስቡክ: https://facebook.com/telebirr\nድረ-ገጻችንን ይጎብኙ :https://www.ethiotelecom.et/telebirr/`,
    timestamp: '1:14 am',
    fullDateTime: '06/09/2026 01:14:02',
    type: 'alert',
  },
];

export const SmsMessagesScreen: React.FC<SmsMessagesScreenProps> = ({
  onBack,
  onOpenReceipt,
}) => {
  const {
    smsMessages,
    smsLanguage,
    setSmsLanguage,
    deleteSmsMessage,
    updateSmsMessage,
    addSmsMessage,
    clearSmsMessages,
    user,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SmsMessage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);
  const [loadingTxId, setLoadingTxId] = useState<string | null>(null);
  const [loadingSecondsLeft, setLoadingSecondsLeft] = useState(5);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on mount and when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [smsMessages.length]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleOpenReceiptWith5SecLoading = (txId: string) => {
    setLoadingTxId(txId);
    setIsReceiptLoading(true);
    setLoadingSecondsLeft(5);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 5 - elapsed);
      setLoadingSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsReceiptLoading(false);
      onOpenReceipt(txId);
    }, 5000);
  };

  const handleCopyMessage = (msg: SmsMessage) => {
    const textToCopy = smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn;
    navigator.clipboard.writeText(textToCopy);
    showToast('Message copied to clipboard');
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    deleteSmsMessage(id);
    showToast('Message deleted');
    setSelectedMessage(null);
  };

  const handleOpenEdit = (msg: SmsMessage) => {
    setSelectedMessage(msg);
    setEditingText(smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedMessage && editingText.trim()) {
      updateSmsMessage(selectedMessage.id, editingText);
      showToast('Message updated');
      setIsEditModalOpen(false);
      setSelectedMessage(null);
    }
  };

  const handleResetToScreenshot = () => {
    clearSmsMessages();
    SCREENSHOT_MESSAGES.forEach((msg) => addSmsMessage(msg));
    showToast('Reset to screenshot messages');
    setIsMenuOpen(false);
  };

  const handleSendCustomMessage = () => {
    if (!customInputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    addSmsMessage({
      bodyEn: customInputText.trim(),
      bodyAm: customInputText.trim(),
      timestamp: timeStr,
      fullDateTime: `${dd}/${mm}/${yyyy} ${now.toTimeString().split(' ')[0]}`,
      type: 'alert',
    });
    setCustomInputText('');
  };

  // Filter messages by search query
  const filteredMessages = smsMessages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.bodyEn.toLowerCase().includes(q) ||
      (msg.bodyAm && msg.bodyAm.toLowerCase().includes(q)) ||
      (msg.txId && msg.txId.toLowerCase().includes(q)) ||
      msg.timestamp.toLowerCase().includes(q)
    );
  });

  // Render clickable links in message text
  const renderMessageContent = (text: string, msg: SmsMessage) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <div className="text-[13.5px] leading-[1.38] text-[#111827] whitespace-pre-wrap font-sans break-words select-text">
        {parts.map((part, idx) => {
          if (part.match(urlRegex)) {
            const isReceiptLink =
              part.includes('transactioninfo.ethiotelecom.et/receipt') ||
              part.includes('receipt');
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isReceiptLink) {
                    const match = part.match(/\/receipt\/([A-Za-z0-9]+)/);
                    const id = match ? match[1] : (msg.txId || 'DH65MCW9BZ');
                    handleOpenReceiptWith5SecLoading(id);
                  } else {
                    window.open(part, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="text-[#2563eb] underline underline-offset-1 hover:text-[#1d4ed8] cursor-pointer inline-flex items-center break-all font-medium"
              >
                <span>{part}</span>
                {isReceiptLink && <ExternalLink className="w-3 h-3 inline ml-0.5 shrink-0" />}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-white select-none relative overflow-hidden font-sans"
      id="sms-messages-screen"
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#8cc73f]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Samsung Messages App Header (Matching Screenshot: <, blue avatar, 127 [1] v, :) */}
      <header className="bg-white px-2 py-2.5 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-slate-900 hover:text-black rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Contact Avatar Circle (#82a8ec periwinkle with white user icon) */}
          <div className="w-9 h-9 rounded-full bg-[#82a8ec] flex items-center justify-center text-white shrink-0">
            <User className="w-5 h-5 fill-white text-white" />
          </div>

          {/* Contact Title & SIM 1 Badge */}
          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => showToast('Ethio Telecom Telebirr Official Notification Service (127)')}
          >
            <span className="text-[17px] font-bold text-black tracking-tight">127</span>
            {/* Small Blue SIM 1 Badge */}
            <span className="w-[15px] h-[15px] rounded-[3px] bg-[#0082c9] text-white text-[9px] font-black flex items-center justify-center">
              1
            </span>
            {/* Dropdown arrow */}
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 rotate-90" />
          </div>
        </div>

        {/* Right Action: 3 vertical dots menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-800 hover:text-black rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-1 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-30 text-xs text-slate-700 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={handleResetToScreenshot}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0082c9]" />
                <span>Reset Screenshot Messages</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = smsLanguage === 'en' ? 'am' : 'en';
                  setSmsLanguage(next);
                  setIsMenuOpen(false);
                  showToast(`Language switched to ${next === 'en' ? 'English' : 'Amharic (አማርኛ)'}`);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium text-slate-800"
              >
                <Languages className="w-3.5 h-3.5 text-[#8cc73f]" />
                <span>Language: {smsLanguage === 'en' ? 'English (EN)' : 'Amharic (አማ)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium text-slate-800"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search Messages</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  const now = new Date();
                  const dd = String(now.getDate()).padStart(2, '0');
                  const mm = String(now.getMonth() + 1).padStart(2, '0');
                  const yyyy = now.getFullYear();
                  const tx = 'DH' + Math.random().toString(36).substring(2, 9).toUpperCase();
                  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
                  addSmsMessage({
                    bodyEn: `Dear ${user.name.split(' ')[0]}\nYou have successfully transferred 250.00 Br. to MOHAMMED YASIN on date ${dd}/${mm}/${yyyy}. Tx ID: ${tx}.\nTo get your payment info: https://transactioninfo.ethiotelecom.et/receipt/${tx}\nThank you for using Telebirr`,
                    bodyAm: `ክቡር ${user.name.split(' ')[0]}\nበ ${dd}/${mm}/${yyyy} 250.00 ብር በተሳካ ሁኔታ አስተላልፈዋል። መለያ ቁጥር: ${tx}።\nየክፍያ መረጃ ለማግኘት: https://transactioninfo.ethiotelecom.et/receipt/${tx}\nቴሌብርን ስለተጠቀሙ እናመሰግናለን`,
                    timestamp: timeStr,
                    fullDateTime: `${dd}/${mm}/${yyyy} ${now.toTimeString().split(' ')[0]}`,
                    txId: tx,
                    type: 'transfer_telebirr',
                  });
                  showToast('Sample transfer SMS added');
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium text-slate-800"
              >
                <Plus className="w-3.5 h-3.5 text-[#8cc73f]" />
                <span>Add Transfer SMS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  clearSmsMessages();
                  showToast('All messages cleared');
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Messages</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 animate-in slide-in-from-top-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verification code, date, or text..."
            className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Messages Stream Container (Pure White Background, exact screenshot styling) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-4 bg-white"
        onClick={() => {
          setSelectedMessage(null);
          setIsMenuOpen(false);
        }}
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600">No messages</p>
            <button
              type="button"
              onClick={handleResetToScreenshot}
              className="px-4 py-1.5 bg-[#0082c9] text-white text-xs font-semibold rounded-full shadow-xs cursor-pointer hover:bg-[#0070ad]"
            >
              Load Screenshot Messages
            </button>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const bodyText = smsLanguage === 'am' && msg.bodyAm ? msg.bodyAm : msg.bodyEn;
            const isSelected = selectedMessage?.id === msg.id;
            const isAlertExpanded = expandedAlerts[msg.id];

            return (
              <div key={msg.id} className="flex flex-col items-start max-w-full relative group animate-in fade-in">
                {/* Bubble + Timestamp row: timestamp sits right beside the bottom right corner of bubble */}
                <div className="flex items-end gap-1.5 max-w-full">
                  {/* SMS Bubble (#dce8fd periwinkle blue, rounded-[20px] rounded-tl-[4px]) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(isSelected ? null : msg);
                    }}
                    className={`relative px-4 py-3 rounded-[20px] rounded-tl-[4px] transition-all cursor-pointer max-w-[80%] sm:max-w-[82%] ${
                      isSelected
                        ? 'bg-[#cce1fd] ring-2 ring-[#0082c9]/40'
                        : 'bg-[#dce8fd] hover:bg-[#d4e4fc]'
                    }`}
                  >
                    {/* Message Text Content */}
                    {renderMessageContent(bodyText, msg)}

                    {/* View all row (Matching screenshot Bubble 4) */}
                    {(msg.type === 'alert' || bodyText.includes('Sorry, your PIN')) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedAlerts((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }));
                        }}
                        className="mt-3 pt-2.5 border-t border-[#c6dcf8] flex items-center justify-between text-[13.5px] font-bold text-black cursor-pointer hover:opacity-80"
                      >
                        <span>View all</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                      </div>
                    )}

                    {/* Expandable extra support details if clicked */}
                    {isAlertExpanded && (
                      <div className="mt-2 pt-2 border-t border-[#c6dcf8] text-xs text-slate-700 space-y-1">
                        <p className="font-semibold text-slate-900">• Ethio Telecom Hotline: 127</p>
                        <p className="font-semibold text-slate-900">• Customer Care SMS: 126</p>
                        <p className="text-[11px] text-slate-600">Hours: 24/7 Support Service</p>
                      </div>
                    )}

                    {/* If message has an official receipt link */}
                    {msg.txId && (
                      <div className="mt-2.5 pt-2 border-t border-[#c6dcf8] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (msg.txId) handleOpenReceiptWith5SecLoading(msg.txId);
                          }}
                          className="text-[11.5px] font-bold text-[#0082c9] hover:text-[#006ca7] flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Official Receipt</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp outside bubble at bottom right (Matching screenshot e.g. 1:08 am) */}
                  <span className="text-[11px] text-[#71717a] font-normal shrink-0 pb-0.5 whitespace-nowrap">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Contextual Action Bar when Message is Clicked */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1.5 flex items-center gap-1 bg-white rounded-xl shadow-lg border border-slate-200 p-1 text-xs animate-in zoom-in-95 z-10"
                  >
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Copy full text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(msg)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Edit message"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {msg.txId && (
                      <button
                        type="button"
                        onClick={() => handleOpenReceiptWith5SecLoading(msg.txId!)}
                        className="px-2.5 py-1 text-[#0082c9] hover:bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                        title="View receipt"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Samsung Messages Bottom Input Bar (Matching Screenshot: [gallery] [camera] [+] [Text message 😀] [|||||]) */}
      <footer className="bg-white px-3 py-2 flex items-center gap-2 border-t border-slate-100 sticky bottom-0 z-20">
        {/* Left Icons: Image, Camera, Plus */}
        <div className="flex items-center gap-1 text-slate-700">
          <button
            type="button"
            onClick={() => showToast('Attach photo from gallery')}
            className="p-1.5 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Gallery"
          >
            <ImageIcon className="w-[21px] h-[21px] stroke-[1.8]" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Open camera')}
            className="p-1.5 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Camera"
          >
            <Camera className="w-[21px] h-[21px] stroke-[1.8]" />
          </button>
          <button
            type="button"
            onClick={() => showToast('More attachment options')}
            className="p-1.5 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Add attachment"
          >
            <Plus className="w-[22px] h-[22px] stroke-[2.2]" />
          </button>
        </div>

        {/* Input Pill */}
        <div className="flex-1 bg-[#f1f3f5] rounded-full px-4 py-2 flex items-center gap-2">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendCustomMessage();
            }}
            placeholder="Text message"
            className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-500 outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => showToast('Emoji selector')}
            className="text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Emoji"
          >
            <Smile className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Far Right: Voice Waveform / Mic or Send Button */}
        {customInputText.trim() ? (
          <button
            type="button"
            onClick={handleSendCustomMessage}
            className="p-2.5 bg-[#0082c9] text-white rounded-full hover:bg-[#0073b3] transition-colors cursor-pointer shadow-xs"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => showToast('Voice recording')}
            className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title="Voice note"
          >
            {/* Audio waveform bars icon matching screenshot */}
            <div className="flex items-center gap-[2px] h-5 px-1">
              <span className="w-[2px] h-2 bg-slate-800 rounded-full" />
              <span className="w-[2px] h-3.5 bg-slate-800 rounded-full" />
              <span className="w-[2px] h-5 bg-slate-800 rounded-full" />
              <span className="w-[2px] h-3.5 bg-slate-800 rounded-full" />
              <span className="w-[2px] h-2 bg-slate-800 rounded-full" />
            </div>
          </button>
        )}
      </footer>

      {/* 5-Second Loading Modal for Receipt */}
      {isReceiptLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full flex flex-col items-center text-center animate-in zoom-in-95">
            <img src="/images/telebirr.png" alt="Telebirr" className="h-9 object-contain mb-3" />

            {/* Telebirr Green Dots Pulse Spinner */}
            <div className="relative w-12 h-12 my-2">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div
                  key={deg}
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#8cc73f]"
                  style={{
                    top: `${50 - 40 * Math.cos((deg * Math.PI) / 180)}%`,
                    left: `${50 + 40 * Math.sin((deg * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `telebirrPulse 1.2s linear infinite ${i * 0.15}s`,
                  }}
                />
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900 mt-3">
              Verifying Official Receipt...
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Transaction #{loadingTxId || 'DH65MCW9BZ'}
            </p>

            {/* 5-Second Animated Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-[#8cc73f] h-full transition-all duration-300 ease-linear rounded-full"
                style={{ width: `${Math.min(100, ((5 - loadingSecondsLeft) / 5) * 100)}%` }}
              />
            </div>

            <span className="text-[11px] font-bold text-[#8cc73f] mt-2">
              Please wait... {loadingSecondsLeft}s
            </span>
          </div>

          <style>{`
            @keyframes telebirrPulse {
              0%, 100% {
                opacity: 0.2;
                transform: translate(-50%, -50%) scale(0.7);
              }
              50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
              }
            }
          `}</style>
        </div>
      )}

      {/* Edit Message Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Edit SMS Message</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Message Body</label>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                rows={7}
                className="w-full text-xs font-sans text-slate-900 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0082c9] focus:ring-1 focus:ring-[#0082c9] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0082c9] hover:bg-[#0070ad] cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
