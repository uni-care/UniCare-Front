/* ─── API response shape from GET /api/v1/Items ─── */
export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  itemType: number; // 1 = ForSale, 2 = ForRent
  status: string;
  ownerId: string;
  ownerName: string;
  availableFrom: string;
  availableTo: string;
  location: string;
  imageUrls: string[];
  isFavorited: boolean;
  favoriteCount: number;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

/* ─── POST/PUT request body ─── */
export interface CreateItemPayload {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  availableFrom?: string;
  availableTo?: string;
  location?: string;
  imageUrls?: string[];
}

export interface UpdateItemPayload {
  title?: string;
  description?: string;
  price?: number;
  itemType?: number;
  currency?: string;
  categoryId?: string;
  status?: string;
  availableFrom?: string;
  availableTo?: string;
  location?: string;
  imageUrls?: string[];
}

/* ─── Favorite toggle response ─── */
export interface FavoriteResponse {
  isFavorited: boolean;
  message: string;
}
