import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useDeleteRecurrenceEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recurrenceId) => {
      console.log("recurrenceId", recurrenceId);
      await axios.post(`${API_URL}/deleteAllRecurrenceEvents`, {
        recurrenceId,
      });
    },
    onMutate: async (recurrenceId) => {
      await queryClient.cancelQueries(["events"]);
      const previousEvents = queryClient.getQueryData(["events"]);

      queryClient.setQueryData(["events"], (old) =>
        old ? old.filter((event) => event.recurrenceId !== recurrenceId) : []
      );
      return { previousEvents };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["events"], context.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};
