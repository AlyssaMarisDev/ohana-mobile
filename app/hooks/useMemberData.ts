import { useEffect, useState } from "react";
import { getMember } from "../services/memberService";
import { useAuth } from "../context/AuthContext";
import { useGlobalState } from "../context/GlobalStateContext";

export const useMemberData = (shouldFetch: boolean = true) => {
  const { member, setMember } = useGlobalState();
  const { memberId, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMemberData = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated && memberId) {
        const memberData = await getMember(memberId);
        setMember(memberData);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      // Keep showing placeholder data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && !member && isAuthenticated && memberId) {
      fetchMemberData();
    }
  }, [shouldFetch, member, isAuthenticated, memberId]);

  return {
    member: member,
    isLoading,
    fetchMemberData, // Expose this in case manual refresh is needed
  };
};
