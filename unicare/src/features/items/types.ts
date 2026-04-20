/* ─── API response shape from GET /api/v1/Items ─── */
export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  ownerId: string;
  ownerName: string;
  availableFrom: string;
  availableTo: string;
  location: string;
  imageUrls: string[];
  isFavorited: boolean;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}

/* ─── POST/PUT request body ─── */
export interface CreateItemPayload {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId?: string;
  availableFrom?: string;
  availableTo?: string;
  location?: string;
  imageUrls?: string[];
}

export interface UpdateItemPayload extends CreateItemPayload {
  status?: string;
}

/* ─── Favorite toggle response ─── */
export interface FavoriteResponse {
  isFavorited: boolean;
  message: string;
}
