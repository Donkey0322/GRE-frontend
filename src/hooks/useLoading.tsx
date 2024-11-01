import { createContext, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (prev: boolean) => void;
}

const initialValue: LoadingContextType = {
  loading: false,
  setLoading: () => {
    console.log("initial");
  },
};

export const LoadingContext = createContext<LoadingContextType>(initialValue);

const useLoading = () => useContext(LoadingContext);

function LoadingProvider({ children }: { children?: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export { useLoading, LoadingProvider };
