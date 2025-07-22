import { BaseService } from '@/app/common/utils/BaseService';
import { authenticatedAxios } from '@/app/features/auth/utils/authenticatedAxios';

export interface Household {
  id: string;
  name: string;
  description: string;
  createdBy: string;
}

export class HouseholdService extends BaseService {
  constructor() {
    super(authenticatedAxios);
  }

  async getHouseholds(): Promise<Household[]> {
    const response = await this.get('/households');
    return response.data;
  }
}

export const householdService = new HouseholdService();
