import React, { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Toast from '../components/Toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextValue = {
  addToast: (message: string, type?: ToastType, duration?: number) => number;
  removeToast: (id: number) => void;
  showSuccess: (message: string, duration?: number) => number;
  showError: (message: string, duration?: number) => number;
  showWarning: (message: string, duration?: number) => number;
  showInfo: (message: string, duration?: number) => number;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast: ToastItem = { id, message, type, duration } as ToastItem;
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => addToast(message, 'success', duration), [addToast]);
  const showError = useCallback((message: string, duration?: number) => addToast(message, 'error', duration), [addToast]);
  const showWarning = useCallback((message: string, duration?: number) => addToast(message, 'warning', duration), [addToast]);
  const showInfo = useCallback((message: string, duration?: number) => addToast(message, 'info', duration), [addToast]);

  const value = useMemo<ToastContextValue>(() => ({
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }), [addToast, removeToast, showError, showInfo, showSuccess, showWarning]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              transform: `translateY(${index * 10}px)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;


