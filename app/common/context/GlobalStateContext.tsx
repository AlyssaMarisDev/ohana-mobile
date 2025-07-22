import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Member } from '../../features/members/services/memberService';
import { Household } from '../../features/households/services/householdService';

type GlobalStateType = {
  member: Member | null;
  setMember: (member: Member | null) => void;
  clearMember: () => void;
  households: Household[];
  setHouseholds: (households: Household[]) => void;
  clearHouseholds: () => void;
  clearAllState: () => void;
};

const GlobalStateContext = createContext<GlobalStateType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);

  const clearMember = () => {
    setMember(null);
  };

  const clearHouseholds = () => {
    setHouseholds([]);
  };

  const clearAllState = () => {
    setMember(null);
    setHouseholds([]);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        member,
        setMember,
        clearMember,
        households,
        setHouseholds,
        clearHouseholds,
        clearAllState,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context)
    throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
};
