import { authenticatedAxios } from '../../auth/utils/authenticatedAxios';

// Types for household data
export interface Household {
  id: string;
  name: string;
  description: string;
  createdBy: string;
}

// Get all households that the user has access to
export const getHouseholds = async (): Promise<Household[]> => {
  const response = await authenticatedAxios.get('/households');
  return response.data;
};
