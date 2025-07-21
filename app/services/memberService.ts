import axios from "axios";
import { API_CONFIG } from "../config/constants";
import { authenticatedAxios } from "../utils/authenticatedAxios";

// Types for member data
export interface Member {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
}

// Get member by ID
export const getMember = async (memberId: string): Promise<Member> => {
  const response = await authenticatedAxios.get(`/members/${memberId}`);
  return response.data;
};

// Update member by ID
export const updateMember = async (
  memberId: string,
  memberData: Omit<Member, "id" | "email">
): Promise<Member> => {
  const response = await authenticatedAxios.put(
    `/members/${memberId}`,
    memberData
  );
  return response.data;
};
