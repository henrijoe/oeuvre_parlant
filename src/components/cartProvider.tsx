// components/CartProvider.tsx
'use client';

import { CartProvider } from 'react-use-cart';

export default function AppCartProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}