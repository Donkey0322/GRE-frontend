import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { QueryClientProviderProps } from "@tanstack/react-query";

import { LoadingProvider } from "@/hooks/useLoading";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export default function QueryProvider({
  children,
}: Pick<QueryClientProviderProps, "children">) {
  return (
    <LoadingProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LoadingProvider>
  );
}
