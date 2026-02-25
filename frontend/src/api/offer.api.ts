import client from './client';
import { Offer } from '../types';

export const offerApi = {
  getActiveOffers: () =>
    client.get('/offers') as Promise<{ message: string; offers: Offer[] }>,
};
