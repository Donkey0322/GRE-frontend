import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";

import type { QuestionType } from "@/types";
import type { RefetchOptions, UseMutationOptions } from "@tanstack/react-query";

import { useLoading } from "@/hooks/useLoading";
import { queryClient } from "@/provider/query";
import instance from "@/services/axios.config";

export const useFetch = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const shuffle = searchParams.get("shuffle") === "true";
  const chapter = pathname.slice(1);

  return useQuery({
    queryKey: ["/", pathname],
    queryFn: () =>
      instance
        .get<QuestionType[]>(`/${chapter}`, {
          params: { shuffle },
        })
        .then((res) => res.data),
  });
};

export const useInput = (
  index: number,
  props?: UseMutationOptions<RefetchOptions, Error, { input: string }>
) => {
  const { pathname } = useLocation();
  const chapter = pathname.slice(1);

  return useMutation({
    ...props,
    mutationKey: ["input", chapter, index],
    mutationFn: ({ input }) =>
      instance
        .patch<RefetchOptions>(`/${chapter}/${index}/input`, {
          input,
        })
        .then((res) => res.data),
  });
};

export const useNote = (
  index: number,
  props?: UseMutationOptions<RefetchOptions, Error>
) => {
  const { pathname } = useLocation();
  const chapter = pathname.slice(1);

  return useMutation({
    ...props,
    mutationKey: ["note", chapter, index],
    mutationFn: () =>
      instance
        .patch<RefetchOptions>(`/${chapter}/${index}/note`)
        .then((res) => res.data),
  });
};

export const useRefetch = (props?: UseMutationOptions<RefetchOptions>) => {
  const { setLoading } = useLoading();
  const { pathname } = useLocation();
  const chapter = pathname.slice(1);

  return useMutation({
    ...props,
    mutationKey: [chapter],
    mutationFn: () =>
      instance.post<RefetchOptions>(`/${chapter}`).then((res) => res.data),
    onMutate: () => setLoading(true),
    onError: () => setLoading(false),
    async onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
      await queryClient.invalidateQueries({ queryKey: ["/", pathname] });
      setLoading(false);
    },
  });
};

export const useClean = (
  props?: UseMutationOptions<RefetchOptions, Error, { deep: boolean }>
) => {
  const { setLoading } = useLoading();
  const { pathname } = useLocation();
  const chapter = pathname.slice(1);

  return useMutation({
    ...props,
    mutationKey: ["clean"],
    mutationFn: ({ deep }: { deep: boolean }) =>
      instance
        .patch<RefetchOptions>(`/${chapter}/clean`, null, {
          params: { deep },
        })
        .then((res) => res.data),
    onMutate: () => setLoading(true),
    onError: () => setLoading(false),
    async onSuccess(data, variables, context) {
      props?.onSuccess?.(data, variables, context);
      await queryClient.invalidateQueries({ queryKey: ["/", pathname] });
      setLoading(false);
    },
  });
};
