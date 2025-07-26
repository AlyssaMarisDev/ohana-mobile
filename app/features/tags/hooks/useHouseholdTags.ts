import { useQuery } from '@tanstack/react-query';
import { TagService, Tag } from '../services/TagService';

const tagService = new TagService();

export const useHouseholdTags = (householdId: string) => {
  return useQuery<Tag[], Error>({
    queryKey: ['household-tags', householdId],
    queryFn: () => tagService.getTags(householdId),
    enabled: !!householdId, // Only fetch when householdId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
