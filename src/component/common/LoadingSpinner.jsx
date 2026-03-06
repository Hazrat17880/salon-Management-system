// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'indigo', 
  text = 'Loading...',
  fullScreen = true 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    pink: 'border-pink-600',
    gray: 'border-gray-600'
  };

  const spinnerClass = `inline-block animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]} mb-4`;

  const content = (
    <div className="text-center">
      <div className={spinnerClass}></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;