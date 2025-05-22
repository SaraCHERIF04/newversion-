import { get, post, put, del } from '@/utils/apiHelpers';
import { MaitreOuvrage } from '@/interfaces/MaitreOuvrageInterface';

const BASE_URL = '/maitre-ouvrage/';

export const  maitreOuvrage  = {
  // Fetch all Maitre Ouvrages
  fetchAll: async (): Promise<MaitreOuvrage[]> => {
    return await get<MaitreOuvrage[]>(`${BASE_URL}`);
  },

  // Get a single Maitre Ouvrage by ID
  fetchById: async (id: number): Promise<MaitreOuvrage> => {
    return await get<MaitreOuvrage>(`${BASE_URL}/${id}`);
  },

  // Create a new Maitre Ouvrage
  create: async (data: Partial<MaitreOuvrage>): Promise<MaitreOuvrage> => {
    return await post<MaitreOuvrage>(`${BASE_URL}`, data);
  },

  // Update an existing Maitre Ouvrage
  update: async (id: number, data: Partial<MaitreOuvrage>): Promise<MaitreOuvrage> => {
    return await put<MaitreOuvrage>(`${BASE_URL}/${id}`, data);
  },

  // Delete a Maitre Ouvrage by ID
  delete: async (id: number): Promise<{ message: string }> => {
    return await del<{ message: string }>(`${BASE_URL}${id}`);
  }
};

export default maitreOuvrage;
