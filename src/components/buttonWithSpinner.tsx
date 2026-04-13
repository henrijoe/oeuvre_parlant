// components/ButtonWithSpinner.tsx
'use client'

import React from 'react';
import { IconType } from 'react-icons';

interface ButtonWithSpinnerProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType;
  onClick?: () => void;
  className?: string;
}

const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  type = 'button',
  size = 'md',
  icon: Icon,
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-wide border align-middle duration-500 text-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 border-gray-600 hover:border-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white focus:ring-green-500'
  };

  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-base',
    lg: 'py-3 px-6 text-lg'
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledClasses}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="mr-2" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default ButtonWithSpinner;