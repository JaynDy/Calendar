import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedEvent) => {
      const { id } = updatedEvent;
      return axios.put(`${API_URL}/updateEvent/${id}`, updatedEvent);
    },

    onMutate: async (updatedEvent) => {
      const { id } = updatedEvent;
      console.log("useUpdateEvent:", updatedEvent);
      await queryClient.cancelQueries(["events"]);

      const previousEvents = queryClient.getQueryData(["events"]);

      queryClient.setQueryData(["events"], (old) => {
        return old
          ? old.map((event) =>
              event.id === id
                ? {
                    ...event,
                    ...updatedEvent,
                  }
                : event
            )
          : [];
      });
      return { previousEvents };
    },

    onSettled: () => {
      queryClient.invalidateQueries(["events"]);
    },

    onError: (err, variables, context) => {
      console.error("Error in updateEvent mutation:", err);
      queryClient.setQueryData(["events"], context.previousEvents);
    },
  });
};
