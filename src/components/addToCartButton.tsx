// components/AddToCartButton.tsx
'use client';

import { useCart } from 'react-use-cart';
import { IProduct } from '@/lib/redux/productsSlice';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';

interface AddToCartButtonProps {
  product: IProduct;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { addItem, inCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price || 0,
      image: product.image,
      author: product.author,
      whatsapp: product.whatsapp, // ← IMPORTANT: inclure le numéro WhatsApp
    });
  };

  const isInCart = inCart(product.id.toString());

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`py-2 px-4 inline-flex items-center justify-center font-semibold tracking-wide border align-middle duration-300 text-base text-center rounded-md ${isInCart
          ? 'bg-green-600 border-green-600 text-white cursor-not-allowed'
          : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
        } ${className}`}
    >
      {/* Texte visible sur desktop, icône seulement sur mobile */}
      <span className="hidden md:inline">
        {isInCart ? '✓ Déjà au panier' : 'Ajouter au panier'}
      </span>

      {/* Icône visible sur mobile */}
      <span className="md:hidden">
        {isInCart ? <FaCheck size={18} /> : <FaShoppingCart size={18} />}
      </span>

      {/* Texte court pour les écrans moyens */}
      <span className="hidden sm:inline md:hidden">
        {isInCart ? 'Déjà ajouté' : 'Ajouter'}
      </span>
    </button>
  );
}