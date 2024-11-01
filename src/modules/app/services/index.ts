import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import type { QuestionType } from "@/types";
import type { RefetchOptions, UseMutationOptions } from "@tanstack/react-query";

import { useLoading } from "@/hooks/useLoading";
import { queryClient } from "@/provider/query";
import instance from "@/services/axios.config";

export const useFetch = () => {
  const { pathname } = useLocation();
  return useQuery({
    queryKey: ["/", pathname],
    queryFn: () =>
      instance
        .get<QuestionType[]>("/", { params: { chapter: pathname.slice(1) } })
        .then((res) => res.data),
  });
};

export const useInput = (
  props?: UseMutationOptions<
    RefetchOptions,
    Error,
    { index: number; input: string }
  >
) => {
  const { pathname } = useLocation();
  return useMutation({
    ...props,
    mutationKey: ["input"],
    mutationFn: ({ index, input }: { index: number; input: string }) =>
      instance
        .put<RefetchOptions>("/", { chapter: pathname.slice(1), index, input })
        .then((res) => res.data),
  });
};

export const useNote = (
  index: number,
  props?: UseMutationOptions<RefetchOptions, Error>
) => {
  const { pathname } = useLocation();
  return useMutation({
    ...props,
    mutationKey: ["note"],
    mutationFn: () =>
      instance
        .put<RefetchOptions>("/note", { chapter: pathname.slice(1), index })
        .then((res) => res.data),
    onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
    },
  });
};

interface MutationProps extends UseMutationOptions<RefetchOptions> {
  invalidateHooks?: {
    isLoading: boolean;
    start: () => void;
    end: () => void;
  };
}

export const useRefetch = (props?: MutationProps) => {
  const { setLoading } = useLoading();
  const { pathname } = useLocation();
  const mutation = useMutation({
    ...props,
    mutationKey: ["refetch"],
    mutationFn: () =>
      instance
        .post<RefetchOptions>("/", { chapter: pathname.slice(1) })
        .then((res) => res.data),
    onMutate: () => setLoading(true),
    onError: () => setLoading(false),
    async onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
      await queryClient.invalidateQueries({ queryKey: ["/", pathname] });
      setLoading(false);
    },
  });
  return mutation;
};

export const useClean = (props?: MutationProps) => {
  const { setLoading } = useLoading();
  const { pathname } = useLocation();
  const mutation = useMutation({
    ...props,
    mutationKey: ["clean"],
    mutationFn: () =>
      instance
        .patch<RefetchOptions>("/", { chapter: pathname.slice(1) })
        .then((res) => res.data),
    onMutate: () => setLoading(true),
    onError: () => setLoading(false),
    async onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
      await queryClient.invalidateQueries({ queryKey: ["/", pathname] });
      setLoading(false);
    },
  });
  return mutation;
};

export const useShuffle = (props?: MutationProps) => {
  const { setLoading } = useLoading();
  const { pathname } = useLocation();
  const mutation = useMutation({
    ...props,
    mutationKey: ["shuffle"],
    mutationFn: () =>
      instance
        .put<RefetchOptions>("/shuffle", { chapter: pathname.slice(1) })
        .then((res) => res.data),
    onMutate: () => setLoading(true),
    onError: () => setLoading(false),
    async onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
      await queryClient.invalidateQueries({ queryKey: ["/", pathname] });
      setLoading(false);
    },
  });
  return mutation;
};
