import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => axios.post(`${API_URL}/deleteEvent`, { id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["events"]);
      const previousEvents = queryClient.getQueryData(["events"]);
      queryClient.setQueryData(["events"], (old) =>
        old.filter((event) => event.id !== id)
      );
      return { previousEvents };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["events"], context.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};
