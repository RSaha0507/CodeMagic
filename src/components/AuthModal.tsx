import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, csrfToken: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { email, password, name } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Authentication failed.');
      if (!data.user || typeof data.csrfToken !== 'string') throw new Error('The server returned an invalid authentication response.');
      onLoginSuccess(data.user, data.csrfToken);
      onClose();
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md gap-6 p-6 sm:p-7">
        <DialogHeader className="items-center text-center">
          <span className="auth-brand-mark" aria-hidden="true"><img src="/brand/codemagic-official.png" alt="" /></span>
          <DialogTitle>{isRegister ? 'Create an account' : 'Sign in to CodeMagic'}</DialogTitle>
          <DialogDescription>{isRegister ? 'Track your learning progress and contribute practice problems.' : 'Continue your learning path and manage your contributions.'}</DialogDescription>
        </DialogHeader>
        {error && <div role="alert" className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && <label className="block space-y-1.5 text-sm font-medium text-zinc-300">Display name<Input required value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Ada Lovelace" /></label>}
          <label className="block space-y-1.5 text-sm font-medium text-zinc-300">Email address<Input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-300">Password<Input type="password" required minLength={12} value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 12 characters" /></label>
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Working...' : isRegister ? 'Create account' : 'Sign in'}</Button>
        </form>
        {isLocalDevelopment && !isRegister && <div className="demo-credentials"><span>Development demo</span><p>Email: <code>demo@codemagic.local</code></p><p>Password: <code>demo-password-2026</code></p></div>}
        <p className="text-center text-sm text-zinc-500">{isRegister ? 'Already have an account?' : 'New to CodeMagic?'}{' '}<button type="button" onClick={() => { setIsRegister(value => !value); setError(null); }} className="font-medium text-violet-300 hover:text-violet-200 focus:outline-none focus:underline">{isRegister ? 'Sign in' : 'Create one'}</button></p>
      </DialogContent>
    </Dialog>
  );
}
