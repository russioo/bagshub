'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Loader2, ArrowLeft, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = 
    form.username.length >= 3 && 
    form.password.length >= 6 && 
    form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email || undefined,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bags-green to-bags-green-dark flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold">B</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join BagsHub to track your favorite tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username *
              </label>
              <Input
                id="username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Choose a username"
                required
                minLength={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                At least 3 characters
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email (optional)
              </label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password *
              </label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                At least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs text-bags-green mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={loading || !isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
