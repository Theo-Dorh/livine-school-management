import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

// Global dispatcher for triggering toasts from anywhere in the codebase
export const toast = {
  success: (message: string, title?: string) => dispatchToast('success', message, title),
  error: (message: string, title?: string) => dispatchToast('error', message, title),
  warning: (message: string, title?: string) => dispatchToast('warning', message, title),
  info: (message: string, title?: string) => dispatchToast('info', message, title),
};

const dispatchToast = (type: ToastType, message: string, title?: string) => {
  const event = new CustomEvent('lis_toast', {
    detail: {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
      duration: 3500,
    },
  });
  window.dispatchEvent(event);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const newToast = customEvent.detail;

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3500);
    };

    window.addEventListener('lis_toast', handleToastEvent);
    return () => window.removeEventListener('lis_toast', handleToastEvent);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        let bg = '#0F2537';
        let border = '#334155';
        let Icon = Info;
        let iconColor = '#38BDF8';

        if (t.type === 'success') {
          bg = '#064E3B';
          border = '#059669';
          Icon = CheckCircle2;
          iconColor = '#34D399';
        } else if (t.type === 'error') {
          bg = '#7F1D1D';
          border = '#DC2626';
          Icon = AlertCircle;
          iconColor = '#F87171';
        } else if (t.type === 'warning') {
          bg = '#78350F';
          border = '#D97706';
          Icon = AlertTriangle;
          iconColor = '#FBBF24';
        }

        return (
          <div
            key={t.id}
            style={{
              backgroundColor: bg,
              color: '#FFFFFF',
              border: `1px solid ${border}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.15rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              pointerEvents: 'auto',
              animation: 'slideInUp 0.2s ease-out',
            }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              {t.title && (
                <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.15rem' }}>
                  {t.title}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', opacity: 0.95, lineHeight: 1.35 }}>
                {t.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
