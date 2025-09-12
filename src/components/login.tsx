// components/Login.tsx
'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { FiSmartphone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/lib/hooks/useAuth';
import { SaveButton } from './buttons/saveButton';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      login(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex">
        {/* Partie gauche - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 to-orange-700 items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <Image
                src="/images/art-icon.png" // Remplacez par votre icône
                alt="Arts Parlants"
                width={120}
                height={120}
                className="mx-auto mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">Arts Parlants</h1>
              <p className="text-orange-100 text-lg">
                Découvrez notre collection d'œuvres d'art exceptionnelles
              </p>
            </div>
            
            <div className="mt-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Accès sécurisé</h3>
                <p className="text-orange-100">
                  Connectez-vous pour accéder à la galerie et gérer les œuvres
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partie droite - Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Connexion
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Champ téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSmartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                  placeholder="+225 01 23 45 67 89"
                  required
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <SaveButton
                loading={loading}
                disabled={loading}
                // className="w-full py-3 text-lg"
              >
                Se connecter
              </SaveButton>
            </div>

            {/* Informations de test */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                Comptes de test :
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Admin:</strong> 0100000000 / admin123</p>
                <p><strong>Viewer:</strong> 0200000000 / viewer123</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}