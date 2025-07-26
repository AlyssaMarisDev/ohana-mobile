import { useQuery } from '@tanstack/react-query';
import { TagService, Tag } from '../services/TagService';

const tagService = new TagService();

export const useTodayTags = (householdId: string) => {
  return useQuery<Tag[], Error>({
    queryKey: ['today-tags', householdId],
    queryFn: () => tagService.getTags(householdId),
    enabled: !!householdId, // Only fetch when householdId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for today screen
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
