import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, parse, isValid, formatISO } from "date-fns";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent) => {
      const formattedEvent = {
        ...newEvent,
        date: formatISO(parseISO(newEvent.date)),
        description: newEvent.description || "",
      };
      await axios.post(`${API_URL}/addEvent`, formattedEvent);
      console.log("Adding event:", formattedEvent);
    },
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousEvents = queryClient.getQueryData(["events"]);
      const newEventObject = {
        id: Date.now().toString(),
        ...newEvent,
        createdAt: new Date(),
      };
      queryClient.setQueryData(["events"], (old) => [...old, newEventObject]);
      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      queryClient.setQueryData(["events"], context.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
