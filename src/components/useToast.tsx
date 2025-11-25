"use client";
import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastOptions {
  title: string;
  description?: string;
  formattableDescription?: string;
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
    }, 4500);
  }, []);

  const getAccentColor = (variant?: ToastOptions["variant"]) => {
    switch (variant) {
      case "destructive":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-20 inset-x-2 sm:right-4 sm:left-auto flex flex-col space-y-3 z-[9999]">
        <AnimatePresence>
          {toasts.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="relative w-full sm:w-80 bg-white text-black rounded-xl px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-md">

                {/* Left Accent Color Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${getAccentColor(
                    t.variant
                  )}`}
                />

                {/* Title */}
                <strong
                  className={`block text-sm font-semibold ${
                    t.variant === "destructive" ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {t.title}
                </strong>

                {/* Description */}
                {t.description && (
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
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
