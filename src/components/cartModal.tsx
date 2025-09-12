// components/CartModal.tsx
'use client';

import { useCart } from 'react-use-cart';
import { currency } from '@/lib/functions';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const {
    isEmpty,
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
    totalItems,
    emptyCart,
  } = useCart();

  // Fermer le modal si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Empêcher la fermeture quand on clique à l'intérieur
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold">Panier ({totalItems})</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isEmpty ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-slate-500 dark:text-slate-400">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      {item.author && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Par {item.author}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-green-600">
                        {currency(item.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      -
                    </button>
                    
                    <span className="text-sm w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm transition-colors"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-green-600">{currency(cartTotal)}</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  emptyCart();
                  // Ne pas fermer le modal après avoir vidé
                }}
                className="flex-1 py-2 px-4 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-sm transition-colors"
              >
                Vider
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  router.push('/checkout');
                }}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
              >
                Commander
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}