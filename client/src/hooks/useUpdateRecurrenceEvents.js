import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useUpdateRecurrenceEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedEvents) => {
      const { recurrenceId } = updatedEvents[0];
      return axios.put(
        `${API_URL}/updateAllRecurrenceEvents/${recurrenceId}`,
        updatedEvents
      );
    },

    onMutate: async (updatedEvents) => {
      const { recurrenceId } = updatedEvents[0];
      console.log("useUpdateEvents:", updatedEvents);
      await queryClient.cancelQueries(["events"]);

      const previousEvents = queryClient.getQueryData(["events"]);

      queryClient.setQueryData(["events"], (old) => {
        return old
          ? old.map((event) =>
              event.recurrenceId === recurrenceId
                ? {
                    ...event,
                    ...updatedEvents.find(
                      (updatedEvent) => updatedEvent.id === event.id
                    ),
                  }
                : event
            )
          : [];
      });
      return { previousEvents };
    },

    onSettled: (data) => {
      console.log("Updated events response:", data);
      queryClient.invalidateQueries(["events"]);
    },

    onError: (err, variables, context) => {
      console.error("Error in updateEvent mutation:", err);
      queryClient.setQueryData(["events"], context.previousEvents);
    },
  });
};
