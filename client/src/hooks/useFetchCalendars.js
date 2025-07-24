import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

const fetchCalendars = async () => {
  const response = await axios.get(`${API_URL}/calendars`);
  return response.data;
};

export const useFetchCalendars = () => {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: fetchCalendars,
  });
};
