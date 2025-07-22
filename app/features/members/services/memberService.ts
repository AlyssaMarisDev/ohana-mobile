import { BaseService } from '@/app/common/utils/BaseService';
import { authenticatedAxios } from '@/app/features/auth/utils/authenticatedAxios';

export interface Member {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
}

export class MemberService extends BaseService {
  constructor() {
    super(authenticatedAxios);
  }

  async getMember(memberId: string): Promise<Member> {
    const response = await this.get(`/members/${memberId}`);
    return response.data;
  }

  async updateMember(
    memberId: string,
    memberData: Omit<Member, 'id' | 'email'>
  ): Promise<Member> {
    const response = await this.put(`/members/${memberId}`, memberData);
    return response.data;
  }
}

export const memberService = new MemberService();
