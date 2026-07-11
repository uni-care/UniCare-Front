'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';
import ItemCard from '@/components/marketplace/ItemCard';
import {
  toMarketplaceItem,
  type MarketplaceItem,
} from '@/app/[locale]/(main)/(buyer)/marketplace/data';
import { itemsApi } from '@/api/items-api';
import { useAuth, getAuthToken } from '@/hooks/useAuth';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { MdOutlineFavoriteBorder, MdArrowBack } from 'react-icons/md';

export default function WishlistPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for useAuth's query to resolve (token restoration + profile fetch)
    // before deciding whether the user is authenticated.
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setIsLoading(false);
      setItems([]);
      return;
    }

    let cancelled = false;

    async function fetchWishlist() {
      const token = getAuthToken();
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const apiItems = await itemsApi.getAll(token);
        if (!cancelled) {
          const favorited = apiItems
            .filter((item) => item.isFavorited)
            .map((item) => toMarketplaceItem(item, locale));
          setItems(favorited);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchWishlist();
    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, isAuthenticated, locale]);

  const handleFavoriteToggle = async (itemId: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await itemsApi.toggleFavorite(itemId, token);
      if (!res.isFavorited) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      }
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update favorite status.');
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className='bg-neutral-50 min-h-screen pt-28 pb-20 flex items-center justify-center'>
        <div className='size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='bg-neutral-50 min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4 text-center px-4'>
        <MdOutlineFavoriteBorder className='text-6xl text-neutral-300' />
        <h1 className='text-2xl font-bold text-neutral-800'>
          {isAr
            ? 'يرجى تسجيل الدخول لعرض المفضلة'
            : 'Please sign in to view your wishlist'}
        </h1>
        <Link
          href='/login'
          className='bg-primary text-white px-8 py-3.5 rounded-full font-bold shadow-md transition-all'
        >
          {isAr ? 'تسجيل الدخول' : 'Sign In'}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8',
        isAr ? 'text-right' : 'text-left',
      )}
    >
      <div className='max-w-7xl mx-auto'>
        <div className='mb-10'>
          <h1 className='text-5xl font-bold tracking-tight text-neutral-900 mb-2'>
            {isAr ? 'المفضلة' : 'Wishlist'}
          </h1>
          <p className='text-lg text-neutral-500 max-w-2xl'>
            {isAr
              ? 'الموارد التي أضفتها إلى المفضلة'
              : "Resources you've saved for later"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 gap-4'>
            <MdOutlineFavoriteBorder className='text-6xl text-neutral-300' />
            <p className='text-neutral-500 font-medium text-lg'>
              {isAr ? 'لا توجد عناصر في المفضلة' : 'No favorites yet'}
            </p>
            <Link
              href='/marketplace'
              className='inline-flex items-center gap-2 text-primary font-bold'
            >
              <MdArrowBack className={isAr ? 'rotate-180' : ''} />
              {isAr ? 'تصفح المتجر' : 'Browse Marketplace'}
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16'>
            {items.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                onFavoriteClick={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
