import { useQuery } from "@tanstack/react-query";
import { getHouseholds, Household } from "../services/householdService";
import { useAuth } from "../context/AuthContext";
import { useGlobalState } from "../context/GlobalStateContext";
import { useEffect } from "react";

export const useHouseholds = (shouldFetch: boolean = true) => {
  const { isAuthenticated } = useAuth();
  const { households, setHouseholds } = useGlobalState();

  // Fetch households
  const {
    data: fetchedHouseholds = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["households"],
    queryFn: getHouseholds,
    enabled: shouldFetch && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update global state when data is fetched
  useEffect(() => {
    if (fetchedHouseholds.length > 0) {
      setHouseholds(fetchedHouseholds);
    }
  }, [fetchedHouseholds, setHouseholds]);

  return {
    households: fetchedHouseholds.length > 0 ? fetchedHouseholds : households,
    isLoading,
    error,
    refetch,
  };
};
