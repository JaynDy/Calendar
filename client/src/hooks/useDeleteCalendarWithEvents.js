import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useDeleteCalendarWithEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (calendarId) => {
      await axios.post(`${API_URL}/deleteAllCalendarEvents`, {
        calendarId,
      });
    },

    onMutate: async (calendarId) => {
      await queryClient.cancelQueries(["events"]);
      const previousEvents = queryClient.getQueryData(["events"]);

      queryClient.setQueryData(["events"], (old) =>
        old ? old.filter((event) => event.calendar.id !== calendarId) : []
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
