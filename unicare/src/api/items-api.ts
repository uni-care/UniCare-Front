import { axiosInstance } from './axios-instance';
import type {
  ItemResponse,
  CreateItemPayload,
  UpdateItemPayload,
  FavoriteResponse,
} from '@/types/items';

const BASE = '/api/v1/Items';

export const itemsApi = {
  /** GET /api/v1/Items — list all items */
  getAll: async (token?: string): Promise<ItemResponse[]> => {
    const { data } = await axiosInstance.get<{
      items: ItemResponse[];
      pageNumber: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }>(BASE, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data.items;
  },

  /** GET /api/v1/Items/:itemId — single item */
  getById: async (itemId: string, token?: string): Promise<ItemResponse> => {
    const { data } = await axiosInstance.get<ItemResponse>(
      `${BASE}/${itemId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
    );
    return data;
  },

  /** POST /api/v1/Items — create a new item */
  create: async (
    payload: CreateItemPayload,
    token: string,
  ): Promise<ItemResponse> => {
    const { data } = await axiosInstance.post<ItemResponse>(BASE, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  /** PUT /api/v1/Items/:itemId — update an existing item */
  update: async (
    itemId: string,
    payload: UpdateItemPayload,
    token: string,
  ): Promise<ItemResponse> => {
    const { data } = await axiosInstance.put<ItemResponse>(
      `${BASE}/${itemId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  },

  /** PATCH /api/v1/Items/:itemId — partially update an existing item */
  patch: async (
    itemId: string,
    payload: UpdateItemPayload,
    token: string,
  ): Promise<ItemResponse> => {
    const { data } = await axiosInstance.patch<ItemResponse>(
      `${BASE}/${itemId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  },

  /** POST /api/v1/Items/:itemId/favorite — toggle favorite */
  toggleFavorite: async (
    itemId: string,
    token: string,
  ): Promise<FavoriteResponse> => {
    const { data } = await axiosInstance.post<FavoriteResponse>(
      `${BASE}/${itemId}/favorite`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  },

  /** POST /api/v1/Items/:itemId/images — upload item image */
  uploadImage: async (
    itemId: string,
    file: File,
    token: string,
  ): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post<{
      url: string;
      publicId: string;
    }>(`${BASE}/${itemId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
