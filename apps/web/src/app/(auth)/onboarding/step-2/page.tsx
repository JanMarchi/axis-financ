'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OnboardingStep2() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Verifique seu Email</h2>
        <p className="text-text-secondary">Enviamos um código para seu email</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((val, idx) => (
          <input
            key={idx}
            maxLength={1}
            value={val}
            onChange={(e) => {
              const newOtp = [...otp];
              newOtp[idx] = e.target.value;
              setOtp(newOtp);
              if (e.target.value && idx < 5) {
                document.getElementById(`otp-${idx + 1}`)?.focus();
              }
            }}
            id={`otp-${idx}`}
            className="w-12 h-12 text-center text-2xl font-bold rounded-input bg-bg-subtle border border-border-default text-text-primary focus:border-brand-500 focus:outline-none"
          />
        ))}
      </div>

      <Link
        href="/onboarding/step-3"
        className="block text-center px-8 py-3 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all"
      >
        Próximo
      </Link>
    </div>
  );
}
