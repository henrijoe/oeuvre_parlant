// src/app/test-login/page.tsx
'use client';
import { useState } from 'react';

export default function TestLogin() {
  const [email, setEmail] = useState('superadmin@artsparlants.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Login API</h1>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block mb-2">Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        
        <div>
          <label className="block mb-2">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tester la connexion
        </button>
      </div>

      {result && (
        <div className="border p-4">
          <h2 className="font-bold">Résultat:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-bold">Comptes de test:</h3>
        <ul className="list-disc pl-5">
          <li>superadmin@artsparlants.com / admin123</li>
          <li>admin@artsparlants.com / admin123</li>
          <li>user@example.com / user123</li>
        </ul>
      </div>
    </div>
  );
}