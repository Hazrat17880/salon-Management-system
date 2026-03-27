'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  // Get email from localStorage (from OTP verification)
  useEffect(() => {
    const verificationEmail = localStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      router.push('/admin/forgot-password');
    } else {
      setEmail(verificationEmail);
    }
  }, [router]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    let feedback = '';
    switch (score) {
      case 0:
      case 1: feedback = 'Very Weak'; break;
      case 2: feedback = 'Weak'; break;
      case 3: feedback = 'Medium'; break;
      case 4: feedback = 'Strong'; break;
      case 5: feedback = 'Very Strong'; break;
      default: feedback = '';
    }
    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;
    if (password.length < 8) { setError('Password must be at least 8 characters'); return false; }
    if (!/[A-Z]/.test(password)) { setError('Password must contain uppercase'); return false; }
    if (!/[a-z]/.test(password)) { setError('Password must contain lowercase'); return false; }
    if (!/[0-9]/.test(password)) { setError('Password must contain number'); return false; }
    if (!/[^a-zA-Z0-9]/.test(password)) { setError('Password must contain special character'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const getStrengthColor = () => {
    const { score } = passwordStrength;
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getStrengthWidth = () => `${(passwordStrength.score / 5) * 100}%`;

  // Submit reset password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!validatePassword()) { setIsLoading(false); return; }

    try {
    

      const otp = localStorage.getItem('lastOTP') || '';
      const res = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');

      // Clear verification info
      localStorage.removeItem('otpVerified');
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('lastOTP');

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <li className="flex items-center text-sm">
      {met ? (
        <span className="text-green-500 mr-2">✔</span>
      ) : (
        <span className="text-gray-400 mr-2">✖</span>
      )}
      <span className={met ? 'text-green-700' : 'text-gray-500'}>{text}</span>
    </li>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new password for <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword.password ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => togglePasswordVisibility('password')}>
                {showPassword.password ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Password Strength:</span>
                <span className={`text-xs font-semibold ${passwordStrength.score <= 2 ? 'text-red-500' : passwordStrength.score <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {passwordStrength.feedback}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${getStrengthColor()} transition-all duration-300`} style={{ width: getStrengthWidth() }} />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
            <ul className="space-y-1">
              <PasswordRequirement met={formData.password.length >= 8} text="At least 8 characters" />
              <PasswordRequirement met={/[A-Z]/.test(formData.password)} text="At least one uppercase letter" />
              <PasswordRequirement met={/[a-z]/.test(formData.password)} text="At least one lowercase letter" />
              <PasswordRequirement met={/[0-9]/.test(formData.password)} text="At least one number" />
              <PasswordRequirement met={/[^a-zA-Z0-9]/.test(formData.password)} text="At least one special character" />
            </ul>
          </div>

          {/* Error / Success Messages */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          {/* Submit */}
          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Navigation */}
          <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
            <Link href="/admin/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">Request new OTP</Link>
            <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}