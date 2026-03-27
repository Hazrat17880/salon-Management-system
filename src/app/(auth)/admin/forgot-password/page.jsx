// app/admin/forgot-password/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend API instead of using localStorage
const response = await fetch('/api/auth/admin/forgot', {
  method: "POST", // ✅ REQUIRED
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
}); 

      const data = await response.json();
      console.log("your api response are :",data.message);

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Store email temporarily for OTP verification (using sessionStorage)
      sessionStorage.setItem('resetEmail', email);
      localStorage.setItem('resetEmail', email);
      
      setMessage(data.message || 'Reset instructions have been sent to your email!');
      setEmail('');
      
      // Redirect to OTP verification page after 3 seconds
      setTimeout(() => {
        router.push('/admin/otp-verification');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f0eb;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(210,185,155,0.25) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(180,160,130,0.15) 0%, transparent 50%);
          font-family: 'DM Sans', sans-serif;
          padding: 2rem;
        }

        .fp-card {
          background: #fffdf9;
          border: 1px solid rgba(180,160,130,0.3);
          border-radius: 2px;
          padding: 3.5rem 3rem;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 1px 2px rgba(100,80,50,0.06),
            0 8px 32px rgba(100,80,50,0.08),
            0 32px 64px rgba(100,80,50,0.05);
          position: relative;
          overflow: hidden;
        }

        .fp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #b08d6a, #d4aa80, #b08d6a);
        }

        .fp-ornament {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #b08d6a;
          letter-spacing: 0.5em;
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }

        .fp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem;
          font-weight: 400;
          color: #2c1f0e;
          text-align: center;
          letter-spacing: 0.02em;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .fp-subtitle {
          font-size: 0.825rem;
          color: #8a7260;
          text-align: center;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 2.5rem;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        .fp-field {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .fp-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a7260;
          margin-bottom: 0.5rem;
        }

        .fp-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid rgba(180,160,130,0.4);
          border-radius: 2px;
          background: #faf7f2;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #2c1f0e;
          transition: all 0.2s ease;
          outline: none;
        }

        .fp-input:focus {
          border-color: #b08d6a;
          background: #fffdf9;
          box-shadow: 0 0 0 3px rgba(176,141,106,0.12);
        }

        .fp-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fp-input::placeholder { color: #c4ad95; }

        .fp-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fdf2f0;
          border: 1px solid rgba(200,80,60,0.2);
          border-radius: 2px;
          color: #b04030;
          font-size: 0.8rem;
          margin-bottom: 1.25rem;
          animation: slideIn 0.2s ease;
        }

        .fp-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f0f7f2;
          border: 1px solid rgba(60,140,80,0.2);
          border-radius: 2px;
          color: #2d7a48;
          font-size: 0.8rem;
          margin-bottom: 1.25rem;
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fp-btn {
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: #2c1f0e;
          color: #f5ede0;
          border: none;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .fp-btn:hover:not(:disabled) {
          background: #3d2c18;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(44,31,14,0.25);
        }

        .fp-btn:active:not(:disabled) { transform: translateY(0); }

        .fp-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fp-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .fp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(245,237,224,0.3);
          border-top-color: #f5ede0;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .fp-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .fp-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(180,160,130,0.25);
        }

        .fp-divider-dot {
          font-family: 'Cormorant Garamond', serif;
          color: #c4ad95;
          font-size: 1.2rem;
        }

        .fp-back {
          display: block;
          text-align: center;
          font-size: 0.8rem;
          color: #8a7260;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }

        .fp-back:hover { color: #b08d6a; }

        .fp-back span {
          display: inline-block;
          margin-right: 0.35rem;
          transition: transform 0.2s;
        }

        .fp-back:hover span { transform: translateX(-3px); }
      `}</style>

      <div className="fp-root">
        <div className="fp-card">
          <div className="fp-ornament">✦</div>
          <h1 className="fp-title">Forgot Password</h1>
          <p className="fp-subtitle">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="fp-field">
              <label htmlFor="email" className="fp-label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fp-input"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="fp-error">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#b04030" strokeWidth="1.5"/>
                  <path d="M7 4v3.5M7 9.5v.5" stroke="#b04030" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {message && (
              <div className="fp-success">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#2d7a48" strokeWidth="1.5"/>
                  <path d="M4.5 7l2 2 3-3" stroke="#2d7a48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {message}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="fp-btn">
              <div className="fp-btn-inner">
                {isLoading && <div className="fp-spinner" />}
                {isLoading ? 'Sending…' : 'Send Reset Instructions'}
              </div>
            </button>
          </form>

          <div className="fp-divider">
            <div className="fp-divider-line" />
            <div className="fp-divider-dot">·</div>
            <div className="fp-divider-line" />
          </div>

          <Link href="/admin/login" className="fp-back">
            <span>←</span> Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}