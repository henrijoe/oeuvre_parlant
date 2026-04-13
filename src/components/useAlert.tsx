// hooks/useAlert.ts
'use client'

import { useState } from 'react';
import { Variant } from '@/components/alerte';

interface AlertState {
  show: boolean;
  type: Variant;
  message: string;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    message: ''
  });

  const showAlert = (type: Variant, message: string, duration: number = 3000) => {
    setAlert({ show: true, type, message });
    
    if (duration > 0) {
      setTimeout(() => {
        setAlert({ show: false, type, message });
      }, duration);
    }
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  return {
    alert,
    showAlert,
    hideAlert
  };
};