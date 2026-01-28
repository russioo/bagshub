import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import type { Bookmark, BagsToken } from '@/types';

// Fetch user's bookmarks
export function useBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      const data = await response.json();
      return data.bookmarks as Bookmark[];
    },
    enabled: !!user,
  });
}

// Get set of bookmarked mint addresses for quick lookup
export function useBookmarkedMints() {
  const { data: bookmarks } = useBookmarks();
  return new Set(bookmarks?.map((b) => b.tokenMint) || []);
}

// Add bookmark
export function useAddBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tokenMint: string) => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenMint }),
      });
      if (!response.ok) throw new Error('Failed to add bookmark');
      return response.json();
    },
    onMutate: async (tokenMint) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['bookmarks', user?.id] });
      const previous = queryClient.getQueryData<Bookmark[]>(['bookmarks', user?.id]);
      
      queryClient.setQueryData<Bookmark[]>(['bookmarks', user?.id], (old = []) => [
        ...old,
        { id: 'temp', tokenMint, createdAt: new Date().toISOString() },
      ]);

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['bookmarks', user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });
}

// Remove bookmark
export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tokenMint: string) => {
      const response = await fetch(`/api/bookmarks/${tokenMint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove bookmark');
      return response.json();
    },
    onMutate: async (tokenMint) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['bookmarks', user?.id] });
      const previous = queryClient.getQueryData<Bookmark[]>(['bookmarks', user?.id]);
      
      queryClient.setQueryData<Bookmark[]>(['bookmarks', user?.id], (old = []) =>
        old.filter((b) => b.tokenMint !== tokenMint)
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['bookmarks', user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
    },
  });
}

// Toggle bookmark (add or remove)
export function useToggleBookmark() {
  const bookmarkedMints = useBookmarkedMints();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  return {
    toggle: (tokenMint: string) => {
      if (bookmarkedMints.has(tokenMint)) {
        removeBookmark.mutate(tokenMint);
      } else {
        addBookmark.mutate(tokenMint);
      }
    },
    isBookmarked: (tokenMint: string) => bookmarkedMints.has(tokenMint),
    isLoading: addBookmark.isPending || removeBookmark.isPending,
  };
}
