import { useQuery } from '@tanstack/react-query';
import { memberService } from '../services/MemberService';

export const useHouseholdMembers = (
  householdId: string,
  shouldFetch: boolean = true
) => {
  return useQuery({
    queryKey: ['household-members', householdId],
    queryFn: () => memberService.getHouseholdMembers(householdId),
    enabled: shouldFetch && !!householdId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
