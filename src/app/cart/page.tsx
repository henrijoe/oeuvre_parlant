// app/cart/page.tsx
'use client';

import { useCart } from 'react-use-cart';
import Link from 'next/link';
import { currency } from '@/lib/functions';

export default function CartPage() {
  const {
    isEmpty,
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
    totalItems,
    emptyCart,
  } = useCart();

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panier ({totalItems} articles)</h1>
      
      <div className="grid gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.author && <p className="text-sm text-gray-600">Par {item.author}</p>}
                <p className="text-lg font-bold">{currency(item.price)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              
              <span className="px-3">{item.quantity}</span>
              
              <button
                onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              
              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-xl font-bold">{currency(cartTotal)}</span>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={emptyCart}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Vider le panier
          </button>
          
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Procéder au paiement
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Continuer vos achats
        </Link>
      </div>
    </div>
  );
}