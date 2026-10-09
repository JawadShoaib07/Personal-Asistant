'use client';

import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  ShieldCheck, 
  Globe, 
  Mail, 
  KeyRound, 
  ExternalLink,
  Zap,
  Crown
} from 'lucide-react';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => boolean;
  currentCode?: string;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  isOpen,
  onClose,
  onApplyCode,
  currentCode = '4NV0PE',
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const success = onApplyCode(inputCode.trim());
    if (success) {
      setStatusMessage({
        type: 'success',
        text: '🎉 Token voucher successfully activated! 1 Billion Tokens allocated.',
      });
      setInputCode('');
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Invalid code. Use featured voucher: 4NV0PE',
      });
    }
  };

  const guideSteps = [
    {
      num: '1',
      title: 'USA Server VPN Connect',
      desc: 'Kisi bhi achi VPN app se USA server connect karein.',
      icon: <Globe className="h-4 w-4 text-[#d4af37]" />,
    },
    {
      num: '2',
      title: 'Website Open Karein',
      desc: 'Official website open karein aur Sign Up page par jayein.',
      icon: <ExternalLink className="h-4 w-4 text-[#f3e5ab]" />,
    },
    {
      num: '3',
      title: 'Email Requirement',
      desc: 'Sign up ke liye apni kam az kam 4 saal purani email use karein.',
      icon: <Mail className="h-4 w-4 text-[#d4af37]" />,
    },
    {
      num: '4',
      title: 'OTP & Age Verification',
      desc: 'OTP verify karein. (Age verification par FB/Instagram connect kar lein).',
      icon: <KeyRound className="h-4 w-4 text-[#f3e5ab]" />,
    },
    {
      num: '5',
      title: 'Redeem Code 4NV0PE',
      desc: 'Bottom-right Menu (2 lines) -> General -> Redeem Code par 4NV0PE enter karein.',
      icon: <Gift className="h-4 w-4 text-[#d4af37]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#0d0a07] p-6 shadow-2xl shadow-black/80 text-[#fcfaf6]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#261d14] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black shadow-md shadow-[#d4af37]/25">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Token Voucher Vault
                <span className="rounded-full bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold text-[#f3e5ab] border border-[#d4af37]/35">
                  1 BILLION
                </span>
              </h2>
              <p className="text-xs text-[#c5a059]">Lifetime Token Allocation Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#c5a059] hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Voucher Pass Card */}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#d4af37]/40 bg-[#16110a] p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#f3e5ab] font-bold">
                Official Free Voucher Code:
              </div>
              <div className="mt-1 font-mono text-2xl font-black tracking-wider text-white">
                {currentCode}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa771c] px-3.5 py-1.5 text-xs font-black text-black hover:brightness-105 transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-black stroke-[3]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#c5a059] border-t border-[#261d14] pt-2">
            <Zap className="h-3 w-3 text-[#d4af37]" />
            <span>Unlocks 1,000,000,000 lifetime tokens without expiration.</span>
          </div>
        </div>

        {/* Redeem Input Form */}
        <form onSubmit={handleRedeem} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code (e.g. 4NV0PE)..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 rounded-xl bg-black/50 px-3.5 py-2 text-xs text-white placeholder-[#c5a059]/40 border border-[#2e2316] focus:border-[#d4af37] focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#d4af37]/20 px-4 py-2 text-xs font-bold text-[#f3e5ab] hover:bg-[#d4af37]/30 border border-[#d4af37]/35 active:scale-95 transition-all"
          >
            Redeem
          </button>
        </form>

        {statusMessage && (
          <div
            className={`mt-2.5 rounded-lg p-2 text-xs font-bold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Step-by-Step Claiming Guide */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#f3e5ab]">
            <span>Claiming Guide (اردو / Roman Urdu):</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#d4af37]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Tested
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {guideSteps.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-2.5 rounded-lg border border-[#271e15] bg-[#120e0a] p-2 text-xs text-gray-300 hover:bg-[#18130e] transition-colors"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#d4af37]/20 font-mono font-bold text-[10px] text-[#f3e5ab]">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    {step.icon}
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[#c5a059]/80 mt-0.5 leading-snug">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/[0.06] px-4 py-1.5 text-xs font-bold text-gray-300 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
