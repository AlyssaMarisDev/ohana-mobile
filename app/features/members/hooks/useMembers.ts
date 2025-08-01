import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService, Member } from '../services/MemberService';
import { useAuth } from '../../auth/context/AuthContext';
import { logger } from '@/app/common/utils/logger';

export const useMembers = (shouldFetch: boolean = true) => {
  const queryClient = useQueryClient();
  const { memberId, isAuthenticated } = useAuth();

  // Fetch member data
  const {
    data: member,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => memberService.getMember(memberId!),
    enabled: shouldFetch && isAuthenticated && !!memberId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update member with optimistic updates
  const updateMemberMutation = useMutation({
    mutationFn: async ({
      memberId,
      data,
    }: {
      memberId: string;
      data: Omit<Member, 'id' | 'email'>;
    }) => {
      return await memberService.updateMember(memberId, data);
    },

    // Optimistic update
    onMutate: async ({ memberId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['member', memberId] });

      // Snapshot the previous value
      const previousMember = queryClient.getQueryData(['member', memberId]) as
        | Member
        | undefined;

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['member', memberId],
        (old: Member | undefined) => {
          if (!old) return old;
          return { ...old, ...data };
        }
      );

      // Return a context object with the snapshotted value
      return { previousMember };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (
      err,
      variables,
      context: { previousMember?: Member } | undefined
    ) => {
      logger.error('Member update failed:', err);
      if (context?.previousMember) {
        queryClient.setQueryData(
          ['member', variables.memberId],
          context.previousMember
        );
      }
      // Show error to user
      alert(
        `Failed to update member: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    },

    // Always refetch after error or success to ensure data consistency
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['member', variables.memberId],
      });
    },
  });

  const updateMemberData = (data: Omit<Member, 'id' | 'email'>) => {
    if (!memberId) {
      logger.error('No member ID available for update');
      return;
    }

    updateMemberMutation.mutate({
      memberId,
      data,
    });
  };

  return {
    member,
    isLoading,
    error,
    updateMemberData,
    refetch,
  };
};
