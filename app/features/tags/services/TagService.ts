import { BaseService } from '../../../common/utils/BaseService';
import { authenticatedAxios } from '../../auth/utils/authenticatedAxios';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TagsResponse {
  tags: Tag[];
}

export class TagService extends BaseService {
  constructor() {
    super(authenticatedAxios);
  }

  async getTags(householdId: string): Promise<Tag[]> {
    const url = `/households/${householdId}/tags`;
    const response = await this.get<TagsResponse>(url);
    return response.data.tags;
  }
}
