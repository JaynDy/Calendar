import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useAddCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCalendar) => {
      console.log("Adding calendar:", newCalendar);
      await axios.post(`${API_URL}/addCalendar`, newCalendar);
    },
    onMutate: async (newCalendar) => {
      await queryClient.cancelQueries({ queryKey: ["calendars"] });
      const previousCalendars = queryClient.getQueryData(["calendars"]);
      const newCalendarObject = {
        id: Date.now().toString(),
        ...newCalendar,
        createdAt: new Date().toLocaleString(),
      };
      queryClient.setQueryData(["calendars"], (old) => [
        ...old,
        newCalendarObject,
      ]);
      return { previousCalendars };
    },
    onError: (err, newCalendar, context) => {
      queryClient.setQueryData(["calendars"], context.previousCalendars);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
};
