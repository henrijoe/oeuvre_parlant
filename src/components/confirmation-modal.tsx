// components/confirmation-modal.tsx
'use client';

import { useState, useEffect } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmation",
    message,
    confirmText = "OK",
    cancelText = "Annuler"
}: ConfirmationModalProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            // Délai pour permettre l'animation de sortie
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-10'}`}>
            {/* Légère overlay pour mieux détacher le modal */}
            <div 
                className="fixed inset-0 bg-black/5 backdrop-blur-[1px] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal avec élévation accentuée */}
            <div className={`relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-300/50 dark:border-slate-600/50 max-w-md w-full mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Close button avec meilleur contraste */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 size-8 flex items-center 
                    justify-center bg-white dark:bg-slate-800 rounded-full shadow-lg border 
                    border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all hover:scale-110"
                    aria-label="Fermer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal content avec padding amélioré */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center size-12 rounded-full bg-red-100 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-800/50">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-6">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-6">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal actions avec séparation visuelle */}
                <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200/50 dark:border-slate-700/50 rounded-b-xl">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 hover:shadow-md"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-sm font-medium text-white shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;