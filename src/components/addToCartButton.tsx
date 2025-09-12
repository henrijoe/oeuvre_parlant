// components/AddToCartButton.tsx
'use client';

import { useCart } from 'react-use-cart';
import { IProduct } from '@/lib/redux/productsSlice';

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
    });
  };

  const isInCart = inCart(product.id.toString());

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-300 text-base text-center w-full rounded-md ${
        isInCart 
          ? 'bg-green-600 border-green-600 text-white cursor-not-allowed' 
          : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
      } ${className}`}
    >
      {isInCart ? '✓ Déjà au panier' : 'Ajouter au panier'}
    </button>
  );
}