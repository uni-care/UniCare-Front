import { axiosInstance } from "@/lib/api/axios-instance";
import type {
  ItemResponse,
  CreateItemPayload,
  UpdateItemPayload,
  FavoriteResponse,
} from "@/features/items/types";

const BASE = "/api/v1/Items";

export const itemsApi = {
  /** GET /api/v1/Items — list all items */
  getAll: async (): Promise<ItemResponse[]> => {
    const { data } = await axiosInstance.get<ItemResponse[]>(BASE);
    return data;
  },

  /** GET /api/v1/Items/:itemId — single item */
  getById: async (itemId: string): Promise<ItemResponse> => {
    const { data } = await axiosInstance.get<ItemResponse>(`${BASE}/${itemId}`);
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
};
