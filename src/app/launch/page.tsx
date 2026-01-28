'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Upload, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export default function LaunchTokenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    twitter: '',
    telegram: '',
    website: '',
    initialBuy: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to launch a token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual token creation via API
      console.log('Creating token:', { ...formData, image });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Redirect to success or token page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <Rocket size={24} className="text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold">Launch Token</h1>
        </div>
        <p className="text-gray-400">
          Create and deploy your own token on Solana via the Bags API
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-6 border-brand-800/50 bg-brand-900/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info size={20} className="text-brand-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-brand-200">
              Tokens are created on Solana via the Bags protocol.
            </p>
            <p className="text-gray-400 mt-1">
              You'll need SOL for gas fees and optional initial liquidity.
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Token Details</CardTitle>
            <CardDescription>Basic information about your token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-loss/10 border border-loss/20 text-loss text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Token Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={24} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="secondary" size="sm" asChild>
                      <span>Upload Image</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Token Name"
                placeholder="e.g. Moon Rocket"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Symbol"
                placeholder="e.g. MOON"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe your token..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Optional links to your project's socials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Website"
              placeholder="https://yourtoken.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Twitter"
                placeholder="@handle"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
              <Input
                label="Telegram"
                placeholder="t.me/yourgroup"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Initial Purchase (Optional)</CardTitle>
            <CardDescription>Buy tokens immediately after creation</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Amount in SOL"
              type="number"
              placeholder="0.0"
              step="0.01"
              min="0"
              value={formData.initialBuy}
              onChange={(e) => setFormData({ ...formData, initialBuy: e.target.value })}
              helperText="Amount of SOL to spend buying your token at launch"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            <Rocket size={18} className="mr-2" />
            Launch Token
          </Button>
        </div>
      </form>
    </div>
  );
}
