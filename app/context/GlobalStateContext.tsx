import React, { createContext, useContext, useState, ReactNode } from "react";
import { Member } from "../services/memberService";

type GlobalStateType = {
  member: Member | null;
  setMember: (member: Member | null) => void;
  clearMember: () => void;
  clearAllState: () => void;
};

const GlobalStateContext = createContext<GlobalStateType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member | null>(null);

  const clearMember = () => {
    setMember(null);
  };

  const clearAllState = () => {
    setMember(null);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        member,
        setMember,
        clearMember,
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
    throw new Error("useGlobalState must be used within GlobalStateProvider");
  return context;
};
