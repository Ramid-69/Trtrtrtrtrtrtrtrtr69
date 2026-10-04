import React, { useState, useRef } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface SwipeableNotificationBannerProps {
  message: string;
  onDismiss: () => void;
  onClick: () => void;
}

export const SwipeableNotificationBanner: React.FC<SwipeableNotificationBannerProps> = ({
  message,
  onDismiss,
  onClick,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.touches[0].clientX;
    const delta = currentXRef.current - startXRef.current;
    setOffsetX(delta);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsSwiping(false);
    const delta = currentXRef.current - startXRef.current;

    if (Math.abs(delta) > 65) {
      // Swiped far enough sideways -> dismiss
      setIsDismissing(true);
      setOffsetX(delta > 0 ? 400 : -400);
      setTimeout(() => {
        onDismiss();
      }, 220);
    } else if (Math.abs(delta) < 8) {
      // Tap detected -> open message
      onClick();
    } else {
      // Reset position
      setOffsetX(0);
    }
  };

  // Mouse handlers for desktop browser testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    isDraggingRef.current = true;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.clientX;
    const delta = currentXRef.current - startXRef.current;
    setOffsetX(delta);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsSwiping(false);
    const delta = currentXRef.current - startXRef.current;

    if (Math.abs(delta) > 65) {
      setIsDismissing(true);
      setOffsetX(delta > 0 ? 400 : -400);
      setTimeout(() => {
        onDismiss();
      }, 220);
    } else if (Math.abs(delta) < 8) {
      onClick();
    } else {
      setOffsetX(0);
    }
  };

  const opacity = Math.max(0.1, 1 - Math.abs(offsetX) / 280);

  return (
    <div
      id="push-notification-banner"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transform: `translateX(${offsetX}px)`,
        opacity,
        transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease',
      }}
      className={`fixed top-2.5 left-2.5 right-2.5 sm:max-w-[400px] sm:mx-auto z-50 bg-[#161f2e]/98 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md cursor-pointer select-none touch-none ${
        isDismissing ? 'pointer-events-none' : ''
      }`}
      title="Tap to open SMS • Swipe left/right to dismiss"
    >
      <div className="flex items-start gap-2.5">
        {/* App Icon */}
        <div className="w-8 h-8 rounded-full bg-[#8cc73f] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs mt-0.5">
          tb
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#8cc73f] uppercase tracking-wider">
                127 • telebirr
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-[10px] text-slate-400">now</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold bg-blue-500/15 px-1.5 py-0.5 rounded-full">
              <MessageSquare className="w-2.5 h-2.5" />
              <span>SMS</span>
            </div>
          </div>

          <p className="text-xs text-slate-100 font-medium leading-snug mt-1 line-clamp-2">
            {message}
          </p>

          <div className="flex items-center justify-between mt-1.5 text-[9px] text-slate-400">
            <span>Tap to open message</span>
            <span>⇄ Swipe to dismiss</span>
          </div>
        </div>

        {/* Dismiss X button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="p-1 text-slate-400 hover:text-white rounded-full shrink-0 -mr-1 -mt-1 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
