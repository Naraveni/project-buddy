

"use client";
import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

type ToastContextType = {
  toast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = useCallback((opts: ToastOptions) => {
    setToasts(prev => [...prev, opts]);
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 inset-x-2 min-w-[20vw] sm:inset-x-auto sm:right-4 flex flex-col space-y-1 z-50">
        <AnimatePresence>
          {toasts.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="w-full sm:max-w-xs p-2 sm:p-5 rounded-lg bg-white border border-gray-200">
                <strong className={`block ${t.variant === 'destructive' ? 'text-red-600' : 'text-black'}`}>
                  {t.title}
                </strong>
                {t.description && (
                  <p className="mt-1 text-sm leading-tight text-black whitespace-pre-line">
                    {t.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
