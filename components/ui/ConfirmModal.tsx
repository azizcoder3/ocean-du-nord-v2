"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        <div className="bg-gray-50 p-4 flex justify-end gap-3 mt-2">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Suppression..." : "Confirmer la suppression"}
          </button>
        </div>
      </div>
    </div>
  );
}