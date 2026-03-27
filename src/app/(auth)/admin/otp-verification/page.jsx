'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyOTP() {
  const router = useRouter();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('');

  const inputRefs = useRef([]);

  // ✅ Get email from sessionStorage
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('resetEmail');

    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      router.push('/admin/forgot-password');
    }
  }, [router]);

  // ✅ Timer logic
  useEffect(() => {
    let interval;

    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, canResend]);

  // ✅ Handle input change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ✅ Backspace handling
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ Paste handling
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6);

    if (/^\d+$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);

      const nextIndex = newOtp.findIndex((v) => !v);
      inputRefs.current[nextIndex !== -1 ? nextIndex : 5].focus();
    }
  };

  // ✅ VERIFY OTP (REAL API)
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/admin/otp-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();
      console.log("your api response are :",data);

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // ✅ Save verification state
      sessionStorage.setItem('otpVerified', 'true');
      sessionStorage.setItem('verificationEmail', email);
      localStorage.setItem('verificationEmail', email);

      setMessage('OTP verified successfully! Redirecting...');

      setTimeout(() => {
        router.push('/admin/reset-password');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ RESEND OTP (REAL API)
const handleResend = async () => {
  setIsLoading(true);
  setError('');
  setMessage('');

  try {
    const res = await fetch('/api/auth/admin/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

    setMessage('OTP resent successfully');
    setTimer(60);
    setCanResend(false);

  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        
        <h2 className="text-center text-3xl font-bold">Verify OTP</h2>

        <p className="text-center text-sm">
          Enter OTP sent to <br />
          <span className="font-medium text-indigo-600">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center border rounded"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {!canResend ? (
              <p>Resend in {timer}s</p>
            ) : (
              <button type="button" onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </div>

          {/* Messages */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="flex justify-between text-sm">
          <Link href="/admin/forgot-password">Request new code</Link>
          <Link href="/admin/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}