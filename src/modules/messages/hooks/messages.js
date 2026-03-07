import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { createMessage, getMessages } from "../action";

export const prefetchMessage = async (queryClient, projectId) => {
  await queryClient.prefetchQuery({
    queryKeys: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
  });
};

export const useGetMessages = (projectId) => {
  return useQuery({
    queryKeys: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
    refetchInterval: (data) => {
      return data?.length ? 5000 : false;
    },
  });
};

export const useCreateMessages = (value, projectId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createMessage(value, projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", projectId],
      });
    },
  });
};
