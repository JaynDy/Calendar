import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedText, updatedColor, updatedIsChecked }) =>
      axios.put(`${API_URL}/updateCalendar/${id}`, {
        updatedText,
        updatedColor,
        updatedIsChecked,
      }),
    onMutate: async ({ id, updatedText, updatedColor, updatedIsChecked }) => {
      // console.log(
      //   "Mutating calendar:",
      //   updatedText,
      //   updatedColor,
      //   updatedIsChecked
      // );
      await queryClient.cancelQueries(["calendars"]);
      const previousCalendars = queryClient.getQueryData(["calendars"]);
      queryClient.setQueryData(["calendars"], (old) =>
        old.map((calendar) =>
          calendar.id === id
            ? {
                ...calendar,
                name: updatedText,
                color: updatedColor,
                isChecked: updatedIsChecked,
              }
            : calendar
        )
      );
      return { previousCalendars };
    },

    onSettled: () => {
      queryClient.invalidateQueries(["calendars"]);
    },

    onError: (err, variables, context) => {
      console.error("Error in updateCalendar mutation:", err);
      queryClient.setQueryData(["calendars"], context.previousCalendars);
    },
  });
};
