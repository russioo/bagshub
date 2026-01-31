'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Upload, 
  Twitter, 
  Globe, 
  MessageCircle,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';

export default function LaunchPage() {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    description: '',
    image: null as File | null,
    twitter: '',
    website: '',
    telegram: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement Bags API token creation
    await new Promise(r => setTimeout(r, 2000));
    
    alert('Token launch feature coming soon! Requires Bags API key.');
    setLoading(false);
  };

  const isValid = form.name.length >= 2 && form.symbol.length >= 2 && form.symbol.length <= 10;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-bags-green to-bags-green-dark mb-4">
          <Rocket className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Launch Your Token</h1>
        <p className="text-muted-foreground">
          Create and deploy a new token on Solana through the Bags protocol
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s 
                ? 'bg-bags-green text-black' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-bags-green' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Token Details</CardTitle>
            <CardDescription>Basic information about your token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Token Image</label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Image</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 512x512 PNG or JPG
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Token Name *
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="My Awesome Token"
                required
              />
            </div>

            {/* Symbol */}
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium mb-2">
                Symbol *
              </label>
              <Input
                id="symbol"
                value={form.symbol}
                onChange={e => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                placeholder="TOKEN"
                maxLength={10}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                2-10 characters, will be uppercase
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Tell people about your token..."
                rows={4}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Social Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Optional - help people find your community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium mb-2">
                <Twitter className="h-4 w-4 inline mr-2" />
                Twitter
              </label>
              <Input
                id="twitter"
                value={form.twitter}
                onChange={e => setForm({ ...form, twitter: e.target.value })}
                placeholder="https://twitter.com/yourtoken"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-2">
                <Globe className="h-4 w-4 inline mr-2" />
                Website
              </label>
              <Input
                id="website"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourtoken.com"
              />
            </div>

            <div>
              <label htmlFor="telegram" className="block text-sm font-medium mb-2">
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Telegram
              </label>
              <Input
                id="telegram"
                value={form.telegram}
                onChange={e => setForm({ ...form, telegram: e.target.value })}
                placeholder="https://t.me/yourtoken"
              />
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <div className="flex gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Important</p>
            <p className="text-muted-foreground">
              Token creation requires a Bags API key and a connected Solana wallet. 
              Make sure you understand the fees and implications before launching.
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={!isValid || loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Token...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Launch Token
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By launching, you agree to the Bags terms of service
        </p>
      </form>
    </div>
  );
}
