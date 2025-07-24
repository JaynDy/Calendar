import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/apiConstant";

const fetchEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  console.log("fetchEvents response", response);

  return response.data;
};

export const useFetchEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};
