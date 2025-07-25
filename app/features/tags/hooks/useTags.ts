import { useQuery } from '@tanstack/react-query';
import { TagService, Tag } from '../services/TagService';

const tagService = new TagService();

export const useTags = (householdId?: string) => {
  return useQuery<Tag[], Error>({
    queryKey: ['tags', householdId],
    queryFn: () => tagService.getTags(householdId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
