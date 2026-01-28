import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BagsToken, LeaderboardFilters, SearchFilters } from '@/types';

// Fetch trending tokens
export function useTrendingTokens(timeFrame: string = '24h') {
  return useQuery({
    queryKey: ['tokens', 'trending', timeFrame],
    queryFn: async () => {
      const response = await fetch(`/api/tokens?type=trending&timeFrame=${timeFrame}`);
      if (!response.ok) throw new Error('Failed to fetch trending tokens');
      const data = await response.json();
      return data.data?.tokens as BagsToken[];
    },
  });
}

// Fetch token by mint address
export function useToken(mint: string) {
  return useQuery({
    queryKey: ['token', mint],
    queryFn: async () => {
      const response = await fetch(`/api/tokens/${mint}?include=holders,transactions`);
      if (!response.ok) throw new Error('Failed to fetch token');
      const data = await response.json();
      return data.data;
    },
    enabled: !!mint,
  });
}

// Search tokens
export function useSearchTokens(filters: SearchFilters) {
  return useQuery({
    queryKey: ['tokens', 'search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.set('search', filters.query);
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.pageSize) params.set('limit', filters.pageSize.toString());
      
      const response = await fetch(`/api/tokens?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search tokens');
      const data = await response.json();
      return data.data?.tokens as BagsToken[];
    },
    enabled: filters.query.length > 0,
  });
}

// Fetch leaderboard
export function useLeaderboard(filters: LeaderboardFilters) {
  return useQuery({
    queryKey: ['tokens', 'leaderboard', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', filters.type);
      params.set('timeFrame', filters.timeFrame);
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.pageSize) params.set('limit', filters.pageSize.toString());
      
      const response = await fetch(`/api/tokens?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      return data.data?.tokens as BagsToken[];
    },
  });
}

// Fetch new launches
export function useNewLaunches(limit: number = 20) {
  return useQuery({
    queryKey: ['tokens', 'new', limit],
    queryFn: async () => {
      const response = await fetch(`/api/tokens?type=new&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch new launches');
      const data = await response.json();
      return data.data?.tokens as BagsToken[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Create token mutation
export function useCreateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokenData: {
      name: string;
      symbol: string;
      description?: string;
      image?: File;
      twitter?: string;
      telegram?: string;
      website?: string;
      initialBuyAmount?: number;
    }) => {
      // First upload image if provided
      let imageUrl: string | undefined;
      if (tokenData.image) {
        const formData = new FormData();
        formData.append('file', tokenData.image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Create token
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tokenData,
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to create token');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate token lists to show new token
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });
}
