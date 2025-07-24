import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => axios.post(`${API_URL}/deleteCalendar`, { id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["calendars"]);
      const previousCalendars = queryClient.getQueryData(["calendars"]);
      queryClient.setQueryData(["calendars"], (old) =>
        old.filter((calendar) => calendar.id !== id)
      );
      return { previousCalendars };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["calendars"], context.previousCalendars);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["calendars"]);
    },
  });
};
