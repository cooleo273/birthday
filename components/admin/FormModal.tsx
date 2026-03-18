'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function FormModal({ isOpen, onClose, title, children }: FormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#D2D2D7]/30 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[#D2D2D7]/30 flex items-center justify-between bg-[#FBFBFD]">
              <h2 className="text-[17px] font-bold text-[#1D1D1F] tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-[#E8E8ED] hover:bg-[#D2D2D7] flex items-center justify-center text-[#1D1D1F] transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-8 py-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
