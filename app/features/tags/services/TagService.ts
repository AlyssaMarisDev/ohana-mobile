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

  async createTag(householdId: string, tagData: Omit<Tag, 'id'>): Promise<Tag> {
    const url = `/households/${householdId}/tags`;
    const response = await this.post<Tag>(url, tagData);
    return response.data;
  }

  async updateTag(
    householdId: string,
    tagId: string,
    tagData: Omit<Tag, 'id'>
  ): Promise<Tag> {
    const url = `/households/${householdId}/tags/${tagId}`;
    const response = await this.put<Tag>(url, tagData);
    return response.data;
  }

  async deleteTag(householdId: string, tagId: string): Promise<void> {
    const url = `/households/${householdId}/tags/${tagId}`;
    await this.delete(url);
  }
}
