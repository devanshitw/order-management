import client from './client';
import { Category, MenuItem } from '../types';

export const menuApi = {
  getCategories: () =>
    client.get('/menu/categories') as Promise<Category[]>,

  getItems: (params?: {
    category_id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    client.get('/menu', { params }) as Promise<{
      items: MenuItem[];
      meta: { total: number; page: number; limit: number; total_pages: number };
    }>,

  getItem: (id: string) =>
    client.get(`/menu/${id}`) as Promise<MenuItem>,

  getRecommendations: () =>
    client.get('/menu/recommendations') as Promise<{ items: MenuItem[] }>,
};
