import React, { useEffect, useState } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
};

const Toast = ({ message, type, onClose, duration = 4000 }: ToastProps): React.ReactElement => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const toastClass = `toast ${
    type === 'success' ? 'toast-success' :
    type === 'error' ? 'toast-error' :
    type === 'warning' ? 'toast-warning' : 'toast-info'
  }`;

  return (
    <div
      className={toastClass}
      style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)', opacity: isVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div style={{ fontSize: '20px' }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {message}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className='toast-close'
      >
        ×
      </button>
    </div>
  );
};

export default Toast;


